import type {
  GameConfig,
  GameContext,
  GameEngine,
  GameResult,
  GameState,
  StudyItemRef,
} from "@/features/learn/games/_core/gameTypes";
import type { ParticleQuestion, ParticleRole } from "./particlesTypes";
import sentencesData from "@/features/learn/content/data/a1-sentences.json";

type SentenceData = {
  id: string;
  tokens: string[];
  english: string;
  hint: string;
};

type ParticleCandidate = Omit<ParticleQuestion, "shownAt">;

type ParticlesState = GameState<ParticleQuestion>;

const allSentences = sentencesData as SentenceData[];

const outcomes: Array<{ ref: StudyItemRef; correct: boolean; latencyMs: number }> = [];
let particleBank: ParticleCandidate[] = [];

const particleChoicesByRole: Record<ParticleRole, string[]> = {
  topic: ["은", "는", "이", "가"],
  subject: ["이", "가", "은", "는"],
  object: ["을", "를", "은", "는"],
};

function particleRoleFromSuffix(suffix: string): ParticleRole | null {
  if (suffix === "은" || suffix === "는") return "topic";
  if (suffix === "이" || suffix === "가") return "subject";
  if (suffix === "을" || suffix === "를") return "object";
  return null;
}

function hasBatchim(text: string): boolean {
  if (!text) return false;
  const code = text.charCodeAt(text.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

function explanationFor(stem: string, role: ParticleRole, correctParticle: string): string {
  if (role === "topic") {
    return `은/는 marks the topic. Use 은 after batchim and 는 after a vowel. Correct here: ${stem}${correctParticle}.`;
  }
  if (role === "subject") {
    return `이/가 marks the subject. Use 이 after batchim and 가 after a vowel. Correct here: ${stem}${correctParticle}.`;
  }
  return `을/를 marks the object. Use 을 after batchim and 를 after a vowel. Correct here: ${stem}${correctParticle}.`;
}

function buildCandidates(sentences: SentenceData[]): ParticleCandidate[] {
  const candidates: ParticleCandidate[] = [];

  for (const sentence of sentences) {
    sentence.tokens.forEach((token, tokenIndex) => {
      if (token.length < 2) return;

      const suffix = token.slice(-1);
      const role = particleRoleFromSuffix(suffix);
      if (!role) return;

      const stem = token.slice(0, -1);
      if (!stem) return;

      const expected = hasBatchim(stem);
      const validPair =
        (role === "topic" && ((expected && suffix === "은") || (!expected && suffix === "는"))) ||
        (role === "subject" && ((expected && suffix === "이") || (!expected && suffix === "가"))) ||
        (role === "object" && ((expected && suffix === "을") || (!expected && suffix === "를")));
      if (!validPair) return;

      const promptTokens = [...sentence.tokens];
      promptTokens[tokenIndex] = `${stem}__`;

      candidates.push({
        ref: { kind: "pattern", id: `${sentence.id}_p${tokenIndex}` },
        prompt: promptTokens.join(" "),
        english: sentence.english,
        hint: sentence.hint,
        explanation: explanationFor(stem, role, suffix),
        role,
        choices: particleChoicesByRole[role],
        correctParticle: suffix,
      });
    });
  }

  return candidates;
}

particleBank = buildCandidates(allSentences);

function pickQuestion(index: number, now: number): ParticleQuestion | null {
  if (index >= particleBank.length) return null;
  const source = particleBank[index];
  return { ...source, shownAt: now };
}

export const particlesEngine: GameEngine<ParticleQuestion> = {
  id: "particles",
  title: "Missing Particle",

  async init(_ctx: GameContext, config: GameConfig): Promise<ParticlesState> {
    outcomes.length = 0;
    const sentences = config.lessonSentenceIds?.length
      ? allSentences.filter((s) => config.lessonSentenceIds!.includes(s.id))
      : allSentences;
    particleBank = buildCandidates(sentences);
    const total = Math.min(config.totalQuestions, particleBank.length);
    const first = total > 0 ? pickQuestion(0, Date.now()) : null;

    return {
      status: first ? "in_progress" : "finished",
      questionIndex: 0,
      question: first ?? undefined,
      score: { correct: 0, wrong: 0, streak: 0, streakMax: 0 },
      startedAt: Date.now(),
    };
  },

  async reduce(state, action, deps): Promise<ParticlesState> {
    const { config, now } = deps;
    const total = Math.min(config.totalQuestions, particleBank.length);

    switch (action.type) {
      case "START":
        return state;

      case "ANSWER": {
        const answer = (action.payload as { value: string }).value;
        const q = state.question;
        if (!q) return state;

        const isCorrect = answer === q.correctParticle;
        const latencyMs = now() - q.shownAt;
        outcomes.push({ ref: q.ref, correct: isCorrect, latencyMs });

        const streak = isCorrect ? state.score.streak + 1 : 0;
        const score = {
          correct: state.score.correct + (isCorrect ? 1 : 0),
          wrong: state.score.wrong + (isCorrect ? 0 : 1),
          streak,
          streakMax: Math.max(state.score.streakMax, streak),
        };

        const nextIndex = state.questionIndex + 1;
        if (nextIndex >= total) {
          return {
            ...state,
            status: "finished",
            question: undefined,
            score,
            finishedAt: now(),
          };
        }

        return {
          ...state,
          questionIndex: nextIndex,
          question: pickQuestion(nextIndex, now()) ?? undefined,
          score,
        };
      }

      case "SKIP": {
        const q = state.question;
        if (q) {
          outcomes.push({ ref: q.ref, correct: false, latencyMs: now() - q.shownAt });
        }

        const nextIndex = state.questionIndex + 1;
        const score = { ...state.score, wrong: state.score.wrong + 1, streak: 0 };

        if (nextIndex >= total) {
          return {
            ...state,
            status: "finished",
            question: undefined,
            score,
            finishedAt: now(),
          };
        }

        return {
          ...state,
          questionIndex: nextIndex,
          question: pickQuestion(nextIndex, now()) ?? undefined,
          score,
        };
      }

      case "FINISH":
        return { ...state, status: "finished", question: undefined, finishedAt: now() };

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
      itemOutcomes: outcomes.map((outcome) => ({
        ref: outcome.ref,
        grade: outcome.correct ? "good" : "fail",
        latencyMs: outcome.latencyMs,
      })),
    };
  },
};
