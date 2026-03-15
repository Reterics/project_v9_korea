import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SplashScreen } from "@reterics/birdie-ui";
import type { ContentRepository } from "@/features/learn/data/content/ContentRepository";
import type { ProgressRepository } from "@/features/learn/data/progress/ProgressRepository";
import type { ProfileRepository } from "@/features/learn/data/profile/ProfileRepository";
import { DataProvider } from "@/features/learn/data/DataProvider";
import { JsonContentRepository } from "@/features/learn/data/content/JsonContentRepository";
import { LocalProgressRepository } from "@/features/learn/data/progress/LocalProgressRepository";
import { LocalProfileRepository } from "@/features/learn/data/profile/LocalProfileRepository";
import { ApiContentRepository } from "@/features/learn/data/content/ApiContentRepository";
import { ApiProgressRepository } from "@/features/learn/data/progress/ApiProgressRepository";
import { ApiProfileRepository } from "@/features/learn/data/profile/ApiProfileRepository";
import { IS_LIVE } from "@/features/learn/data/types";
import type { DataMode } from "@/features/learn/data/types";

interface AppDataContextValue {
  isReady: boolean;
}

const AppDataContext = createContext<AppDataContextValue>({ isReady: false });

// eslint-disable-next-line react-refresh/only-export-components
export function useAppData() {
  return useContext(AppDataContext);
}

type Repos = {
  mode: DataMode;
  content: ContentRepository;
  progress: ProgressRepository;
  profile: ProfileRepository;
};

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [repos, setRepos] = useState<Repos | null>(() => {
    if (!IS_LIVE) return {
      mode: "demo",
      content: new JsonContentRepository(),
      progress: new LocalProgressRepository(),
      profile: new LocalProfileRepository(),
    };
    return null;
  });
  const [isReady, setIsReady] = useState(!IS_LIVE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!IS_LIVE) return;

    const contentRepo = new ApiContentRepository();
    const progressRepo = new ApiProgressRepository();
    const profileRepo = new ApiProfileRepository();

    Promise.all([contentRepo.init(), progressRepo.init(), profileRepo.init()])
      .then(() => {
        setRepos({
          mode: "live",
          content: contentRepo,
          progress: progressRepo,
          profile: profileRepo,
        });
        setIsReady(true);
      })
      .catch((err) => {
        console.error("Failed to initialize API data:", err);
        setError("Failed to connect to server. Please try again later.");
        setIsReady(true);
      });
  }, []);

  if (!isReady) return <SplashScreen />;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hanji-100 dark:bg-namsaek-950">
        <div className="rounded-3xl border border-dancheong-200 bg-white p-8 text-center shadow-sm dark:border-dancheong-800 dark:bg-namsaek-900">
          <div className="text-sm text-dancheong-600 dark:text-dancheong-400">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-namsaek-500 px-4 py-2 text-sm font-semibold text-hanji-50 hover:bg-namsaek-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!repos) return null;

  return (
    <AppDataContext.Provider value={{ isReady }}>
      <DataProvider
        mode={repos.mode}
        content={repos.content}
        progress={repos.progress}
        profile={repos.profile}
      >
        {children}
      </DataProvider>
    </AppDataContext.Provider>
  );
}
