import type { ReactNode } from "react";

type SidebarProps = {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  collapsed?: boolean;
  className?: string;
};

export function Sidebar({
  header,
  footer,
  children,
  collapsed,
  className = "",
}: SidebarProps) {
  return (
    <aside
      className={
        "hidden lg:flex flex-col border-r border-hanji-300 bg-white dark:border-namsaek-700 dark:bg-namsaek-900 " +
        (collapsed ? "w-16" : "w-56") +
        " h-full transition-[width] duration-200" +
        (className ? " " + className : "")
      }
    >
      {header && (
        <div
          className={
            "flex h-16 shrink-0 items-center border-b border-hanji-300 dark:border-namsaek-700" +
            (collapsed ? " justify-center px-2" : " px-4")
          }
        >
          {header}
        </div>
      )}
      <nav className={"flex-1 overflow-y-auto py-3" + (collapsed ? " px-2" : " px-3")}>
        <div className="flex flex-col gap-1">{children}</div>
      </nav>
      {footer && (
        <div
          className={
            "shrink-0 border-t border-hanji-300 py-3 dark:border-namsaek-700" +
            (collapsed ? " px-2" : " px-3")
          }
        >
          {footer}
        </div>
      )}
    </aside>
  );
}
