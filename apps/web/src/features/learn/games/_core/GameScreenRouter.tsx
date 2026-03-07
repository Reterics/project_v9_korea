import type { GameId, GameState, GameAction } from "./gameTypes";
import { FlashcardsScreen } from "../flashcards/FlashcardsScreen";
import type { FlashcardQuestion } from "../flashcards/flashcardsTypes";
import { SentenceBuilderScreen } from "../sentence-builder/SentenceBuilderScreen";
import type { SentenceBuilderQuestion } from "../sentence-builder/sentenceBuilderTypes";
import { ParticlesScreen } from "../particles/ParticlesScreen";
import type { ParticleQuestion } from "../particles/particlesTypes";

type GameScreenRouterProps = {
  gameId: GameId;
  state: GameState;
  dispatch: (action: GameAction) => void;
};

export function GameScreenRouter({ gameId, state, dispatch }: GameScreenRouterProps) {
  switch (gameId) {
    case "flashcards":
      return <FlashcardsScreen state={state as GameState<FlashcardQuestion>} dispatch={dispatch} />;
    case "sentence_builder":
      return <SentenceBuilderScreen state={state as GameState<SentenceBuilderQuestion>} dispatch={dispatch} />;
    case "particles":
      return <ParticlesScreen state={state as GameState<ParticleQuestion>} dispatch={dispatch} />;
    case "match":
    case "listening":
      return (
        <div className="text-center text-sm text-hanji-500 dark:text-hanji-400">
          Coming soon
        </div>
      );
  }
}
