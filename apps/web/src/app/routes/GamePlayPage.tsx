import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import type { GameId, GameContext } from "@/features/learn/games/_core/gameTypes";
import { GameHost } from "@/features/learn/games/_core/GameHost";
import { useStudySession } from "@/features/learn/session/useStudySession";
import { useMemo } from "react";
import { useData } from "@/features/learn/data/DataProvider";

export function GamePlayPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { content } = useData();
  const { items, config } = useStudySession(10);

  const lessonId = searchParams.get("lessonId") ?? undefined;
  const lesson = useMemo(() => (lessonId ? content.getLesson(lessonId) : undefined), [lessonId, content]);

  const ctx = useMemo<GameContext>(() => ({
    items,
    locale: "en",
  }), [items]);

  const lessonConfig = useMemo(() => {
    if (!lesson) return config;
    return {
      ...config,
      lessonSentenceIds: lesson.relatedSentenceIds,
      lessonId: lesson.id,
    };
  }, [config, lesson]);

  if (!gameId) {
    navigate("/");
    return null;
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
      config={lessonConfig}
      onExit={handleExit}
    />
  );
}
