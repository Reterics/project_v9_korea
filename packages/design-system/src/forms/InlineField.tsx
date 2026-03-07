import type { ReactNode } from "react";

type InlineFieldProps = {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

export function InlineField({ label, htmlFor, children, className = "" }: InlineFieldProps) {
  return (
    <div
      className={
        "flex items-center justify-between gap-4" +
        (className ? " " + className : "")
      }
    >
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-namsaek-700 dark:text-hanji-200"
      >
        {label}
      </label>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
