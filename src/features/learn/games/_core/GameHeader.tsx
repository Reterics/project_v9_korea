import type { GameState } from "./gameTypes";

type GameHeaderProps = {
  title: string;
  state: GameState;
  onExit: () => void;
};

export function GameHeader({ title, state, onExit }: GameHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <button
        onClick={onExit}
        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
      >
        &larr; Exit
      </button>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <div className="text-sm text-gray-500">
        {state.score.correct + state.score.wrong > 0 && (
          <span>
            {state.score.correct}/{state.score.correct + state.score.wrong}
          </span>
        )}
      </div>
    </header>
  );
}
