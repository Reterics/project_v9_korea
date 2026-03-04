import type { GameState, GameAction } from "@/features/learn/games/_core/gameTypes";
import type { SentenceBuilderQuestion, GrammarRole } from "./sentenceBuilderTypes";
import { FeedbackToast } from "@/features/learn/games/_core/ui/FeedbackToast";
import { useState, useEffect, useCallback } from "react";

type Props = {
  state: GameState<SentenceBuilderQuestion>;
  dispatch: (action: GameAction) => void;
};

const roleColors: Record<GrammarRole, string> = {
  subject: "border-namsaek-300 bg-namsaek-50 text-namsaek-700 dark:border-namsaek-600 dark:bg-namsaek-800/50 dark:text-namsaek-200",
  object: "border-cheongja-300 bg-cheongja-50 text-cheongja-700 dark:border-cheongja-600 dark:bg-cheongja-800/50 dark:text-cheongja-200",
  verb: "border-dancheong-300 bg-dancheong-50 text-dancheong-700 dark:border-dancheong-600 dark:bg-dancheong-800/50 dark:text-dancheong-200",
  location: "border-geum-300 bg-geum-50 text-geum-700 dark:border-geum-600 dark:bg-geum-800/50 dark:text-geum-200",
};

const roleLabels: Record<GrammarRole, string> = {
  subject: "주어",
  object: "목적어",
  verb: "동사",
  location: "장소",
};

export function SentenceBuilderScreen({ state, dispatch }: Props) {
  const q = state.question;
  const [placed, setPlaced] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);

  // Reset placed tokens when question changes
  useEffect(() => {
    setPlaced([]);
    setShowCorrect(false);
    setFeedback(null);
  }, [state.questionIndex]);

  const available = q
    ? q.shuffled.filter((token) => {
        const placedCount = placed.filter((p) => p === token).length;
        const totalCount = q.shuffled.filter((s) => s === token).length;
        return placedCount < totalCount;
      })
    : [];

  const addToken = useCallback(
    (token: string) => {
      if (!q || showCorrect) return;
      const newPlaced = [...placed, token];
      setPlaced(newPlaced);

      // Auto-check when all tokens are placed
      if (newPlaced.length === q.tokens.length) {
        const correctOrder = q.tokens.map((t) => t.text);
        const isCorrect = newPlaced.every((t, i) => t === correctOrder[i]);
        setFeedback(isCorrect ? "correct" : "wrong");

        if (isCorrect) {
          setTimeout(() => {
            dispatch({ type: "ANSWER", payload: { ordered: newPlaced } });
          }, 900);
        } else {
          setShowCorrect(true);
          setTimeout(() => {
            dispatch({ type: "ANSWER", payload: { ordered: newPlaced } });
          }, 2000);
        }
      }
    },
    [q, placed, showCorrect, dispatch],
  );

  const removeToken = useCallback(
    (index: number) => {
      if (showCorrect) return;
      setPlaced((prev) => prev.filter((_, i) => i !== index));
    },
    [showCorrect],
  );

  // Keyboard: 1-N to select available tokens, Backspace to undo
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!q || showCorrect) return;

      if (e.key === "Backspace" && placed.length > 0) {
        e.preventDefault();
        setPlaced((prev) => prev.slice(0, -1));
        return;
      }

      const num = parseInt(e.key);
      if (num >= 1 && num <= available.length) {
        e.preventDefault();
        addToken(available[num - 1]);
      }

      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        dispatch({ type: "SKIP" });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [q, placed, available, showCorrect, addToken, dispatch]);

  if (!q) return null;

  const getRoleForToken = (text: string): GrammarRole | undefined => {
    const token = q.tokens.find((t) => t.text === text);
    return token?.role;
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-5">
      {/* English prompt */}
      <div className="rounded-3xl border border-hanji-300 bg-hanji-50 p-5 dark:border-namsaek-700 dark:bg-namsaek-950/40">
        <div className="text-xs font-semibold text-hanji-500 dark:text-hanji-400">
          Build this sentence
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight">{q.english}</div>
        <div className="mt-2 text-xs text-namsaek-500 dark:text-hanji-400">{q.hint}</div>
      </div>

      {/* Sentence bar — placed tokens */}
      <div
        className={
          "flex min-h-[60px] flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed p-4 transition " +
          (placed.length === 0
            ? "border-hanji-300 dark:border-namsaek-700"
            : showCorrect
              ? feedback === "correct"
                ? "border-cheongja-400 bg-cheongja-50/50 dark:border-cheongja-600 dark:bg-cheongja-900/20"
                : "border-dancheong-400 bg-dancheong-50/50 dark:border-dancheong-600 dark:bg-dancheong-900/20"
              : "border-namsaek-300 dark:border-namsaek-600")
        }
      >
        {placed.length === 0 && (
          <span className="text-sm text-hanji-400 dark:text-hanji-500">
            Tap tokens below to build the sentence...
          </span>
        )}
        {placed.map((token, i) => {
          const role = getRoleForToken(token);
          return (
            <button
              key={`${token}-${i}`}
              onClick={() => removeToken(i)}
              disabled={showCorrect}
              className={
                "rounded-xl border px-3 py-2 text-base font-semibold shadow-sm transition hover:-translate-y-0.5 " +
                (role ? roleColors[role] : "border-hanji-300 bg-white dark:border-namsaek-700 dark:bg-namsaek-800")
              }
            >
              {token}
            </button>
          );
        })}
      </div>

      {/* Show correct answer on wrong */}
      {showCorrect && feedback === "wrong" && (
        <div className="rounded-2xl border border-cheongja-200 bg-cheongja-50 p-3 dark:border-cheongja-700 dark:bg-cheongja-900/30">
          <div className="text-xs font-semibold text-cheongja-600 dark:text-cheongja-300">
            Correct order:
          </div>
          <div className="mt-1 flex flex-wrap gap-2">
            {q.tokens.map((t, i) => (
              <span
                key={i}
                className={
                  "rounded-xl border px-3 py-2 text-base font-semibold " +
                  roleColors[t.role]
                }
              >
                {t.text}
                <span className="ml-1.5 text-[10px] font-normal opacity-60">
                  {roleLabels[t.role]}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Available tokens to pick */}
      <div className="flex flex-wrap justify-center gap-2">
        {available.map((token, i) => (
          <button
            key={`${token}-${i}`}
            onClick={() => addToken(token)}
            className="rounded-xl border border-hanji-300 bg-white px-4 py-3 text-base font-semibold shadow-sm transition hover:-translate-y-0.5 hover:border-namsaek-400 hover:shadow-md dark:border-namsaek-700 dark:bg-namsaek-900 dark:hover:border-namsaek-500"
          >
            {token}
            <span className="ml-2 text-xs text-hanji-400 dark:text-hanji-500">{i + 1}</span>
          </button>
        ))}
      </div>

      {/* Role legend */}
      <div className="flex flex-wrap justify-center gap-3 text-[10px]">
        {(Object.keys(roleLabels) as GrammarRole[]).map((role) => (
          <span
            key={role}
            className={
              "rounded-lg border px-2 py-1 " + roleColors[role]
            }
          >
            {roleLabels[role]}
          </span>
        ))}
      </div>

      <FeedbackToast type={feedback} />
    </div>
  );
}
