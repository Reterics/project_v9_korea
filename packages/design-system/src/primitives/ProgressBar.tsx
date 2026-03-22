type ProgressBarVariant = "primary" | "success" | "danger" | "warning";
type ProgressBarSize = "sm" | "md" | "lg";

type ProgressBarProps = {
  /** Current value (0–100) */
  value: number;
  /** Maximum value, defaults to 100 */
  max?: number;
  /** Visual style */
  variant?: ProgressBarVariant;
  /** Bar thickness */
  size?: ProgressBarSize;
  /** Show percentage label inside the bar */
  showLabel?: boolean;
  /** Whether to animate the bar fill */
  animated?: boolean;
  className?: string;
};

const variantClasses: Record<ProgressBarVariant, string> = {
  primary: "bg-namsaek-500 dark:bg-namsaek-400",
  success: "bg-cheongja-500 dark:bg-cheongja-400",
  danger: "bg-dancheong-500 dark:bg-dancheong-400",
  warning: "bg-geum-500 dark:bg-geum-400",
};

const trackClasses =
  "w-full overflow-hidden rounded-full bg-hanji-200 dark:bg-namsaek-800";

const sizeClasses: Record<ProgressBarSize, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  max = 100,
  variant = "primary",
  size = "md",
  showLabel = false,
  animated = true,
  className = "",
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={
        trackClasses +
        " " +
        sizeClasses[size] +
        (className ? " " + className : "")
      }
    >
      <div
        className={
          "h-full rounded-full " +
          variantClasses[variant] +
          (animated ? " transition-all duration-500 ease-out" : "") +
          (showLabel && size === "lg"
            ? " flex items-center justify-end pr-2 text-[10px] font-semibold text-white dark:text-namsaek-900"
            : "")
        }
        style={{ width: `${pct}%` }}
      >
        {showLabel && size === "lg" && pct >= 10 ? `${Math.round(pct)}%` : null}
      </div>
    </div>
  );
}
