import { useState } from "react";
import {
  Card,
  PageHeader,
  Tabs,
  Badge,
  MagpieTip,
  colors,
  fontSize,
  fontWeight,
  spacing,
  radius,
  shadows,
} from "@reterics/birdie-ui";
import { ShowcaseCard } from "../components/ShowcaseCard.tsx";

const colorFamilies: { name: string; key: keyof typeof colors; purpose: string }[] = [
  { name: "Namsaek", key: "namsaek", purpose: "Primary actions & indigo identity" },
  { name: "Cheongja", key: "cheongja", purpose: "Success, mastery & positive states" },
  { name: "Dancheong", key: "dancheong", purpose: "Errors, warnings & destructive actions" },
  { name: "Geum", key: "geum", purpose: "XP, streaks, coins & rewards" },
  { name: "Hanji", key: "hanji", purpose: "Backgrounds, borders & neutrals" },
];

const tabs = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "radius", label: "Radius" },
  { id: "shadows", label: "Shadows" },
  { id: "darkmode", label: "Dark Mode" },
];

function ColorsSection() {
  return (
    <div className="space-y-6">
      {colorFamilies.map(({ name, key, purpose }) => (
        <ShowcaseCard key={key} title={name} description={purpose}>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(colors[key]) as [string, string][]).map(
              ([shade, hex]) => (
                <div key={shade} className="text-center">
                  <div
                    className="h-12 w-12 rounded-xl border border-hanji-200 dark:border-namsaek-700"
                    style={{ backgroundColor: hex }}
                  />
                  <div className="mt-1 text-[10px] font-medium text-hanji-500 dark:text-hanji-400">
                    {shade}
                  </div>
                </div>
              ),
            )}
          </div>
        </ShowcaseCard>
      ))}
    </div>
  );
}

function TypographySection() {
  return (
    <div className="space-y-6">
      <ShowcaseCard
        title="Font Family"
        description='Inter + Pretendard for Korean glyphs'
      >
        <p
          className="text-lg"
          style={{ fontFamily: '"Inter", "Pretendard", system-ui, sans-serif' }}
        >
          The quick brown fox jumps over the lazy dog.
          <br />
          <span className="text-namsaek-500">
            안녕하세요 — Hello in Korean
          </span>
        </p>
      </ShowcaseCard>

      <ShowcaseCard title="Font Sizes" description="Consistent type scale">
        <div className="space-y-3">
          {(Object.entries(fontSize) as [string, string][]).map(
            ([name, size]) => (
              <div key={name} className="flex items-baseline gap-4">
                <Badge>{name}</Badge>
                <span style={{ fontSize: size }}>
                  Design System ({size})
                </span>
              </div>
            ),
          )}
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Font Weights">
        <div className="flex flex-wrap gap-6">
          {(Object.entries(fontWeight) as [string, number][]).map(
            ([name, weight]) => (
              <span key={name} style={{ fontWeight: weight }} className="text-lg">
                {name} ({weight})
              </span>
            ),
          )}
        </div>
      </ShowcaseCard>
    </div>
  );
}

function SpacingSection() {
  return (
    <ShowcaseCard
      title="Spacing Scale"
      description="Consistent spacing creates visual rhythm."
    >
      <div className="space-y-2">
        {(Object.entries(spacing) as [string, string][]).map(
          ([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-10 text-right text-xs font-mono text-hanji-500 dark:text-hanji-400">
                {key}
              </span>
              <div
                className="h-4 rounded bg-namsaek-400 dark:bg-namsaek-500"
                style={{ width: value }}
              />
              <span className="text-xs text-hanji-500 dark:text-hanji-400">
                {value}
              </span>
            </div>
          ),
        )}
      </div>
    </ShowcaseCard>
  );
}

function RadiusSection() {
  return (
    <ShowcaseCard
      title="Border Radius"
      description="Rounded corners create warmth and approachability."
    >
      <div className="flex flex-wrap gap-4">
        {(Object.entries(radius) as [string, string][]).map(
          ([name, value]) => (
            <div key={name} className="text-center">
              <div
                className="h-16 w-16 border-2 border-namsaek-400 bg-namsaek-50 dark:border-namsaek-500 dark:bg-namsaek-800"
                style={{ borderRadius: value }}
              />
              <div className="mt-2 text-xs font-semibold">{name}</div>
              <div className="text-[10px] text-hanji-500 dark:text-hanji-400">
                {value}
              </div>
            </div>
          ),
        )}
      </div>
    </ShowcaseCard>
  );
}

function ShadowsSection() {
  return (
    <ShowcaseCard
      title="Shadows"
      description="Subtle elevation creates depth without heaviness."
    >
      <div className="flex flex-wrap gap-6">
        {(Object.entries(shadows) as [string, string][]).map(
          ([name, value]) => (
            <div key={name} className="text-center">
              <div
                className="h-20 w-20 rounded-2xl bg-white dark:bg-namsaek-800"
                style={{ boxShadow: value }}
              />
              <div className="mt-2 text-xs font-semibold">{name}</div>
            </div>
          ),
        )}
      </div>
    </ShowcaseCard>
  );
}

function DarkModeSection() {
  return (
    <div className="space-y-6">
      <ShowcaseCard
        title="Dark Mode Strategy"
        description="Class-based dark mode with smooth transitions."
      >
        <div className="space-y-3 text-sm text-hanji-600 dark:text-hanji-300">
          <p>
            Dark mode uses the <code className="rounded bg-hanji-200 px-1.5 py-0.5 text-xs dark:bg-namsaek-800">.dark</code> class
            on the <code className="rounded bg-hanji-200 px-1.5 py-0.5 text-xs dark:bg-namsaek-800">&lt;html&gt;</code> element.
            All components respond via Tailwind's <code className="rounded bg-hanji-200 px-1.5 py-0.5 text-xs dark:bg-namsaek-800">dark:</code> variant.
          </p>
          <p>
            Toggle the sun/moon icon in the header to see dark mode in action across this entire site.
          </p>
        </div>
      </ShowcaseCard>

      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-hanji-50 p-4">
            <div className="text-xs font-semibold text-namsaek-600">Light mode</div>
            <div className="mt-2 text-sm text-namsaek-700">
              Warm hanji paper backgrounds, deep namsaek text.
            </div>
          </div>
          <div className="rounded-2xl bg-namsaek-900 p-4">
            <div className="text-xs font-semibold text-namsaek-300">Dark mode</div>
            <div className="mt-2 text-sm text-hanji-200">
              Deep indigo backgrounds, soft hanji text.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function FoundationsPage() {
  const [activeTab, setActiveTab] = useState("colors");

  const content: Record<string, React.ReactNode> = {
    colors: <ColorsSection />,
    typography: <TypographySection />,
    spacing: <SpacingSection />,
    radius: <RadiusSection />,
    shadows: <ShadowsSection />,
    darkmode: <DarkModeSection />,
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Foundations"
        description="The visual language behind every Birdie component."
      />
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      <div>{content[activeTab]}</div>

      <MagpieTip>
        Tokens are exported as JavaScript objects from{" "}
        <code className="rounded bg-namsaek-100 px-1 text-xs dark:bg-namsaek-800">
          @reterics/birdie-ui
        </code>{" "}
        and as CSS custom properties via the theme stylesheet.
      </MagpieTip>
    </div>
  );
}
