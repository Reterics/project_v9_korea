import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Sentence } from "../adminContentApi";
import type { ContentLevel } from "@/features/learn/content/wordTypes";
import { LEVELS, Field, EditorError, inp, btnPrimary, btnGhost } from "./editorShared";

const ROLE_OPTIONS = [
  "subject", "topic", "object", "verb", "adjective",
  "adverb", "particle", "location", "time", "number",
  "conjunction", "exclamation", "other",
];

type Props = {
  sentence: Sentence | null;
  isNew: boolean;
  onSave: (s: Sentence) => void;
  onCancel: () => void;
};

const EMPTY: Sentence = { id: "", tokens: [""], roles: ["subject"], english: "", hint: "", level: "A1" };

export function SentenceEditor({ sentence, isNew, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<Sentence>(sentence ?? EMPTY);
  const [error, setError] = useState("");

  function setField<K extends keyof Sentence>(key: K, value: Sentence[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function setToken(i: number, value: string) {
    const tokens = [...draft.tokens];
    tokens[i] = value;
    setDraft((d) => ({ ...d, tokens }));
  }

  function setRole(i: number, value: string) {
    const roles = [...draft.roles];
    roles[i] = value;
    setDraft((d) => ({ ...d, roles }));
  }

  function addRow() {
    setDraft((d) => ({ ...d, tokens: [...d.tokens, ""], roles: [...d.roles, "subject"] }));
  }

  function removeRow(i: number) {
    setDraft((d) => ({
      ...d,
      tokens: d.tokens.filter((_, idx) => idx !== i),
      roles: d.roles.filter((_, idx) => idx !== i),
    }));
  }

  function handleSave() {
    if (!draft.id.trim() || !draft.english.trim()) {
      setError("id and english are required");
      return;
    }
    if (draft.tokens.length === 0) {
      setError("At least one token is required");
      return;
    }
    if (draft.tokens.some((t) => !t.trim())) {
      setError("All tokens must be non-empty");
      return;
    }
    setError("");
    onSave(draft);
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-namsaek-900 dark:text-hanji-100">
        {isNew ? "New Sentence" : "Edit Sentence"}
      </h3>

      <EditorError message={error} />

      <div className="grid grid-cols-2 gap-3">
        <Field label="ID">
          <input
            value={draft.id}
            onChange={(e) => setField("id", e.target.value)}
            disabled={!isNew}
            className={inp}
            placeholder="e.g. s-001"
          />
        </Field>

        <Field label="Level">
          <select value={draft.level} onChange={(e) => setField("level", e.target.value as ContentLevel)} className={inp}>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>
      </div>

      <Field label="English">
        <input value={draft.english} onChange={(e) => setField("english", e.target.value)} className={inp} />
      </Field>

      <Field label="Hint (optional)">
        <input
          value={draft.hint ?? ""}
          onChange={(e) => setField("hint", e.target.value)}
          className={inp}
          placeholder="Grammar or context hint"
        />
      </Field>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-medium text-hanji-600 dark:text-hanji-400">
            Tokens & Roles
          </label>
          <button
            onClick={addRow}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-namsaek-600 hover:bg-namsaek-50 dark:text-namsaek-400 dark:hover:bg-namsaek-900"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-hanji-200 dark:border-namsaek-700">
          <table className="w-full text-sm">
            <thead className="bg-hanji-50 dark:bg-namsaek-900">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-hanji-600 dark:text-hanji-400">Token</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-hanji-600 dark:text-hanji-400">Role</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-hanji-100 dark:divide-namsaek-800">
              {draft.tokens.map((token, i) => (
                <tr key={i}>
                  <td className="px-3 py-1.5">
                    <input
                      value={token}
                      onChange={(e) => setToken(i, e.target.value)}
                      className="w-full rounded border border-hanji-200 bg-transparent px-2 py-1 text-sm outline-none focus:border-namsaek-400 dark:border-namsaek-700 dark:text-hanji-200"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <select
                      value={draft.roles[i] ?? "other"}
                      onChange={(e) => setRole(i, e.target.value)}
                      className="w-full rounded border border-hanji-200 bg-transparent px-2 py-1 text-sm outline-none focus:border-namsaek-400 dark:border-namsaek-700 dark:text-hanji-200"
                    >
                      {ROLE_OPTIONS.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-2">
                    <button
                      onClick={() => removeRow(i)}
                      disabled={draft.tokens.length === 1}
                      className="rounded p-1 text-hanji-400 hover:text-dancheong-500 disabled:opacity-30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={handleSave} className={btnPrimary}>Save</button>
        <button onClick={onCancel} className={btnGhost}>Cancel</button>
      </div>
    </div>
  );
}

