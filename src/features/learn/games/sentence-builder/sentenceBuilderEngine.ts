import type {
  GameEngine,
  GameState,
  GameResult,
  StudyItemRef,
} from "@/features/learn/games/_core/gameTypes";
import { listWords } from "@/features/learn/content/contentRepo";
import type { SentenceBuilderQuestion, GrammarRole } from "./sentenceBuilderTypes";
import sentencesData from "@/features/learn/content/data/a1-sentences.json";

type SentenceData = {
  id: string;
  tokens: string[];
  roles: GrammarRole[];
  english: string;
  hint: string;
  level: string;
};

const allSentences: SentenceData[] = sentencesData as SentenceData[];
const wordGlossByKorean = new Map(listWords().map((w) => [w.korean, w.english]));

type SBState = GameState<SentenceBuilderQuestion>;

const outcomes: Array<{ ref: StudyItemRef; correct: boolean; latencyMs: number }> = [];
let activeSentences: SentenceData[] = allSentences;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCandidates(token: string, role: GrammarRole): string[] {
  const candidates = [token];

  // Common polite/particle endings in beginner content.
  if (token.length > 1) {
    candidates.push(token.slice(0, -1));
  }
  if (token.length > 2) {
    candidates.push(token.slice(0, -2));
  }

  if (token.endsWith("요")) {
    candidates.push(`${token.slice(0, -1)}다`);
  }

  if (role === "verb" && token.length > 1) {
    candidates.push(`${token.slice(0, -1)}다`);
  }

  return Array.from(new Set(candidates.filter(Boolean)));
}

function buildTranslationHint(tokens: Array<{ text: string; role: GrammarRole }>): string {
  const lines: string[] = [];

  for (const t of tokens) {
    const gloss = buildCandidates(t.text, t.role)
      .map((c) => wordGlossByKorean.get(c))
      .find(Boolean);

    if (gloss) {
      lines.push(`${t.text} = ${gloss}`);
    }
  }

  if (lines.length === 0) {
    return "";
  }

  return lines.join("\n");
}

function buildQuestion(index: number, now: number): SentenceBuilderQuestion | null {
  if (index >= activeSentences.length) return null;
  const s = activeSentences[index];
  const tokens = s.tokens.map((text, i) => ({ text, role: s.roles[i] }));
  // Shuffle until order differs from correct (if more than 1 token)
  let shuffled = shuffle(s.tokens);
  if (s.tokens.length > 1) {
    let attempts = 0;
    while (shuffled.every((t, i) => t === s.tokens[i]) && attempts < 10) {
      shuffled = shuffle(s.tokens);
      attempts++;
    }
  }
  return {
    ref: { kind: "pattern", id: s.id },
    tokens,
    shuffled,
    english: s.english,
    hint: s.hint,
    translationHint: buildTranslationHint(tokens),
    shownAt: now,
  };
}

export const sentenceBuilderEngine: GameEngine<SentenceBuilderQuestion> = {
  id: "sentence_builder",
  title: "Sentence Builder",

  async init(_ctx, config): Promise<SBState> {
    outcomes.length = 0;
    activeSentences = config.lessonSentenceIds?.length
      ? allSentences.filter((s) => config.lessonSentenceIds!.includes(s.id))
      : allSentences;
    const firstQ = buildQuestion(0, Date.now());
    return {
      status: firstQ ? "in_progress" : "finished",
      questionIndex: 0,
      question: firstQ ?? undefined,
      score: { correct: 0, wrong: 0, streak: 0, streakMax: 0 },
      startedAt: Date.now(),
    };
  },

  async reduce(state, action, deps): Promise<SBState> {
    const { config, now } = deps;
    const totalQ = Math.min(config.totalQuestions, activeSentences.length);

    switch (action.type) {
      case "START":
        return state;

      case "ANSWER": {
        const { ordered } = action.payload as { ordered: string[] };
        const q = state.question!;
        const correctOrder = q.tokens.map((t) => t.text);
        const isCorrect = ordered.every((t, i) => t === correctOrder[i]);
        const latencyMs = now() - q.shownAt;

        outcomes.push({ ref: q.ref, correct: isCorrect, latencyMs });

        const newStreak = isCorrect ? state.score.streak + 1 : 0;
        const score = {
          correct: state.score.correct + (isCorrect ? 1 : 0),
          wrong: state.score.wrong + (isCorrect ? 0 : 1),
          streak: newStreak,
          streakMax: Math.max(state.score.streakMax, newStreak),
        };

        const nextIndex = state.questionIndex + 1;
        if (nextIndex >= totalQ) {
          return { ...state, score, status: "finished", finishedAt: now(), question: undefined };
        }

        const nextQ = buildQuestion(nextIndex, now());
        return {
          ...state,
          score,
          questionIndex: nextIndex,
          question: nextQ ?? undefined,
        };
      }

      case "SKIP": {
        const q = state.question;
        if (q) {
          outcomes.push({ ref: q.ref, correct: false, latencyMs: now() - q.shownAt });
        }
        const nextIndex = state.questionIndex + 1;
        if (nextIndex >= totalQ) {
          return {
            ...state,
            score: { ...state.score, wrong: state.score.wrong + 1, streak: 0 },
            status: "finished",
            finishedAt: now(),
            question: undefined,
          };
        }
        const nextQ = buildQuestion(nextIndex, now());
        return {
          ...state,
          score: { ...state.score, wrong: state.score.wrong + 1, streak: 0 },
          questionIndex: nextIndex,
          question: nextQ ?? undefined,
        };
      }

      case "FINISH":
        return { ...state, status: "finished", finishedAt: now() };

      default:
        return state;
    }
  },

  buildResult(state): GameResult {
    return {
      correct: state.score.correct,
      wrong: state.score.wrong,
      streakMax: state.score.streakMax,
      durationMs: (state.finishedAt ?? Date.now()) - (state.startedAt ?? Date.now()),
      itemOutcomes: outcomes.map((o) => ({
        ref: o.ref,
        grade: o.correct ? "good" : "fail",
        latencyMs: o.latencyMs,
      })),
    };
  },
};
