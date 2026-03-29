import { Keyboard, Brain, Flame, MessageCircle } from "lucide-react";
import { Card, CardHeader, Kbd, PageHeader } from "@reterics/birdie-ui";

export function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Help & Support" />
      <KeyboardShortcutsSection />
      <HowItWorksSection />
      <FeedbackSection />
    </div>
  );
}

function KeyboardShortcutsSection() {
  const shortcuts = [
    { keys: "1 – 4", description: "Select answer choice" },
    { keys: "Space", description: "Continue / next question" },
    { keys: "H", description: "Show hint" },
    { keys: "S", description: "Skip question" },
    { keys: "R", description: "Replay audio" },
    { keys: "Esc", description: "Exit game" },
  ];

  return (
    <Card variant="section">
      <CardHeader icon={<Keyboard className="h-5 w-5" />} title="Keyboard Shortcuts" />
      <div className="grid gap-2">
        {shortcuts.map(({ keys, description }) => (
          <div key={keys} className="flex items-center justify-between text-sm">
            <span className="text-hanji-600 dark:text-hanji-400">{description}</span>
            <Kbd>{keys}</Kbd>
          </div>
        ))}
      </div>
    </Card>
  );
}

function HowItWorksSection() {
  return (
    <Card variant="section">
      <CardHeader icon={<Brain className="h-5 w-5" />} title="How It Works" />
      <div className="space-y-4 text-sm text-hanji-700 dark:text-hanji-300">
        <div>
          <h3 className="mb-1 font-semibold text-namsaek-800 dark:text-hanji-100">
            Spaced Repetition (SRS)
          </h3>
          <p>
            Words you get right are shown less often. Words you struggle with
            come back sooner. This is based on the SM-2 algorithm — the same
            system used by Anki and other proven flashcard apps.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Flame className="mt-0.5 h-4 w-4 shrink-0 text-geum-500" />
          <div>
            <h3 className="mb-1 font-semibold text-namsaek-800 dark:text-hanji-100">
              XP &amp; Streaks
            </h3>
            <p>
              Earn XP by completing games. Every 100 XP earns a level up.
              Practice daily to keep your streak going — a longer streak means
              more bonus coins.
            </p>
          </div>
        </div>
        <div>
          <h3 className="mb-1 font-semibold text-namsaek-800 dark:text-hanji-100">
            Mastery Scores
          </h3>
          <p>
            Each word has a mastery score from 0 to 1. Getting a question right
            raises the score; getting it wrong lowers it. A score above 0.8 is
            considered "mastered".
          </p>
        </div>
      </div>
    </Card>
  );
}

function FeedbackSection() {
  return (
    <Card variant="section">
      <CardHeader icon={<MessageCircle className="h-5 w-5" />} title="Feedback" />
      <p className="text-sm text-hanji-600 dark:text-hanji-400">
        Found a bug or have a suggestion? Open an issue on{" "}
        <a
          href="https://github.com/Reterics/project_v9_korea/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-namsaek-600 underline hover:text-namsaek-700 dark:text-namsaek-400 dark:hover:text-namsaek-300"
        >
          GitHub
        </a>
        .
      </p>
    </Card>
  );
}
