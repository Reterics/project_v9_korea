import { useState } from "react";
import type { Word, WordCategory, WordLevel } from "@/features/learn/content/wordTypes";
import { Field, EditorError } from "./editorShared";
import { LEVELS, inp, btnPrimary, btnGhost } from "./editorStyles";

const CATEGORIES: WordCategory[] = [
  "greetings", "numbers", "food", "verbs", "family", "places", "adjectives",
  "time", "travel", "daily", "nature", "body", "emotions", "shopping",
  "weather", "clothing", "work",
];

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

      <EditorError message={error} />

      <div className="grid grid-cols-2 gap-3">
        <Field label="ID">
          <input
            value={draft.id}
            onChange={(e) => set("id", e.target.value)}
            disabled={!isNew}
            className={inp}
            placeholder="e.g. word-hello"
          />
        </Field>

        <Field label="Level">
          <select value={draft.level} onChange={(e) => set("level", e.target.value as WordLevel)} className={inp}>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>

        <Field label="Korean">
          <input value={draft.korean} onChange={(e) => set("korean", e.target.value)} className={inp} />
        </Field>

        <Field label="Romanization">
          <input value={draft.romanization} onChange={(e) => set("romanization", e.target.value)} className={inp} />
        </Field>

        <Field label="English">
          <input value={draft.english} onChange={(e) => set("english", e.target.value)} className={inp} />
        </Field>

        <Field label="Category">
          <select value={draft.category} onChange={(e) => set("category", e.target.value as WordCategory)} className={inp}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Example (optional)">
        <textarea
          value={draft.example ?? ""}
          onChange={(e) => set("example", e.target.value)}
          rows={2}
          className={inp}
        />
      </Field>

      <div className="flex gap-2 pt-2">
        <button onClick={handleSave} className={btnPrimary}>Save</button>
        <button onClick={onCancel} className={btnGhost}>Cancel</button>
      </div>
    </div>
  );
}
