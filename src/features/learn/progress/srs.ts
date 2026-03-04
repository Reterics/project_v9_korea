import type { SrsData } from "./progressTypes";

/**
 * Simplified SM-2 algorithm.
 * Pure function: takes current SRS data + grade, returns new SRS data.
 */
export function computeNextSrs(
  current: SrsData,
  grade: "easy" | "good" | "hard" | "fail",
  now: number
): SrsData {
  const gradeValue = { easy: 5, good: 4, hard: 2, fail: 0 }[grade];

  let ease = current.ease + (0.1 - (5 - gradeValue) * (0.08 + (5 - gradeValue) * 0.02));
  ease = Math.max(1.3, ease);

  let intervalDays: number;
  if (gradeValue < 3) {
    // Failed — reset interval
    intervalDays = 1;
  } else if (current.intervalDays === 0) {
    intervalDays = 1;
  } else if (current.intervalDays === 1) {
    intervalDays = 3;
  } else {
    intervalDays = Math.round(current.intervalDays * ease);
  }

  const dueAt = now + intervalDays * 24 * 60 * 60 * 1000;

  return {
    intervalDays,
    ease,
    dueAt,
    lastReviewedAt: now,
  };
}

export function createInitialSrs(now: number): SrsData {
  return {
    intervalDays: 0,
    ease: 2.5,
    dueAt: now,
    lastReviewedAt: undefined,
  };
}
