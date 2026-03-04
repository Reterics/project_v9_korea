import type { ReactNode } from "react";

type GameLayoutProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

export function GameLayout({ header, footer, children }: GameLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="shrink-0">{header}</div>
      <main className="flex flex-1 items-center justify-center p-4">
        {children}
      </main>
      <div className="shrink-0">{footer}</div>
    </div>
  );
}
