import type { UserProfile } from "./profileTypes";
import type { GameResult } from "@/features/learn/games/_core/gameTypes";

const STORAGE_KEY = "korean_profile";

const XP_PER_CORRECT = 10;
const XP_PER_GAME = 5;
const XP_PER_LEVEL = 100;

function createDefaultProfile(): UserProfile {
  const now = Date.now();
  return {
    userId: "local",
    displayName: "Learner",
    createdAt: now,
    lastActiveAt: now,
    xp: 0,
    level: 1,
    coins: 0,
    dailyStreak: 0,
    streakUpdatedAt: 0,
  };
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  const profile = createDefaultProfile();
  saveProfile(profile);
  return profile;
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function awardXp(result: GameResult) {
  const profile = loadProfile();
  const earned = result.correct * XP_PER_CORRECT + XP_PER_GAME;
  profile.xp += earned;
  profile.coins += Math.floor(earned / 2);
  profile.level = Math.floor(profile.xp / XP_PER_LEVEL) + 1;
  profile.lastActiveAt = Date.now();

  // Streak logic: update if last activity was yesterday or today
  const today = new Date().toDateString();
  const lastDay = new Date(profile.streakUpdatedAt).toDateString();
  if (lastDay !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    profile.dailyStreak = lastDay === yesterday ? profile.dailyStreak + 1 : 1;
    profile.streakUpdatedAt = Date.now();
  }

  saveProfile(profile);
  return profile;
}
