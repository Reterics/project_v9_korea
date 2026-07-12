import { Fragment, useId, useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ReactNode } from "react";

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
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const menuId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

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

  useEffect(() => {
    if (!open) return;
    itemRefs.current[highlightedIndex]?.focus();
  }, [open, highlightedIndex]);

  const openMenu = (index = 0) => {
    setHighlightedIndex(index);
    setOpen(true);
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    setOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  const focusItem = (index: number) => {
    if (items.length === 0) return;
    const nextIndex = (index + items.length) % items.length;
    setHighlightedIndex(nextIndex);
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openMenu(0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openMenu(Math.max(items.length - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu(0);
    }
  };

  const handleMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      return;
    }

    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(highlightedIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(highlightedIndex - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusItem(items.length - 1);
    }
  };

  return (
    <div
      ref={ref}
      onBlurCapture={() => {
        requestAnimationFrame(() => {
          if (!ref.current?.contains(document.activeElement)) {
            setOpen(false);
          }
        });
      }}
      className={"relative" + (className ? " " + className : "")}
    >
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-hanji-300 bg-white shadow-sm hover:bg-hanji-50 dark:border-namsaek-700 dark:bg-namsaek-800 dark:hover:bg-namsaek-700 cursor-pointer"
        title={title}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
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
          id={menuId}
          role="menu"
          onKeyDown={handleMenuKeyDown}
          className={
            "absolute top-full z-50 mt-2 w-56 rounded-2xl border border-hanji-300 bg-white py-1 shadow-lg dark:border-namsaek-700 dark:bg-namsaek-900" +
            (align === "right" ? " right-0" : " left-0")
          }
        >
          {children && (
            <div
              role="presentation"
              className="border-b border-hanji-200 px-4 py-3 dark:border-namsaek-700"
            >
              {children}
            </div>
          )}

          {items.map((item, index) => (
            <Fragment key={item.id}>
              {item.divider && (
                <div
                  role="separator"
                  className="my-1 border-t border-hanji-200 dark:border-namsaek-700"
                />
              )}
              <button
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  closeMenu({ restoreFocus: false });
                  item.onClick?.();
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={
                  "flex w-full items-center gap-2 px-4 py-2 text-sm outline-none transition cursor-pointer focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-namsaek-300 dark:focus-visible:ring-namsaek-600 " +
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
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
