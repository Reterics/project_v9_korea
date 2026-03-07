import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
};

const base =
  "w-full rounded-xl border bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition appearance-none " +
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] " +
  "bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-9 " +
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

export function Select({ error, disabled, className = "", children, ...rest }: SelectProps) {
  return (
    <select
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
    >
      {children}
    </select>
  );
}
