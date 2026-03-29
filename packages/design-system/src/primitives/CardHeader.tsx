import type { ReactNode } from "react";

type CardHeaderProps = {
  icon?: ReactNode;
  title: string;
  className?: string;
};

export function CardHeader({ icon, title, className = "" }: CardHeaderProps) {
  return (
    <div
      className={
        "mb-4 flex items-center gap-2 text-namsaek-800 dark:text-hanji-200" +
        (className ? " " + className : "")
      }
    >
      {icon}
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}
