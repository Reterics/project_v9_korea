import { useState, useCallback } from "react";
import type { ReactNode } from "react";

type AccordionItemData = {
  id: string;
  title: ReactNode;
  content: ReactNode;
};

type AccordionProps = {
  /** Items to render */
  items: AccordionItemData[];
  /** Allow multiple items open at once */
  multiple?: boolean;
  /** IDs of initially open items */
  defaultOpen?: string[];
  /** Size variant */
  size?: "sm" | "md" | "lg";
  className?: string;
};

type AccordionItemProps = {
  title: ReactNode;
  open: boolean;
  onToggle: () => void;
  size: "sm" | "md" | "lg";
  children: ReactNode;
  id: string;
};

const sizePadding: Record<string, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-4 text-base",
};

const contentPadding: Record<string, string> = {
  sm: "px-3 pb-2 text-xs",
  md: "px-4 pb-3 text-sm",
  lg: "px-5 pb-4 text-sm",
};

function AccordionItem({ title, open, onToggle, size, children, id }: AccordionItemProps) {
  const headerId = `accordion-header-${id}`;
  const panelId = `accordion-panel-${id}`;

  return (
    <div className="border-b border-hanji-200 last:border-b-0 dark:border-namsaek-700">
      <button
        type="button"
        id={headerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={
          "flex w-full items-center justify-between font-medium text-namsaek-800 transition-colors hover:text-namsaek-600 dark:text-hanji-100 dark:hover:text-hanji-300 cursor-pointer " +
          sizePadding[size]
        }
      >
        <span>{title}</span>
        <svg
          className={
            "h-4 w-4 shrink-0 transition-transform duration-200 " +
            (open ? "rotate-180" : "")
          }
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={
          "grid transition-[grid-template-rows] duration-200 " +
          (open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
        }
      >
        <div className="overflow-hidden">
          <div
            className={
              "text-namsaek-600 dark:text-hanji-400 " + contentPadding[size]
            }
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  size = "md",
  className = "",
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = useCallback(
    (id: string) => {
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!multiple) next.clear();
          next.add(id);
        }
        return next;
      });
    },
    [multiple],
  );

  return (
    <div
      className={
        "rounded-2xl border border-hanji-300 bg-white dark:border-namsaek-700 dark:bg-namsaek-900" +
        (className ? " " + className : "")
      }
    >
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          open={openIds.has(item.id)}
          onToggle={() => toggle(item.id)}
          size={size}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
