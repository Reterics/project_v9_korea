import { useState, useCallback, useEffect } from "react";
import type {
  GameEngine,
  GameState,
  GameAction,
  GameContext,
  GameConfig,
  GameResult,
} from "./gameTypes";
import { getWord } from "@/features/learn/content/contentRepo";
import { getPattern } from "@/features/learn/content/contentRepo";

export function useGameController(
  engine: GameEngine,
  ctx: GameContext,
  config: GameConfig
) {
  const [state, setState] = useState<GameState>({ status: "idle", questionIndex: 0, score: { correct: 0, wrong: 0, streak: 0, streakMax: 0 } });
  const [result, setResult] = useState<GameResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    engine.init(ctx, config).then((initialState) => {
      if (!cancelled) {
        setState(initialState);
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [engine, ctx, config]);

  const dispatch = useCallback(
    async (action: GameAction) => {
      setState((prev) => {
        // Trigger async reduce, then update state
        engine
          .reduce(prev, action, {
            ctx,
            config,
            getWord,
            getPattern,
            now: () => Date.now(),
            rng: () => Math.random(),
          })
          .then((next) => {
            setState(next);
            if (next.status === "finished") {
              setResult(engine.buildResult(next));
            }
          });
        return prev;
      });
    },
    [engine, ctx, config]
  );

  return { state, dispatch, result, isLoading };
}
