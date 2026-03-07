import type { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "danger" | "warning";

type BadgeProps = {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-hanji-100 text-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-300",
  success:
    "bg-cheongja-50 text-cheongja-700 dark:bg-cheongja-900/40 dark:text-cheongja-300",
  danger:
    "bg-dancheong-50 text-dancheong-600 dark:bg-dancheong-900/40 dark:text-dancheong-300",
  warning:
    "bg-geum-50 text-geum-700 dark:bg-geum-900/40 dark:text-geum-300",
};

export function Badge({ variant = "default", className = "", children }: BadgeProps) {
  return (
    <span
      className={
        "inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold " +
        variantClasses[variant] +
        (className ? " " + className : "")
      }
    >
      {children}
    </span>
  );
}