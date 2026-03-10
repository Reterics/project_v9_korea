import type { ItemProgress } from "@/features/learn/progress/progressTypes";
import type { GameResult, StudyItemRef } from "@/features/learn/games/_core/gameTypes";

export interface ProgressRepository {
  getProgress(ref: StudyItemRef): ItemProgress | undefined;
  getAllProgress(): ItemProgress[];
  getDueItems(now: number): ItemProgress[];
  applyGameResult(result: GameResult): void;
}
