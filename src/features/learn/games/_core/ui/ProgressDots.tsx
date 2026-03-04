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
              ? "bg-zinc-900 dark:bg-zinc-100"
              : i < current
                ? "bg-zinc-400 dark:bg-zinc-600"
                : "bg-zinc-200 dark:bg-zinc-800")
          }
        />
      ))}
      <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
        {current + 1}/{total}
      </span>
    </div>
  );
}
