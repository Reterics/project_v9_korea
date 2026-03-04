import { ArrowLeft } from "lucide-react";
import type { GameState } from "./gameTypes";


type GameHeaderProps = {
  title: string;
  state: GameState;
  onExit: () => void;
};

export function GameHeader({ title, state, onExit }: GameHeaderProps) {
  const answered = state.score.correct + state.score.wrong;

  return (
    <header className="border-b border-hanji-300 bg-white/80 backdrop-blur dark:border-namsaek-800 dark:bg-namsaek-950/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-namsaek-700 hover:bg-hanji-200 dark:text-hanji-200 dark:hover:bg-namsaek-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium text-hanji-500 sm:inline dark:text-hanji-400">
            {title}
          </span>
          {answered > 0 && (
            <span className="text-xs text-hanji-500 dark:text-hanji-400">
              Q{state.questionIndex + 1}
            </span>
          )}
        </div>

        <div className="rounded-2xl bg-cheongja-50 px-3 py-2 text-xs font-semibold text-cheongja-600 dark:bg-cheongja-900/30 dark:text-cheongja-300">
          {state.score.correct}/{answered}
        </div>
      </div>
    </header>
  );
}
