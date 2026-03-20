import { useState, useRef, useCallback, useLayoutEffect } from "react";

/**
 * Encapsulates the feedback/selected state pattern shared by choice-based game screens:
 *   submit(value, isCorrect) → show feedback → wait delayMs → clear → call onContinue(value)
 *
 * onContinue is kept current via a ref so callers never need to memoize it.
 */
export function useAnswerFeedback(onContinue: (value: string) => void, delayMs = 750) {
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const continueRef = useRef(onContinue);
  useLayoutEffect(() => { continueRef.current = onContinue; });

  const submit = useCallback(
    (value: string, isCorrect: boolean) => {
      setSelected(value);
      setFeedback(isCorrect ? "correct" : "wrong");
      window.setTimeout(() => {
        setFeedback(null);
        setSelected(null);
        continueRef.current(value);
      }, delayMs);
    },
    [delayMs],
  );

  return { feedback, selected, submit };
}
