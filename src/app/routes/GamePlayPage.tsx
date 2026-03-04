import { useParams, useNavigate } from "react-router-dom";
import type { GameId, GameContext } from "@/features/learn/games/_core/gameTypes";
import { GameHost } from "@/features/learn/games/_core/GameHost";
import { useStudySession } from "@/features/learn/session/useStudySession";
import { useMemo } from "react";

export function GamePlayPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { items, config } = useStudySession(5);

  const ctx = useMemo<GameContext>(() => ({
    items,
    locale: "en",
  }), [items]);

  if (!gameId) {
    navigate("/");
    return null;
  }

  return (
    <GameHost
      gameId={gameId as GameId}
      ctx={ctx}
      config={config}
      onExit={() => navigate("/")}
    />
  );
}
