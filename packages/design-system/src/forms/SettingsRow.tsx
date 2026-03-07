import type { ReactNode } from "react";

type SettingsRowProps = {
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function SettingsRow({
  label,
  description,
  children,
  className = "",
}: SettingsRowProps) {
  return (
    <div
      className={
        "flex items-center justify-between gap-4 rounded-2xl border border-hanji-300 bg-white p-4 shadow-sm " +
        "dark:border-namsaek-700 dark:bg-namsaek-900" +
        (className ? " " + className : "")
      }
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-namsaek-700 dark:text-hanji-100">
          {label}
        </p>
        {description && (
          <p className="mt-0.5 text-xs text-namsaek-400 dark:text-hanji-400">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
