import { useState, useCallback, useEffect, useRef } from "react";
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
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    engine.init(ctx, config).then((initialState) => {
      if (!cancelled) {
        setState(initialState);
        stateRef.current = initialState;
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [engine, ctx, config]);

  const dispatch = useCallback(
    async (action: GameAction) => {
      const next = await engine.reduce(stateRef.current, action, {
        ctx,
        config,
        getWord,
        getPattern,
        now: () => Date.now(),
        rng: () => Math.random(),
      });
      stateRef.current = next;
      setState(next);
      if (next.status === "finished") {
        setResult(engine.buildResult(next));
      }
    },
    [engine, ctx, config]
  );

  return { state, dispatch, result, isLoading };
}
