import type { ReactNode } from "react";

type StatsCardVariant = "default" | "success" | "warning" | "danger";

type StatsCardProps = {
  label: string;
  value: string | number;
  icon?: ReactNode;
  change?: string;
  variant?: StatsCardVariant;
  className?: string;
};

const iconBg: Record<StatsCardVariant, string> = {
  default: "bg-namsaek-100 text-namsaek-600 dark:bg-namsaek-800 dark:text-namsaek-300",
  success: "bg-cheongja-50 text-cheongja-600 dark:bg-cheongja-900/40 dark:text-cheongja-300",
  warning: "bg-geum-50 text-geum-600 dark:bg-geum-900/40 dark:text-geum-300",
  danger: "bg-dancheong-50 text-dancheong-600 dark:bg-dancheong-900/40 dark:text-dancheong-300",
};

const changeBadge: Record<string, string> = {
  up: "text-cheongja-600 dark:text-cheongja-400",
  down: "text-dancheong-600 dark:text-dancheong-400",
  neutral: "text-namsaek-400 dark:text-hanji-400",
};

function changeDirection(change?: string) {
  if (!change) return "neutral";
  if (change.startsWith("+") || change.startsWith("↑")) return "up";
  if (change.startsWith("-") || change.startsWith("↓")) return "down";
  return "neutral";
}

export function StatsCard({
  label,
  value,
  icon,
  change,
  variant = "default",
  className = "",
}: StatsCardProps) {
  return (
    <div
      className={
        "rounded-2xl border border-hanji-300 bg-white p-4 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900" +
        (className ? " " + className : "")
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-namsaek-400 dark:text-hanji-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-namsaek-700 dark:text-hanji-100">
            {value}
          </p>
          {change && (
            <p className={"mt-1 text-xs font-semibold " + changeBadge[changeDirection(change)]}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl " +
              iconBg[variant]
            }
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
