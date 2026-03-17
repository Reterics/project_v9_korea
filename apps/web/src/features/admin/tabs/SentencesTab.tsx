import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { btnPrimaryIcon } from "../components/editorStyles";
import { api } from "@/features/learn/data/apiClient";
import { adminContentApi } from "../adminContentApi";
import { SentenceEditor } from "../components/SentenceEditor";
import { ImportExportBar } from "../components/ImportExportBar";
import type { ImportMode } from "../components/ImportExportBar";
import type { Sentence } from "../adminContentApi";

type SeedResult = { seeded: { sentences: number } };

export function SentencesTab() {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Sentence | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadSentences = useCallback(() => {
    setLoading(true);
    adminContentApi
      .listSentences()
      .then(setSentences)
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadSentences(); }, [loadSentences]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return sentences;
    return sentences.filter(
      (s) => s.id.includes(q) || s.english.toLowerCase().includes(q),
    );
  }, [sentences, search]);

  function openNew() { setSelected(null); setIsNew(true); }
  function openEdit(s: Sentence) { setSelected(s); setIsNew(false); }
  function closeEditor() { setSelected(null); setIsNew(false); }

  async function handleSave(s: Sentence) {
    setSaving(true);
    try {
      if (isNew) {
        await adminContentApi.createSentence(s);
        setSentences((prev) => [...prev, s]);
      } else {
        await adminContentApi.updateSentence(s.id, s);
        setSentences((prev) => prev.map((x) => (x.id === s.id ? s : x)));
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
    if (!confirm("Delete this sentence?")) return;
    try {
      await adminContentApi.deleteSentence(id);
      setSentences((prev) => prev.filter((s) => s.id !== id));
      if (selected?.id === id) closeEditor();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function handleImport(items: unknown[], mode: ImportMode): Promise<number> {
    const res = await api.post<SeedResult>("/api/v1/admin/seed-demo", { sentences: items, mode });
    return res.seeded.sentences;
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
              placeholder="Search sentences…"
              className="w-64 rounded-xl border border-hanji-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-namsaek-400 dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-200"
            />
          </div>
          <button onClick={openNew} className={btnPrimaryIcon}>
            <Plus className="h-4 w-4" /> New Sentence
          </button>
        </div>

        <ImportExportBar
          data={sentences}
          filename="sentences.json"
          onImport={handleImport}
          onImportComplete={loadSentences}
        />
      </div>

      <div className="flex gap-4">
        {/* List */}
        <div
          className="w-72 shrink-0 overflow-y-auto rounded-2xl border border-hanji-200 dark:border-namsaek-700"
          style={{ maxHeight: "60vh" }}
        >
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-hanji-500">No sentences found.</p>
          )}
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => openEdit(s)}
              className={`group flex w-full items-center justify-between px-4 py-3 text-left hover:bg-hanji-50 dark:hover:bg-namsaek-800 ${
                selected?.id === s.id ? "bg-namsaek-50 dark:bg-namsaek-800" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-namsaek-900 dark:text-hanji-100">
                  {s.english}
                </div>
                <div className="truncate text-xs text-hanji-500 dark:text-hanji-400">
                  {s.tokens.join(" · ")} — {s.tokens.length} tokens
                </div>
              </div>
              <div className="ml-2 flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-hanji-100 px-1.5 py-0.5 text-xs text-hanji-600 dark:bg-namsaek-700 dark:text-hanji-300">
                  {s.level}
                </span>
                <button
                  onClick={(e) => handleDelete(s.id, e)}
                  className="hidden rounded p-1 text-hanji-400 hover:text-dancheong-500 group-hover:block"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </button>
          ))}
        </div>

        {/* Editor */}
        {showEditor ? (
          <div className="flex-1 overflow-y-auto rounded-2xl border border-hanji-200 p-5 dark:border-namsaek-700">
            <SentenceEditor
              key={selected?.id ?? "new"}
              sentence={selected}
              isNew={isNew}
              onSave={handleSave}
              onCancel={closeEditor}
            />
            {saving && <p className="mt-2 text-xs text-hanji-500">Saving…</p>}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-hanji-200 text-sm text-hanji-400 dark:border-namsaek-700">
            Select a sentence to edit or click New Sentence
          </div>
        )}
      </div>
    </div>
  );
}

