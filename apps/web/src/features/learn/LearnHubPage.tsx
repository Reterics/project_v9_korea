import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Headphones,
  Keyboard,
  Languages,
  Layers,
  Target,
} from "lucide-react";
import type { GameId } from "./games/_core/gameTypes";
import { BrandLogo } from "@/components/BrandLogo";
import { listWords } from "./content/contentRepo";
import { loadMastery } from "./profile/masteryRepo";
import { getCurrentLesson, loadLessonProgress } from "./content/lessonRepo";

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
  const startGame = (id: GameId) => navigate(`/play/${id}`);
  const currentLesson = useMemo(() => getCurrentLesson(), []);
  const lessonProgress = useMemo(() => (currentLesson ? loadLessonProgress()[currentLesson.id] : undefined), [currentLesson]);

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
      {/* Left column */}
      <div className="space-y-6">
        {/* Current lesson block */}
        {!currentLesson && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-hanji-300 bg-white p-6 text-center shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
            <BrandLogo variant="icon" size={40} />
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
          <div className="rounded-3xl border border-namsaek-200 bg-namsaek-50 p-5 dark:border-namsaek-700/50 dark:bg-namsaek-900/60">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-namsaek-500 dark:text-namsaek-400" />
              <div className="text-xs font-medium text-namsaek-600 dark:text-namsaek-400">
                {lessonProgress?.status === "in_progress" ? "Continue lesson" : "Start lesson"}
              </div>
            </div>
            <div className="mt-1 text-base font-semibold text-namsaek-900 dark:text-hanji-100">
              {currentLesson.title}
            </div>
            <div className="mt-0.5 text-sm text-namsaek-600 dark:text-hanji-300">
              {currentLesson.summary}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigate(`/grammar/${currentLesson.id}`)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-namsaek-500 px-4 py-2 text-xs font-semibold text-hanji-50 transition hover:bg-namsaek-600"
              >
                {lessonProgress?.status === "in_progress" ? "Continue lesson" : "Open lesson"}
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              {currentLesson.practiceModes[0] && (
                <button
                  onClick={() => navigate(`/play/${currentLesson.practiceModes[0]}?lessonId=${currentLesson.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-namsaek-300 bg-white px-4 py-2 text-xs font-semibold text-namsaek-700 transition hover:bg-namsaek-50 dark:border-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-200 dark:hover:bg-namsaek-700"
                >
                  Practice
                </button>
              )}
            </div>
          </div>
        )}

        {/* Game cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => navigate("/hangeul-practice/game")}
            className="group rounded-3xl border border-hanji-300 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-namsaek-300 hover:shadow-md dark:border-namsaek-700 dark:bg-namsaek-900 dark:hover:border-namsaek-600"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-namsaek-50 text-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-200">
                  <Languages className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Hangeul Practice</div>
                  <div className="mt-1 text-xs text-hanji-500 dark:text-hanji-400">
                    Dictionary + game
                  </div>
                </div>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 text-hanji-400 transition group-hover:translate-x-0.5 dark:text-hanji-500" />
            </div>
            <div className="mt-3 text-sm text-namsaek-600 dark:text-hanji-300">
              Browse Hangeul letters, then open the dedicated pronunciation game.
            </div>
          </button>
          {games.map((game) => (
            <GameCard
              key={game.id}
              icon={game.icon}
              title={game.title}
              desc={game.desc}
              meta={game.meta}
              available={game.available}
              onClick={() => game.available && startGame(game.id)}
            />
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        {/* Weak area */}
        <div className="rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Weak area</div>
              <div className="text-xs text-hanji-500 dark:text-hanji-400">
                Based on recent mistakes
              </div>
            </div>
            <div className="rounded-xl bg-dancheong-50 px-3 py-2 text-xs font-semibold text-dancheong-600 dark:bg-dancheong-900/40 dark:text-dancheong-300">
              Particles
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <MiniRow left="Vocabulary" right="Review" hint="Core A1 words" />
            <MiniRow left="Particles" right="Practice" hint="Topic & subject markers" />
            <MiniRow left="Sentences" right="Build" hint="Word order drills" />
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-hanji-300 bg-hanji-50 p-3 text-xs text-namsaek-600 dark:border-namsaek-700 dark:bg-namsaek-950/40 dark:text-hanji-300">
            <Keyboard className="h-4 w-4 shrink-0" />
            Tip: use <span className="font-semibold">1-4</span> to answer,{" "}
            <span className="font-semibold">Space</span> next.
          </div>
        </div>

        {/* Vocab Progress */}
        <VocabProgressCard />
      </div>
    </div>
  );
}


function GameCard({
  icon,
  title,
  desc,
  meta,
  available,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  meta: string;
  available: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!available}
      className={
        "group rounded-3xl border border-hanji-300 bg-white p-5 text-left shadow-sm transition dark:border-namsaek-700 dark:bg-namsaek-900 " +
        (available
          ? "hover:-translate-y-0.5 hover:border-namsaek-300 hover:shadow-md dark:hover:border-namsaek-600"
          : "opacity-50 cursor-not-allowed")
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-namsaek-50 text-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-200">
            {icon}
          </div>
          <div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="mt-1 text-xs text-hanji-500 dark:text-hanji-400">
              {available ? meta : "Coming soon"}
            </div>
          </div>
        </div>
        {available && (
          <ChevronRight className="mt-1 h-4 w-4 text-hanji-400 transition group-hover:translate-x-0.5 dark:text-hanji-500" />
        )}
      </div>
      <div className="mt-3 text-sm text-namsaek-600 dark:text-hanji-300">{desc}</div>
    </button>
  );
}

function MiniRow({
  left,
  right,
  hint,
}: {
  left: string;
  right: string;
  hint: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-hanji-200 bg-hanji-50 px-3 py-3 dark:border-namsaek-700 dark:bg-namsaek-950/30">
      <div>
        <div className="text-sm font-semibold">{left}</div>
        <div className="mt-0.5 text-xs text-hanji-500 dark:text-hanji-400">
          {hint}
        </div>
      </div>
      <div className="text-sm font-semibold text-namsaek-500 dark:text-cheongja-400">
        {right}
      </div>
    </div>
  );
}

function VocabProgressCard() {
  const words = useMemo(() => listWords(), []);
  const mastery = useMemo(() => loadMastery(), []);

  const tiles = useMemo(
    () => words.map((w) => ({ id: w.id, score: mastery[w.id]?.score ?? 0 })),
    [words, mastery],
  );
  const learned = tiles.filter((t) => t.score > 0).length;
  const mastered = tiles.filter((t) => t.score >= 0.8).length;

  return (
    <div className="rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-sm font-semibold">Vocabulary</div>
        <div className="text-sm font-bold text-namsaek-700 dark:text-hanji-100">
          {learned}
          <span className="text-xs font-normal text-hanji-400 dark:text-hanji-500"> / {tiles.length}</span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {tiles.map((t) => (
          <div
            key={t.id}
            className={
              "h-2.5 w-2.5 rounded-sm " +
              (t.score >= 0.8
                ? "bg-cheongja-500 dark:bg-cheongja-400"
                : t.score >= 0.4
                  ? "bg-cheongja-300 dark:bg-cheongja-600"
                  : t.score > 0
                    ? "bg-cheongja-100 dark:bg-cheongja-800"
                    : "bg-hanji-200 dark:bg-namsaek-700")
            }
          />
        ))}
      </div>
      <div className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">{mastered} mastered</div>
    </div>
  );
}


