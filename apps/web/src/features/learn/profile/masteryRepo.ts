import type { GameResult } from "@/features/learn/games/_core/gameTypes";

const STORAGE_KEY = "korean_mastery";

type MasteryEntry = { score: number; lastSeen: number };
type MasteryData = Record<string, MasteryEntry>;

const GRADE_DELTAS: Record<string, number> = {
  easy: 0.3,
  good: 0.2,
  hard: 0.1,
  fail: -0.15,
};

export function loadMastery(): MasteryData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveMastery(data: MasteryData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function updateMastery(outcomes: GameResult["itemOutcomes"]) {
  const data = loadMastery();
  const now = Date.now();

  for (const outcome of outcomes) {
    const id = outcome.ref.id;
    const prev = data[id]?.score ?? 0;
    const delta = GRADE_DELTAS[outcome.grade] ?? 0;
    data[id] = {
      score: Math.max(0, Math.min(1, prev + delta)),
      lastSeen: now,
    };
  }

  saveMastery(data);
  return data;
}

export function getMasteryScore(wordId: string): number {
  const data = loadMastery();
  return data[wordId]?.score ?? 0;
}
