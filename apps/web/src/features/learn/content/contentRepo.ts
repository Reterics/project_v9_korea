import type { Word, WordLevel } from "./wordTypes";
import type { Sentence } from "./lessonTypes";
import type { StudyItemRef } from "@/features/learn/games/_core/gameTypes";
import a1Data from "./data/a1-words.json";
import a1PlusData from "./data/a1plus-words.json";
import a2Data from "./data/a2-words.json";
import sentencesData from "./data/a1-sentences.json";

const words: Word[] = [
  ...(a1Data as Word[]),
  ...(a1PlusData as Word[]),
  ...(a2Data as Word[]),
];

const sentences: Sentence[] = sentencesData as Sentence[];

export function getWord(id: string): Word | undefined {
  return words.find((w) => w.id === id);
}

export function listWords(level?: WordLevel): Word[] {
  if (level) return words.filter((w) => w.level === level);
  return words;
}

export function getAllWordRefs(): StudyItemRef[] {
  return words.map((w) => ({ kind: "word", id: w.id }));
}

export function listSentences(): Sentence[] {
  return sentences;
}
