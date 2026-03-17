import { useRef, useState } from "react";
import { Download, Upload, X } from "lucide-react";
import { downloadJson, readJsonFile } from "../utils/importExport";

export type ImportMode = "skip" | "overwrite";

export type ImportExportBarProps = {
  /** Current list data — exported as-is. */
  data: unknown[];
  /** Suggested filename for the downloaded file, e.g. `"words.json"`. */
  filename: string;
  /**
   * Called when the user confirms an import.
   * Receives the parsed array and chosen mode.
   * Should return the number of records actually written so the bar can
   * display a success message.
   */
  onImport: (items: unknown[], mode: ImportMode) => Promise<number>;
  /**
   * Called after a successful import so the parent can reload its list.
   * Kept separate from `onImport` so the bar controls its own "success"
   * state independently of the parent's loading state.
   */
  onImportComplete: () => void;
};

export function ImportExportBar({
  data,
  filename,
  onImport,
  onImportComplete,
}: ImportExportBarProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [parsedItems, setParsedItems] = useState<unknown[] | null>(null);
  const [parseError, setParseError] = useState("");
  const [mode, setMode] = useState<ImportMode>("skip");
  const [importing, setImporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [importError, setImportError] = useState("");

  // ── Export ──────────────────────────────────────────────────────────────

  function handleExport() {
    downloadJson(data, filename);
  }

  // ── Import panel toggle ──────────────────────────────────────────────────

  function togglePanel() {
    const opening = !panelOpen;
    setPanelOpen(opening);
    if (opening) {
      // Reset every time the panel is opened
      setParsedItems(null);
      setParseError("");
      setSuccessMsg("");
      setImportError("");
    }
  }

  // ── File selection ───────────────────────────────────────────────────────

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsedItems(null);
    setParseError("");
    setSuccessMsg("");
    setImportError("");

    try {
      const items = await readJsonFile(file);
      setParsedItems(items);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Failed to parse file");
    }

    // Reset so the same file can be re-selected if needed
    e.target.value = "";
  }

  // ── Import confirm ───────────────────────────────────────────────────────

  async function handleImport() {
    if (!parsedItems) return;

    setImporting(true);
    setSuccessMsg("");
    setImportError("");

    try {
      const count = await onImport(parsedItems, mode);
      setSuccessMsg(`${count} item${count !== 1 ? "s" : ""} imported.`);
      setParsedItems(null);
      onImportComplete();
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleExport}
          disabled={data.length === 0}
          title={data.length === 0 ? "Nothing to export" : `Export ${data.length} items`}
          className={btnGhost}
        >
          <Download className="h-3.5 w-3.5" />
          Export
          {data.length > 0 && (
            <span className="rounded-full bg-hanji-100 px-1.5 py-0.5 text-xs tabular-nums text-hanji-600 dark:bg-namsaek-700 dark:text-hanji-300">
              {data.length}
            </span>
          )}
        </button>

        <button onClick={togglePanel} className={panelOpen ? btnGhostActive : btnGhost}>
          <Upload className="h-3.5 w-3.5" />
          Import
          {panelOpen && <X className="ml-0.5 h-3 w-3" />}
        </button>
      </div>

      {/* Import panel */}
      {panelOpen && (
        <div className="space-y-3 rounded-xl border border-hanji-200 bg-hanji-50 p-4 dark:border-namsaek-700 dark:bg-namsaek-900/60">
          {/* File picker */}
          <div className="space-y-1">
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className={filePicker(!!parsedItems)}
            >
              {parsedItems
                ? `✓  ${parsedItems.length} item${parsedItems.length !== 1 ? "s" : ""} ready — click to change file`
                : "Click to choose a .json file…"}
            </button>
            {parseError && (
              <p className="text-xs text-dancheong-600 dark:text-dancheong-400">{parseError}</p>
            )}
          </div>

          {/* Mode */}
          <div className="flex gap-5">
            {(["skip", "overwrite"] as const).map((m) => (
              <label
                key={m}
                className="flex cursor-pointer items-center gap-1.5 text-sm text-namsaek-800 dark:text-hanji-200"
              >
                <input
                  type="radio"
                  name={`import-mode-${filename}`}
                  checked={mode === m}
                  onChange={() => setMode(m)}
                />
                {m === "skip" ? "Skip existing" : "Overwrite existing"}
              </label>
            ))}
          </div>

          {/* Feedback */}
          {successMsg && (
            <p className="text-xs text-cheongja-600 dark:text-cheongja-400">{successMsg}</p>
          )}
          {importError && (
            <p className="text-xs text-dancheong-600 dark:text-dancheong-400">{importError}</p>
          )}

          {/* Confirm button */}
          <button
            onClick={handleImport}
            disabled={!parsedItems || importing}
            className={btnImport}
          >
            {importing
              ? "Importing…"
              : `Import${parsedItems ? ` ${parsedItems.length} items` : ""}`}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Shared style constants ────────────────────────────────────────────────────

const btnGhost =
  "flex items-center gap-1.5 rounded-xl border border-hanji-300 px-3 py-1.5 text-sm font-medium text-hanji-700 hover:bg-hanji-100 disabled:opacity-40 dark:border-namsaek-600 dark:text-hanji-300 dark:hover:bg-namsaek-800";

const btnGhostActive =
  "flex items-center gap-1.5 rounded-xl border border-namsaek-400 bg-namsaek-50 px-3 py-1.5 text-sm font-medium text-namsaek-700 dark:border-namsaek-500 dark:bg-namsaek-900 dark:text-namsaek-200";

const btnImport =
  "rounded-xl bg-namsaek-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-namsaek-700 disabled:opacity-50 dark:bg-namsaek-500 dark:hover:bg-namsaek-400";

function filePicker(hasData: boolean) {
  return [
    "w-full rounded-lg border border-dashed px-4 py-3 text-left text-sm transition-colors",
    hasData
      ? "border-cheongja-400 bg-cheongja-50 text-cheongja-700 dark:border-cheongja-600 dark:bg-cheongja-900/20 dark:text-cheongja-300"
      : "border-hanji-300 bg-white text-hanji-500 hover:border-namsaek-400 hover:text-namsaek-600 dark:border-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-400",
  ].join(" ");
}
