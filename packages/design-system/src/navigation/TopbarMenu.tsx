import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";

type TopbarMenuItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  children?: TopbarMenuItem[];
};

type TopbarMenuProps = {
  items: TopbarMenuItem[];
  className?: string;
};

const ChevronDown = () => (
  <svg
    className="h-3.5 w-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

function MenuItem({ item, onClose }: { item: TopbarMenuItem; onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasChildren = item.children && item.children.length > 0;

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleClick = () => {
    if (hasChildren) {
      setOpen((v) => !v);
    } else {
      item.onClick?.();
      onClose?.();
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleClick}
        className={
          "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium outline-none transition cursor-pointer " +
          (item.active
            ? "bg-namsaek-500 text-hanji-50"
            : "text-namsaek-600 hover:bg-hanji-200 hover:text-namsaek-700 focus-visible:ring-2 focus-visible:ring-namsaek-300 dark:text-hanji-300 dark:hover:bg-namsaek-800 dark:hover:text-hanji-100 dark:focus-visible:ring-namsaek-600")
        }
      >
        {item.icon && (
          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
            {item.icon}
          </span>
        )}
        {item.label}
        {hasChildren && <ChevronDown />}
      </button>

      {hasChildren && open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[10rem] rounded-xl border border-hanji-300 bg-white py-1 shadow-lg dark:border-namsaek-700 dark:bg-namsaek-900">
          {item.children!.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                child.onClick?.();
                setOpen(false);
                onClose?.();
              }}
              className={
                "flex w-full items-center gap-2 px-3 py-2 text-sm outline-none transition cursor-pointer " +
                (child.active
                  ? "bg-namsaek-100 font-medium text-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-100"
                  : "text-namsaek-600 hover:bg-hanji-100 dark:text-hanji-300 dark:hover:bg-namsaek-800")
              }
            >
              {child.icon && (
                <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
                  {child.icon}
                </span>
              )}
              {child.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TopbarMenu({ items, className = "" }: TopbarMenuProps) {
  return (
    <div
      className={
        "flex items-center gap-1" +
        (className ? " " + className : "")
      }
    >
      {items.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
}
