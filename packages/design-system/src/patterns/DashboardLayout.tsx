import type { ReactNode } from "react";

type DashboardLayoutProps = {
  main: ReactNode;
  sidebar: ReactNode;
  className?: string;
};

export function DashboardLayout({ main, sidebar, className = "" }: DashboardLayoutProps) {
  return (
    <div className={"grid gap-6 md:grid-cols-[1.2fr_0.8fr] " + className}>
      <div className="space-y-6">{main}</div>
      <div className="space-y-6">{sidebar}</div>
    </div>
  );
}