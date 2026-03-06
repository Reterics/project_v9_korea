import { Keyboard } from "lucide-react";
import type { GameState, GameAction, GameId } from "./gameTypes";

type GameFooterProps = {
  gameId: GameId;
  state: GameState;
  dispatch: (action: GameAction) => void;
};

export function GameFooter({ gameId, state, dispatch }: GameFooterProps) {
  if (state.status !== "in_progress") return null;

  return (
    <footer className="border-t border-hanji-300 bg-white/80 backdrop-blur dark:border-namsaek-800 dark:bg-namsaek-950/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-hanji-500 dark:text-hanji-400">
          <Keyboard className="h-4 w-4" />
          <span className="hidden sm:inline">
            {gameId === "sentence_builder"
              ? "1-4 answer · Space next"
              : "1-4 answer · Space next · H hint"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {gameId === "sentence_builder" && (
            <button
              onClick={() => window.dispatchEvent(new Event("sentence-builder-toggle-hint"))}
              className="rounded-2xl border border-hanji-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-hanji-50 dark:border-namsaek-700 dark:bg-namsaek-800 dark:hover:bg-namsaek-700"
            >
              Hint (H)
            </button>
          )}
          <button
            onClick={() => dispatch({ type: "SKIP" })}
            className="rounded-2xl border border-hanji-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-hanji-50 dark:border-namsaek-700 dark:bg-namsaek-800 dark:hover:bg-namsaek-700"
          >
            Skip
          </button>
        </div>
      </div>
    </footer>
  );
}
