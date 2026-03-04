import type { Word, WordLevel } from "./wordTypes";
import type { Pattern } from "./grammarTypes";
import type { StudyItemRef } from "@/features/learn/games/_core/gameTypes";
import a1Data from "./data/a1-words.json";
import a1PlusData from "./data/a1plus-words.json";
import a2Data from "./data/a2-words.json";

const words: Word[] = [
  ...(a1Data as Word[]),
  ...(a1PlusData as Word[]),
  ...(a2Data as Word[]),
];

export function getWord(id: string): Word | undefined {
  return words.find((w) => w.id === id);
}

export function getPattern(_id: string): Pattern | undefined {
  // TODO: load grammar patterns
  return undefined;
}

export function listWords(level?: WordLevel): Word[] {
  if (level) return words.filter((w) => w.level === level);
  return words;
}

export function getAllWordRefs(): StudyItemRef[] {
  return words.map((w) => ({ kind: "word", id: w.id }));
}
