import type { UserProfile } from "@/features/learn/profile/profileTypes";
import type { GameResult } from "@/features/learn/games/_core/gameTypes";

export interface ProfileRepository {
  loadProfile(): UserProfile;
  saveProfile(profile: UserProfile): void;
  awardXp(result: GameResult): UserProfile;
}
