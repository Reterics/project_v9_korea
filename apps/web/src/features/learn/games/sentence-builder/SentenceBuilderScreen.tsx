import type { GameState, GameAction } from "@/features/learn/games/_core/gameTypes";
import type { SentenceBuilderQuestion, GrammarRole } from "./sentenceBuilderTypes";
import { FeedbackToast } from "@reterics/birdie-ui";
import {useState, useEffect, useCallback, useMemo} from "react";

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
  subject: "Subject",
  object: "Object",
  verb: "Verb",
  location: "Location",
};

export function SentenceBuilderScreen({ state, dispatch }: Props) {
  const q = state.question;
  const [placed, setPlaced] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [pendingWrongAnswer, setPendingWrongAnswer] = useState<string[] | null>(null);

  // Reset placed tokens when question changes (state-during-render pattern)
  const [prevQuestionIndex, setPrevQuestionIndex] = useState(state.questionIndex);
  if (prevQuestionIndex !== state.questionIndex) {
    setPrevQuestionIndex(state.questionIndex);
    setPlaced([]);
    setShowCorrect(false);
    setFeedback(null);
    setShowHint(false);
    setPendingWrongAnswer(null);
  }

  const available = useMemo(() => q
      ? q.shuffled.filter((token) => {
        const placedCount = placed.filter((p) => p === token).length;
        const totalCount = q.shuffled.filter((s) => s === token).length;
        return placedCount < totalCount;
      })
      : [], [placed, q]);

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
          setPendingWrongAnswer(newPlaced);
        }
      }
    },
    [q, placed, showCorrect, dispatch],
  );

  const continueAfterWrong = useCallback(() => {
    if (!(showCorrect && feedback === "wrong")) return;
    const ordered = pendingWrongAnswer ?? placed;
    dispatch({ type: "ANSWER", payload: { ordered } });
  }, [showCorrect, feedback, pendingWrongAnswer, placed, dispatch]);

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

      if ((e.key === "Enter" || e.key === " ") && showCorrect && feedback === "wrong") {
        e.preventDefault();
        continueAfterWrong();
      }

      if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        setShowHint((prev) => !prev);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [q, placed, available, showCorrect, feedback, addToken, continueAfterWrong, dispatch]);

  // Footer Hint (H) button dispatches this event for Sentence Builder only.
  useEffect(() => {
    function onToggleHint() {
      setShowHint((prev) => !prev);
    }

    window.addEventListener("sentence-builder-toggle-hint", onToggleHint);
    return () => window.removeEventListener("sentence-builder-toggle-hint", onToggleHint);
  }, []);

  if (!q) return null;

  const getRoleForToken = (text: string): GrammarRole | undefined => {
    const token = q.tokens.find((t) => t.text === text);
    return token?.role;
  };

  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-lg flex-col gap-3">
      {/* English prompt */}
      <div className="shrink-0 rounded-3xl border border-hanji-300 bg-hanji-50 p-4 dark:border-namsaek-700 dark:bg-namsaek-950/40">
        <div className="text-xs font-semibold text-hanji-500 dark:text-hanji-400">
          Build this sentence
        </div>
        <div className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">{q.english}</div>
      </div>

      {/* Sentence bar — placed tokens */}
      <div
        className={
          "flex min-h-[84px] max-h-[132px] flex-wrap content-start items-start gap-2 overflow-y-auto rounded-2xl border-2 border-dashed p-3 transition " +
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
                "inline-flex h-12 items-center rounded-xl border px-4 text-base font-semibold shadow-sm transition hover:-translate-y-0.5 " +
                (role ? roleColors[role] : "border-hanji-300 bg-white dark:border-namsaek-700 dark:bg-namsaek-800")
              }
            >
              {token}
            </button>
          );
        })}
      </div>

      {/* Keep result block mounted to avoid jump when wrong-answer panel appears */}
      <div
        aria-hidden={!(showCorrect && feedback === "wrong")}
        className={
          "h-[124px] shrink-0 overflow-y-auto rounded-2xl border border-cheongja-200 bg-cheongja-50 p-3 transition-opacity dark:border-cheongja-700 dark:bg-cheongja-900/30 " +
          (showCorrect && feedback === "wrong" ? "opacity-100" : "pointer-events-none opacity-0")
        }
      >
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
        <div className="flex justify-end">
          <button
            onClick={continueAfterWrong}
            className="rounded-2xl border border-cheongja-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-cheongja-50 dark:border-cheongja-700 dark:bg-namsaek-800 dark:hover:bg-namsaek-700"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Available tokens to pick */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-wrap justify-center gap-2 py-1">
          {available.map((token, i) => (
            <button
              key={`${token}-${i}`}
              onClick={() => addToken(token)}
              className="inline-flex h-12 items-center rounded-xl border border-hanji-300 bg-white px-4 text-base font-semibold shadow-sm transition hover:-translate-y-0.5 hover:border-namsaek-400 hover:shadow-md dark:border-namsaek-700 dark:bg-namsaek-900 dark:hover:border-namsaek-500"
            >
              {token}
              <span className="ml-2 text-xs text-hanji-400 dark:text-hanji-500">{i + 1}</span>
            </button>
          ))}
        </div>
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

      {/* Reserve hint space to prevent content jump when toggling hints */}
      {showHint && (
        <div className="absolute inset-x-0 bottom-0 z-10 rounded-2xl border border-hanji-300 bg-hanji-50 p-4 text-sm text-namsaek-700 shadow-lg dark:border-namsaek-700 dark:bg-namsaek-950 dark:text-hanji-300">
          <div className="max-h-40 overflow-y-auto whitespace-pre-line font-medium">
            {q.translationHint || "No translation hint available yet."}
          </div>
        </div>
      )}

      <FeedbackToast type={feedback} />
    </div>
  );
}

