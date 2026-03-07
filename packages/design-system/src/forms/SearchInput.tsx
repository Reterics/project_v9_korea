import type { InputHTMLAttributes } from "react";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function SearchInput({ className = "", ...rest }: SearchInputProps) {
  return (
    <div className={"relative" + (className ? " " + className : "")}>
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-namsaek-400 dark:text-hanji-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        className={
          "w-full rounded-xl border border-hanji-300 bg-white py-2.5 pl-9 pr-3 text-sm shadow-sm outline-none transition " +
          "placeholder:text-hanji-400 " +
          "focus:border-namsaek-400 focus:ring-2 focus:ring-namsaek-200 " +
          "dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-100 dark:placeholder:text-namsaek-400 " +
          "dark:focus:border-namsaek-500 dark:focus:ring-namsaek-800"
        }
        {...rest}
      />
    </div>
  );
}
