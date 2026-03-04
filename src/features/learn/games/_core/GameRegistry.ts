import type { GameEngine } from "./gameTypes";
import { flashcardsEngine } from "../flashcards/flashcardsEngine";
import { sentenceBuilderEngine } from "../sentence-builder/sentenceBuilderEngine";
import { particlesEngine } from "../particles/particlesEngine";

export const GameRegistry: Record<string, GameEngine> = {
  flashcards: flashcardsEngine,
  sentence_builder: sentenceBuilderEngine,
  particles: particlesEngine,
};
