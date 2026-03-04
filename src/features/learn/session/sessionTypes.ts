import type { StudyItemRef, GameId, GameConfig } from "@/features/learn/games/_core/gameTypes";

export type StudySession = {
  gameId: GameId;
  config: GameConfig;
  items: StudyItemRef[];
  startedAt: number;
};
