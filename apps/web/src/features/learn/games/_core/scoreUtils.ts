export type Score = {
  correct: number;
  wrong: number;
  streak: number;
  streakMax: number;
};

export const ZERO_SCORE: Score = { correct: 0, wrong: 0, streak: 0, streakMax: 0 };

export function calcScore(current: Score, isCorrect: boolean): Score {
  const streak = isCorrect ? current.streak + 1 : 0;
  return {
    correct: current.correct + (isCorrect ? 1 : 0),
    wrong: current.wrong + (isCorrect ? 0 : 1),
    streak,
    streakMax: Math.max(current.streakMax, streak),
  };
}

export function skipScore(current: Score): Score {
  return { ...current, wrong: current.wrong + 1, streak: 0 };
}
