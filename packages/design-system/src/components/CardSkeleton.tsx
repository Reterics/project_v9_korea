import { Skeleton } from "../primitives/Skeleton.tsx";

type CardSkeletonProps = {
  lines?: number;
  className?: string;
};

export function CardSkeleton({ lines = 3, className = "" }: CardSkeletonProps) {
  return (
    <div
      className={
        "rounded-2xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900" +
        (className ? " " + className : "")
      }
    >
      <Skeleton className="mb-3 h-3 w-2/3" />
      {Array.from({ length: lines - 1 }, (_, i) => (
        <Skeleton
          key={i}
          className={"mt-2 h-2 " + (i % 2 === 0 ? "w-full" : "w-4/5")}
        />
      ))}
    </div>
  );
}
