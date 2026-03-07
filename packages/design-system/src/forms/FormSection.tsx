import type { HTMLAttributes, ReactNode } from "react";

type FormSectionProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormSection({
  title,
  description,
  children,
  className = "",
  ...rest
}: FormSectionProps) {
  return (
    <div
      className={
        "flex flex-col gap-4 border-b border-hanji-200 pb-6 last:border-b-0 dark:border-namsaek-800" +
        (className ? " " + className : "")
      }
      {...rest}
    >
      <div>
        <h3 className="text-base font-semibold text-namsaek-700 dark:text-hanji-100">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 text-sm text-namsaek-400 dark:text-hanji-400">
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
