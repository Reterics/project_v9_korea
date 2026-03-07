import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

const base =
  "w-full rounded-xl border bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition " +
  "placeholder:text-hanji-400 " +
  "dark:bg-namsaek-900 dark:text-hanji-100 dark:placeholder:text-namsaek-400";

const stateClasses = {
  default:
    "border-hanji-300 focus:border-namsaek-400 focus:ring-2 focus:ring-namsaek-200 " +
    "dark:border-namsaek-700 dark:focus:border-namsaek-500 dark:focus:ring-namsaek-800",
  error:
    "border-dancheong-400 focus:border-dancheong-500 focus:ring-2 focus:ring-dancheong-200 " +
    "dark:border-dancheong-600 dark:focus:border-dancheong-500 dark:focus:ring-dancheong-900",
  disabled: "opacity-50 cursor-not-allowed bg-hanji-100 dark:bg-namsaek-800",
};

export function Input({ error, disabled, className = "", ...rest }: InputProps) {
  return (
    <input
      className={
        base +
        " " +
        (disabled
          ? stateClasses.disabled
          : error
            ? stateClasses.error
            : stateClasses.default) +
        (className ? " " + className : "")
      }
      disabled={disabled}
      {...rest}
    />
  );
}
