import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronRight,
  Flame,
  Headphones,
  Keyboard,
  Layers,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import type { GameId } from "./games/_core/gameTypes";
import { useProfile } from "./profile/useProfile";

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
    desc: "Recall 300 core words with spaced repetition.",
    meta: "2-4 min",
    icon: <BookOpen className="h-5 w-5" />,
    available: true,
  },
  {
    id: "sentence_builder",
    title: "Sentence Builder",
    desc: "Drag tokens to build Korean word order patterns.",
    meta: "3-6 min",
    icon: <Layers className="h-5 w-5" />,
    available: false,
  },
  {
    id: "particles",
    title: "Particles",
    desc: "Fill the correct particle with instant explanations.",
    meta: "2-5 min",
    icon: <Target className="h-5 w-5" />,
    available: false,
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
  const { profile } = useProfile();
  const startGame = (id: GameId) => navigate(`/play/${id}`);

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
      {/* Left column */}
      <div className="space-y-6">
        {/* Session banner */}
        <div className="rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-hanji-500 dark:text-hanji-400">
                Today
              </div>
              <div className="mt-1 text-xl font-semibold">
                Continue your A1 sprint
              </div>
              <div className="mt-1 text-sm text-namsaek-600 dark:text-hanji-300">
                5-7 minutes. Focus: core vocab + particles.
              </div>
            </div>
            <button
              onClick={() => startGame("flashcards")}
              className="group inline-flex items-center gap-2 rounded-2xl bg-namsaek-500 px-4 py-3 text-sm font-semibold text-hanji-50 shadow-sm transition hover:bg-namsaek-600"
            >
              Start session
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <StatChip
              icon={<Trophy className="h-4 w-4 text-geum-500" />}
              label="Level"
              value={String(profile.level)}
            />
            <StatChip
              icon={<Zap className="h-4 w-4 text-cheongja-500" />}
              label="XP"
              value={String(profile.xp)}
            />
            <StatChip
              icon={<Flame className="h-4 w-4 text-dancheong-500" />}
              label="Coins"
              value={String(profile.coins)}
            />
          </div>
        </div>

        {/* Game cards */}
        <div className="grid gap-4 sm:grid-cols-2">
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
                Based on recent sessions
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

        {/* Mastery preview */}
        <div className="rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
          <div className="text-sm font-semibold">Mastery preview</div>
          <div className="mt-2 text-xs text-hanji-500 dark:text-hanji-400">
            300 words (A1) — tiles fill as mastery grows.
          </div>
          <MasteryGrid />
        </div>
      </div>
    </div>
  );
}

function StatChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-hanji-200 bg-hanji-50 px-3 py-3 dark:border-namsaek-700 dark:bg-namsaek-950/40">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-namsaek-800">
        {icon}
      </div>
      <div className="leading-tight">
        <div className="text-xs text-hanji-500 dark:text-hanji-400">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
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

function MasteryGrid() {
  const tiles = useMemo(() => {
    const n = 90;
    return Array.from({ length: n }, (_, i) => {
      const mastery = Math.max(0, Math.min(1, (Math.sin(i / 6) + 1) / 2));
      return { filled: mastery > 0.55, strong: mastery > 0.8 };
    });
  }, []);

  return (
    <div className="mt-4 grid grid-cols-10 gap-2">
      {tiles.map((t, i) => (
        <div
          key={i}
          className={
            "h-4 w-full rounded-lg border " +
            (t.filled
              ? t.strong
                ? "border-cheongja-500 bg-cheongja-500 dark:border-cheongja-400 dark:bg-cheongja-400"
                : "border-cheongja-300 bg-cheongja-200 dark:border-cheongja-600 dark:bg-cheongja-700"
              : "border-hanji-200 bg-hanji-100 dark:border-namsaek-700 dark:bg-namsaek-800")
          }
        />
      ))}
    </div>
  );
}
