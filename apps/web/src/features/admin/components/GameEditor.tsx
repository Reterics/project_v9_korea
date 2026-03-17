import { useState } from "react";
import type { DbGameConfig } from "../adminContentApi";
import { Field } from "./editorShared";
import { inp, btnPrimary } from "./editorStyles";

type Props = {
  config: DbGameConfig;
  onSave: (updated: DbGameConfig) => void;
};

const GAME_LABELS: Record<string, string> = {
  flashcards: "Flashcards",
  sentence_builder: "Sentence Builder",
  particles: "Particles",
};

export function GameEditor({ config, onSave }: Props) {
  const [draft, setDraft] = useState<DbGameConfig>(config);
  const [saving, setSaving] = useState(false);

  function setField<K extends keyof DbGameConfig>(key: K, value: DbGameConfig[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function setEngine(key: string, value: unknown) {
    setDraft((d) => ({
      ...d,
      engineConfig: { ...(d.engineConfig ?? {}), [key]: value },
    }));
  }

  function engineVal(key: string): unknown {
    return draft.engineConfig?.[key];
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(draft);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-namsaek-900 dark:text-hanji-100">
        {GAME_LABELS[draft.gameId] ?? draft.gameId}
      </h3>

      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-hanji-500 dark:text-hanji-400">General</p>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Total Questions">
            <input
              type="number"
              min={1}
              max={50}
              value={draft.totalQuestions}
              onChange={(e) => setField("totalQuestions", +e.target.value)}
              className={inp}
            />
          </Field>

          <Field label="Time Limit (sec, blank = none)">
            <input
              type="number"
              min={0}
              value={draft.timeLimitSec ?? ""}
              onChange={(e) =>
                setField("timeLimitSec", e.target.value === "" ? null : +e.target.value)
              }
              className={inp}
              placeholder="none"
            />
          </Field>

          <Field label="Difficulty">
            <select
              value={draft.difficulty}
              onChange={(e) => setField("difficulty", e.target.value as DbGameConfig["difficulty"])}
              className={inp}
            >
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
            </select>
          </Field>
        </div>
      </section>

      {draft.gameId === "flashcards" && (
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-hanji-500 dark:text-hanji-400">
            Engine Settings
          </p>
          <label className={checkRow}>
            <input
              type="checkbox"
              checked={!!engineVal("showRomanization")}
              onChange={(e) => setEngine("showRomanization", e.target.checked)}
              className="rounded"
            />
            Show romanization
          </label>
          <Field label="Auto-advance (ms, 0 = off)">
            <input
              type="number"
              min={0}
              value={(engineVal("autoAdvanceMs") as number) ?? 0}
              onChange={(e) => setEngine("autoAdvanceMs", +e.target.value)}
              className={inp}
            />
          </Field>
        </section>
      )}

      {draft.gameId === "sentence_builder" && (
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-hanji-500 dark:text-hanji-400">
            Engine Settings
          </p>
          <label className={checkRow}>
            <input
              type="checkbox"
              checked={!!engineVal("showHint")}
              onChange={(e) => setEngine("showHint", e.target.checked)}
              className="rounded"
            />
            Show hint
          </label>
          <label className={checkRow}>
            <input
              type="checkbox"
              checked={!!engineVal("showTranslationHint")}
              onChange={(e) => setEngine("showTranslationHint", e.target.checked)}
              className="rounded"
            />
            Show translation hint
          </label>
        </section>
      )}

      {draft.gameId === "particles" && (
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-hanji-500 dark:text-hanji-400">
            Engine Settings
          </p>
          <Field label="Number of choices">
            <select
              value={(engineVal("numChoices") as number) ?? 4}
              onChange={(e) => setEngine("numChoices", +e.target.value)}
              className={inp}
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </Field>
          <label className={checkRow}>
            <input
              type="checkbox"
              checked={!!engineVal("showBatchimRule")}
              onChange={(e) => setEngine("showBatchimRule", e.target.checked)}
              className="rounded"
            />
            Show batchim rule
          </label>
          <label className={checkRow}>
            <input
              type="checkbox"
              checked={!!engineVal("showExplanation")}
              onChange={(e) => setEngine("showExplanation", e.target.checked)}
              className="rounded"
            />
            Show explanation
          </label>
        </section>
      )}

      <button onClick={handleSave} disabled={saving} className={btnPrimary}>
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

const checkRow = "flex cursor-pointer items-center gap-2 text-sm text-namsaek-800 dark:text-hanji-200";
