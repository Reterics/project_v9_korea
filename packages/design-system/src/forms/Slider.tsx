import type { InputHTMLAttributes } from "react";

type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> & {
  label?: string;
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  showValue?: boolean;
  error?: boolean;
};

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  showValue = true,
  error,
  disabled,
  className = "",
  id,
  ...rest
}: SliderProps) {
  const range = max - min;
  const progress = range > 0 ? ((value - min) / range) * 100 : 0;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={"flex w-full flex-col gap-2" + (className ? " " + className : "")}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-3">
          {label ? (
            <label
              htmlFor={id}
              className="text-sm font-medium text-namsaek-700 dark:text-hanji-200"
            >
              {label}
            </label>
          ) : (
            <span />
          )}
          {showValue && (
            <output
              htmlFor={id}
              className={
                "rounded-lg border px-2 py-1 text-xs font-semibold tabular-nums " +
                (error
                  ? "border-dancheong-200 bg-dancheong-50 text-dancheong-700 dark:border-dancheong-700 dark:bg-dancheong-900/50 dark:text-dancheong-200"
                  : "border-hanji-300 bg-white text-namsaek-600 dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-200")
              }
            >
              {value}
              {unit}
            </output>
          )}
        </div>
      )}
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(event) => onChange?.(event.currentTarget.valueAsNumber)}
        className={
          "h-2 w-full cursor-pointer appearance-none rounded-full outline-none transition " +
          "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 " +
          "[&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-namsaek-500 [&::-moz-range-thumb]:shadow-sm " +
          "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full " +
          "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-namsaek-500 [&::-webkit-slider-thumb]:shadow-sm " +
          "focus-visible:ring-2 focus-visible:ring-namsaek-300 disabled:cursor-not-allowed disabled:opacity-50 dark:[&::-moz-range-thumb]:bg-namsaek-300 dark:[&::-webkit-slider-thumb]:bg-namsaek-300 " +
          (error ? "focus-visible:ring-dancheong-300" : "")
        }
        style={{
          background: `linear-gradient(to right, var(--color-namsaek-500) 0%, var(--color-namsaek-500) ${clampedProgress}%, var(--color-hanji-300) ${clampedProgress}%, var(--color-hanji-300) 100%)`,
        }}
        {...rest}
      />
    </div>
  );
}
