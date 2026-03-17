import { useCallback, useEffect, useState } from "react";
import { adminContentApi } from "../adminContentApi";
import { GameEditor } from "../components/GameEditor";
import { ImportExportBar } from "../components/ImportExportBar";
import type { ImportMode } from "../components/ImportExportBar";
import type { DbGameConfig } from "../adminContentApi";

const GAME_LABELS: Record<string, string> = {
  flashcards: "Flashcards",
  sentence_builder: "Sentence Builder",
  particles: "Particles",
};

const GAME_ORDER = ["flashcards", "sentence_builder", "particles"];

export function GamesTab() {
  const [configs, setConfigs] = useState<DbGameConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const loadConfigs = useCallback(() => {
    adminContentApi
      .listGameConfigs()
      .then(setConfigs)
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadConfigs(); }, [loadConfigs]);

  async function handleImport(items: unknown[], _mode: ImportMode): Promise<number> {
    const cfgs = (items as DbGameConfig[]).filter(
      (c) => typeof c?.gameId === "string" && c.gameId.length > 0,
    );
    await Promise.all(
      cfgs.map((c) => adminContentApi.updateGameConfig(c.gameId, c)),
    );
    return cfgs.length;
  }

  async function handleSave(updated: DbGameConfig) {
    try {
      await adminContentApi.updateGameConfig(updated.gameId, updated);
      setConfigs((prev) => prev.map((c) => (c.gameId === updated.gameId ? updated : c)));
      setSuccessMsg("Saved!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  }

  if (loading) return <p className="text-sm text-hanji-500">Loading…</p>;

  const sorted = [...configs].sort(
    (a, b) => GAME_ORDER.indexOf(a.gameId) - GAME_ORDER.indexOf(b.gameId),
  );

  // Derive the active game: explicit selection, or the first card by default.
  const activeId = selected ?? sorted[0]?.gameId ?? null;
  const activeConfig = sorted.find((c) => c.gameId === activeId);

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-dancheong-600 dark:text-dancheong-400">{error}</p>}
      {successMsg && <p className="text-sm text-cheongja-600 dark:text-cheongja-400">{successMsg}</p>}

      <div className="flex justify-end">
        <ImportExportBar
          data={configs}
          filename="game-configs.json"
          onImport={handleImport}
          onImportComplete={() => { setLoading(true); loadConfigs(); }}
        />
      </div>

      <div className="flex gap-4">
        {/* Game cards */}
        <div className="flex w-56 shrink-0 flex-col gap-2">
          {sorted.map((cfg) => (
            <button
              key={cfg.gameId}
              onClick={() => setSelected(cfg.gameId)}
              className={`rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                activeId === cfg.gameId
                  ? "border-namsaek-400 bg-namsaek-50 dark:border-namsaek-500 dark:bg-namsaek-900"
                  : "border-hanji-200 bg-white dark:border-namsaek-700 dark:bg-namsaek-950"
              }`}
            >
              <p className="font-semibold text-namsaek-900 dark:text-hanji-100">
                {GAME_LABELS[cfg.gameId] ?? cfg.gameId}
              </p>
              <p className="mt-1 text-xs text-hanji-500 dark:text-hanji-400">
                {cfg.totalQuestions} questions · {cfg.difficulty}
              </p>
              {cfg.timeLimitSec && (
                <p className="text-xs text-hanji-400">{cfg.timeLimitSec}s limit</p>
              )}
            </button>
          ))}
        </div>

        {/* Editor */}
        {activeConfig ? (
          <div className="flex-1 rounded-2xl border border-hanji-200 p-5 dark:border-namsaek-700">
            <GameEditor key={activeConfig.gameId} config={activeConfig} onSave={handleSave} />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-hanji-200 text-sm text-hanji-400 dark:border-namsaek-700">
            Select a game to configure
          </div>
        )}
      </div>
    </div>
  );
}
