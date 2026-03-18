type Listener = (message: string) => void;

const listeners = new Set<Listener>();

export function onSaveError(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function notifySaveError(message: string): void {
  console.error("[save error]", message);
  for (const fn of listeners) fn(message);
}
