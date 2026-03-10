import { createContext, useContext, type ReactNode } from "react";
import type { DataMode } from "./types";
import type { ContentRepository } from "./content/ContentRepository";
import type { ProgressRepository } from "./progress/ProgressRepository";
import type { ProfileRepository } from "./profile/ProfileRepository";

interface DataContextValue {
  mode: DataMode;
  content: ContentRepository;
  progress: ProgressRepository;
  profile: ProfileRepository;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({
  mode,
  content,
  progress,
  profile,
  children,
}: DataContextValue & { children: ReactNode }) {
  return (
    <DataContext.Provider value={{ mode, content, progress, profile }}>
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
