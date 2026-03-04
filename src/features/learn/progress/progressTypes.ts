import type { StudyItemRef } from "@/features/learn/games/_core/gameTypes";

export type SrsData = {
  intervalDays: number;
  ease: number;
  dueAt: number;
  lastReviewedAt?: number;
};

export type ItemProgress = {
  ref: StudyItemRef;
  mastery: number;
  srs: SrsData;
  seenCount: number;
  correctCount: number;
  wrongCount: number;
  avgLatencyMs?: number;
};

export type DailyStats = {
  dayKey: string;
  xpGained: number;
  minutesStudied: number;
  correct: number;
  wrong: number;
};
