import type { Word, WordLevel } from "@/features/learn/content/wordTypes";
import type { GrammarLesson, LessonProgress, Sentence } from "@/features/learn/content/lessonTypes";
import type { StudyItemRef } from "@/features/learn/games/_core/gameTypes";

export interface ContentRepository {
  getWord(id: string): Word | undefined;
  listWords(level?: WordLevel): Word[];
  getAllWordRefs(): StudyItemRef[];
  listSentences(): Sentence[];
  listLessons(): GrammarLesson[];
  getLesson(id: string): GrammarLesson | undefined;
  loadLessonProgress(): Record<string, LessonProgress>;
  markLessonViewed(lessonId: string): void;
  markLessonPracticed(lessonId: string): void;
  getCurrentLesson(): GrammarLesson | undefined;
}
