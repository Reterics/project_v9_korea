import type { GameId, GameState, GameAction } from "./gameTypes";
import { FlashcardsScreen } from "../flashcards/FlashcardsScreen";

type GameScreenRouterProps = {
  gameId: GameId;
  state: GameState;
  dispatch: (action: GameAction) => void;
};

export function GameScreenRouter({ gameId, state, dispatch }: GameScreenRouterProps) {
  switch (gameId) {
    case "flashcards":
      return <FlashcardsScreen state={state as any} dispatch={dispatch} />;
    case "match":
    case "sentence_builder":
    case "particles":
    case "listening":
      return (
        <div className="text-center text-gray-400 text-lg">
          Coming soon
        </div>
      );
  }
}
