import type { ReactNode } from "react";

type LessonListProps = {
  children: ReactNode;
  className?: string;
};

export function LessonList({ children, className = "" }: LessonListProps) {
  return (
    <div className={"space-y-4 " + className}>
      {children}
    </div>
  );
}