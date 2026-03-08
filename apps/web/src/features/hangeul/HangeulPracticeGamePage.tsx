import { useCallback, useEffect, useState } from "react";
import { ChoiceGrid, PromptCard } from "@birdie/ui";
import { hangeulEntries, speakKorean, type HangeulEntry } from "./hangeulData";

type PracticeMode = "sound_from_char" | "char_from_sound";

type QuizQuestion = {
  prompt: string;
  title: string;
  subtitle: string;
  correctValue: string;
  correctChar: string;
  choices: Array<{ label: string; value: string }>;
};

const QUIZ_LENGTH = 10;

const KEY_TO_INDEX: Record<string, number> = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 3,
};

function shuffled<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickDifferentEntries(source: HangeulEntry, amount: number): HangeulEntry[] {
  return shuffled(hangeulEntries.filter((entry) => entry.char !== source.char)).slice(0, amount);
}

function buildQuestion(mode: PracticeMode): QuizQuestion {
  const entry = hangeulEntries[Math.floor(Math.random() * hangeulEntries.length)];
  const distractors = pickDifferentEntries(entry, 3);

  if (mode === "sound_from_char") {
    const choices = shuffled([
      { label: entry.romanization, value: entry.romanization },
      ...distractors.map((d) => ({ label: d.romanization, value: d.romanization })),
    ]);

    return {
      prompt: entry.char,
      title: "What sound does it make?",
      subtitle: `Pick the correct pronunciation for ${entry.char}.`,
      correctValue: entry.romanization,
      correctChar: entry.char,
      choices,
    };
  }

  const choices = shuffled([
    { label: entry.char, value: entry.char },
    ...distractors.map((d) => ({ label: d.char, value: d.char })),
  ]);

  return {
    prompt: entry.romanization,
    title: "Select the correct letter",
    subtitle: "Choose the Hangeul character for this pronunciation.",
    correctValue: entry.char,
    correctChar: entry.char,
    choices,
  };
}

export function HangeulPracticeGamePage() {
  const [mode, setMode] = useState<PracticeMode>("sound_from_char");
  const [question, setQuestion] = useState<QuizQuestion>(() => buildQuestion("sound_from_char"));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const finished = questionIndex >= QUIZ_LENGTH;

  const resetSession = useCallback(
    (nextMode: PracticeMode = mode) => {
      setMode(nextMode);
      setQuestion(buildQuestion(nextMode));
      setQuestionIndex(0);
      setCorrect(0);
      setWrong(0);
      setSelected(null);
      setFeedback(null);
    },
    [mode]
  );

  const answer = useCallback(
    (value: string) => {
      if (finished || feedback) return;

      const isCorrect = value === question.correctValue;
      speakKorean(question.correctChar);
      setSelected(value);
      setFeedback(isCorrect ? "correct" : "wrong");

      if (isCorrect) {
        setCorrect((prev) => prev + 1);
      } else {
        setWrong((prev) => prev + 1);
      }

      window.setTimeout(() => {
        setSelected(null);
        setFeedback(null);
        setQuestionIndex((prev) => prev + 1);
        setQuestion(buildQuestion(mode));
      }, 700);
    },
    [feedback, finished, mode, question.correctValue, question.correctChar]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (finished || feedback) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const idx = KEY_TO_INDEX[e.key];
      if (idx !== undefined && question.choices[idx]) {
        e.preventDefault();
        answer(question.choices[idx].value);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [answer, feedback, finished, question.choices]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <section className="rounded-3xl border border-hanji-300 bg-white p-4 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Hangeul Practice Game</h1>
            <p className="text-xs text-hanji-500 dark:text-hanji-400">
              Question {Math.min(questionIndex + 1, QUIZ_LENGTH)} / {QUIZ_LENGTH}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => resetSession("sound_from_char")}
              className={
                "rounded-2xl border px-3 py-2 text-xs font-semibold transition " +
                (mode === "sound_from_char"
                  ? "border-namsaek-500 bg-namsaek-500 text-hanji-50"
                  : "border-hanji-300 bg-hanji-50 text-namsaek-700 hover:bg-hanji-100 dark:border-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200 dark:hover:bg-namsaek-700")
              }
            >
              Hangeul -&gt; Sound
            </button>
            <button
              onClick={() => resetSession("char_from_sound")}
              className={
                "rounded-2xl border px-3 py-2 text-xs font-semibold transition " +
                (mode === "char_from_sound"
                  ? "border-namsaek-500 bg-namsaek-500 text-hanji-50"
                  : "border-hanji-300 bg-hanji-50 text-namsaek-700 hover:bg-hanji-100 dark:border-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200 dark:hover:bg-namsaek-700")
              }
            >
              Sound -&gt; Hangeul
            </button>
          </div>
        </div>

        <div className="mt-3 flex gap-3 text-xs">
          <StatPill label="Correct" value={String(correct)} tone="success" />
          <StatPill label="Wrong" value={String(wrong)} tone="danger" />
        </div>

        {!finished && (
          <div className="mt-4 space-y-4">
            <PromptCard title={question.title} text={question.prompt} subtitle={question.subtitle} />
            <ChoiceGrid
              disabled={feedback !== null}
              onSelect={answer}
              choices={question.choices.map((choice) => {
                if (!selected) return choice;
                if (choice.value === question.correctValue) {
                  return { ...choice, variant: "success" as const };
                }
                if (choice.value === selected && selected !== question.correctValue) {
                  return { ...choice, variant: "danger" as const };
                }
                return choice;
              })}
            />
          </div>
        )}

        {finished && (
          <div className="mt-4 rounded-2xl border border-cheongja-300 bg-cheongja-50 p-4 dark:border-cheongja-700 dark:bg-cheongja-900/30">
            <div className="text-sm font-semibold">Session complete: {correct}/{QUIZ_LENGTH}</div>
            <div className="mt-1 text-sm text-namsaek-700 dark:text-hanji-300">
              Restart and switch modes to practice both sound recognition and letter selection.
            </div>
            <button
              onClick={() => resetSession(mode)}
              className="mt-3 rounded-2xl bg-namsaek-500 px-4 py-2 text-xs font-semibold text-hanji-50 transition hover:bg-namsaek-600"
            >
              Start New Round
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function StatPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "danger";
}) {
  return (
    <div
      className={
        "rounded-xl border px-3 py-1 " +
        (tone === "success"
          ? "border-cheongja-300 bg-cheongja-50 text-cheongja-700 dark:border-cheongja-700 dark:bg-cheongja-900/20 dark:text-cheongja-300"
          : "border-dancheong-300 bg-dancheong-50 text-dancheong-700 dark:border-dancheong-700 dark:bg-dancheong-900/20 dark:text-dancheong-300")
      }
    >
      {label}: {value}
    </div>
  );
}



