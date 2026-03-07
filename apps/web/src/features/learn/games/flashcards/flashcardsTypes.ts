import type { StudyItemRef } from "@/features/learn/games/_core/gameTypes";

export type FlashcardQuestion = {
  ref: StudyItemRef;
  korean: string;
  romanization: string;
  english: string;
  example?: string;
  revealed: boolean;
  shownAt: number;
};

export type FlashcardGrade = "easy" | "good" | "hard" | "again";

export type FlashcardAnswer = {
  grade: FlashcardGrade;
};
