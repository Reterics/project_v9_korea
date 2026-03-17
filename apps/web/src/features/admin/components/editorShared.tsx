import type { ReactNode } from "react";
import type { ContentLevel } from "@/features/learn/content/wordTypes";

// ── Shared level options ────────────────────────────────────────────────────

export const LEVELS: ContentLevel[] = ["A1", "A1+", "A2", "A2+", "B1"];

// ── Shared className constants ──────────────────────────────────────────────

export const inp =
  "w-full rounded-lg border border-hanji-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-namsaek-400 focus:ring-1 focus:ring-namsaek-400 dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-200";

/** Primary button — no icon, used in editor save/action rows */
export const btnPrimary =
  "rounded-xl bg-namsaek-600 px-4 py-2 text-sm font-semibold text-white hover:bg-namsaek-700 dark:bg-namsaek-500 dark:hover:bg-namsaek-400";

/** Primary button with icon gap — used in list toolbars (New Word, + Add, etc.) */
export const btnPrimaryIcon =
  "flex items-center gap-1.5 rounded-xl bg-namsaek-600 px-4 py-2 text-sm font-semibold text-white hover:bg-namsaek-700 dark:bg-namsaek-500 dark:hover:bg-namsaek-400";

export const btnGhost =
  "rounded-xl border border-hanji-300 px-4 py-2 text-sm font-semibold text-hanji-700 hover:bg-hanji-50 dark:border-namsaek-700 dark:text-hanji-300 dark:hover:bg-namsaek-800";

export const addBtn =
  "flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-namsaek-600 hover:bg-namsaek-50 dark:text-namsaek-400 dark:hover:bg-namsaek-900";

// ── Shared components ───────────────────────────────────────────────────────

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-hanji-600 dark:text-hanji-400">
        {label}
      </label>
      {children}
    </div>
  );
}

export function EditorError({ message }: { message: string }) {
  if (!message) return null;
  return <p className="text-sm text-dancheong-600 dark:text-dancheong-400">{message}</p>;
}
