export type LessonCategory = "sentence-pattern" | "particles" | "question-form" | "negative-form";

export type LessonLevel = "A1";

export type LessonExample = {
  id: string;
  english: string;
  korean: string;
  englishBreakdown: string[];
  koreanBreakdown: string[];
  notes?: string[];
};

export type LessonExplanationBlock = {
  id: string;
  type: "text" | "tip" | "warning";
  title?: string;
  content: string;
};

export type GrammarLesson = {
  id: string;
  slug: string;
  title: string;
  category: LessonCategory;
  level: LessonLevel;
  summary: string;
  pattern?: {
    englishOrder: string[];
    koreanOrder: string[];
  };
  examples: LessonExample[];
  explanationBlocks: LessonExplanationBlock[];
  relatedSentenceIds: string[];
  practiceModes: Array<"sentence_builder" | "particles" | "flashcards">;
  nextLessonId?: string | null;
};

export type LessonProgress = {
  lessonId: string;
  status: "not_started" | "in_progress" | "completed";
  viewedAt?: number;
  completedAt?: number;
  practiceCount: number;
};
