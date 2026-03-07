import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "nav-active" | "nav-inactive";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-namsaek-500 text-hanji-50 px-4 py-3 text-sm font-semibold shadow-sm rounded-xl hover:bg-namsaek-600 transition",
  secondary:
    "border border-hanji-300 bg-white rounded-2xl px-3 py-2 text-xs font-semibold shadow-sm hover:bg-hanji-50 dark:border-namsaek-700 dark:bg-namsaek-800 dark:hover:bg-namsaek-700 transition",
  "nav-active":
    "rounded-xl px-3 py-2 bg-namsaek-500 text-hanji-50 text-sm font-medium",
  "nav-inactive":
    "rounded-xl px-3 py-2 text-sm font-medium text-namsaek-600 hover:bg-hanji-200 dark:text-hanji-300 dark:hover:bg-namsaek-800 transition",
};

export function Button({
  variant = "primary",
  className = "",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={
        variantClasses[variant] +
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