import type { GameId, GameContext, GameConfig } from "./gameTypes";
import { GameRegistry } from "./GameRegistry";
import { useGameController } from "./useGameController";
import { GameLayout } from "@reterics/birdie-ui";
import { GameHeader } from "./GameHeader";
import { GameFooter } from "./GameFooter";
import { GameResults } from "./GameResults";
import { GameScreenRouter } from "./GameScreenRouter";
import { useData } from "@/features/learn/data/DataProvider";
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
  const { progress, profile } = useData();
  const appliedRef = useRef(false);

  useEffect(() => {
    if (result && !appliedRef.current) {
      appliedRef.current = true;
      progress.applyGameResult(result);
      profile.awardXp(result);
    }
  }, [result, progress, profile]);

  if (!engine) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hanji-100 dark:bg-namsaek-950">
        <div className="text-sm text-hanji-500 dark:text-hanji-400">
          Game not found
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hanji-100 dark:bg-namsaek-950">
        <div className="text-sm text-hanji-500 dark:text-hanji-400">
          Loading...
        </div>
      </div>
    );
  }

  if (state.status === "finished" && result) {
    return <GameResults title={engine.title} result={result} onDone={onExit} />;
  }

  return (
    <GameLayout
      header={<GameHeader title={engine.title} state={state} onExit={onExit} />}
      footer={<GameFooter gameId={gameId} state={state} dispatch={dispatch} />}
    >
      <GameScreenRouter gameId={gameId} state={state} dispatch={dispatch} />
    </GameLayout>
  );
}
