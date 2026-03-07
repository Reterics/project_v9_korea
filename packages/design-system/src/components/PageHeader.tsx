import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={
        "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4" +
        (className ? " " + className : "")
      }
    >
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-namsaek-700 dark:text-hanji-100">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-sm text-namsaek-400 dark:text-hanji-400">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
