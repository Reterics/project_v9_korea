import type { GameState, GameAction } from "@/features/learn/games/_core/gameTypes";
import type { FlashcardQuestion, FlashcardGrade } from "./flashcardsTypes";
import { PromptCard, AudioButton } from "@birdie/ui";
import { useState, useEffect, useCallback } from "react";

type Props = {
  state: GameState<FlashcardQuestion>;
  dispatch: (action: GameAction) => void;
};

const gradeButtons: { grade: FlashcardGrade; label: string; key: number; color: string }[] = [
  { grade: "again", label: "Again", key: 1, color: "border-dancheong-200 bg-dancheong-50 text-dancheong-700 hover:bg-dancheong-100 dark:border-dancheong-800/40 dark:bg-dancheong-900/20 dark:text-dancheong-300 dark:hover:bg-dancheong-900/40" },
  { grade: "hard", label: "Hard", key: 2, color: "border-geum-200 bg-geum-50 text-geum-700 hover:bg-geum-100 dark:border-geum-800/40 dark:bg-geum-900/20 dark:text-geum-300 dark:hover:bg-geum-900/40" },
  { grade: "good", label: "Good", key: 3, color: "border-cheongja-200 bg-cheongja-50 text-cheongja-700 hover:bg-cheongja-100 dark:border-cheongja-800/40 dark:bg-cheongja-900/20 dark:text-cheongja-300 dark:hover:bg-cheongja-900/40" },
  { grade: "easy", label: "Easy", key: 4, color: "border-namsaek-200 bg-namsaek-50 text-namsaek-700 hover:bg-namsaek-100 dark:border-namsaek-700/40 dark:bg-namsaek-800/30 dark:text-namsaek-300 dark:hover:bg-namsaek-800/50" },
];

const gradeByKey: Record<string, FlashcardGrade> = {
  "1": "again",
  "2": "hard",
  "3": "good",
  "4": "easy",
};

export function FlashcardsScreen({ state, dispatch }: Props) {
  const [revealed, setRevealed] = useState(false);
  const q = state.question;

  const handleGrade = useCallback((grade: FlashcardGrade) => {
    setRevealed(false);
    dispatch({ type: "ANSWER", payload: { grade } });
  }, [dispatch]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (!revealed && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        setRevealed(true);
        return;
      }

      if (revealed && gradeByKey[e.key]) {
        e.preventDefault();
        handleGrade(gradeByKey[e.key]);
        return;
      }

      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        dispatch({ type: "SKIP" });
        setRevealed(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [revealed, handleGrade, dispatch]);

  if (!q) return null;

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      {/* Prompt */}
      <PromptCard
        text={q.korean}
        title="Flashcard"
        subtitle={revealed ? undefined : "What does this word mean?"}
        rightSlot={<AudioButton text={q.korean} />}
      />

      {/* Reveal / Answer area */}
      {!revealed ? (
        <div className="space-y-3">
          <div className="rounded-2xl border border-hanji-200 bg-hanji-50 px-4 py-3 text-center text-sm text-namsaek-600 dark:border-namsaek-700 dark:bg-namsaek-950/40 dark:text-hanji-300">
            Think of the meaning, then reveal to check yourself
          </div>
          <button
            onClick={() => setRevealed(true)}
            className="w-full rounded-2xl bg-namsaek-500 px-4 py-3 text-sm font-semibold text-hanji-50 shadow-sm transition hover:bg-namsaek-600"
          >
            Show Answer <span className="ml-2 text-xs opacity-60">Space</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Answer card */}
          <div className="rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
            <div className="text-center">
              <div className="text-2xl font-semibold">{q.english}</div>
              <div className="mt-1 text-sm text-hanji-500 dark:text-hanji-400">
                {q.romanization}
              </div>
              {q.example && (
                <div className="mt-3 rounded-2xl border border-hanji-200 bg-hanji-50 p-3 text-sm text-namsaek-600 dark:border-namsaek-700 dark:bg-namsaek-950/40 dark:text-hanji-300">
                  {q.example}
                </div>
              )}
            </div>
          </div>

          {/* Grade buttons */}
          <div className="text-center text-xs text-hanji-500 dark:text-hanji-400">
            How well did you know it?
          </div>
          <div className="grid grid-cols-4 gap-2">
            {gradeButtons.map((btn) => (
              <button
                key={btn.grade}
                onClick={() => handleGrade(btn.grade)}
                className={
                  "rounded-2xl border px-3 py-3 text-center shadow-sm transition hover:-translate-y-0.5 " +
                  btn.color
                }
              >
                <div className="text-sm font-semibold">{btn.label}</div>
                <div className="mt-1 text-xs opacity-60">{btn.key}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
