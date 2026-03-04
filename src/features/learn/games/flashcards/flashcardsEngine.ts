import type { GameEngine, GameState, GameContext, GameConfig, GameResult, StudyItemRef } from "@/features/learn/games/_core/gameTypes";
import type { FlashcardQuestion, FlashcardGrade } from "./flashcardsTypes";
import { getWord as getWordFromRepo } from "@/features/learn/content/contentRepo";

type FlashcardState = GameState<FlashcardQuestion>;

const outcomes: Array<{ ref: StudyItemRef; grade: FlashcardGrade; latencyMs: number }> = [];

function buildQuestion(
  ref: StudyItemRef,
  getWord: (id: string) => any,
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

export const flashcardsEngine: GameEngine<FlashcardQuestion> = {
  id: "flashcards",
  title: "Flashcard Sprint",

  async init(ctx: GameContext, config: GameConfig): Promise<FlashcardState> {
    outcomes.length = 0;
    const items = ctx.items.slice(0, config.totalQuestions);
    const firstRef = items[0];
    const firstQ = firstRef ? buildQuestion(firstRef, getWordFromRepo, Date.now()) : null;
    return {
      status: firstQ ? "in_progress" : "finished",
      questionIndex: 0,
      question: firstQ ?? undefined,
      score: { correct: 0, wrong: 0, streak: 0, streakMax: 0 },
      startedAt: Date.now(),
    };
  },

  async reduce(state, action, deps): Promise<FlashcardState> {
    const { ctx, config, getWord, now } = deps;
    const items = ctx.items.slice(0, config.totalQuestions);

    // Lazily build current question if missing
    if (!state.question && state.status === "in_progress") {
      const ref = items[state.questionIndex];
      if (!ref) return { ...state, status: "finished", finishedAt: now() };
      const q = buildQuestion(ref, getWord, now());
      if (!q) return { ...state, status: "finished", finishedAt: now() };
      return { ...state, question: q };
    }

    switch (action.type) {
      case "START":
        return state;

      case "ANSWER": {
        const grade = (action.payload as { grade: FlashcardGrade }).grade;
        const q = state.question!;
        const latencyMs = now() - q.shownAt;
        const isCorrect = grade === "easy" || grade === "good";

        outcomes.push({ ref: q.ref, grade, latencyMs });

        const newStreak = isCorrect ? state.score.streak + 1 : 0;
        const score = {
          correct: state.score.correct + (isCorrect ? 1 : 0),
          wrong: state.score.wrong + (isCorrect ? 0 : 1),
          streak: newStreak,
          streakMax: Math.max(state.score.streakMax, newStreak),
        };

        const nextIndex = state.questionIndex + 1;
        if (nextIndex >= items.length) {
          return { ...state, score, status: "finished", finishedAt: now(), question: undefined };
        }

        const nextRef = items[nextIndex];
        const nextQ = buildQuestion(nextRef, getWord, now());
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
          outcomes.push({ ref: q.ref, grade: "again", latencyMs: now() - q.shownAt });
        }
        const nextIndex = state.questionIndex + 1;
        if (nextIndex >= items.length) {
          return {
            ...state,
            score: { ...state.score, wrong: state.score.wrong + 1, streak: 0 },
            status: "finished",
            finishedAt: now(),
            question: undefined,
          };
        }
        const nextRef = items[nextIndex];
        const nextQ = buildQuestion(nextRef, getWord, now());
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
        grade: o.grade === "again" ? "fail" : o.grade,
        latencyMs: o.latencyMs,
      })),
    };
  },
};
