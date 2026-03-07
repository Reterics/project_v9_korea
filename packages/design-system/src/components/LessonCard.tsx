import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { LessonStatusIcon } from "../icons/LessonStatusIcon.tsx";

type LessonStatus = "done" | "in_progress" | "locked";

type LessonCardProps = {
  title: string;
  summary: string;
  status: LessonStatus;
  actionLabel?: string;
  secondaryAction?: { label: string; onClick: () => void };
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
};

export function LessonCard({
  title,
  summary,
  status,
  actionLabel,
  secondaryAction,
  icon,
  onClick,
  className = "",
}: LessonCardProps) {
  const isLocked = status === "locked";

  return (
    <div
      className={
        "rounded-3xl border p-5 " +
        (status === "in_progress"
          ? "border-namsaek-200 bg-namsaek-50 dark:border-namsaek-700/50 dark:bg-namsaek-900/60"
          : "border-hanji-300 bg-white shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900") +
        (isLocked ? " opacity-50" : "") +
        (className ? " " + className : "")
      }
    >
      <div className="flex items-center gap-2">
        {icon ?? <LessonStatusIcon status={status} />}
        <div className="text-xs font-medium text-namsaek-600 dark:text-namsaek-400">
          {status === "in_progress" ? "Continue lesson" : status === "done" ? "Completed" : "Locked"}
        </div>
      </div>
      <div className="mt-1 text-base font-semibold text-namsaek-900 dark:text-hanji-100">
        {title}
      </div>
      <div className="mt-0.5 text-sm text-namsaek-600 dark:text-hanji-300">
        {summary}
      </div>
      {!isLocked && (onClick || secondaryAction) && (
        <div className="mt-4 flex gap-2">
          {onClick && (
            <button
              onClick={onClick}
              className="inline-flex items-center gap-1.5 rounded-xl bg-namsaek-500 px-4 py-2 text-xs font-semibold text-hanji-50 transition hover:bg-namsaek-600"
            >
              {actionLabel ?? (status === "in_progress" ? "Continue lesson" : "Open lesson")}
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center gap-1.5 rounded-xl border border-namsaek-300 bg-white px-4 py-2 text-xs font-semibold text-namsaek-700 transition hover:bg-namsaek-50 dark:border-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-200 dark:hover:bg-namsaek-700"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}