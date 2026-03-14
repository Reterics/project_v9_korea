import type { ProgressRepository, MasteryData } from "./ProgressRepository";
import type { ItemProgress } from "@/features/learn/progress/progressTypes";
import type { GameResult, StudyItemRef } from "@/features/learn/games/_core/gameTypes";
import * as progressRepo from "@/features/learn/progress/progressRepo";
import { loadMastery } from "@/features/learn/profile/masteryRepo";

/**
 * Demo-mode progress repository.
 * Delegates to the existing localStorage-based module.
 */
export class LocalProgressRepository implements ProgressRepository {
  getProgress(ref: StudyItemRef): ItemProgress | undefined {
    return progressRepo.getProgress(ref);
  }

  getAllProgress(): ItemProgress[] {
    return progressRepo.getAllProgress();
  }

  getDueItems(now: number): ItemProgress[] {
    return progressRepo.getDueItems(now);
  }

  applyGameResult(result: GameResult): void {
    progressRepo.applyGameResult(result);
  }

  loadMastery(): MasteryData {
    return loadMastery();
  }
}
