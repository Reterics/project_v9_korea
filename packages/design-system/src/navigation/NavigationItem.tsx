import type { ButtonHTMLAttributes, ReactNode } from "react";

type NavigationItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
};

export function NavigationItem({
  icon,
  label,
  active,
  collapsed,
  className = "",
  ...rest
}: NavigationItemProps) {
  return (
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
      {...rest}
    >
      {icon && (
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">
          {icon}
        </span>
      )}
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
