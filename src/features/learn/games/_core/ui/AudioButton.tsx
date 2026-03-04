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
      className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/30 dark:hover:bg-zinc-800"
      title="Listen"
    >
      <Play className="h-4 w-4" />
      Audio
    </button>
  );
}
