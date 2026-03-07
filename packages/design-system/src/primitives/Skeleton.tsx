type SkeletonProps = {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
};

const roundedMap = {
  sm: "rounded",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

export function Skeleton({ className = "", rounded = "md" }: SkeletonProps) {
  return (
    <div
      className={
        "animate-pulse bg-hanji-200 dark:bg-namsaek-800 " +
        roundedMap[rounded] +
        (className ? " " + className : "")
      }
    />
  );
}
