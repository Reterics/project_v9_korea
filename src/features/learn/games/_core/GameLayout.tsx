import type { ReactNode } from "react";

type GameLayoutProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

export function GameLayout({ header, footer, children }: GameLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="shrink-0">{header}</div>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
      <div className="shrink-0">{footer}</div>
    </div>
  );
}
