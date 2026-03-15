import type { ContentRepository } from "./ContentRepository";
import type { Word, WordLevel } from "@/features/learn/content/wordTypes";
import type { GrammarLesson, LessonProgress } from "@/features/learn/content/lessonTypes";
import type { Pattern } from "@/features/learn/content/grammarTypes";
import type { StudyItemRef } from "@/features/learn/games/_core/gameTypes";
import { api } from "../apiClient";

/**
 * Live-mode content repository.
 * Fetches content from the PHP API.
 * Data is cached in memory after first load.
 */
export class ApiContentRepository implements ContentRepository {
  private words: Word[] = [];
  private lessons: GrammarLesson[] = [];
  private lessonProgress: Record<string, LessonProgress> = {};
  private loaded = false;

  async init(): Promise<void> {
    if (this.loaded) return;

    const [words, lessons] = await Promise.all([
      api.get<Word[]>("/api/v1/content/words"),
      api.get<GrammarLesson[]>("/api/v1/lessons"),
    ]);

    this.words = words;
    this.lessons = lessons;
    this.loaded = true;
  }

  getWord(id: string): Word | undefined {
    return this.words.find((w) => w.id === id);
  }

  getPattern(_: string): Pattern | undefined {
    // TODO: API endpoint for patterns
    return undefined;
  }

  listWords(level?: WordLevel): Word[] {
    if (level) return this.words.filter((w) => w.level === level);
    return this.words;
  }

  getAllWordRefs(): StudyItemRef[] {
    return this.words.map((w) => ({ kind: "word", id: w.id }));
  }

  listLessons(): GrammarLesson[] {
    return this.lessons;
  }

  getLesson(id: string): GrammarLesson | undefined {
    return this.lessons.find((l) => l.id === id);
  }

  loadLessonProgress(): Record<string, LessonProgress> {
    return this.lessonProgress;
  }

  markLessonViewed(lessonId: string): void {
    api.post(`/api/v1/lessons/${encodeURIComponent(lessonId)}/progress`, { action: "view" }).catch(console.error);
    // Optimistic update
    const existing = this.lessonProgress[lessonId];
    if (!existing || existing.status === "not_started") {
      this.lessonProgress[lessonId] = {
        lessonId,
        status: "in_progress",
        viewedAt: Date.now(),
        practiceCount: existing?.practiceCount ?? 0,
      };
    }
  }

  markLessonPracticed(lessonId: string): void {
    api.post(`/api/v1/lessons/${encodeURIComponent(lessonId)}/progress`, { action: "practice" }).catch(console.error);
    // Optimistic update
    const existing = this.lessonProgress[lessonId] ?? {
      lessonId,
      status: "in_progress" as const,
      viewedAt: Date.now(),
      practiceCount: 0,
    };
    const practiceCount = existing.practiceCount + 1;
    this.lessonProgress[lessonId] = {
      ...existing,
      practiceCount,
      status: practiceCount >= 3 ? "completed" : "in_progress",
      completedAt: practiceCount >= 3 ? Date.now() : existing.completedAt,
    };
  }

  getCurrentLesson(): GrammarLesson | undefined {
    const progress = this.lessonProgress;
    const inProgress = this.lessons.find((l) => progress[l.id]?.status === "in_progress");
    if (inProgress) return inProgress;
    return this.lessons.find((l) => !progress[l.id] || progress[l.id].status === "not_started");
  }
}
