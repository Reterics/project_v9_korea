import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { listWords } from "./content/contentRepo";
import type { WordLevel } from "./content/wordTypes";
import { BrandLogo } from "@birdie/ui";
import { loadMastery } from "./profile/masteryRepo";

const TABS: { level: WordLevel; label: string }[] = [
  { level: "A1", label: "A1" },
  { level: "A1+", label: "A1+" },
  { level: "A2", label: "A2" },
];

const CATEGORY_COLORS: Record<string, string> = {
  greetings: "bg-namsaek-100 text-namsaek-700 dark:bg-namsaek-800 dark:text-namsaek-200",
  numbers: "bg-geum-100 text-geum-700 dark:bg-geum-900/40 dark:text-geum-300",
  food: "bg-dancheong-50 text-dancheong-600 dark:bg-dancheong-900/40 dark:text-dancheong-300",
  verbs: "bg-cheongja-100 text-cheongja-700 dark:bg-cheongja-900/40 dark:text-cheongja-300",
  family: "bg-namsaek-50 text-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-300",
  places: "bg-hanji-200 text-hanji-600 dark:bg-namsaek-800 dark:text-hanji-300",
  adjectives: "bg-cheongja-50 text-cheongja-600 dark:bg-cheongja-900/30 dark:text-cheongja-300",
  time: "bg-geum-50 text-geum-600 dark:bg-geum-900/30 dark:text-geum-300",
  travel: "bg-namsaek-100 text-namsaek-600 dark:bg-namsaek-800 dark:text-namsaek-300",
  daily: "bg-hanji-100 text-hanji-600 dark:bg-namsaek-800 dark:text-hanji-400",
  nature: "bg-cheongja-100 text-cheongja-600 dark:bg-cheongja-900/30 dark:text-cheongja-300",
  body: "bg-dancheong-50 text-dancheong-500 dark:bg-dancheong-900/30 dark:text-dancheong-300",
  emotions: "bg-dancheong-100 text-dancheong-600 dark:bg-dancheong-900/40 dark:text-dancheong-300",
  shopping: "bg-geum-100 text-geum-600 dark:bg-geum-900/30 dark:text-geum-300",
  weather: "bg-namsaek-50 text-namsaek-500 dark:bg-namsaek-800 dark:text-namsaek-300",
  clothing: "bg-hanji-200 text-hanji-500 dark:bg-namsaek-800 dark:text-hanji-400",
  work: "bg-namsaek-100 text-namsaek-700 dark:bg-namsaek-800 dark:text-namsaek-200",
};

export function DictionaryPage() {
  const [activeTab, setActiveTab] = useState<WordLevel>("A1");
  const [search, setSearch] = useState("");

  const words = useMemo(() => listWords(activeTab), [activeTab]);
  const mastery = useMemo(() => loadMastery(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return words;
    const q = search.toLowerCase();
    return words.filter(
      (w) =>
        w.korean.includes(q) ||
        w.romanization.toLowerCase().includes(q) ||
        w.english.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q),
    );
  }, [words, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Dictionary</h1>
        <p className="mt-1 text-sm text-hanji-500 dark:text-hanji-400">
          Browse all vocabulary across levels
        </p>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.level}
              onClick={() => setActiveTab(tab.level)}
              className={
                "rounded-xl px-4 py-2 text-sm font-medium transition " +
                (activeTab === tab.level
                  ? "bg-namsaek-500 text-hanji-50"
                  : "bg-hanji-200 text-namsaek-600 hover:bg-hanji-300 dark:bg-namsaek-800 dark:text-hanji-300 dark:hover:bg-namsaek-700")
              }
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-70">
                ({listWords(tab.level).length})
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hanji-400" />
          <input
            type="text"
            placeholder="Search words..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-hanji-300 bg-white py-2 pl-9 pr-3 text-sm shadow-sm outline-none focus:border-namsaek-400 focus:ring-1 focus:ring-namsaek-400 dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-200 dark:focus:border-namsaek-500 sm:w-64"
          />
        </div>
      </div>

      {/* Word list */}
      <div className="rounded-3xl border border-hanji-300 bg-white shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <BrandLogo variant="icon" size={36} />
            <div className="text-sm text-hanji-500 dark:text-hanji-400">
              No words found matching <span className="font-medium">"{search}"</span>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-hanji-200 dark:divide-namsaek-700">
            {filtered.map((word) => {
              const score = mastery[word.id]?.score ?? 0;
              const masteryLabel =
                score >= 0.8 ? "Mastered" : score >= 0.4 ? "Learning" : score > 0 ? "Seen" : "New";
              const masteryColor =
                score >= 0.8
                  ? "bg-cheongja-500 text-white dark:bg-cheongja-400"
                  : score >= 0.4
                    ? "bg-cheongja-200 text-cheongja-700 dark:bg-cheongja-700 dark:text-cheongja-200"
                    : score > 0
                      ? "bg-cheongja-100 text-cheongja-600 dark:bg-cheongja-800 dark:text-cheongja-300"
                      : "bg-hanji-100 text-hanji-500 dark:bg-namsaek-800 dark:text-hanji-500";
              return (
                <div
                  key={word.id}
                  className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="min-w-[120px]">
                    <div className="text-lg font-semibold">{word.korean}</div>
                    <div className="text-xs text-hanji-500 dark:text-hanji-400">
                      {word.romanization}
                    </div>
                  </div>
                  <div className="flex-1 text-sm text-namsaek-700 dark:text-hanji-300">
                    {word.english}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "rounded-lg px-2 py-1 text-xs font-medium " +
                        (CATEGORY_COLORS[word.category] ?? "bg-hanji-100 text-hanji-600 dark:bg-namsaek-800 dark:text-hanji-400")
                      }
                    >
                      {word.category}
                    </span>
                    <span className={`rounded-lg px-2 py-1 text-xs font-medium ${masteryColor}`}>
                      {masteryLabel}
                    </span>
                  </div>
                  {word.example && (
                    <div className="mt-1 text-xs text-hanji-500 italic dark:text-hanji-400 sm:mt-0 sm:min-w-[180px] sm:text-right">
                      {word.example}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="text-center text-xs text-hanji-500 dark:text-hanji-400">
        Showing {filtered.length} of {words.length} words
      </div>
    </div>
  );
}
