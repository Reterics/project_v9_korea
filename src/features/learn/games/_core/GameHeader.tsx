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
    <header className="border-b border-zinc-200 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium text-zinc-500 sm:inline dark:text-zinc-400">
            {title}
          </span>
          {answered > 0 && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Q{state.questionIndex + 1}
            </span>
          )}
        </div>

        <div className="rounded-2xl bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          {state.score.correct}/{answered}
        </div>
      </div>
    </header>
  );
}
