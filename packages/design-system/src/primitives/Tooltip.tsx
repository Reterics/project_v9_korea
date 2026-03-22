import { useId } from "react";
import type { ReactNode, ReactElement } from "react";

type TooltipPlacement = "top" | "bottom" | "left" | "right";
type TooltipSize = "sm" | "md" | "lg";

type TooltipProps = {
  /** The text or content to display in the tooltip */
  content: ReactNode;
  /** The element that triggers the tooltip */
  children: ReactElement;
  /** Tooltip placement relative to the trigger */
  placement?: TooltipPlacement;
  /** Tooltip size — controls padding and font size */
  size?: TooltipSize;
  className?: string;
};

const placementClasses: Record<TooltipPlacement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const sizeClasses: Record<TooltipSize, string> = {
  sm: "px-2 py-1 text-xs",
  md: "px-2.5 py-1.5 text-xs",
  lg: "px-3 py-2 text-sm",
};

const arrowClasses: Record<TooltipPlacement, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-namsaek-800 border-x-transparent border-b-transparent dark:border-t-hanji-200 dark:border-x-transparent dark:border-b-transparent",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-namsaek-800 border-x-transparent border-t-transparent dark:border-b-hanji-200 dark:border-x-transparent dark:border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-namsaek-800 border-y-transparent border-r-transparent dark:border-l-hanji-200 dark:border-y-transparent dark:border-r-transparent",
  right: "right-full top-1/2 -translate-y-1/2 border-r-namsaek-800 border-y-transparent border-l-transparent dark:border-r-hanji-200 dark:border-y-transparent dark:border-l-transparent",
};

export function Tooltip({
  content,
  children,
  placement = "top",
  size = "md",
  className = "",
}: TooltipProps) {
  const id = useId();

  return (
    <span className="group/tooltip relative inline-flex">
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-namsaek-800 font-medium text-hanji-50 opacity-0 shadow-md transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 dark:bg-hanji-200 dark:text-namsaek-900 " +
          sizeClasses[size] +
          " " +
          placementClasses[placement] +
          (className ? " " + className : "")
        }
      >
        {content}
        <span
          className={
            "absolute border-4 " + arrowClasses[placement]
          }
          aria-hidden="true"
        />
      </span>
    </span>
  );
}