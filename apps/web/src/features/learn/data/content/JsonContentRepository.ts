import type { ContentRepository } from "./ContentRepository";
import type { Word, WordLevel } from "@/features/learn/content/wordTypes";
import type { GrammarLesson, LessonProgress, Sentence } from "@/features/learn/content/lessonTypes";
import type { StudyItemRef } from "@/features/learn/games/_core/gameTypes";
import * as contentRepo from "@/features/learn/content/contentRepo";
import * as lessonRepo from "@/features/learn/content/lessonRepo";

/**
 * Demo-mode content repository.
 * Delegates to the existing JSON-based repo modules.
 */
export class JsonContentRepository implements ContentRepository {
  getWord(id: string): Word | undefined {
    return contentRepo.getWord(id);
  }

  listWords(level?: WordLevel): Word[] {
    return contentRepo.listWords(level);
  }

  getAllWordRefs(): StudyItemRef[] {
    return contentRepo.getAllWordRefs();
  }

  listSentences(): Sentence[] {
    return contentRepo.listSentences();
  }

  listLessons(): GrammarLesson[] {
    return lessonRepo.listLessons();
  }

  getLesson(id: string): GrammarLesson | undefined {
    return lessonRepo.getLesson(id);
  }

  loadLessonProgress(): Record<string, LessonProgress> {
    return lessonRepo.loadLessonProgress();
  }

  markLessonViewed(lessonId: string): void {
    lessonRepo.markLessonViewed(lessonId);
  }

  markLessonPracticed(lessonId: string): void {
    lessonRepo.markLessonPracticed(lessonId);
  }

  getCurrentLesson(): GrammarLesson | undefined {
    return lessonRepo.getCurrentLesson();
  }
}
