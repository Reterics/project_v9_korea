import type { GameResult } from "./gameTypes";

type GameResultsProps = {
  title: string;
  result: GameResult;
  onDone: () => void;
};

export function GameResults({ title, result, onDone }: GameResultsProps) {
  const total = result.correct + result.wrong;
  const accuracy = total > 0 ? Math.round((result.correct / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 mb-8">Session Complete</p>

      <div className="grid grid-cols-2 gap-6 mb-8 w-full max-w-xs">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-3xl font-bold text-green-600">{result.correct}</div>
          <div className="text-sm text-gray-500">Correct</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-3xl font-bold text-red-500">{result.wrong}</div>
          <div className="text-sm text-gray-500">Wrong</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
          <div className="text-sm text-gray-500">Accuracy</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-3xl font-bold text-amber-500">{result.streakMax}</div>
          <div className="text-sm text-gray-500">Best Streak</div>
        </div>
      </div>

      <button
        onClick={onDone}
        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
      >
        Done
      </button>
    </div>
  );
}
