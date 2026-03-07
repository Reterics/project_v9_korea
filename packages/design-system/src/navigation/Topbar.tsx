import type { ReactNode } from "react";

type TopbarNavPosition = "left" | "center" | "right";

type TopbarProps = {
  logo?: ReactNode;
  nav?: ReactNode;
  navPosition?: TopbarNavPosition;
  actions?: ReactNode;
  onMenuClick?: () => void;
  className?: string;
};

export function Topbar({
  logo,
  nav,
  navPosition = "center",
  actions,
  onMenuClick,
  className = "",
}: TopbarProps) {
  return (
    <header
      className={
        "grid h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-b border-hanji-300 bg-white px-4 dark:border-namsaek-700 dark:bg-namsaek-900" +
        (className ? " " + className : "")
      }
    >
      <div className="flex min-w-0 items-center justify-self-start gap-3">
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
        {nav && navPosition === "left" && <div className="hidden items-center lg:flex">{nav}</div>}
      </div>

      <div className="min-w-0 justify-self-center">
        {nav && navPosition === "center" && (
          <div className="hidden items-center justify-center lg:flex">{nav}</div>
        )}
      </div>

      <div className="flex min-w-0 items-center justify-self-end gap-2">
        {nav && navPosition === "right" && <div className="hidden items-center lg:flex">{nav}</div>}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
