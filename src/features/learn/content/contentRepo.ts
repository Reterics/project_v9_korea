import type { Word } from "./wordTypes";
import type { Pattern } from "./grammarTypes";
import type { StudyItemRef } from "@/features/learn/games/_core/gameTypes";
import wordsData from "./data/a1-words.json";

const words: Word[] = wordsData as Word[];

export function getWord(id: string): Word | undefined {
  return words.find((w) => w.id === id);
}

export function getPattern(_id: string): Pattern | undefined {
  // TODO: load grammar patterns
  return undefined;
}

export function listWords(level?: "A1" | "A2"): Word[] {
  if (level) return words.filter((w) => w.level === level);
  return words;
}

export function getAllWordRefs(): StudyItemRef[] {
  return words.map((w) => ({ kind: "word", id: w.id }));
}
