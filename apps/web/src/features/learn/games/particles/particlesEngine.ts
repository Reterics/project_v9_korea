import type {
  GameConfig,
  GameContext,
  GameEngine,
  GameResult,
  GameState,
  StudyItemRef,
} from "@/features/learn/games/_core/gameTypes";
import { calcScore, skipScore, ZERO_SCORE } from "@/features/learn/games/_core/scoreUtils";
import type { ParticleQuestion, ParticleRole } from "./particlesTypes";

type SentenceData = {
  id: string;
  tokens: string[];
  english: string;
  hint: string;
};

type ParticleCandidate = Omit<ParticleQuestion, "shownAt">;

type OutcomeEntry = { ref: StudyItemRef; label: string; correct: boolean; latencyMs: number };

type ParticlesState = GameState<ParticleQuestion> & {
  _outcomes: OutcomeEntry[];
  _bank: ParticleCandidate[];
};

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
        ref: { kind: "sentence", id: `${sentence.id}_p${tokenIndex}` },
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

function pickQuestion(bank: ParticleCandidate[], index: number, now: number): ParticleQuestion | null {
  if (index >= bank.length) return null;
  const source = bank[index];
  return { ...source, shownAt: now };
}

export const particlesEngine: GameEngine<ParticleQuestion> = {
  id: "particles",
  title: "Missing Particle",

  async init(ctx: GameContext, config: GameConfig): Promise<ParticlesState> {
    const allSentences = ctx.sentences as SentenceData[];
    const sentences = config.lessonSentenceIds?.length
      ? allSentences.filter((s) => config.lessonSentenceIds!.includes(s.id))
      : allSentences;
    const bank = buildCandidates(sentences);
    const total = Math.min(config.totalQuestions, bank.length);
    const first = total > 0 ? pickQuestion(bank, 0, Date.now()) : null;

    return {
      status: first ? "in_progress" : "finished",
      questionIndex: 0,
      question: first ?? undefined,
      score: ZERO_SCORE,
      startedAt: Date.now(),
      _outcomes: [],
      _bank: bank,
    };
  },

  async reduce(state, action, deps): Promise<ParticlesState> {
    const s = state as ParticlesState;
    const { config, now } = deps;
    const bank = s._bank;
    const outcomes = s._outcomes;
    const total = Math.min(config.totalQuestions, bank.length);

    switch (action.type) {
      case "START":
        return s;

      case "ANSWER": {
        const answer = (action.payload as { value: string }).value;
        const q = s.question;
        if (!q) return s;

        const isCorrect = answer === q.correctParticle;
        const latencyMs = now() - q.shownAt;
        const label = `${q.prompt} — ${q.english}`;
        const newOutcomes = [...outcomes, { ref: q.ref, label, correct: isCorrect, latencyMs }];

        const score = calcScore(s.score, isCorrect);

        const nextIndex = s.questionIndex + 1;
        if (nextIndex >= total) {
          return {
            ...s,
            status: "finished",
            question: undefined,
            score,
            finishedAt: now(),
            _outcomes: newOutcomes,
          };
        }

        return {
          ...s,
          questionIndex: nextIndex,
          question: pickQuestion(bank, nextIndex, now()) ?? undefined,
          score,
          _outcomes: newOutcomes,
        };
      }

      case "SKIP": {
        const q = s.question;
        const newOutcomes = q
          ? [...outcomes, { ref: q.ref, label: `${q.prompt} — ${q.english}`, correct: false, latencyMs: now() - q.shownAt }]
          : outcomes;

        const nextIndex = s.questionIndex + 1;
        const score = skipScore(s.score);

        if (nextIndex >= total) {
          return {
            ...s,
            status: "finished",
            question: undefined,
            score,
            finishedAt: now(),
            _outcomes: newOutcomes,
          };
        }

        return {
          ...s,
          questionIndex: nextIndex,
          question: pickQuestion(bank, nextIndex, now()) ?? undefined,
          score,
          _outcomes: newOutcomes,
        };
      }

      case "FINISH":
        return { ...s, status: "finished", question: undefined, finishedAt: now() };

      default:
        return s;
    }
  },

  buildResult(state): GameResult {
    const s = state as ParticlesState;
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
