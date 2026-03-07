import { useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type NavigationItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  children?: ReactNode;
  defaultOpen?: boolean;
};

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={
      "h-4 w-4 shrink-0 transition-transform duration-200 " +
      (open ? "rotate-90" : "")
    }
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export function NavigationItem({
  icon,
  label,
  active,
  collapsed,
  children,
  defaultOpen,
  className = "",
  onClick,
  ...rest
}: NavigationItemProps) {
  const hasChildren = !!children;
  const [open, setOpen] = useState(defaultOpen ?? !!active);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasChildren) {
      setOpen((v) => !v);
    }
    onClick?.(e);
  };

  return (
    <div>
      <button
        className={
          "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium outline-none transition " +
          (active
            ? "bg-namsaek-500 text-hanji-50 shadow-sm"
            : "text-namsaek-600 hover:bg-hanji-200 hover:text-namsaek-700 focus-visible:ring-2 focus-visible:ring-namsaek-300 dark:text-hanji-300 dark:hover:bg-namsaek-800 dark:hover:text-hanji-100 dark:focus-visible:ring-namsaek-600") +
          (collapsed ? " justify-center" : "") +
          " cursor-pointer" +
          (className ? " " + className : "")
        }
        title={collapsed ? label : undefined}
        onClick={handleClick}
        {...rest}
      >
        {icon && (
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">
            {icon}
          </span>
        )}
        {!collapsed && <span className="flex-1 truncate text-left">{label}</span>}
        {!collapsed && hasChildren && <ChevronIcon open={open} />}
      </button>

      {!collapsed && hasChildren && open && (
        <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-hanji-200 pl-3 dark:border-namsaek-800">
          {children}
        </div>
      )}
    </div>
  );
}
