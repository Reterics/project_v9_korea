import type { StudyItemRef } from "@/features/learn/games/_core/gameTypes";

export type GrammarRole = "subject" | "object" | "verb" | "location";

export type SentenceToken = {
  text: string;
  role: GrammarRole;
};

export type SentenceBuilderQuestion = {
  ref: StudyItemRef;
  /** The correct ordered tokens */
  tokens: SentenceToken[];
  /** Shuffled token texts for the player to arrange */
  shuffled: string[];
  english: string;
  hint: string;
  /** Optional learner help: Korean token -> English gloss */
  translationHint?: string;
  shownAt: number;
};
