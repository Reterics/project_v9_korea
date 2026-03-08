import { PageHeader, Card, Badge, MagpieTip } from "@birdie/ui";
import { Package, FileCode, Palette, Terminal } from "lucide-react";

const resources = [
  {
    icon: Package,
    title: "Install the package",
    content: (
      <code className="block rounded-xl bg-namsaek-50 px-4 py-2.5 text-sm font-mono text-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200">
        {'"@birdie/ui": "*"'}
      </code>
    ),
    desc: "Add to your package.json dependencies. The monorepo workspace resolves it automatically.",
  },
  {
    icon: FileCode,
    title: "Import the theme",
    content: (
      <code className="block rounded-xl bg-namsaek-50 px-4 py-2.5 text-sm font-mono text-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200">
        {'@import "tailwindcss";'}<br />
        {'@import "@birdie/ui/theme";'}
      </code>
    ),
    desc: "In your main CSS file, import Tailwind and the Birdie theme. This provides all color tokens and Tailwind source scanning.",
  },
  {
    icon: Palette,
    title: "Use components",
    content: (
      <code className="block rounded-xl bg-namsaek-50 px-4 py-2.5 text-sm font-mono text-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200">
        {'import { Button, Card } from "@birdie/ui";'}
      </code>
    ),
    desc: "Import any component directly from the package.",
  },
  {
    icon: Terminal,
    title: "Build before dev",
    content: (
      <code className="block rounded-xl bg-namsaek-50 px-4 py-2.5 text-sm font-mono text-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200">
        npm run build -w packages/design-system
      </code>
    ),
    desc: "The design system must be built before consumer apps can use it. Run this after changes to @birdie/ui.",
  },
];

export function ResourcesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Resources"
        description="Getting started with the Birdie Design System."
      />

      <div className="space-y-4">
        {resources.map(({ icon: Icon, title, content, desc }) => (
          <Card key={title}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-namsaek-50 text-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-200">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            <div className="mt-3">{content}</div>
            <p className="mt-2 text-sm text-hanji-500 dark:text-hanji-400">
              {desc}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-sm font-semibold">Project Structure</h3>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-namsaek-50 p-4 text-xs font-mono text-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200">
{`project_v9_korea/
├── apps/
│   ├── web/                 # Main learning app
│   └── design-system-site/  # This documentation site
└── packages/
    └── design-system/       # @birdie/ui package
        ├── src/
        │   ├── tokens/      # colors, typography, spacing...
        │   ├── primitives/  # Button, Card, Badge...
        │   ├── forms/       # Input, Select, Switch...
        │   ├── components/  # LessonCard, MagpieTip...
        │   ├── navigation/  # Sidebar, Topbar, BottomNav...
        │   ├── patterns/    # DashboardLayout, GameLayout...
        │   ├── icons/       # BirdIcon, BrandLogo...
        │   └── styles/      # theme.css
        └── dist/            # Built output`}
        </pre>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold">Key exports</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Button", "Card", "Badge", "Input", "Select", "Switch",
            "Tabs", "LessonCard", "ActivityCard", "ProgressCard",
            "MagpieTip", "BrandLogo", "GameLayout", "DashboardLayout",
          ].map((name) => (
            <Badge key={name}>{name}</Badge>
          ))}
        </div>
      </Card>

      <MagpieTip>
        Check the{" "}
        <code className="rounded bg-namsaek-100 px-1 text-xs dark:bg-namsaek-800">
          packages/design-system/src/index.ts
        </code>{" "}
        file for the full list of exports.
      </MagpieTip>
    </div>
  );
}
