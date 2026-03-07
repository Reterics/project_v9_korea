import type { ReactNode } from "react";

type ActivityGridProps = {
  children: ReactNode;
  className?: string;
};

export function ActivityGrid({ children, className = "" }: ActivityGridProps) {
  return (
    <div className={"grid gap-4 sm:grid-cols-2 " + className}>
      {children}
    </div>
  );
}