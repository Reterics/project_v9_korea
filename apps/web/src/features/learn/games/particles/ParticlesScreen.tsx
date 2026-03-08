import { useCallback, useEffect, useState } from "react";
import type { GameAction, GameState } from "@/features/learn/games/_core/gameTypes";
import { ChoiceGrid, FeedbackToast, PromptCard } from "@reterics/birdie-ui";
import type { ParticleQuestion } from "./particlesTypes";

type Props = {
  state: GameState<ParticleQuestion>;
  dispatch: (action: GameAction) => void;
};

const KEY_TO_INDEX: Record<string, number> = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 3,
};

export function ParticlesScreen({ state, dispatch }: Props) {
  const q = state.question;
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const answer = useCallback(
    (value: string) => {
      if (!q || feedback) return;

      const isCorrect = value === q.correctParticle;
      setSelected(value);
      setFeedback(isCorrect ? "correct" : "wrong");

      window.setTimeout(() => {
        setFeedback(null);
        setSelected(null);
        setShowHint(false);
        dispatch({ type: "ANSWER", payload: { value } });
      }, 750);
    },
    [dispatch, feedback, q]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!q || feedback) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const idx = KEY_TO_INDEX[e.key];
      if (idx !== undefined && q.choices[idx]) {
        e.preventDefault();
        answer(q.choices[idx]);
        return;
      }

      if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        setShowHint((prev) => !prev);
        return;
      }

      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        setFeedback(null);
        setSelected(null);
        setShowHint(false);
        dispatch({ type: "SKIP" });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [answer, dispatch, feedback, q]);

  if (!q) return null;

  const revealInfo = showHint || feedback !== null;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-hanji-500 dark:text-hanji-400">
          {q.role === "topic" ? "Topic marker" : q.role === "subject" ? "Subject marker" : "Object marker"}
        </div>
        <div className="text-xs text-hanji-500 dark:text-hanji-400">
          Question {state.questionIndex + 1}
        </div>
      </div>

      <PromptCard
        title="Fill the particle"
        text={q.prompt}
        subtitle={q.english}
      />

      <ChoiceGrid
        disabled={feedback !== null}
        onSelect={answer}
        choices={q.choices.map((choice) => {
          if (!selected) return { label: choice, value: choice };
          if (choice === q.correctParticle) return { label: choice, value: choice, variant: "success" as const };
          if (choice === selected && selected !== q.correctParticle) return { label: choice, value: choice, variant: "danger" as const };
          return { label: choice, value: choice };
        })}
      />

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setShowHint((prev) => !prev)}
          className="rounded-2xl border border-hanji-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-hanji-50 dark:border-namsaek-700 dark:bg-namsaek-800 dark:hover:bg-namsaek-700"
        >
          {showHint ? "Hide hint" : "Hint (H)"}
        </button>
      </div>

      {revealInfo && (
        <div className="rounded-2xl border border-hanji-300 bg-hanji-50 p-4 text-sm text-namsaek-700 dark:border-namsaek-700 dark:bg-namsaek-950/40 dark:text-hanji-300">
          <div className="font-semibold">{q.hint}</div>
          <div className="mt-1">{q.explanation}</div>
        </div>
      )}

      <FeedbackToast
        type={feedback}
        message={
          feedback === "correct"
            ? `Correct: ${q.correctParticle}`
            : feedback === "wrong"
              ? `Wrong - answer: ${q.correctParticle}`
              : undefined
        }
      />
    </div>
  );
}
