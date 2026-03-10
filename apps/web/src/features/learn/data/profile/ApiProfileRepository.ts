import type { ProfileRepository } from "./ProfileRepository";
import type { UserProfile } from "@/features/learn/profile/profileTypes";
import type { GameResult } from "@/features/learn/games/_core/gameTypes";
import { api } from "../apiClient";

const XP_PER_CORRECT = 10;
const XP_PER_GAME = 5;
const XP_PER_LEVEL = 100;

/**
 * Live-mode profile repository.
 * Reads/writes through the PHP API.
 * Maintains an in-memory cache for synchronous access.
 */
export class ApiProfileRepository implements ProfileRepository {
  private profile: UserProfile | null = null;

  async init(): Promise<void> {
    this.profile = await api.get<UserProfile>("/api/v1/profile");
  }

  loadProfile(): UserProfile {
    if (!this.profile) {
      throw new Error("Profile not loaded. Call init() first.");
    }
    return this.profile;
  }

  saveProfile(profile: UserProfile): void {
    this.profile = profile;
    api
      .put("/api/v1/profile", {
        xp: profile.xp,
        level: profile.level,
        coins: profile.coins,
        dailyStreak: profile.dailyStreak,
        streakUpdatedAt: profile.streakUpdatedAt,
      })
      .catch(console.error);
  }

  awardXp(result: GameResult): UserProfile {
    const profile = this.loadProfile();
    const earned = result.correct * XP_PER_CORRECT + XP_PER_GAME;
    profile.xp += earned;
    profile.coins += Math.floor(earned / 2);
    profile.level = Math.floor(profile.xp / XP_PER_LEVEL) + 1;
    profile.lastActiveAt = Date.now();

    const today = new Date().toDateString();
    const lastDay = new Date(profile.streakUpdatedAt).toDateString();
    if (lastDay !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      profile.dailyStreak = lastDay === yesterday ? profile.dailyStreak + 1 : 1;
      profile.streakUpdatedAt = Date.now();
    }

    this.profile = { ...profile };
    // XP is also awarded server-side via applyGameResult, but we sync profile state too
    this.saveProfile(this.profile);
    return this.profile;
  }
}
