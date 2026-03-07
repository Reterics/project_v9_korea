import { useEffect } from "react";
import type { ReactNode } from "react";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  header?: ReactNode;
  children: ReactNode;
  hideOnDesktop?: boolean;
  className?: string;
};

export function Drawer({
  open,
  onClose,
  header,
  children,
  hideOnDesktop = true,
  className = "",
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={
        "fixed inset-0 z-40" +
        (hideOnDesktop ? " lg:hidden" : "") +
        (open ? "" : " pointer-events-none")
      }
    >
      {/* Backdrop */}
      <div
        className={
          "absolute inset-0 bg-black/40 transition-opacity duration-200 " +
          (open ? "opacity-100" : "opacity-0")
        }
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={
          "absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl transition-transform duration-200 dark:bg-namsaek-900" +
          (open ? " translate-x-0" : " -translate-x-full") +
          (className ? " " + className : "")
        }
      >
        {/* Header with close button */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-hanji-300 px-4 dark:border-namsaek-700">
          <div>{header}</div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg p-2 text-namsaek-500 outline-none transition hover:bg-hanji-200 focus-visible:ring-2 focus-visible:ring-namsaek-300 dark:text-hanji-300 dark:hover:bg-namsaek-800 dark:focus-visible:ring-namsaek-600 cursor-pointer"
            aria-label="Close menu"
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
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <div className="flex flex-col gap-1">{children}</div>
        </nav>
      </aside>
    </div>
  );
}
