import { Play } from "lucide-react";

type AudioButtonProps = {
  text: string;
  lang?: string;
};

export function AudioButton({ text, lang = "ko-KR" }: AudioButtonProps) {
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className="inline-flex items-center gap-2 rounded-2xl border border-hanji-300 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-hanji-50 dark:border-namsaek-700 dark:bg-namsaek-800 dark:hover:bg-namsaek-700"
      title="Listen"
    >
      <Play className="h-4 w-4 text-namsaek-500 dark:text-cheongja-400" />
      Audio
    </button>
  );
}
