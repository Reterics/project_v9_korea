import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import type { GameId, GameContext, GameConfig } from "@/features/learn/games/_core/gameTypes";
import { GameHost } from "@/features/learn/games/_core/GameHost";
import { useStudySession } from "@/features/learn/session/useStudySession";
import { useEffect, useMemo, useState } from "react";
import { useData } from "@/features/learn/data/DataProvider";
import { publicGameApi } from "@/features/admin/adminContentApi";
import type { DbGameConfig } from "@/features/admin/adminContentApi";

export function GamePlayPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { content } = useData();
  const { items, config } = useStudySession(10);

  const [dbConfigs, setDbConfigs] = useState<DbGameConfig[]>([]);
  const [dbConfigsReady, setDbConfigsReady] = useState(false);

  useEffect(() => {
    publicGameApi.getGameConfigs()
      .then(setDbConfigs)
      .catch(() => {
        // silently fall back to hardcoded defaults
      })
      .finally(() => setDbConfigsReady(true));
  }, []);

  const lessonId = searchParams.get("lessonId") ?? undefined;
  const lesson = useMemo(() => (lessonId ? content.getLesson(lessonId) : undefined), [lessonId, content]);

  const ctx = useMemo<GameContext>(() => ({
    items,
    locale: "en",
  }), [items]);

  const mergedConfig = useMemo<GameConfig>(() => {
    const dbCfg = dbConfigs.find((c) => c.gameId === gameId);

    const base: GameConfig = {
      ...config,
      ...(dbCfg && {
        totalQuestions: dbCfg.totalQuestions,
        ...(dbCfg.timeLimitSec != null && { timeLimitSec: dbCfg.timeLimitSec }),
        ...(dbCfg.difficulty && { difficulty: dbCfg.difficulty }),
        ...(dbCfg.engineConfig && { engineConfig: dbCfg.engineConfig }),
      }),
    };

    if (!lesson) return base;
    return {
      ...base,
      lessonSentenceIds: lesson.relatedSentenceIds,
      lessonId: lesson.id,
    };
  }, [config, dbConfigs, gameId, lesson]);

  if (!gameId) {
    navigate("/");
    return null;
  }

  if (!dbConfigsReady) {
    return <p className="flex h-screen items-center justify-center text-sm text-hanji-500">Loading…</p>;
  }

  const handleExit = () => {
    if (lessonId) {
      content.markLessonPracticed(lessonId);
      navigate(`/grammar/${lessonId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <GameHost
      gameId={gameId as GameId}
      ctx={ctx}
      config={mergedConfig}
      onExit={handleExit}
    />
  );
}
