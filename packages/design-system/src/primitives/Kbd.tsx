import type { ReactNode } from "react";

type KbdSize = "sm" | "md" | "lg";

type KbdProps = {
  /** The key label(s) to display */
  children: ReactNode;
  /** Size variant */
  size?: KbdSize;
  className?: string;
};

const sizeClasses: Record<KbdSize, string> = {
  sm: "min-w-5 px-1 py-0.5 text-[10px]",
  md: "min-w-6 px-1.5 py-0.5 text-xs",
  lg: "min-w-8 px-2 py-1 text-sm",
};

export function Kbd({
  children,
  size = "md",
  className = "",
}: KbdProps) {
  return (
    <kbd
      className={
        "inline-flex items-center justify-center rounded-md border border-hanji-300 bg-hanji-100 font-mono font-medium text-namsaek-700 shadow-[0_1px_0_1px_rgba(0,0,0,0.05)] dark:border-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-300 dark:shadow-[0_1px_0_1px_rgba(0,0,0,0.3)] " +
        sizeClasses[size] +
        (className ? " " + className : "")
      }
    >
      {children}
    </kbd>
  );
}
