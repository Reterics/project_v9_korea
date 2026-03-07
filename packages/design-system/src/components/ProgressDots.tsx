type ProgressDotsProps = {
  current: number;
  total: number;
};

export function ProgressDots({ current, total }: ProgressDotsProps) {
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Progress ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={
            "h-2.5 w-2.5 rounded-full transition " +
            (i === current
              ? "bg-namsaek-500 dark:bg-cheongja-400"
              : i < current
                ? "bg-cheongja-400 dark:bg-cheongja-600"
                : "bg-hanji-200 dark:bg-namsaek-700")
          }
        />
      ))}
      <span className="ml-2 text-xs text-hanji-500 dark:text-hanji-400">
        {current + 1}/{total}
      </span>
    </div>
  );
}