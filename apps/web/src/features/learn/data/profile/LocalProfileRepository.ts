import type { ProfileRepository } from "./ProfileRepository";
import type { UserProfile } from "@/features/learn/profile/profileTypes";
import type { GameResult } from "@/features/learn/games/_core/gameTypes";
import * as profileRepo from "@/features/learn/profile/profileRepo";

/**
 * Demo-mode profile repository.
 * Delegates to the existing localStorage-based module.
 */
export class LocalProfileRepository implements ProfileRepository {
  loadProfile(): UserProfile {
    return profileRepo.loadProfile();
  }

  saveProfile(profile: UserProfile): void {
    profileRepo.saveProfile(profile);
  }

  awardXp(result: GameResult): UserProfile {
    return profileRepo.awardXp(result);
  }
}
