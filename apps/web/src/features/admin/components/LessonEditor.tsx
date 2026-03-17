import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, Check } from "lucide-react";
import type { LessonCategory, LessonLevel } from "@/features/learn/content/lessonTypes";
import type { ContentLevel } from "@/features/learn/content/wordTypes";
import type { AdminLesson, Sentence } from "../adminContentApi";

const CATEGORIES: LessonCategory[] = [
  "sentence-pattern", "particles", "question-form", "negative-form",
];
const LEVELS: ContentLevel[] = ["A1", "A1+", "A2", "A2+", "B1"];
const PRACTICE_MODES = ["sentence_builder", "particles", "flashcards"] as const;
const BLOCK_TYPES = ["text", "tip", "warning"] as const;

type Props = {
  lesson: AdminLesson | null;
  isNew: boolean;
  allLessons: AdminLesson[];
  allSentences: Sentence[];
  onSave: (l: AdminLesson) => void;
  onCancel: () => void;
};

const EMPTY: AdminLesson = {
  id: "", slug: "", title: "", category: "sentence-pattern", level: "A1",
  summary: "", pattern: { englishOrder: [], koreanOrder: [] },
  examples: [], explanationBlocks: [],
  relatedSentenceIds: [], practiceModes: [], nextLessonId: null,
};

// ---- small helpers ----

function TagInput({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function add() {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInput("");
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-hanji-600 dark:text-hanji-400">{label}</label>
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-hanji-300 bg-white p-2 dark:border-namsaek-700 dark:bg-namsaek-900">
        {values.map((v, i) => (
          <span
            key={i}
            className="flex items-center gap-1 rounded-full bg-namsaek-100 px-2 py-0.5 text-xs text-namsaek-800 dark:bg-namsaek-800 dark:text-namsaek-200"
          >
            {v}
            <button
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="text-namsaek-500 hover:text-dancheong-500"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
          }}
          onBlur={add}
          className="min-w-16 flex-1 bg-transparent text-sm outline-none dark:text-hanji-200"
          placeholder="Type and press Enter…"
        />
      </div>
    </div>
  );
}

export function LessonEditor({ lesson, isNew, allLessons, allSentences, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<AdminLesson>(lesson ?? EMPTY);
  const [error, setError] = useState("");
  const [expandedExample, setExpandedExample] = useState<number | null>(null);

  function setField<K extends keyof AdminLesson>(key: K, value: AdminLesson[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  // ---- examples ----
  function addExample() {
    const id = `ex-${Date.now()}`;
    const newEx = { id, english: "", korean: "", englishBreakdown: [], koreanBreakdown: [], notes: [] };
    setDraft((d) => ({ ...d, examples: [...d.examples, newEx] }));
    setExpandedExample(draft.examples.length);
  }

  function updateExample(i: number, key: string, value: unknown) {
    setDraft((d) => {
      const examples = d.examples.map((ex, idx) => idx === i ? { ...ex, [key]: value } : ex);
      return { ...d, examples };
    });
  }

  function removeExample(i: number) {
    setDraft((d) => ({ ...d, examples: d.examples.filter((_, idx) => idx !== i) }));
    setExpandedExample(null);
  }

  // ---- blocks ----
  function addBlock() {
    const id = `blk-${Date.now()}`;
    setDraft((d) => ({ ...d, explanationBlocks: [...d.explanationBlocks, { id, type: "text", title: "", content: "" }] }));
  }

  function updateBlock(i: number, key: string, value: unknown) {
    setDraft((d) => {
      const explanationBlocks = d.explanationBlocks.map((bl, idx) => idx === i ? { ...bl, [key]: value } : bl);
      return { ...d, explanationBlocks };
    });
  }

  function removeBlock(i: number) {
    setDraft((d) => ({ ...d, explanationBlocks: d.explanationBlocks.filter((_, idx) => idx !== i) }));
  }

  function togglePracticeMode(mode: typeof PRACTICE_MODES[number]) {
    setDraft((d) => {
      const has = d.practiceModes.includes(mode);
      return { ...d, practiceModes: has ? d.practiceModes.filter((m) => m !== mode) : [...d.practiceModes, mode] };
    });
  }

  function handleSave() {
    if (!draft.id.trim() || !draft.title.trim() || !draft.slug.trim()) {
      setError("id, slug and title are required");
      return;
    }
    setError("");
    onSave(draft);
  }

  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-namsaek-900 dark:text-hanji-100">
        {isNew ? "New Lesson" : "Edit Lesson"}
      </h3>

      {error && <p className="text-sm text-dancheong-600 dark:text-dancheong-400">{error}</p>}

      {/* Basic */}
      <section className="space-y-3">
        <SectionTitle>Basic Info</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Field label="ID">
            <input value={draft.id} onChange={(e) => setField("id", e.target.value)} disabled={!isNew} className={inp} />
          </Field>
          <Field label="Slug">
            <input value={draft.slug} onChange={(e) => setField("slug", e.target.value)} className={inp} />
          </Field>
          <Field label="Category">
            <select value={draft.category} onChange={(e) => setField("category", e.target.value as LessonCategory)} className={inp}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Level">
            <select value={draft.level} onChange={(e) => setField("level", e.target.value as LessonLevel)} className={inp}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Title">
          <input value={draft.title} onChange={(e) => setField("title", e.target.value)} className={inp} />
        </Field>
        <Field label="Summary">
          <textarea value={draft.summary} onChange={(e) => setField("summary", e.target.value)} rows={2} className={inp} />
        </Field>
      </section>

      {/* Pattern */}
      <section className="space-y-3">
        <SectionTitle>Pattern</SectionTitle>
        <TagInput
          label="English word order"
          values={draft.pattern?.englishOrder ?? []}
          onChange={(v) => setField("pattern", { ...draft.pattern, englishOrder: v, koreanOrder: draft.pattern?.koreanOrder ?? [] })}
        />
        <TagInput
          label="Korean word order"
          values={draft.pattern?.koreanOrder ?? []}
          onChange={(v) => setField("pattern", { ...draft.pattern, koreanOrder: v, englishOrder: draft.pattern?.englishOrder ?? [] })}
        />
      </section>

      {/* Examples */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <SectionTitle>Examples ({draft.examples.length})</SectionTitle>
          <button onClick={addExample} className={addBtn}>
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
        {draft.examples.map((ex, i) => {
          const open = expandedExample === i;
          return (
            <div key={ex.id} className="rounded-xl border border-hanji-200 dark:border-namsaek-700">
              <button
                onClick={() => setExpandedExample(open ? null : i)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-medium text-namsaek-800 dark:text-hanji-200">
                  {ex.english || <span className="italic text-hanji-400">no english yet</span>}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeExample(i); }}
                    className="rounded p-1 text-hanji-400 hover:text-dancheong-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  {open ? <ChevronUp className="h-4 w-4 text-hanji-400" /> : <ChevronDown className="h-4 w-4 text-hanji-400" />}
                </div>
              </button>

              {open && (
                <div className="border-t border-hanji-100 px-4 py-3 space-y-3 dark:border-namsaek-800">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="ID">
                      <input value={ex.id} onChange={(e) => updateExample(i, "id", e.target.value)} className={inp} />
                    </Field>
                  </div>
                  <Field label="English">
                    <input value={ex.english} onChange={(e) => updateExample(i, "english", e.target.value)} className={inp} />
                  </Field>
                  <Field label="Korean">
                    <input value={ex.korean} onChange={(e) => updateExample(i, "korean", e.target.value)} className={inp} />
                  </Field>
                  <Field label="English breakdown (comma-separated)">
                    <input
                      value={(ex.englishBreakdown ?? []).join(", ")}
                      onChange={(e) => updateExample(i, "englishBreakdown", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                      className={inp}
                    />
                  </Field>
                  <Field label="Korean breakdown (comma-separated)">
                    <input
                      value={(ex.koreanBreakdown ?? []).join(", ")}
                      onChange={(e) => updateExample(i, "koreanBreakdown", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                      className={inp}
                    />
                  </Field>
                  <Field label="Notes (comma-separated, optional)">
                    <input
                      value={(ex.notes ?? []).join(", ")}
                      onChange={(e) => updateExample(i, "notes", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                      className={inp}
                      placeholder="optional notes…"
                    />
                  </Field>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Explanation blocks */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <SectionTitle>Explanation Blocks ({draft.explanationBlocks.length})</SectionTitle>
          <button onClick={addBlock} className={addBtn}>
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
        {draft.explanationBlocks.map((bl, i) => (
          <div key={bl.id} className="rounded-xl border border-hanji-200 p-3 space-y-2 dark:border-namsaek-700">
            <div className="flex items-center gap-2">
              <select
                value={bl.type}
                onChange={(e) => updateBlock(i, "type", e.target.value)}
                className="rounded-lg border border-hanji-300 bg-white px-2 py-1 text-xs dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-200"
              >
                {BLOCK_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <input
                value={bl.title ?? ""}
                onChange={(e) => updateBlock(i, "title", e.target.value)}
                placeholder="Title (optional)"
                className="flex-1 rounded-lg border border-hanji-300 bg-white px-2 py-1 text-xs outline-none focus:border-namsaek-400 dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-200"
              />
              <button onClick={() => removeBlock(i)} className="rounded p-1 text-hanji-400 hover:text-dancheong-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <textarea
              value={bl.content}
              onChange={(e) => updateBlock(i, "content", e.target.value)}
              rows={2}
              className={inp}
              placeholder="Block content…"
            />
          </div>
        ))}
      </section>

      {/* Related sentences */}
      <section className="space-y-2">
        <SectionTitle>Related Sentences</SectionTitle>
        <SentenceSelect
          selected={draft.relatedSentenceIds}
          sentences={allSentences}
          onChange={(ids) => setField("relatedSentenceIds", ids)}
        />
      </section>

      {/* Practice modes */}
      <section className="space-y-2">
        <SectionTitle>Practice Modes</SectionTitle>
        <div className="flex gap-4">
          {PRACTICE_MODES.map((mode) => (
            <label key={mode} className="flex cursor-pointer items-center gap-2 text-sm text-namsaek-800 dark:text-hanji-200">
              <input
                type="checkbox"
                checked={draft.practiceModes.includes(mode)}
                onChange={() => togglePracticeMode(mode)}
                className="rounded"
              />
              {mode.replace("_", " ")}
            </label>
          ))}
        </div>
      </section>

      {/* Next lesson */}
      <section className="space-y-2">
        <SectionTitle>Next Lesson</SectionTitle>
        <select
          value={draft.nextLessonId ?? ""}
          onChange={(e) => setField("nextLessonId", e.target.value || null)}
          className={inp}
        >
          <option value="">— none —</option>
          {allLessons
            .filter((l) => l.id !== draft.id)
            .map((l) => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
        </select>
      </section>

      <div className="flex gap-2 pt-2">
        <button onClick={handleSave} className={btnPrimary}>Save</button>
        <button onClick={onCancel} className={btnGhost}>Cancel</button>
      </div>
    </div>
  );
}

function SentenceSelect({
  selected,
  sentences,
  onChange,
}: {
  selected: string[];
  sentences: Sentence[];
  onChange: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = sentences.filter(
    (s) =>
      !search ||
      s.english.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()),
  );

  function toggle(id: string) {
    onChange(
      selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id],
    );
  }

  return (
    <div className="space-y-2">
      {/* Selected chips */}
      <div className="flex min-h-8 flex-wrap gap-1.5">
        {selected.length === 0 && (
          <span className="text-xs text-hanji-400">None selected — pick from the list below</span>
        )}
        {selected.map((id) => {
          const s = sentences.find((x) => x.id === id);
          return (
            <span
              key={id}
              className="flex items-center gap-1 rounded-full bg-namsaek-100 px-2 py-0.5 text-xs text-namsaek-800 dark:bg-namsaek-800 dark:text-namsaek-200"
            >
              <span className="max-w-[180px] truncate" title={s?.english ?? id}>
                {s?.english ?? id}
              </span>
              <span className="text-hanji-400">·</span>
              <span className="font-mono text-hanji-500">{id}</span>
              <button
                onClick={() => onChange(selected.filter((x) => x !== id))}
                className="ml-0.5 text-namsaek-500 hover:text-dancheong-500"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by English or ID…"
        className={inp}
      />

      {/* Sentence list */}
      <div className="max-h-44 overflow-y-auto rounded-xl border border-hanji-200 dark:border-namsaek-700">
        {sentences.length === 0 && (
          <p className="py-4 text-center text-xs text-hanji-400">No sentences loaded</p>
        )}
        {sentences.length > 0 && filtered.length === 0 && (
          <p className="py-4 text-center text-xs text-hanji-400">No matches</p>
        )}
        {filtered.map((s) => {
          const on = selected.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors hover:bg-hanji-50 dark:hover:bg-namsaek-800 ${on ? "bg-namsaek-50 dark:bg-namsaek-900/60" : ""}`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${on ? "border-namsaek-500 bg-namsaek-500" : "border-hanji-300 dark:border-namsaek-600"}`}
              >
                {on && <Check className="h-2.5 w-2.5 text-white" />}
              </span>
              <span className="min-w-0 flex-1 truncate text-namsaek-800 dark:text-hanji-200">
                {s.english}
              </span>
              <span className="shrink-0 font-mono text-hanji-400">{s.id}</span>
              <span className="shrink-0 rounded-full bg-hanji-100 px-1.5 py-0.5 text-hanji-500 dark:bg-namsaek-700 dark:text-hanji-400">
                {s.level}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wide text-hanji-500 dark:text-hanji-400">{children}</p>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-hanji-600 dark:text-hanji-400">{label}</label>
      {children}
    </div>
  );
}

const inp =
  "w-full rounded-lg border border-hanji-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-namsaek-400 focus:ring-1 focus:ring-namsaek-400 dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-200";

const btnPrimary =
  "rounded-xl bg-namsaek-600 px-4 py-2 text-sm font-semibold text-white hover:bg-namsaek-700 dark:bg-namsaek-500 dark:hover:bg-namsaek-400";

const btnGhost =
  "rounded-xl border border-hanji-300 px-4 py-2 text-sm font-semibold text-hanji-700 hover:bg-hanji-50 dark:border-namsaek-700 dark:text-hanji-300 dark:hover:bg-namsaek-800";

const addBtn =
  "flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-namsaek-600 hover:bg-namsaek-50 dark:text-namsaek-400 dark:hover:bg-namsaek-900";
