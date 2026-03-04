import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORY_LABELS, CATEGORY_ORDER, hangeulEntries, speakKorean, type HangeulEntry } from "./hangeulData";

export function HangeulPracticePage() {
  const navigate = useNavigate();

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        category: cat,
        label: CATEGORY_LABELS[cat],
        entries: hangeulEntries.filter((entry) => entry.category === cat),
      })),
    []
  );

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-3xl border border-hanji-300 bg-white p-4 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
        <h1 className="text-xl font-semibold">Hangeul Dictionary</h1>
        <p className="mt-1 text-sm text-namsaek-600 dark:text-hanji-300">
          Browse Korean letters and pronunciation, then launch the dedicated game to practice recognition.
        </p>
        <button
          onClick={() => navigate("/hangeul-practice/game")}
          className="mt-3 rounded-2xl bg-namsaek-500 px-4 py-2 text-sm font-semibold text-hanji-50 transition hover:bg-namsaek-600"
        >
          Open Practice Game
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {grouped.map((group) => (
          <LetterCard key={group.category} title={group.label} entries={group.entries} />
        ))}
      </section>
    </div>
  );
}

function LetterCard({ title, entries }: { title: string; entries: HangeulEntry[] }) {
  return (
    <div className="rounded-3xl border border-hanji-300 bg-white p-4 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {entries.map((entry) => (
          <button
            key={entry.char}
            type="button"
            onClick={() => speakKorean(entry.char)}
            className="flex min-w-[3.5rem] cursor-pointer flex-col items-center rounded-2xl border border-hanji-300 bg-hanji-50 px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:border-namsaek-300 hover:shadow-md active:translate-y-0 dark:border-namsaek-700 dark:bg-namsaek-950/40 dark:hover:border-namsaek-600"
          >
            <div className="text-xl font-semibold leading-tight">{entry.char}</div>
            <div className="text-[10px] text-namsaek-600 dark:text-hanji-300">{entry.romanization}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

