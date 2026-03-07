import type { ReactNode } from "react";

type GameLayoutProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

export function GameLayout({ header, footer, children }: GameLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-hanji-100 text-namsaek-900 dark:bg-namsaek-950 dark:text-hanji-200">
      <div className="shrink-0">{header}</div>
      <main className="flex flex-1 items-start justify-center overflow-hidden p-2 sm:p-4">
        {children}
      </main>
      <div className="shrink-0">{footer}</div>
    </div>
  );
}