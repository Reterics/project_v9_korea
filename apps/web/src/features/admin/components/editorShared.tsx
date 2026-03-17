import type { ReactNode } from "react";

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
