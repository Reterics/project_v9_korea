/**
 * Pure import/export utilities — no API or React dependencies.
 */

/** Triggers a browser download of `data` serialised as pretty-printed JSON. */
export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Reads a File, parses it as JSON, and resolves with the top-level array.
 * Rejects with a human-readable error string if the file is not valid JSON
 * or if the root value is not an array.
 */
export function readJsonFile(file: File): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      reject(new Error("Please upload a .json file"));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed: unknown = JSON.parse(e.target?.result as string);
        if (!Array.isArray(parsed)) {
          reject(new Error("JSON root must be an array of objects"));
          return;
        }
        resolve(parsed);
      } catch {
        reject(new Error("File contains invalid JSON"));
      }
    };

    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsText(file);
  });
}
