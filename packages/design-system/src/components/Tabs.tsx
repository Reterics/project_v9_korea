import type { ReactNode } from "react";

type Tab = {
  id: string;
  label: string;
  icon?: ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
};

export function Tabs({ tabs, active, onChange, className = "" }: TabsProps) {
  return (
    <div
      role="tablist"
      className={
        "flex gap-1 border-b border-hanji-200 dark:border-namsaek-800" +
        (className ? " " + className : "")
      }
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={
              "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium outline-none transition cursor-pointer " +
              (isActive
                ? "text-namsaek-700 dark:text-hanji-100"
                : "text-namsaek-400 hover:text-namsaek-600 dark:text-hanji-400 dark:hover:text-hanji-200") +
              " focus-visible:ring-2 focus-visible:ring-namsaek-300 focus-visible:rounded-lg dark:focus-visible:ring-namsaek-600"
            }
          >
            {tab.icon && (
              <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
                {tab.icon}
              </span>
            )}
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-namsaek-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}
