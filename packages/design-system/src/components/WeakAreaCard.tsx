import type { ReactNode } from "react";
import { Badge } from "../primitives/Badge.tsx";

type WeakAreaRow = {
  label: string;
  action: string;
  hint: string;
};

type WeakAreaCardProps = {
  weakArea: string;
  rows: WeakAreaRow[];
  tip?: ReactNode;
  className?: string;
};

export function WeakAreaCard({ weakArea, rows, tip, className = "" }: WeakAreaCardProps) {
  return (
    <div
      className={
        "rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900 " +
        className
      }
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Weak area</div>
          <div className="text-xs text-hanji-500 dark:text-hanji-400">
            Based on recent mistakes
          </div>
        </div>
        <Badge variant="danger">{weakArea}</Badge>
      </div>

      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 rounded-2xl border border-hanji-200 bg-hanji-50 px-3 py-3 dark:border-namsaek-700 dark:bg-namsaek-950/30"
          >
            <div>
              <div className="text-sm font-semibold">{row.label}</div>
              <div className="mt-0.5 text-xs text-hanji-500 dark:text-hanji-400">{row.hint}</div>
            </div>
            <div className="text-sm font-semibold text-namsaek-500 dark:text-cheongja-400">
              {row.action}
            </div>
          </div>
        ))}
      </div>

      {tip && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-hanji-300 bg-hanji-50 p-3 text-xs text-namsaek-600 dark:border-namsaek-700 dark:bg-namsaek-950/40 dark:text-hanji-300">
          {tip}
        </div>
      )}
    </div>
  );
}