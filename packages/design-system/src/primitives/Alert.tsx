import type { ReactNode } from "react";

type AlertVariant = "info" | "success" | "warning" | "danger";
type AlertSize = "sm" | "md" | "lg";

type AlertProps = {
  /** Alert style */
  variant?: AlertVariant;
  /** Alert size */
  size?: AlertSize;
  /** Optional title displayed above the message */
  title?: string;
  /** Alert content */
  children: ReactNode;
  /** Show a dismiss button */
  onDismiss?: () => void;
  className?: string;
};

const variantClasses: Record<AlertVariant, string> = {
  info: "border-namsaek-300 bg-namsaek-50 text-namsaek-700 dark:border-namsaek-600 dark:bg-namsaek-900/50 dark:text-namsaek-200",
  success:
    "border-cheongja-300 bg-cheongja-50 text-cheongja-700 dark:border-cheongja-700 dark:bg-cheongja-900/40 dark:text-cheongja-200",
  warning:
    "border-geum-300 bg-geum-50 text-geum-700 dark:border-geum-700 dark:bg-geum-900/40 dark:text-geum-200",
  danger:
    "border-dancheong-300 bg-dancheong-50 text-dancheong-700 dark:border-dancheong-700 dark:bg-dancheong-900/40 dark:text-dancheong-200",
};

const iconPaths: Record<AlertVariant, string> = {
  info: "M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z",
  success: "M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z",
  warning: "M12 9v2m0 4h.01M12 2L2 20h20L12 2z",
  danger: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m5-2a9 9 0 11-18 0 9 9 0 0118 0z",
};

const sizeClasses: Record<AlertSize, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-4 text-base",
};

const iconSizeClasses: Record<AlertSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function Alert({
  variant = "info",
  size = "md",
  title,
  children,
  onDismiss,
  className = "",
}: AlertProps) {
  return (
    <div
      role="alert"
      className={
        "flex gap-3 rounded-2xl border " +
        variantClasses[variant] +
        " " +
        sizeClasses[size] +
        (className ? " " + className : "")
      }
    >
      <svg
        className={"shrink-0 " + iconSizeClasses[size]}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={iconPaths[variant]} />
      </svg>
      <div className="flex-1">
        {title && (
          <p className="font-semibold">{title}</p>
        )}
        <div className={title ? "mt-1" : ""}>{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-0.5 opacity-60 transition hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current cursor-pointer"
          aria-label="Dismiss"
        >
          <svg
            className={iconSizeClasses[size]}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
