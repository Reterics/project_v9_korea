import { useState } from "react";
import type { Word, WordCategory, WordLevel, ContentLevel } from "@/features/learn/content/wordTypes";

const CATEGORIES: WordCategory[] = [
  "greetings", "numbers", "food", "verbs", "family", "places", "adjectives",
  "time", "travel", "daily", "nature", "body", "emotions", "shopping",
  "weather", "clothing", "work",
];

const LEVELS: ContentLevel[] = ["A1", "A1+", "A2", "A2+", "B1"];

type Props = {
  word: Word | null;
  isNew: boolean;
  onSave: (w: Word) => void;
  onCancel: () => void;
};

const EMPTY: Word = {
  id: "", korean: "", romanization: "", english: "",
  category: "daily", level: "A1", example: "",
};

export function WordEditor({ word, isNew, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<Word>(word ?? EMPTY);
  const [error, setError] = useState("");

  function set<K extends keyof Word>(key: K, value: Word[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleSave() {
    if (!draft.id.trim() || !draft.korean.trim() || !draft.english.trim()) {
      setError("id, korean and english are required");
      return;
    }
    setError("");
    onSave(draft);
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-namsaek-900 dark:text-hanji-100">
        {isNew ? "New Word" : "Edit Word"}
      </h3>

      {error && (
        <p className="text-sm text-dancheong-600 dark:text-dancheong-400">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label="ID">
          <input
            value={draft.id}
            onChange={(e) => set("id", e.target.value)}
            disabled={!isNew}
            className={input}
            placeholder="e.g. word-hello"
          />
        </Field>

        <Field label="Level">
          <select value={draft.level} onChange={(e) => set("level", e.target.value as WordLevel)} className={input}>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>

        <Field label="Korean">
          <input value={draft.korean} onChange={(e) => set("korean", e.target.value)} className={input} />
        </Field>

        <Field label="Romanization">
          <input value={draft.romanization} onChange={(e) => set("romanization", e.target.value)} className={input} />
        </Field>

        <Field label="English">
          <input value={draft.english} onChange={(e) => set("english", e.target.value)} className={input} />
        </Field>

        <Field label="Category">
          <select value={draft.category} onChange={(e) => set("category", e.target.value as WordCategory)} className={input}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Example (optional)">
        <textarea
          value={draft.example ?? ""}
          onChange={(e) => set("example", e.target.value)}
          rows={2}
          className={input}
        />
      </Field>

      <div className="flex gap-2 pt-2">
        <button onClick={handleSave} className={btnPrimary}>Save</button>
        <button onClick={onCancel} className={btnGhost}>Cancel</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-hanji-600 dark:text-hanji-400">{label}</label>
      {children}
    </div>
  );
}

const input =
  "w-full rounded-lg border border-hanji-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-namsaek-400 focus:ring-1 focus:ring-namsaek-400 dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-200";

const btnPrimary =
  "rounded-xl bg-namsaek-600 px-4 py-2 text-sm font-semibold text-white hover:bg-namsaek-700 dark:bg-namsaek-500 dark:hover:bg-namsaek-400";

const btnGhost =
  "rounded-xl border border-hanji-300 px-4 py-2 text-sm font-semibold text-hanji-700 hover:bg-hanji-50 dark:border-namsaek-700 dark:text-hanji-300 dark:hover:bg-namsaek-800";
