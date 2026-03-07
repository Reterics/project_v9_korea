type MasteryTile = {
  id: string;
  score: number;
};

type ProgressCardProps = {
  title?: string;
  tiles: MasteryTile[];
  className?: string;
};

export function ProgressCard({ title = "Vocabulary", tiles, className = "" }: ProgressCardProps) {
  const learned = tiles.filter((t) => t.score > 0).length;
  const mastered = tiles.filter((t) => t.score >= 0.8).length;

  return (
    <div
      className={
        "rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900 " +
        className
      }
    >
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm font-bold text-namsaek-700 dark:text-hanji-100">
          {learned}
          <span className="text-xs font-normal text-hanji-400 dark:text-hanji-500">
            {" "}
            / {tiles.length}
          </span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {tiles.map((t) => (
          <div
            key={t.id}
            className={
              "h-2.5 w-2.5 rounded-sm " +
              (t.score >= 0.8
                ? "bg-cheongja-500 dark:bg-cheongja-400"
                : t.score >= 0.4
                  ? "bg-cheongja-300 dark:bg-cheongja-600"
                  : t.score > 0
                    ? "bg-cheongja-100 dark:bg-cheongja-800"
                    : "bg-hanji-200 dark:bg-namsaek-700")
            }
          />
        ))}
      </div>
      <div className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">{mastered} mastered</div>
    </div>
  );
}