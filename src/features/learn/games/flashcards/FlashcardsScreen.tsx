import type { GameState, GameAction } from "@/features/learn/games/_core/gameTypes";
import type { FlashcardQuestion, FlashcardGrade } from "./flashcardsTypes";
import { PromptCard } from "@/features/learn/games/_core/ui/PromptCard";
import { AudioButton } from "@/features/learn/games/_core/ui/AudioButton";
import { useState } from "react";

type Props = {
  state: GameState<FlashcardQuestion>;
  dispatch: (action: GameAction) => void;
};

const gradeButtons: { grade: FlashcardGrade; label: string; color: string }[] = [
  { grade: "again", label: "Again", color: "bg-red-100 text-red-700 border-red-300" },
  { grade: "hard", label: "Hard", color: "bg-orange-100 text-orange-700 border-orange-300" },
  { grade: "good", label: "Good", color: "bg-green-100 text-green-700 border-green-300" },
  { grade: "easy", label: "Easy", color: "bg-blue-100 text-blue-700 border-blue-300" },
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
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <PromptCard
        text={q.korean}
        subtitle={revealed ? undefined : "Tap to reveal"}
      />

      <AudioButton text={q.korean} />

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors w-full"
        >
          Show Answer
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center w-full">
            <div className="text-2xl font-bold text-gray-800">{q.english}</div>
            <div className="text-sm text-gray-400 mt-1">{q.romanization}</div>
            {q.example && (
              <div className="text-sm text-gray-500 mt-2 italic">{q.example}</div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 w-full">
            {gradeButtons.map((btn) => (
              <button
                key={btn.grade}
                onClick={() => handleGrade(btn.grade)}
                className={`rounded-lg border-2 py-2 text-sm font-medium transition-colors ${btn.color}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
