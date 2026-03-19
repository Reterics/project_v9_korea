import type {
  GameEngine,
  GameContext,
  GameState,
  GameResult,
  StudyItemRef,
} from "@/features/learn/games/_core/gameTypes";
import { calcScore, skipScore, ZERO_SCORE } from "@/features/learn/games/_core/scoreUtils";
import type { SentenceBuilderQuestion, GrammarRole } from "./sentenceBuilderTypes";

type SentenceData = {
  id: string;
  tokens: string[];
  roles: GrammarRole[];
  english: string;
  hint: string;
  level: string;
};

type OutcomeEntry = { ref: StudyItemRef; label: string; correct: boolean; latencyMs: number };

type SBState = GameState<SentenceBuilderQuestion> & {
  _outcomes: OutcomeEntry[];
  _sentences: SentenceData[];
  _glossMap: Map<string, string>;
};

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

function buildTranslationHint(tokens: Array<{ text: string; role: GrammarRole }>, glossMap: Map<string, string>): string {
  const lines: string[] = [];

  for (const t of tokens) {
    const gloss = buildCandidates(t.text, t.role)
      .map((c) => glossMap.get(c))
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

function buildQuestion(sentences: SentenceData[], glossMap: Map<string, string>, index: number, now: number): SentenceBuilderQuestion | null {
  if (index >= sentences.length) return null;
  const s = sentences[index];
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
    ref: { kind: "sentence", id: s.id },
    tokens,
    shuffled,
    english: s.english,
    hint: s.hint,
    translationHint: buildTranslationHint(tokens, glossMap),
    shownAt: now,
  };
}

export const sentenceBuilderEngine: GameEngine<SentenceBuilderQuestion> = {
  id: "sentence_builder",
  title: "Sentence Builder",

  async init(ctx: GameContext, config): Promise<SBState> {
    const glossMap = new Map(ctx.words.map((w) => [w.korean, w.english]));
    const allSentences = ctx.sentences as SentenceData[];
    const sentences = config.lessonSentenceIds?.length
      ? allSentences.filter((s) => config.lessonSentenceIds!.includes(s.id))
      : allSentences;
    const firstQ = buildQuestion(sentences, glossMap, 0, Date.now());
    return {
      status: firstQ ? "in_progress" : "finished",
      questionIndex: 0,
      question: firstQ ?? undefined,
      score: ZERO_SCORE,
      startedAt: Date.now(),
      _outcomes: [],
      _sentences: sentences,
      _glossMap: glossMap,
    };
  },

  async reduce(state, action, deps): Promise<SBState> {
    const s = state as SBState;
    const { config, now } = deps;
    const { _sentences: sentences, _glossMap: glossMap, _outcomes: outcomes } = s;
    const totalQ = Math.min(config.totalQuestions, sentences.length);

    switch (action.type) {
      case "START":
        return s;

      case "ANSWER": {
        const { ordered } = action.payload as { ordered: string[] };
        const q = s.question!;
        const correctOrder = q.tokens.map((t) => t.text);
        const isCorrect = ordered.every((t, i) => t === correctOrder[i]);
        const latencyMs = now() - q.shownAt;
        const label = `${q.tokens.map((t) => t.text).join(" ")} — ${q.english}`;
        const newOutcomes = [...outcomes, { ref: q.ref, label, correct: isCorrect, latencyMs }];

        const score = calcScore(s.score, isCorrect);

        const nextIndex = s.questionIndex + 1;
        if (nextIndex >= totalQ) {
          return { ...s, score, status: "finished", finishedAt: now(), question: undefined, _outcomes: newOutcomes };
        }

        const nextQ = buildQuestion(sentences, glossMap, nextIndex, now());
        return {
          ...s,
          score,
          questionIndex: nextIndex,
          question: nextQ ?? undefined,
          _outcomes: newOutcomes,
        };
      }

      case "SKIP": {
        const q = s.question;
        const newOutcomes = q
          ? [...outcomes, { ref: q.ref, label: `${q.tokens.map((t) => t.text).join(" ")} — ${q.english}`, correct: false, latencyMs: now() - q.shownAt }]
          : outcomes;

        const nextIndex = s.questionIndex + 1;
        if (nextIndex >= totalQ) {
          return {
            ...s,
            score: skipScore(s.score),
            status: "finished",
            finishedAt: now(),
            question: undefined,
            _outcomes: newOutcomes,
          };
        }
        const nextQ = buildQuestion(sentences, glossMap, nextIndex, now());
        return {
          ...s,
          score: skipScore(s.score),
          questionIndex: nextIndex,
          question: nextQ ?? undefined,
          _outcomes: newOutcomes,
        };
      }

      case "FINISH":
        return { ...s, status: "finished", finishedAt: now() };

      default:
        return s;
    }
  },

  buildResult(state): GameResult {
    const s = state as SBState;
    return {
      correct: s.score.correct,
      wrong: s.score.wrong,
      streakMax: s.score.streakMax,
      durationMs: (s.finishedAt ?? Date.now()) - (s.startedAt ?? Date.now()),
      itemOutcomes: s._outcomes.map((o) => ({
        ref: o.ref,
        label: o.label,
        grade: o.correct ? "good" : "fail",
        latencyMs: o.latencyMs,
      })),
    };
  },
};
