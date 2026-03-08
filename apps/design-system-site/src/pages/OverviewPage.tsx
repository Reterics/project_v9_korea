import { Link } from "react-router-dom";
import {
  BirdIcon,
  Card,
  Badge,
  Button,
  MagpieTip,
  PageHeader,
} from "@birdie/ui";
import {
  Palette,
  LayoutGrid,
  Layers,
  Stamp,
  BookOpen,
  Compass,
} from "lucide-react";

const sections = [
  {
    to: "/principles",
    icon: Compass,
    title: "Principles",
    desc: "The values driving every design decision.",
  },
  {
    to: "/foundations",
    icon: Palette,
    title: "Foundations",
    desc: "Colors, typography, spacing, and visual tokens.",
  },
  {
    to: "/components",
    icon: LayoutGrid,
    title: "Components",
    desc: "Reusable UI building blocks.",
  },
  {
    to: "/patterns",
    icon: Layers,
    title: "Patterns",
    desc: "Real product screen compositions.",
  },
  {
    to: "/brand",
    icon: Stamp,
    title: "Brand",
    desc: "Logo, mascot, color personality, and tone.",
  },
  {
    to: "/storybook",
    icon: BookOpen,
    title: "Storybook",
    desc: "Interactive component playground.",
  },
];

export function OverviewPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-namsaek-50 to-hanji-100 px-6 py-14 text-center dark:from-namsaek-900 dark:to-namsaek-950">
        <BirdIcon size={56} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-namsaek-700 dark:text-hanji-100">
            Birdie Design System
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-namsaek-500 dark:text-hanji-300">
            A calm, modern design system inspired by traditional Korean
            aesthetics. Built for learning experiences that feel premium and
            focused.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default">v0.1.0</Badge>
          <Badge variant="success">Stable</Badge>
        </div>
      </div>

      <PageHeader
        title="Explore the system"
        description="Everything you need to build consistent Birdie experiences."
      />

      {/* Section cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to} className="group">
            <Card hoverable className="h-full">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-namsaek-50 text-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold">{title}</h3>
              </div>
              <p className="mt-3 text-sm text-hanji-500 dark:text-hanji-400">
                {desc}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick preview */}
      <div className="space-y-4">
        <PageHeader title="Quick preview" />
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="warning">Warning</Badge>
        </div>
      </div>

      <MagpieTip>
        This documentation site is built entirely with{" "}
        <span className="font-semibold">@birdie/ui</span> components,
        demonstrating the design system in action.
      </MagpieTip>
    </div>
  );
}
