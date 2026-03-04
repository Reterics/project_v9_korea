import { CheckCircle, XCircle, Sparkles, Timer } from "lucide-react";
import type { GameResult } from "./gameTypes";

type GameResultsProps = {
  title: string;
  result: GameResult;
  onDone: () => void;
};

export function GameResults({ title, result, onDone }: GameResultsProps) {
  const total = result.correct + result.wrong;
  const accuracy = total > 0 ? Math.round((result.correct / total) * 100) : 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-hanji-100 p-4 text-namsaek-900 dark:bg-namsaek-950 dark:text-hanji-200">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        {/* Summary card */}
        <div className="rounded-3xl border border-hanji-300 bg-white p-6 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-hanji-500 dark:text-hanji-400">
                Session complete
              </div>
              <div className="mt-1 text-2xl font-semibold">Nice work.</div>
              <div className="mt-1 text-sm text-namsaek-600 dark:text-hanji-300">
                {title} — {total} questions answered.
              </div>
            </div>
            <button
              onClick={onDone}
              className="rounded-2xl bg-namsaek-500 px-4 py-3 text-sm font-semibold text-hanji-50 shadow-sm transition hover:bg-namsaek-600"
            >
              Back to hub
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            <StatChip
              icon={<CheckCircle className="h-4 w-4 text-cheongja-500" />}
              label="Correct"
              value={String(result.correct)}
            />
            <StatChip
              icon={<XCircle className="h-4 w-4 text-dancheong-500" />}
              label="Wrong"
              value={String(result.wrong)}
            />
            <StatChip
              icon={<Sparkles className="h-4 w-4 text-geum-500" />}
              label="Accuracy"
              value={`${accuracy}%`}
            />
            <StatChip
              icon={<Timer className="h-4 w-4 text-namsaek-400" />}
              label="Best streak"
              value={String(result.streakMax)}
            />
          </div>
        </div>

        {/* Mistakes list */}
        {result.itemOutcomes.some((o) => o.grade === "fail") && (
          <div className="rounded-3xl border border-hanji-300 bg-white p-6 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
            <div className="text-sm font-semibold">Mistakes to review</div>
            <div className="mt-1 text-xs text-hanji-500 dark:text-hanji-400">
              Focus on these next session.
            </div>
            <div className="mt-4 grid gap-3">
              {result.itemOutcomes
                .filter((o) => o.grade === "fail")
                .map((o, i) => (
                  <div
                    key={`${o.ref.kind}-${o.ref.id}-${i}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-dancheong-100 bg-dancheong-50 px-4 py-3 dark:border-dancheong-800/30 dark:bg-dancheong-900/20"
                  >
                    <div className="text-sm font-semibold">{o.ref.id}</div>
                    <div className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-dancheong-600 shadow-sm dark:bg-namsaek-800 dark:text-dancheong-300">
                      Review
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-hanji-200 bg-hanji-50 px-3 py-3 dark:border-namsaek-700 dark:bg-namsaek-950/40">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-namsaek-800">
        {icon}
      </div>
      <div className="leading-tight">
        <div className="text-xs text-hanji-500 dark:text-hanji-400">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}
