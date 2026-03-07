import type { GrammarLesson, LessonProgress } from "./lessonTypes";
import lessonsData from "./data/a1-grammar-lessons.json";

const lessons = lessonsData as GrammarLesson[];

const STORAGE_KEY = "korean_lesson_progress";

export function listLessons(): GrammarLesson[] {
  return lessons;
}

export function getLesson(id: string): GrammarLesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function loadLessonProgress(): Record<string, LessonProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, LessonProgress>) : {};
  } catch {
    return {};
  }
}

function saveLessonProgress(progress: Record<string, LessonProgress>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markLessonViewed(lessonId: string): void {
  const progress = loadLessonProgress();
  const existing = progress[lessonId];
  if (!existing || existing.status === "not_started") {
    progress[lessonId] = {
      lessonId,
      status: "in_progress",
      viewedAt: Date.now(),
      practiceCount: existing?.practiceCount ?? 0,
    };
    saveLessonProgress(progress);
  }
}

export function markLessonPracticed(lessonId: string): void {
  const progress = loadLessonProgress();
  const existing = progress[lessonId] ?? {
    lessonId,
    status: "in_progress",
    viewedAt: Date.now(),
    practiceCount: 0,
  };
  progress[lessonId] = {
    ...existing,
    practiceCount: existing.practiceCount + 1,
    status: existing.practiceCount + 1 >= 3 ? "completed" : "in_progress",
    completedAt: existing.practiceCount + 1 >= 3 ? Date.now() : existing.completedAt,
  };
  saveLessonProgress(progress);
}

export function getCurrentLesson(): GrammarLesson | undefined {
  const progress = loadLessonProgress();
  // First in-progress lesson
  const inProgress = lessons.find((l) => progress[l.id]?.status === "in_progress");
  if (inProgress) return inProgress;
  // First not-started lesson
  return lessons.find((l) => !progress[l.id] || progress[l.id].status === "not_started");
}
