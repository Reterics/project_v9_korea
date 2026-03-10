import { useState, useCallback, useEffect, useRef } from "react";
import type {
  GameEngine,
  GameState,
  GameAction,
  GameContext,
  GameConfig,
  GameResult,
} from "./gameTypes";
import { useData } from "@/features/learn/data/DataProvider";

const INITIAL_STATE: GameState = {
  status: "idle",
  questionIndex: 0,
  score: {
    correct: 0,
    wrong: 0,
    streak: 0,
    streakMax: 0,
  },
};

export function useGameController(
    engine: GameEngine,
    ctx: GameContext,
    config: GameConfig
) {
  const { content } = useData();
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [result, setResult] = useState<GameResult | null>(null);
  const isLoading = state.status === "idle";
  const stateRef = useRef<GameState>(INITIAL_STATE);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    let cancelled = false;

    engine.init(ctx, config).then((initialState) => {
      if (cancelled) return;

      stateRef.current = initialState;
      setState(initialState);
    });

    return () => {
      cancelled = true;
    };
  }, [engine, ctx, config]);

  const dispatch = useCallback(
      async (action: GameAction) => {
        const next = await engine.reduce(stateRef.current, action, {
          ctx,
          config,
          getWord: (id: string) => content.getWord(id),
          getPattern: (id: string) => content.getPattern(id),
          now: () => Date.now(),
          rng: () => Math.random(),
        });

        stateRef.current = next;
        setState(next);

        if (next.status === "finished") {
          setResult(engine.buildResult(next));
        }
      },
      [engine, ctx, config, content]
  );

  return { state, dispatch, result, isLoading };
}