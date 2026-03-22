type SpinnerSize = "sm" | "md" | "lg";
type SpinnerVariant = "primary" | "secondary" | "current";

type SpinnerProps = {
  /** Spinner size */
  size?: SpinnerSize;
  /** Color variant — "current" inherits the parent text color */
  variant?: SpinnerVariant;
  /** Accessible label */
  label?: string;
  className?: string;
};

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-[3px]",
  lg: "h-10 w-10 border-4",
};

const variantClasses: Record<SpinnerVariant, string> = {
  primary:
    "border-namsaek-200 border-t-namsaek-500 dark:border-namsaek-700 dark:border-t-namsaek-400",
  secondary:
    "border-hanji-300 border-t-hanji-600 dark:border-namsaek-700 dark:border-t-hanji-400",
  current:
    "border-current/20 border-t-current",
};

export function Spinner({
  size = "md",
  variant = "primary",
  label = "Loading",
  className = "",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={
        "inline-block animate-spin rounded-full " +
        sizeClasses[size] +
        " " +
        variantClasses[variant] +
        (className ? " " + className : "")
      }
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}
