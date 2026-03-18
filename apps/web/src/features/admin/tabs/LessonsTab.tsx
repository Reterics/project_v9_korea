import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { btnPrimaryIcon } from "../components/editorStyles";
import { api } from "@/features/learn/data/apiClient";
import { adminContentApi } from "../adminContentApi";
import { LessonEditor } from "../components/LessonEditor";
import { ImportExportBar } from "../components/ImportExportBar";
import type { ImportMode } from "../components/ImportExportBar";
import type { AdminLesson, Sentence } from "../adminContentApi";

type SeedResult = { seeded: { lessons: number } };

const CATEGORY_COLORS: Record<string, string> = {
  "sentence-pattern": "bg-namsaek-100 text-namsaek-700 dark:bg-namsaek-800 dark:text-namsaek-200",
  "particles":        "bg-cheongja-100 text-cheongja-700 dark:bg-cheongja-900 dark:text-cheongja-200",
  "question-form":    "bg-geum-100 text-geum-700 dark:bg-geum-900 dark:text-geum-200",
  "negative-form":    "bg-dancheong-100 text-dancheong-700 dark:bg-dancheong-900 dark:text-dancheong-200",
};

export function LessonsTab() {
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminLesson | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadLessons = useCallback(() => {
    setLoading(true);
    Promise.all([
      adminContentApi.listLessons(),
      adminContentApi.listSentences(),
    ])
      .then(([ls, ss]) => { setLessons(ls); setSentences(ss); })
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadLessons(); }, [loadLessons]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return lessons;
    return lessons.filter(
      (l) =>
        l.id.includes(q) ||
        l.title.toLowerCase().includes(q) ||
        l.category.includes(q),
    );
  }, [lessons, search]);

  function openNew() { setSelected(null); setIsNew(true); }
  function openEdit(l: AdminLesson) { setSelected(l); setIsNew(false); }
  function closeEditor() { setSelected(null); setIsNew(false); }

  async function handleSave(l: AdminLesson) {
    setSaving(true);
    try {
      if (isNew) {
        await adminContentApi.createLesson(l);
        setLessons((prev) => [...prev, l]);
      } else {
        await adminContentApi.updateLesson(l.id, l);
        setLessons((prev) => prev.map((x) => (x.id === l.id ? l : x)));
      }
      closeEditor();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, evt: React.MouseEvent) {
    evt.stopPropagation();
    if (!confirm("Delete this lesson and all its examples/blocks?")) return;
    try {
      await adminContentApi.deleteLesson(id);
      setLessons((prev) => prev.filter((l) => l.id !== id));
      if (selected?.id === id) closeEditor();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function handleImport(items: unknown[], mode: ImportMode): Promise<number> {
    const res = await api.post<SeedResult>("/api/v1/admin/seed-demo", { lessons: items, mode });
    return res.seeded.lessons;
  }

  if (loading) return <p className="text-sm text-hanji-500">Loading…</p>;

  const showEditor = isNew || selected !== null;

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-dancheong-600 dark:text-dancheong-400">{error}</p>}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hanji-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lessons…"
              className="w-64 rounded-xl border border-hanji-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-namsaek-400 dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-200"
            />
          </div>
          <button onClick={openNew} className={btnPrimaryIcon}>
            <Plus className="h-4 w-4" /> New Lesson
          </button>
        </div>

        <ImportExportBar
          data={lessons}
          filename="lessons.json"
          onImport={handleImport}
          onImportComplete={loadLessons}
        />
      </div>

      <div className="flex gap-4">
        {/* List */}
        <div
          className="w-72 shrink-0 overflow-y-auto rounded-2xl border border-hanji-200 dark:border-namsaek-700"
          style={{ maxHeight: "60vh" }}
        >
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-hanji-500">No lessons found.</p>
          )}
          {filtered.map((l) => (
            <div
              key={l.id}
              role="button"
              tabIndex={0}
              onClick={() => openEdit(l)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openEdit(l); }}
              className={`group flex w-full cursor-pointer items-start justify-between px-4 py-3 text-left hover:bg-hanji-50 dark:hover:bg-namsaek-800 ${
                selected?.id === l.id ? "bg-namsaek-50 dark:bg-namsaek-800" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-namsaek-900 dark:text-hanji-100">
                  {l.title}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs ${CATEGORY_COLORS[l.category] ?? "bg-hanji-100 text-hanji-600"}`}
                  >
                    {l.category}
                  </span>
                  <span className="rounded-full bg-hanji-100 px-1.5 py-0.5 text-xs text-hanji-600 dark:bg-namsaek-700 dark:text-hanji-300">
                    {l.level}
                  </span>
                  <span className="text-xs text-hanji-400">{l.examples.length} ex</span>
                </div>
              </div>
              <button
                onClick={(e) => handleDelete(l.id, e)}
                className="ml-2 hidden shrink-0 rounded p-1 text-hanji-400 hover:text-dancheong-500 group-hover:block"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Editor */}
        {showEditor ? (
          <div
            className="flex-1 overflow-y-auto rounded-2xl border border-hanji-200 p-5 dark:border-namsaek-700"
            style={{ maxHeight: "60vh" }}
          >
            <LessonEditor
              key={selected?.id ?? "new"}
              lesson={selected}
              isNew={isNew}
              allLessons={lessons}
              allSentences={sentences}
              onSave={handleSave}
              onCancel={closeEditor}
            />
            {saving && <p className="mt-2 text-xs text-hanji-500">Saving…</p>}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-hanji-200 text-sm text-hanji-400 dark:border-namsaek-700">
            Select a lesson to edit or click New Lesson
          </div>
        )}
      </div>
    </div>
  );
}

