import { useNavigate } from "react-router-dom";
import type { GameId } from "./games/_core/gameTypes";
import { useProfile } from "./profile/useProfile";

type GameCard = {
  id: GameId;
  title: string;
  description: string;
  emoji: string;
  available: boolean;
};

const games: GameCard[] = [
  { id: "flashcards", title: "Flashcard Sprint", description: "Review Korean words with spaced repetition", emoji: "\uD83C\uDCCF", available: true },
  { id: "match", title: "Word Match", description: "Match Korean with English meanings", emoji: "\uD83E\uDDE9", available: false },
  { id: "sentence_builder", title: "Sentence Builder", description: "Arrange words into correct sentences", emoji: "\uD83D\uDCDD", available: false },
  { id: "particles", title: "Missing Particle", description: "Choose the correct particle", emoji: "\uD83E\uDD14", available: false },
  { id: "listening", title: "Listening Challenge", description: "Identify words by sound", emoji: "\uD83C\uDFA7", available: false },
];

export function LearnHubPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Level {profile.level}</div>
          <div className="text-xs text-gray-400">{profile.xp} XP</div>
        </div>
        <div className="text-center">
          <div className="text-2xl">{profile.dailyStreak > 0 ? "\uD83D\uDD25" : "\u2744\uFE0F"}</div>
          <div className="text-xs text-gray-400">{profile.dailyStreak} day streak</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-amber-500 font-semibold">{profile.coins} coins</div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-3">Games</h2>

      <div className="grid gap-3">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => game.available && navigate(`/play/${game.id}`)}
            disabled={!game.available}
            className={`flex items-center gap-4 p-4 rounded-xl text-left transition-colors ${
              game.available
                ? "bg-white shadow-sm hover:shadow-md cursor-pointer"
                : "bg-gray-100 opacity-60 cursor-not-allowed"
            }`}
          >
            <div className="text-3xl">{game.emoji}</div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{game.title}</div>
              <div className="text-sm text-gray-500">{game.description}</div>
              {!game.available && (
                <div className="text-xs text-gray-400 mt-1">Coming soon</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
