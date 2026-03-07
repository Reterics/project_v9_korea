import type { ReactNode } from "react";

type BottomNavProps = {
  children: ReactNode;
  className?: string;
};

export function BottomNav({ children, className = "" }: BottomNavProps) {
  return (
    <nav
      className={
        "border-t border-hanji-300/70 bg-hanji-100/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-namsaek-800/60 dark:bg-namsaek-950/95" +
        (className ? " " + className : "")
      }
    >
      <div className="flex items-stretch">{children}</div>
    </nav>
  );
}
