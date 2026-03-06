import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, CheckCircle2, Circle, Clock } from "lucide-react";
import { listLessons, loadLessonProgress } from "@/features/learn/content/lessonRepo";
import type { GrammarLesson, LessonProgress } from "@/features/learn/content/lessonTypes";

const categoryLabels: Record<string, string> = {
  "sentence-pattern": "Word Order",
  "particles": "Particles",
  "question-form": "Questions",
  "negative-form": "Negatives",
};

export function GrammarPage() {
  const navigate = useNavigate();
  const lessons = useMemo(() => listLessons(), []);
  const progress = useMemo(() => loadLessonProgress(), []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Grammar</h1>
        <p className="mt-1 text-sm text-hanji-500 dark:text-hanji-400">
          Learn Korean patterns through examples, then reinforce with focused practice.
        </p>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            index={index}
            progress={progress[lesson.id]}
            onClick={() => navigate(`/grammar/${lesson.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

function LessonCard({
  lesson,
  index,
  progress,
  onClick,
}: {
  lesson: GrammarLesson;
  index: number;
  progress?: LessonProgress;
  onClick: () => void;
}) {
  const status = progress?.status ?? "not_started";

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-3xl border border-hanji-300 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-namsaek-300 hover:shadow-md dark:border-namsaek-700 dark:bg-namsaek-900 dark:hover:border-namsaek-600"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 shrink-0">
            {status === "completed" ? (
              <CheckCircle2 className="h-5 w-5 text-cheongja-500 dark:text-cheongja-400" />
            ) : status === "in_progress" ? (
              <Clock className="h-5 w-5 text-geum-500 dark:text-geum-400" />
            ) : (
              <Circle className="h-5 w-5 text-hanji-300 dark:text-namsaek-600" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-hanji-400 dark:text-hanji-500">
                Lesson {index + 1}
              </span>
              <span className="rounded-lg bg-namsaek-50 px-2 py-0.5 text-xs font-medium text-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-300">
                {categoryLabels[lesson.category] ?? lesson.category}
              </span>
              {status === "completed" && (
                <span className="rounded-lg bg-cheongja-50 px-2 py-0.5 text-xs font-medium text-cheongja-600 dark:bg-cheongja-900/40 dark:text-cheongja-400">
                  Done
                </span>
              )}
              {status === "in_progress" && (
                <span className="rounded-lg bg-geum-50 px-2 py-0.5 text-xs font-medium text-geum-600 dark:bg-geum-900/40 dark:text-geum-400">
                  In progress
                </span>
              )}
            </div>
            <div className="mt-1 text-sm font-semibold">{lesson.title}</div>
            <div className="mt-1 text-xs text-hanji-500 dark:text-hanji-400">{lesson.summary}</div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {lesson.practiceModes.map((mode) => (
                <span
                  key={mode}
                  className="inline-flex items-center gap-1 rounded-lg border border-hanji-200 bg-hanji-50 px-2 py-1 text-xs text-hanji-500 dark:border-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-400"
                >
                  <BookOpen className="h-3 w-3" />
                  {mode === "sentence_builder" ? "Sentence Builder" : mode === "particles" ? "Particles" : "Flashcards"}
                </span>
              ))}
            </div>
          </div>
        </div>

        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-hanji-400 transition group-hover:translate-x-0.5 dark:text-hanji-500" />
      </div>
    </button>
  );
}
