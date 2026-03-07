import type { InputHTMLAttributes } from "react";

type NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  error?: boolean;
  value?: number;
  onChange?: (value: number) => void;
};

const base =
  "w-full rounded-xl border bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition " +
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none " +
  "dark:bg-namsaek-900 dark:text-hanji-100";

const stateClasses = {
  default:
    "border-hanji-300 focus:border-namsaek-400 focus:ring-2 focus:ring-namsaek-200 " +
    "dark:border-namsaek-700 dark:focus:border-namsaek-500 dark:focus:ring-namsaek-800",
  error:
    "border-dancheong-400 focus:border-dancheong-500 focus:ring-2 focus:ring-dancheong-200 " +
    "dark:border-dancheong-600 dark:focus:border-dancheong-500 dark:focus:ring-dancheong-900",
  disabled: "opacity-50 cursor-not-allowed bg-hanji-100 dark:bg-namsaek-800",
};

export function NumberInput({
  error,
  disabled,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  ...rest
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.valueAsNumber;
    if (!Number.isNaN(num)) onChange?.(num);
  };

  return (
    <div className={"flex items-center gap-1" + (className ? " " + className : "")}>
      <button
        type="button"
        disabled={disabled || (min !== undefined && value !== undefined && value <= Number(min))}
        onClick={() => onChange?.((value ?? 0) - Number(step ?? 1))}
        className={
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-hanji-300 bg-white text-sm font-semibold transition " +
          "hover:bg-hanji-100 disabled:opacity-40 disabled:cursor-not-allowed " +
          "dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-200 dark:hover:bg-namsaek-800"
        }
        aria-label="Decrease"
      >
        -
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={
          base +
          " text-center " +
          (disabled
            ? stateClasses.disabled
            : error
              ? stateClasses.error
              : stateClasses.default)
        }
        {...rest}
      />
      <button
        type="button"
        disabled={disabled || (max !== undefined && value !== undefined && value >= Number(max))}
        onClick={() => onChange?.((value ?? 0) + Number(step ?? 1))}
        className={
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-hanji-300 bg-white text-sm font-semibold transition " +
          "hover:bg-hanji-100 disabled:opacity-40 disabled:cursor-not-allowed " +
          "dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-200 dark:hover:bg-namsaek-800"
        }
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}
