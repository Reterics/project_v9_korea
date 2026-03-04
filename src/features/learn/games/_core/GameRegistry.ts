import type { GameEngine } from "./gameTypes";
import { flashcardsEngine } from "../flashcards/flashcardsEngine";

export const GameRegistry: Record<string, GameEngine> = {
  flashcards: flashcardsEngine,
};
