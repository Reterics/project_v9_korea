import type { Word, WordLevel } from "@/features/learn/content/wordTypes";
import type { GrammarLesson, LessonProgress } from "@/features/learn/content/lessonTypes";
import type { Pattern } from "@/features/learn/content/grammarTypes";
import type { StudyItemRef } from "@/features/learn/games/_core/gameTypes";

export interface ContentRepository {
  getWord(id: string): Word | undefined;
  getPattern(id: string): Pattern | undefined;
  listWords(level?: WordLevel): Word[];
  getAllWordRefs(): StudyItemRef[];
  listLessons(): GrammarLesson[];
  getLesson(id: string): GrammarLesson | undefined;
  loadLessonProgress(): Record<string, LessonProgress>;
  markLessonViewed(lessonId: string): void;
  markLessonPracticed(lessonId: string): void;
  getCurrentLesson(): GrammarLesson | undefined;
}
