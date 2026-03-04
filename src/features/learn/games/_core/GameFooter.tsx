import type { GameState, GameAction } from "./gameTypes";

type GameFooterProps = {
  state: GameState;
  dispatch: (action: GameAction) => void;
};

export function GameFooter({ state, dispatch }: GameFooterProps) {
  if (state.status !== "in_progress") return null;

  return (
    <footer className="flex items-center justify-center px-4 py-3 bg-white border-t border-gray-200">
      <button
        onClick={() => dispatch({ type: "SKIP" })}
        className="text-sm text-gray-400 hover:text-gray-600"
      >
        Skip
      </button>
    </footer>
  );
}
