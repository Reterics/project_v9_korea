import type { GameEngine, GameState, GameContext, GameConfig, GameResult, StudyItemRef } from "@/features/learn/games/_core/gameTypes";
import type { FlashcardQuestion, FlashcardGrade } from "./flashcardsTypes";
import { getWord as getWordFromRepo } from "@/features/learn/content/contentRepo";

type OutcomeEntry = { ref: StudyItemRef; grade: FlashcardGrade; latencyMs: number };

type FlashcardState = GameState<FlashcardQuestion> & {
  _outcomes: OutcomeEntry[];
};

function buildQuestion(
  ref: StudyItemRef,
  getWord: (id: string) => { korean: string; romanization: string; english: string; example?: string } | undefined,
  now: number
): FlashcardQuestion | null {
  if (ref.kind !== "word") return null;
  const w = getWord(ref.id);
  if (!w) return null;
  return {
    ref,
    korean: w.korean,
    romanization: w.romanization,
    english: w.english,
    example: w.example,
    revealed: false,
    shownAt: now,
  };
}

function advanceToNextQuestion(
  items: StudyItemRef[],
  fromIndex: number,
  getWord: (id: string) => { korean: string; romanization: string; english: string; example?: string } | undefined,
  now: number
): { question: FlashcardQuestion; questionIndex: number } | null {
  for (let i = fromIndex; i < items.length; i++) {
    const q = buildQuestion(items[i], getWord, now);
    if (q) return { question: q, questionIndex: i };
  }
  return null;
}

export const flashcardsEngine: GameEngine<FlashcardQuestion> = {
  id: "flashcards",
  title: "Flashcard Sprint",

  async init(ctx: GameContext, config: GameConfig): Promise<FlashcardState> {
    const items = ctx.items.slice(0, config.totalQuestions);
    const first = advanceToNextQuestion(items, 0, getWordFromRepo, Date.now());
    return {
      status: first ? "in_progress" : "finished",
      questionIndex: first?.questionIndex ?? 0,
      question: first?.question,
      score: { correct: 0, wrong: 0, streak: 0, streakMax: 0 },
      startedAt: Date.now(),
      _outcomes: [],
    };
  },

  async reduce(state, action, deps): Promise<FlashcardState> {
    const s = state as FlashcardState;
    const { ctx, config, getWord, now } = deps;
    const items = ctx.items.slice(0, config.totalQuestions);
    const outcomes = s._outcomes ?? [];

    switch (action.type) {
      case "START":
        return s;

      case "ANSWER": {
        const grade = (action.payload as { grade: FlashcardGrade }).grade;
        const q = s.question;
        if (!q) return s;

        const latencyMs = now() - q.shownAt;
        const isCorrect = grade === "easy" || grade === "good";
        const newOutcomes = [...outcomes, { ref: q.ref, grade, latencyMs }];

        const newStreak = isCorrect ? s.score.streak + 1 : 0;
        const score = {
          correct: s.score.correct + (isCorrect ? 1 : 0),
          wrong: s.score.wrong + (isCorrect ? 0 : 1),
          streak: newStreak,
          streakMax: Math.max(s.score.streakMax, newStreak),
        };

        const next = advanceToNextQuestion(items, s.questionIndex + 1, getWord, now());
        if (!next) {
          return { ...s, score, status: "finished", finishedAt: now(), question: undefined, _outcomes: newOutcomes };
        }

        return {
          ...s,
          score,
          questionIndex: next.questionIndex,
          question: next.question,
          _outcomes: newOutcomes,
        };
      }

      case "SKIP": {
        const q = s.question;
        const newOutcomes = q
          ? [...outcomes, { ref: q.ref, grade: "again" as FlashcardGrade, latencyMs: now() - q.shownAt }]
          : outcomes;

        const score = { ...s.score, wrong: s.score.wrong + 1, streak: 0 };
        const next = advanceToNextQuestion(items, s.questionIndex + 1, getWord, now());
        if (!next) {
          return { ...s, score, status: "finished", finishedAt: now(), question: undefined, _outcomes: newOutcomes };
        }

        return {
          ...s,
          score,
          questionIndex: next.questionIndex,
          question: next.question,
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
    const s = state as FlashcardState;
    const outcomes = s._outcomes ?? [];
    return {
      correct: s.score.correct,
      wrong: s.score.wrong,
      streakMax: s.score.streakMax,
      durationMs: (s.finishedAt ?? Date.now()) - (s.startedAt ?? Date.now()),
      itemOutcomes: outcomes.map((o) => ({
        ref: o.ref,
        grade: o.grade === "again" ? "fail" : o.grade,
        latencyMs: o.latencyMs,
      })),
    };
  },
};
