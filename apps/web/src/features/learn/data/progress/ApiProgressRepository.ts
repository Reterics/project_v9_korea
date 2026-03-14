import type { ProgressRepository, MasteryData } from "./ProgressRepository";
import type { ItemProgress } from "@/features/learn/progress/progressTypes";
import type { GameResult, StudyItemRef } from "@/features/learn/games/_core/gameTypes";
import { api } from "../apiClient";

/**
 * Live-mode progress repository.
 * Reads/writes through the PHP API.
 * Maintains an in-memory cache for synchronous access.
 */
export class ApiProgressRepository implements ProgressRepository {
  private cache: Map<string, ItemProgress> = new Map();
  private loaded = false;

  async init(): Promise<void> {
    if (this.loaded) return;
    const all = await api.get<ItemProgress[]>("/api/v1/progress");
    this.cache.clear();
    for (const item of all) {
      this.cache.set(`${item.ref.kind}_${item.ref.id}`, item);
    }
    this.loaded = true;
  }

  getProgress(ref: StudyItemRef): ItemProgress | undefined {
    return this.cache.get(`${ref.kind}_${ref.id}`);
  }

  getAllProgress(): ItemProgress[] {
    return Array.from(this.cache.values());
  }

  getDueItems(now: number): ItemProgress[] {
    return this.getAllProgress().filter((p) => p.srs.dueAt <= now);
  }

  applyGameResult(result: GameResult): void {
    // Fire-and-forget to API
    api
      .post("/api/v1/progress/game-result", {
        correct: result.correct,
        wrong: result.wrong,
        streakMax: result.streakMax,
        durationMs: result.durationMs,
        itemOutcomes: result.itemOutcomes,
      })
      .catch(console.error);

    // Optimistic cache update (mirrors the localStorage logic)
    const now = Date.now();
    for (const outcome of result.itemOutcomes) {
      const key = `${outcome.ref.kind}_${outcome.ref.id}`;
      const existing = this.cache.get(key);
      const isCorrect = outcome.grade === "easy" || outcome.grade === "good";
      const seenCount = (existing?.seenCount ?? 0) + 1;
      const correctCount = (existing?.correctCount ?? 0) + (isCorrect ? 1 : 0);
      const wrongCount = (existing?.wrongCount ?? 0) + (isCorrect ? 0 : 1);
      const mastery = Math.min(1, correctCount / Math.max(1, seenCount));

      this.cache.set(key, {
        ref: outcome.ref,
        mastery,
        srs: {
          intervalDays: 0, // Approximate; real value computed server-side
          ease: existing?.srs.ease ?? 2.5,
          dueAt: now + 86400000,
          lastReviewedAt: now,
        },
        seenCount,
        correctCount,
        wrongCount,
        avgLatencyMs: outcome.latencyMs,
      });
    }
  }

  loadMastery(): MasteryData {
    const result: MasteryData = {};
    for (const item of this.cache.values()) {
      result[item.ref.id] = {
        score: item.mastery,
        lastSeen: item.srs.lastReviewedAt ?? 0,
      };
    }
    return result;
  }
}
