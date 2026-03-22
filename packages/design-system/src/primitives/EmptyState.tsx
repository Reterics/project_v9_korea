import type { ReactNode } from "react";

type EmptyStateSize = "sm" | "md" | "lg";

type EmptyStateProps = {
  /** Icon or illustration displayed above the message */
  icon?: ReactNode;
  /** Primary heading */
  title: string;
  /** Secondary description */
  description?: string;
  /** Call-to-action element (e.g. a Button) */
  action?: ReactNode;
  /** Size variant */
  size?: EmptyStateSize;
  className?: string;
};

const sizeClasses: Record<EmptyStateSize, { wrapper: string; icon: string; title: string; desc: string }> = {
  sm: {
    wrapper: "py-6",
    icon: "mb-2 text-2xl",
    title: "text-sm font-semibold",
    desc: "text-xs",
  },
  md: {
    wrapper: "py-10",
    icon: "mb-3 text-4xl",
    title: "text-base font-semibold",
    desc: "text-sm",
  },
  lg: {
    wrapper: "py-16",
    icon: "mb-4 text-5xl",
    title: "text-lg font-semibold",
    desc: "text-sm",
  },
};

const defaultIcon = (
  <svg
    className="h-10 w-10 text-hanji-400 dark:text-namsaek-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

export function EmptyState({
  icon,
  title,
  description,
  action,
  size = "md",
  className = "",
}: EmptyStateProps) {
  const s = sizeClasses[size];

  return (
    <div
      className={
        "flex flex-col items-center justify-center text-center " +
        s.wrapper +
        (className ? " " + className : "")
      }
    >
      <div className={s.icon}>
        {icon ?? defaultIcon}
      </div>
      <p className={s.title + " text-namsaek-700 dark:text-hanji-200"}>
        {title}
      </p>
      {description && (
        <p className={s.desc + " mt-1 max-w-sm text-namsaek-500 dark:text-hanji-400"}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
