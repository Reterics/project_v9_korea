import type { ItemProgress } from "./progressTypes";
import type { GameResult, StudyItemRef } from "@/features/learn/games/_core/gameTypes";
import { computeNextSrs, createInitialSrs } from "./srs";

const STORAGE_KEY = "korean_progress";

function loadAll(): Record<string, ItemProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, ItemProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function refKey(ref: StudyItemRef): string {
  return `${ref.kind}_${ref.id}`;
}

export function getProgress(ref: StudyItemRef): ItemProgress | undefined {
  return loadAll()[refKey(ref)];
}

export function getAllProgress(): ItemProgress[] {
  return Object.values(loadAll());
}

export function getDueItems(now: number): ItemProgress[] {
  return getAllProgress().filter((p) => p.srs.dueAt <= now);
}

export function applyGameResult(result: GameResult) {
  const all = loadAll();
  const now = Date.now();

  for (const outcome of result.itemOutcomes) {
    const key = refKey(outcome.ref);
    const existing = all[key];
    const currentSrs = existing?.srs ?? createInitialSrs(now);
    const newSrs = computeNextSrs(currentSrs, outcome.grade, now);

    const isCorrect = outcome.grade === "easy" || outcome.grade === "good";
    const seenCount = (existing?.seenCount ?? 0) + 1;
    const correctCount = (existing?.correctCount ?? 0) + (isCorrect ? 1 : 0);
    const wrongCount = (existing?.wrongCount ?? 0) + (isCorrect ? 0 : 1);
    const mastery = Math.min(1, correctCount / Math.max(1, seenCount));

    all[key] = {
      ref: outcome.ref,
      mastery,
      srs: newSrs,
      seenCount,
      correctCount,
      wrongCount,
      avgLatencyMs: outcome.latencyMs,
    };
  }

  saveAll(all);
}
