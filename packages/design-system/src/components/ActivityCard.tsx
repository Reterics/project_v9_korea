import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

type ActivityCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  meta: string;
  available?: boolean;
  onClick?: () => void;
  className?: string;
};

export function ActivityCard({
  icon,
  title,
  description,
  meta,
  available = true,
  onClick,
  className = "",
}: ActivityCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={!available}
      className={
        "group rounded-3xl border border-hanji-300 bg-white p-5 text-left shadow-sm transition dark:border-namsaek-700 dark:bg-namsaek-900 " +
        (available
          ? "hover:-translate-y-0.5 hover:border-namsaek-300 hover:shadow-md dark:hover:border-namsaek-600"
          : "opacity-50 cursor-not-allowed") +
        (className ? " " + className : "")
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-namsaek-50 text-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-200">
            {icon}
          </div>
          <div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="mt-1 text-xs text-hanji-500 dark:text-hanji-400">
              {available ? meta : "Coming soon"}
            </div>
          </div>
        </div>
        {available && (
          <ChevronRight className="mt-1 h-4 w-4 text-hanji-400 transition group-hover:translate-x-0.5 dark:text-hanji-500" />
        )}
      </div>
      <div className="mt-3 text-sm text-namsaek-600 dark:text-hanji-300">{description}</div>
    </button>
  );
}