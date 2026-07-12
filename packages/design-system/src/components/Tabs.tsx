import { useId, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";

type Tab = {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Optional id for the associated tab panel */
  panelId?: string;
};

type TabsVariant = "line" | "stacked";

type TabsProps = {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  /**
   * "line" (default) lays icon and label side by side.
   * "stacked" puts the icon above a small label and distributes the tabs
   * evenly — use it when many tabs must fit a narrow container.
   */
  variant?: TabsVariant;
  /** Accessible label for the tab list */
  ariaLabel?: string;
  className?: string;
};

function getNextIndex(currentIndex: number, delta: number, total: number) {
  return (currentIndex + delta + total) % total;
}

export function Tabs({
  tabs,
  active,
  onChange,
  variant = "line",
  ariaLabel,
  className = "",
}: TabsProps) {
  const fallbackId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeIndex = Math.max(
    tabs.findIndex((tab) => tab.id === active),
    0,
  );

  const focusTab = (index: number) => {
    const tab = tabs[index];
    if (!tab) return;
    onChange(tab.id);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (tabs.length === 0) return;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      focusTab(getNextIndex(index, 1, tabs.length));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      focusTab(getNextIndex(index, -1, tabs.length));
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(tabs.length - 1);
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={
        "flex gap-1 border-b border-hanji-200 dark:border-namsaek-800" +
        (className ? " " + className : "")
      }
    >
      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;
        const tabId = `${fallbackId}-tab-${tab.id}`;
        const panelId = tab.panelId ?? `${fallbackId}-panel-${tab.id}`;
        return (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={tabId}
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={
              (variant === "stacked"
                ? "relative flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 text-xs font-medium outline-none transition cursor-pointer "
                : "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium outline-none transition cursor-pointer ") +
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
            <span className="max-w-full truncate">{tab.label}</span>
            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-namsaek-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}
