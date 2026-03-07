import type { ReactNode } from "react";

type TopbarProps = {
  logo?: ReactNode;
  actions?: ReactNode;
  onMenuClick?: () => void;
  className?: string;
};

export function Topbar({ logo, actions, onMenuClick, className = "" }: TopbarProps) {
  return (
    <header
      className={
        "flex h-16 items-center gap-3 border-b border-hanji-300 bg-white px-4 dark:border-namsaek-700 dark:bg-namsaek-900" +
        (className ? " " + className : "")
      }
    >
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex items-center justify-center rounded-lg p-2 text-namsaek-500 outline-none transition hover:bg-hanji-200 focus-visible:ring-2 focus-visible:ring-namsaek-300 lg:hidden dark:text-hanji-300 dark:hover:bg-namsaek-800 dark:focus-visible:ring-namsaek-600 cursor-pointer"
          aria-label="Open menu"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      {logo && <div className="shrink-0">{logo}</div>}
      <div className="flex-1" />
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
