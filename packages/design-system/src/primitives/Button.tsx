import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "nav-active" | "nav-inactive";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-namsaek-500 text-hanji-50 text-sm font-semibold shadow-sm rounded-xl hover:bg-namsaek-600 transition",
  secondary:
    "border border-hanji-300 bg-white rounded-2xl text-xs font-semibold shadow-sm hover:bg-hanji-50 dark:border-namsaek-700 dark:bg-namsaek-800 dark:hover:bg-namsaek-700 transition",
  outline:
    "border border-hanji-300 bg-white rounded-xl text-sm font-semibold shadow-sm text-namsaek-700 hover:bg-hanji-50 dark:border-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200 dark:hover:bg-namsaek-700 transition",
  danger:
    "border border-dancheong-300 bg-white rounded-xl text-sm font-semibold text-dancheong-700 hover:bg-dancheong-50 dark:border-dancheong-700 dark:bg-namsaek-900 dark:text-dancheong-400 dark:hover:bg-dancheong-950 transition",
  "nav-active":
    "rounded-xl bg-namsaek-500 text-hanji-50 text-sm font-medium",
  "nav-inactive":
    "rounded-xl text-sm font-medium text-namsaek-600 hover:bg-hanji-200 dark:text-hanji-300 dark:hover:bg-namsaek-800 transition",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2",
  md: "px-4 py-3",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={
        variantClasses[variant] +
        " " + sizeClasses[size] +
        (disabled ? " opacity-50 cursor-not-allowed" : " cursor-pointer") +
        (className ? " " + className : "")
      }
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}