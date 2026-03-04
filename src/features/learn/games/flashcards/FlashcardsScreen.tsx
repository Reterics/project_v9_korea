import type { GameState, GameAction } from "@/features/learn/games/_core/gameTypes";
import type { FlashcardQuestion, FlashcardGrade } from "./flashcardsTypes";
import { PromptCard } from "@/features/learn/games/_core/ui/PromptCard";
import { AudioButton } from "@/features/learn/games/_core/ui/AudioButton";
import { useState } from "react";

type Props = {
  state: GameState<FlashcardQuestion>;
  dispatch: (action: GameAction) => void;
};

const gradeButtons: { grade: FlashcardGrade; label: string; key: number }[] = [
  { grade: "again", label: "Again", key: 1 },
  { grade: "hard", label: "Hard", key: 2 },
  { grade: "good", label: "Good", key: 3 },
  { grade: "easy", label: "Easy", key: 4 },
];

export function FlashcardsScreen({ state, dispatch }: Props) {
  const [revealed, setRevealed] = useState(false);
  const q = state.question;

  if (!q) return null;

  const handleGrade = (grade: FlashcardGrade) => {
    setRevealed(false);
    dispatch({ type: "ANSWER", payload: { grade } });
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      {/* Prompt */}
      <PromptCard
        text={q.korean}
        title="Flashcard"
        subtitle={revealed ? undefined : "Tap to reveal"}
        rightSlot={<AudioButton text={q.korean} />}
      />

      {/* Reveal / Answer area */}
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-50 shadow-sm hover:opacity-95 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Show Answer
        </button>
      ) : (
        <div className="space-y-4">
          {/* Answer card */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-center">
              <div className="text-2xl font-semibold">{q.english}</div>
              <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {q.romanization}
              </div>
              {q.example && (
                <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
                  {q.example}
                </div>
              )}
            </div>
          </div>

          {/* Grade buttons */}
          <div className="grid grid-cols-4 gap-2">
            {gradeButtons.map((btn) => (
              <button
                key={btn.grade}
                onClick={() => handleGrade(btn.grade)}
                className="group rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div className="text-sm font-semibold">{btn.label}</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {btn.key}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
