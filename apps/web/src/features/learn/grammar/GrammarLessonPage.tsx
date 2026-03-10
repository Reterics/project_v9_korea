import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Layers, Target, BookOpen, AlertTriangle, Info } from "lucide-react";
import { useData } from "@/features/learn/data/DataProvider";
import type { LessonExample, LessonExplanationBlock } from "@/features/learn/content/lessonTypes";
import { MagpieTip } from "@reterics/birdie-ui";

const roleColors: Record<string, string> = {
  subject: "bg-namsaek-50 text-namsaek-700 border-namsaek-200 dark:bg-namsaek-800/50 dark:text-namsaek-200 dark:border-namsaek-700",
  object: "bg-cheongja-50 text-cheongja-700 border-cheongja-200 dark:bg-cheongja-800/50 dark:text-cheongja-200 dark:border-cheongja-700",
  verb: "bg-dancheong-50 text-dancheong-700 border-dancheong-200 dark:bg-dancheong-800/50 dark:text-dancheong-200 dark:border-dancheong-700",
  location: "bg-geum-50 text-geum-700 border-geum-200 dark:bg-geum-800/50 dark:text-geum-200 dark:border-geum-700",
  topic: "bg-namsaek-50 text-namsaek-700 border-namsaek-200 dark:bg-namsaek-800/50 dark:text-namsaek-200 dark:border-namsaek-700",
};

const practiceIcons: Record<string, React.ReactNode> = {
  sentence_builder: <Layers className="h-4 w-4" />,
  particles: <Target className="h-4 w-4" />,
  flashcards: <BookOpen className="h-4 w-4" />,
};

const practiceLabels: Record<string, string> = {
  sentence_builder: "Sentence Builder",
  particles: "Particles",
  flashcards: "Flashcards",
};

const practiceDesc: Record<string, string> = {
  sentence_builder: "Build word order",
  particles: "Fill particles",
  flashcards: "Review words",
};

export function GrammarLessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { content } = useData();
  const lesson = useMemo(() => (lessonId ? content.getLesson(lessonId) : undefined), [lessonId, content]);
  const progress = useMemo(() => (lessonId ? content.loadLessonProgress()[lessonId] : undefined), [lessonId, content]);

  useEffect(() => {
    if (lessonId) content.markLessonViewed(lessonId);
  }, [lessonId, content]);

  if (!lesson) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-hanji-400 dark:text-hanji-500">
        Lesson not found.
      </div>
    );
  }

  const introExample = lesson.examples[0];
  const moreExamples = lesson.examples.slice(1);
  const practiceCount = progress?.practiceCount ?? 0;

  return (
    <div className="space-y-4">
      {/* Header card — same style as HangeulPracticePage */}
      <section className="rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-hanji-500 dark:text-hanji-400">
              {lesson.level} · Grammar
            </div>
            <h1 className="mt-1 text-xl font-semibold">{lesson.title}</h1>
            <p className="mt-1 text-sm text-namsaek-600 dark:text-hanji-300">{lesson.summary}</p>
          </div>
          {lesson.nextLessonId && (
            <button
              onClick={() => navigate(`/grammar/${lesson.nextLessonId}`)}
              className="shrink-0 flex items-center gap-1.5 rounded-2xl bg-namsaek-500 px-4 py-2 text-sm font-semibold text-hanji-50 transition hover:bg-namsaek-600"
            >
              Next lesson
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>

      {/* Pattern comparison */}
      {lesson.pattern && (
        <div className="rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
          <div className="text-xs font-semibold text-hanji-500 dark:text-hanji-400 mb-3">
            Word order
          </div>
          <div className="space-y-3">
            <div>
              <div className="mb-1.5 text-xs text-hanji-400 dark:text-hanji-500">English</div>
              <div className="flex flex-wrap gap-2">
                {lesson.pattern.englishOrder.map((part, i) => (
                  <span
                    key={i}
                    className={
                      "rounded-xl border px-3 py-1.5 text-sm font-medium " +
                      (roleColors[part.toLowerCase()] ?? "bg-hanji-50 text-hanji-700 border-hanji-200 dark:bg-namsaek-800 dark:text-hanji-200 dark:border-namsaek-700")
                    }
                  >
                    {part}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-xs text-hanji-400 dark:text-hanji-500">Korean</div>
              <div className="flex flex-wrap gap-2">
                {lesson.pattern.koreanOrder.map((part, i) => (
                  <span
                    key={i}
                    className={
                      "rounded-xl border px-3 py-1.5 text-sm font-medium " +
                      (roleColors[part.toLowerCase()] ?? "bg-hanji-50 text-hanji-700 border-hanji-200 dark:bg-namsaek-800 dark:text-hanji-200 dark:border-namsaek-700")
                    }
                  >
                    {part}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Intro example card */}
      {introExample && (
        <div className="rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
          <div className="text-xs font-semibold text-hanji-500 dark:text-hanji-400 mb-3">
            Example
          </div>
          <ExampleCard example={introExample} featured />
        </div>
      )}

      {/* Key points */}
      <div className="rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
        <div className="text-xs font-semibold text-hanji-500 dark:text-hanji-400 mb-3">
          Key points
        </div>
        <div className="space-y-3">
          {lesson.explanationBlocks.map((block) => (
            <ExplanationBlock key={block.id} block={block} />
          ))}
        </div>
      </div>

      {/* More examples */}
      {moreExamples.length > 0 && (
        <div className="rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
          <div className="text-xs font-semibold text-hanji-500 dark:text-hanji-400 mb-3">
            More examples
          </div>
          <div className="space-y-3">
            {moreExamples.map((ex) => (
              <ExampleCard key={ex.id} example={ex} />
            ))}
          </div>
        </div>
      )}

      {/* Practice CTAs */}
      <div className="rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-hanji-500 dark:text-hanji-400">
            Practice this lesson
          </div>
          {practiceCount > 0 && (
            <div className="text-xs text-cheongja-600 dark:text-cheongja-400">
              {practiceCount} session{practiceCount !== 1 ? "s" : ""} done
            </div>
          )}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {lesson.practiceModes.map((mode) => (
            <button
              key={mode}
              onClick={() => navigate(`/play/${mode}?lessonId=${lesson.id}`)}
              className="group flex items-center gap-3 rounded-2xl border border-hanji-300 bg-hanji-50 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-namsaek-300 hover:bg-white hover:shadow-sm dark:border-namsaek-700 dark:bg-namsaek-800 dark:hover:border-namsaek-500 dark:hover:bg-namsaek-700"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-namsaek-50 text-namsaek-600 dark:bg-namsaek-700 dark:text-hanji-200">
                {practiceIcons[mode] ?? <BookOpen className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold">{practiceLabels[mode] ?? mode}</div>
                <div className="text-xs text-hanji-500 dark:text-hanji-400">
                  {practiceDesc[mode] ?? "Practice"}
                </div>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-hanji-400 transition group-hover:translate-x-0.5 dark:text-hanji-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExampleCard({ example, featured }: { example: LessonExample; featured?: boolean }) {
  return (
    <div
      className={
        "rounded-2xl border p-4 " +
        (featured
          ? "border-namsaek-200 bg-namsaek-50/50 dark:border-namsaek-700/60 dark:bg-namsaek-800/30"
          : "border-hanji-200 bg-hanji-50 dark:border-namsaek-700/40 dark:bg-namsaek-950/30")
      }
    >
      <div className={featured ? "text-2xl font-semibold tracking-tight" : "text-lg font-semibold"}>
        {example.korean}
      </div>
      <div className="mt-1 text-sm text-hanji-500 dark:text-hanji-400">{example.english}</div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {example.koreanBreakdown.map((role, i) => (
          <span
            key={i}
            className={
              "rounded-lg border px-2 py-0.5 text-xs font-medium " +
              (roleColors[role] ?? "bg-hanji-100 text-hanji-600 border-hanji-200 dark:bg-namsaek-800 dark:text-hanji-300 dark:border-namsaek-700")
            }
          >
            {role}
          </span>
        ))}
      </div>

      {example.notes && example.notes.length > 0 && (
        <div className="mt-3 space-y-1">
          {example.notes.map((note, i) => (
            <div key={i} className="text-xs text-hanji-500 dark:text-hanji-400">
              · {note}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExplanationBlock({ block }: { block: LessonExplanationBlock }) {
  if (block.type === "tip") {
    return (
      <MagpieTip title={block.title ?? "Birdie Tip"}>
        {block.content}
      </MagpieTip>
    );
  }

  if (block.type === "warning") {
    return (
      <div className="flex gap-3 rounded-2xl border border-geum-200 bg-geum-50 p-3 dark:border-geum-700/50 dark:bg-geum-900/20">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-geum-500 dark:text-geum-400" />
        <div>
          {block.title && (
            <div className="text-xs font-semibold text-geum-700 dark:text-geum-300 mb-0.5">
              {block.title}
            </div>
          )}
          <div className="text-sm text-geum-700 dark:text-geum-200">{block.content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-hanji-400 dark:text-hanji-500" />
      <div className="text-sm text-namsaek-700 dark:text-hanji-200">{block.content}</div>
    </div>
  );
}
