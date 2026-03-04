import type { GameId, GameContext, GameConfig } from "./gameTypes";
import { GameRegistry } from "./GameRegistry";
import { useGameController } from "./useGameController";
import { GameLayout } from "./GameLayout";
import { GameHeader } from "./GameHeader";
import { GameFooter } from "./GameFooter";
import { GameResults } from "./GameResults";
import { GameScreenRouter } from "./GameScreenRouter";
import { applyGameResult } from "@/features/learn/progress/progressRepo";
import { awardXp } from "@/features/learn/profile/profileRepo";
import { useEffect, useRef } from "react";

type GameHostProps = {
  gameId: GameId;
  ctx: GameContext;
  config: GameConfig;
  onExit: () => void;
};

export function GameHost({ gameId, ctx, config, onExit }: GameHostProps) {
  const engine = GameRegistry[gameId];
  const { state, dispatch, result, isLoading } = useGameController(engine, ctx, config);
  const appliedRef = useRef(false);

  useEffect(() => {
    if (result && !appliedRef.current) {
      appliedRef.current = true;
      applyGameResult(result);
      awardXp(result);
    }
  }, [result]);

  if (!engine) {
    return <div className="p-8 text-center text-gray-500">Game not found</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (state.status === "finished" && result) {
    return <GameResults title={engine.title} result={result} onDone={onExit} />;
  }

  return (
    <GameLayout
      header={<GameHeader title={engine.title} state={state} onExit={onExit} />}
      footer={<GameFooter state={state} dispatch={dispatch} />}
    >
      <GameScreenRouter gameId={gameId} state={state} dispatch={dispatch} />
    </GameLayout>
  );
}
