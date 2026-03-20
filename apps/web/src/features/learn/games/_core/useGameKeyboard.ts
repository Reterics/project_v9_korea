import { useEffect, useRef } from "react";

/**
 * Attaches a single keydown listener on window with the standard game guards
 * (ignores events from input/textarea). Letter keys are matched case-insensitively,
 * so callers only need to define lowercase variants (e.g. "h", not "h" + "H").
 *
 * The handlers map is kept current via a ref, so callers never need to memoize it
 * and the effect only registers once.
 */
export function useGameKeyboard(handlers: Record<string, () => void>) {
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const handler = ref.current[e.key] ?? ref.current[e.key.toLowerCase()];
      if (handler) {
        e.preventDefault();
        handler();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
