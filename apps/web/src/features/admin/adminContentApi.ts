import { api } from "@/features/learn/data/apiClient";
import type { Word } from "@/features/learn/content/wordTypes";
import type { GrammarLesson, Sentence } from "@/features/learn/content/lessonTypes";

export type { Sentence };

export type DbGameConfig = {
  gameId: string;
  totalQuestions: number;
  timeLimitSec?: number | null;
  difficulty: "easy" | "normal" | "hard";
  engineConfig?: Record<string, unknown> | null;
  updatedAt?: string;
};

export type AdminLesson = GrammarLesson & {
  sortOrder?: number;
};

export const adminContentApi = {
  // Words
  listWords: () => api.get<Word[]>("/api/v1/admin/content/words"),
  createWord: (w: Word) => api.post<{ id: string }>("/api/v1/admin/content/words", w),
  updateWord: (id: string, w: Word) => api.put<{ ok: boolean }>(`/api/v1/admin/content/words/${id}`, w),
  deleteWord: (id: string) => api.delete<{ ok: boolean }>(`/api/v1/admin/content/words/${id}`),

  // Sentences
  listSentences: () => api.get<Sentence[]>("/api/v1/admin/content/sentences"),
  createSentence: (s: Sentence) => api.post<{ id: string }>("/api/v1/admin/content/sentences", s),
  updateSentence: (id: string, s: Sentence) =>
    api.put<{ ok: boolean }>(`/api/v1/admin/content/sentences/${id}`, s),
  deleteSentence: (id: string) =>
    api.delete<{ ok: boolean }>(`/api/v1/admin/content/sentences/${id}`),

  // Lessons
  listLessons: () => api.get<AdminLesson[]>("/api/v1/admin/content/lessons"),
  createLesson: (l: AdminLesson) =>
    api.post<{ id: string }>("/api/v1/admin/content/lessons", l),
  updateLesson: (id: string, l: AdminLesson) =>
    api.put<{ ok: boolean }>(`/api/v1/admin/content/lessons/${id}`, l),
  deleteLesson: (id: string) =>
    api.delete<{ ok: boolean }>(`/api/v1/admin/content/lessons/${id}`),

  // Game configs (admin-gated)
  listGameConfigs: () => api.get<DbGameConfig[]>("/api/v1/admin/games"),
  updateGameConfig: (gameId: string, cfg: Partial<DbGameConfig>) =>
    api.put<{ ok: boolean }>(`/api/v1/admin/games/${gameId}`, cfg),
};

// Public endpoint – no auth required
export const publicGameApi = {
  getGameConfigs: () => api.get<DbGameConfig[]>("/api/v1/games/config"),
};
