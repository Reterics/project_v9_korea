import { PageHeader, Card, MagpieTip, Badge } from "@birdie/ui";
import { BookOpen, Code, Eye, Puzzle } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Visual Testing",
    desc: "See every component variant side-by-side. Compare states, sizes, and themes without writing code.",
  },
  {
    icon: Code,
    title: "Prop Documentation",
    desc: "Auto-generated prop tables with types, defaults, and descriptions. The source of truth for component APIs.",
  },
  {
    icon: Puzzle,
    title: "Interactive Playground",
    desc: "Adjust props in real-time using controls. Experiment with combinations to find the right configuration.",
  },
  {
    icon: BookOpen,
    title: "Development Workspace",
    desc: "Build and test components in isolation. Hot-reload makes iteration fast without running the full app.",
  },
];

export function StorybookPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Storybook"
        description="The interactive component playground for developers."
      />

      <Card>
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-namsaek-50 text-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-200">
            <BookOpen className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-namsaek-700 dark:text-hanji-100">
              Launch Storybook
            </h2>
            <p className="mt-1 text-sm text-hanji-500 dark:text-hanji-400">
              Run the command below to start the development server.
            </p>
          </div>
          <code className="rounded-xl bg-namsaek-50 px-4 py-2.5 text-sm font-mono text-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200">
            npm run storybook
          </code>
          <div className="flex gap-2">
            <Badge>Port 6006</Badge>
            <Badge variant="success">Hot reload</Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, desc }) => (
          <Card key={title}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-namsaek-50 text-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-200">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            <p className="mt-3 text-sm text-hanji-500 dark:text-hanji-400">
              {desc}
            </p>
          </Card>
        ))}
      </div>

      <MagpieTip title="When to use what?">
        Use this <span className="font-semibold">documentation site</span> to
        understand <em>when</em> and <em>why</em> to use a component. Use{" "}
        <span className="font-semibold">Storybook</span> to explore{" "}
        <em>how</em> — detailed props, edge cases, and visual testing.
      </MagpieTip>
    </div>
  );
}
