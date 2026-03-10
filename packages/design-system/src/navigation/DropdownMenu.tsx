import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";

type DropdownMenuItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger";
  divider?: boolean;
};

type DropdownMenuProps = {
  /** Menu items rendered below the header */
  items: DropdownMenuItem[];
  /** Header content rendered above the items */
  children?: ReactNode;
  /** Content inside the trigger button */
  trigger?: ReactNode;
  /** Tooltip / accessible label for the trigger button */
  title?: string;
  /** Alignment of the dropdown relative to the trigger */
  align?: "left" | "right";
  className?: string;
};

export type { DropdownMenuItem, DropdownMenuProps };

export function DropdownMenu({
  items,
  children,
  trigger,
  title,
  align = "right",
  className = "",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className={"relative" + (className ? " " + className : "")}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-hanji-300 bg-white shadow-sm hover:bg-hanji-50 dark:border-namsaek-700 dark:bg-namsaek-800 dark:hover:bg-namsaek-700 cursor-pointer"
        title={title}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {trigger ?? (
          <svg
            className="h-4 w-4 text-namsaek-500 dark:text-hanji-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={
            "absolute top-full z-50 mt-2 w-56 rounded-2xl border border-hanji-300 bg-white py-1 shadow-lg dark:border-namsaek-700 dark:bg-namsaek-900" +
            (align === "right" ? " right-0" : " left-0")
          }
        >
          {children && (
            <div className="border-b border-hanji-200 px-4 py-3 dark:border-namsaek-700">
              {children}
            </div>
          )}

          {items.map((item) => (
            <div key={item.id}>
              {item.divider && (
                <div className="my-1 border-t border-hanji-200 dark:border-namsaek-700" />
              )}
              <button
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                }}
                className={
                  "flex w-full items-center gap-2 px-4 py-2 text-sm outline-none transition cursor-pointer " +
                  (item.variant === "danger"
                    ? "text-dancheong-600 hover:bg-dancheong-50 dark:text-dancheong-400 dark:hover:bg-namsaek-800"
                    : "text-namsaek-700 hover:bg-hanji-100 dark:text-hanji-300 dark:hover:bg-namsaek-800")
                }
              >
                {item.icon && (
                  <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
