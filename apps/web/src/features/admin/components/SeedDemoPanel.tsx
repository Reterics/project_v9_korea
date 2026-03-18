import { useState, useEffect } from "react";
import { Database, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/features/learn/data/apiClient";
import a1Words from "@/features/learn/content/data/a1-words.json";
import a1PlusWords from "@/features/learn/content/data/a1plus-words.json";
import a2Words from "@/features/learn/content/data/a2-words.json";
import a1Sentences from "@/features/learn/content/data/a1-sentences.json";
import a1Lessons from "@/features/learn/content/data/a1-grammar-lessons.json";

const ALL_WORDS = [...a1Words, ...a1PlusWords, ...a2Words];
const ALL_SENTENCES = a1Sentences;
const ALL_LESSONS = a1Lessons;

type SeedResult = { seeded: { words: number; sentences: number; lessons: number } };

export function SeedDemoPanel() {
  const [open, setOpen] = useState(false);
  const [includeWords, setIncludeWords] = useState(true);
  const [includeSentences, setIncludeSentences] = useState(true);
  const [includeLessons, setIncludeLessons] = useState(true);
  const [mode, setMode] = useState<"skip" | "overwrite">("skip");
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [dbEmpty, setDbEmpty] = useState<boolean | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<unknown[]>("/api/v1/content/words").catch(() => []),
      api.get<unknown[]>("/api/v1/lessons").catch(() => []),
    ]).then(([words, lessons]) => {
      setDbEmpty(words.length === 0 && lessons.length === 0);
    });
  }, []);

  async function handleSeed() {
    setSeeding(true);
    setResult("");
    setError("");
    try {
      const payload: Record<string, unknown> = { mode };
      if (includeWords) payload.words = ALL_WORDS;
      if (includeSentences) payload.sentences = ALL_SENTENCES;
      if (includeLessons) payload.lessons = ALL_LESSONS;

      const res = await api.post<SeedResult>("/api/v1/admin/seed-demo", payload);
      const { seeded } = res;
      const total = seeded.words + seeded.sentences + seeded.lessons;
      setResult(
        `Done — ${seeded.words} word${seeded.words !== 1 ? "s" : ""}, ` +
        `${seeded.sentences} sentence${seeded.sentences !== 1 ? "s" : ""}, ` +
        `${seeded.lessons} lesson${seeded.lessons !== 1 ? "s" : ""} seeded.`,
      );
      if (total > 0) setDbEmpty(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Seed failed");
    } finally {
      setSeeding(false);
    }
  }

  const noneSelected = !includeWords && !includeSentences && !includeLessons;

  if (dbEmpty === null || dbEmpty === false) return null;

  return (
    <div className="rounded-2xl border border-geum-300 bg-geum-50 dark:border-geum-700 dark:bg-namsaek-900/40">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-geum-600 dark:text-geum-400" />
          <span className="font-semibold text-geum-900 dark:text-geum-100">Seed Demo Data</span>
          <span className="rounded-full bg-geum-200 px-2 py-0.5 text-xs text-geum-700 dark:bg-geum-800 dark:text-geum-200">
            {ALL_WORDS.length} words · {ALL_SENTENCES.length} sentences · {ALL_LESSONS.length} lessons
          </span>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 text-geum-500" />
          : <ChevronDown className="h-4 w-4 text-geum-500" />}
      </button>

      {open && (
        <div className="space-y-4 border-t border-geum-200 px-5 py-4 dark:border-geum-700">
          <p className="text-sm text-geum-700 dark:text-geum-300">
            Populate the database from the bundled JSON demo content. Use <strong>Skip existing</strong> on first
            run; <strong>Overwrite</strong> to reset to defaults.
          </p>

          {/* Include checkboxes */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-geum-600 dark:text-geum-400">
              Include
            </p>
            {[
              {
                label: `Words (${ALL_WORDS.length} — A1, A1+, A2)`,
                checked: includeWords,
                toggle: () => setIncludeWords((v) => !v),
              },
              {
                label: `Sentences (${ALL_SENTENCES.length} — A1)`,
                checked: includeSentences,
                toggle: () => setIncludeSentences((v) => !v),
              },
              {
                label: `Grammar Lessons (${ALL_LESSONS.length} — A1)`,
                checked: includeLessons,
                toggle: () => setIncludeLessons((v) => !v),
              },
            ].map(({ label, checked, toggle }) => (
              <label
                key={label}
                className="flex cursor-pointer items-center gap-2 text-sm text-namsaek-800 dark:text-hanji-200"
              >
                <input type="checkbox" checked={checked} onChange={toggle} className="rounded" />
                {label}
              </label>
            ))}
          </div>

          {/* Mode */}
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-geum-600 dark:text-geum-400">
              Mode
            </p>
            <div className="flex gap-3">
              {(["skip", "overwrite"] as const).map((m) => (
                <label key={m} className="flex cursor-pointer items-center gap-2 text-sm text-namsaek-800 dark:text-hanji-200">
                  <input
                    type="radio"
                    name="seed-mode"
                    value={m}
                    checked={mode === m}
                    onChange={() => setMode(m)}
                  />
                  {m === "skip" ? "Skip existing (safe)" : "Overwrite all (replaces existing)"}
                </label>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {result && (
            <p className="rounded-xl bg-cheongja-50 px-4 py-2 text-sm text-cheongja-700 dark:bg-cheongja-900/30 dark:text-cheongja-300">
              {result}
            </p>
          )}
          {error && (
            <p className="rounded-xl bg-dancheong-50 px-4 py-2 text-sm text-dancheong-700 dark:bg-dancheong-900/30 dark:text-dancheong-300">
              {error}
            </p>
          )}

          <button
            onClick={handleSeed}
            disabled={seeding || noneSelected}
            className="rounded-xl bg-geum-500 px-5 py-2 text-sm font-semibold text-white hover:bg-geum-600 disabled:opacity-50 dark:bg-geum-600 dark:hover:bg-geum-500"
          >
            {seeding ? "Seeding…" : "Seed Now"}
          </button>
        </div>
      )}
    </div>
  );
}
