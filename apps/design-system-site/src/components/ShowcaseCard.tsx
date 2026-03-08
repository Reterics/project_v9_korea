import type { ReactNode } from "react";
import { Card } from "@reterics/birdie-ui";

type ShowcaseCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function ShowcaseCard({
  title,
  description,
  children,
  className = "",
}: ShowcaseCardProps) {
  return (
    <Card className={className}>
      <h3 className="text-sm font-semibold text-namsaek-700 dark:text-hanji-100">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-xs text-hanji-500 dark:text-hanji-400">
          {description}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </Card>
  );
}
