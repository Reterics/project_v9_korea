import { useState, useCallback } from "react";
import type { UserProfile } from "./profileTypes";
import { loadProfile } from "./profileRepo";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());

  const refresh = useCallback(() => {
    setProfile(loadProfile());
  }, []);

  return { profile, refresh };
}
