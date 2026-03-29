import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORY_LABELS, CATEGORY_ORDER, hangeulEntries, speakKorean, type HangeulEntry } from "./hangeulData";
import { Button, Card } from "@reterics/birdie-ui";

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
      <Card className="p-4">
        <h1 className="text-xl font-semibold">Hangeul Dictionary</h1>
        <p className="mt-1 text-sm text-namsaek-600 dark:text-hanji-300">
          Browse Korean letters and pronunciation, then launch the dedicated game to practice recognition.
        </p>
        <Button size="sm" className="mt-3 rounded-2xl" onClick={() => navigate("/hangeul-practice/game")}>
          Open Practice Game
        </Button>
      </Card>

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
    <Card className="p-4">
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
    </Card>
  );
}

