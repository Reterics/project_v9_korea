import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Headphones,
  Keyboard,
  Languages,
  Layers,
  Target,
} from "lucide-react";
import {
  ActivityCard,
  BirdIcon,
  DashboardLayout,
  ActivityGrid,
  LessonCard,
  ProgressCard,
  WeakAreaCard,
} from "@reterics/birdie-ui";
import type { GameId } from "./games/_core/gameTypes";
import { loadMastery } from "./profile/masteryRepo";
import { useData } from "./data/DataProvider";

type GameCardDef = {
  id: GameId;
  title: string;
  desc: string;
  meta: string;
  icon: React.ReactNode;
  available: boolean;
};

const games: GameCardDef[] = [
  {
    id: "flashcards",
    title: "Flashcards",
    desc: "Review words from your lessons with spaced repetition.",
    meta: "2-4 min",
    icon: <BookOpen className="h-5 w-5" />,
    available: true,
  },
  {
    id: "sentence_builder",
    title: "Sentence Builder",
    desc: "Practice word order — put tokens in the right Korean sequence.",
    meta: "3-6 min",
    icon: <Layers className="h-5 w-5" />,
    available: true,
  },
  {
    id: "particles",
    title: "Particles",
    desc: "Practice markers — fill 은/는, 이/가, 을/를 in context.",
    meta: "2-5 min",
    icon: <Target className="h-5 w-5" />,
    available: true,
  },
  {
    id: "listening",
    title: "Listening",
    desc: "Hear a word, choose meaning, train sound recognition.",
    meta: "2-4 min",
    icon: <Headphones className="h-5 w-5" />,
    available: false,
  },
];

export function LearnHubPage() {
  const navigate = useNavigate();
  const { content } = useData();
  const startGame = (id: GameId) => navigate(`/play/${id}`);
  const currentLesson = useMemo(() => content.getCurrentLesson(), [content]);
  const lessonProgress = useMemo(() => (currentLesson ? content.loadLessonProgress()[currentLesson.id] : undefined), [currentLesson, content]);

  const vocabTiles = useMemo(() => {
    const words = content.listWords();
    const mastery = loadMastery();
    return words.map((w) => ({ id: w.id, score: mastery[w.id]?.score ?? 0 }));
  }, [content]);

  return (
    <DashboardLayout
      main={
        <>
          {/* Current lesson block */}
          {!currentLesson && (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-hanji-300 bg-white p-6 text-center shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
              <BirdIcon size={40} />
              <div>
                <div className="text-sm font-semibold text-namsaek-900 dark:text-hanji-100">
                  All lessons complete!
                </div>
                <div className="mt-1 text-xs text-hanji-500 dark:text-hanji-400">
                  Your Korean Birdie is proud. Keep practising to build mastery.
                </div>
              </div>
            </div>
          )}
          {currentLesson && (
            <LessonCard
              title={currentLesson.title}
              summary={currentLesson.summary}
              status="in_progress"
              icon={<GraduationCap className="h-4 w-4 text-namsaek-500 dark:text-namsaek-400" />}
              actionLabel={lessonProgress?.status === "in_progress" ? "Continue lesson" : "Open lesson"}
              onClick={() => navigate(`/grammar/${currentLesson.id}`)}
              secondaryAction={
                currentLesson.practiceModes[0]
                  ? {
                      label: "Practice",
                      onClick: () =>
                        navigate(`/play/${currentLesson.practiceModes[0]}?lessonId=${currentLesson.id}`),
                    }
                  : undefined
              }
            />
          )}

          {/* Game cards */}
          <ActivityGrid>
            <ActivityCard
              icon={<Languages className="h-5 w-5" />}
              title="Hangeul Practice"
              description="Browse Hangeul letters, then open the dedicated pronunciation game."
              meta="Dictionary + game"
              onClick={() => navigate("/hangeul-practice/game")}
            />
            {games.map((game) => (
              <ActivityCard
                key={game.id}
                icon={game.icon}
                title={game.title}
                description={game.desc}
                meta={game.meta}
                available={game.available}
                onClick={() => game.available && startGame(game.id)}
              />
            ))}
          </ActivityGrid>
        </>
      }
      sidebar={
        <>
          <WeakAreaCard
            weakArea="Particles"
            rows={[
              { label: "Vocabulary", action: "Review", hint: "Core A1 words" },
              { label: "Particles", action: "Practice", hint: "Topic & subject markers" },
              { label: "Sentences", action: "Build", hint: "Word order drills" },
            ]}
            tip={
              <>
                <Keyboard className="h-4 w-4 shrink-0" />
                Tip: use <span className="font-semibold">1-4</span> to answer,{" "}
                <span className="font-semibold">Space</span> next.
              </>
            }
          />
          <ProgressCard tiles={vocabTiles} />
        </>
      }
    />
  );
}


