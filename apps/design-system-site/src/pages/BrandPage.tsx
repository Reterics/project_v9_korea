import {
  PageHeader,
  Card,
  BrandLogo,
  BirdIcon,
  MagpieTip,
  Badge,
  colors,
} from "@reterics/birdie-ui";
import { ShowcaseCard } from "../components/ShowcaseCard.tsx";

const colorPersonality: { name: string; key: keyof typeof colors; shade: string; role: string; hex: string }[] = [
  { name: "Namsaek", key: "namsaek", shade: "500", role: "Trust, depth, focus", hex: colors.namsaek[500] },
  { name: "Cheongja", key: "cheongja", shade: "500", role: "Growth, mastery, calm", hex: colors.cheongja[500] },
  { name: "Dancheong", key: "dancheong", shade: "500", role: "Energy, attention, urgency", hex: colors.dancheong[500] },
  { name: "Geum", key: "geum", shade: "500", role: "Achievement, warmth, reward", hex: colors.geum[500] },
  { name: "Hanji", key: "hanji", shade: "100", role: "Comfort, neutrality, paper", hex: colors.hanji[100] },
];

export function BrandPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Brand"
        description="The Birdie identity: logo, mascot, color personality, and tone."
      />

      {/* Logo */}
      <ShowcaseCard
        title="Logo Usage"
        description="The Birdie logo in primary and icon-only variants."
      >
        <div className="space-y-6">
          <div className="flex items-center gap-8">
            <div className="space-y-2 text-center">
              <BrandLogo size={36} />
              <div className="text-xs text-hanji-500 dark:text-hanji-400">Primary</div>
            </div>
            <div className="space-y-2 text-center">
              <BrandLogo variant="icon" size={36} />
              <div className="text-xs text-hanji-500 dark:text-hanji-400">Icon only</div>
            </div>
          </div>

          <Card>
            <h4 className="text-xs font-semibold text-namsaek-600 dark:text-namsaek-300">
              Guidelines
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-hanji-600 dark:text-hanji-300">
              <li>Maintain clear space around the logo equal to the icon height.</li>
              <li>Never distort, rotate, or change the logo colors.</li>
              <li>Use the dark variant on dark backgrounds automatically.</li>
            </ul>
          </Card>
        </div>
      </ShowcaseCard>

      {/* Mascot */}
      <ShowcaseCard
        title="Mascot Usage"
        description="The Birdie magpie is supportive but never dominant."
      >
        <div className="flex items-start gap-6">
          <div className="shrink-0">
            <BirdIcon size={48} />
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-cheongja-600 dark:text-cheongja-400">
                Allowed
              </h4>
              <ul className="mt-1 space-y-0.5 text-sm text-hanji-600 dark:text-hanji-300">
                <li>Hero sections and welcome screens</li>
                <li>Tips, hints, and encouragement</li>
                <li>Empty states and onboarding</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-dancheong-600 dark:text-dancheong-400">
                Avoid
              </h4>
              <ul className="mt-1 space-y-0.5 text-sm text-hanji-600 dark:text-hanji-300">
                <li>Repeated on every component</li>
                <li>Inside serious UI controls (buttons, inputs)</li>
                <li>Decorative clutter or cartoon overload</li>
              </ul>
            </div>
          </div>
        </div>
      </ShowcaseCard>

      {/* Color personality */}
      <ShowcaseCard
        title="Color Personality"
        description="Each color conveys a distinct emotional quality."
      >
        <div className="space-y-3">
          {colorPersonality.map(({ name, role, hex }) => (
            <div key={name} className="flex items-center gap-3">
              <div
                className="h-8 w-8 shrink-0 rounded-xl"
                style={{ backgroundColor: hex }}
              />
              <div>
                <div className="text-sm font-semibold">{name}</div>
                <div className="text-xs text-hanji-500 dark:text-hanji-400">
                  {role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ShowcaseCard>

      {/* Tone */}
      <ShowcaseCard
        title="Tone & Feel"
        description="How Birdie communicates."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <Badge variant="success">Do</Badge>
            <ul className="mt-2 space-y-1 text-sm text-hanji-600 dark:text-hanji-300">
              <li>Encouraging and warm</li>
              <li>Clear and concise</li>
              <li>Playful where appropriate</li>
              <li>Respectful of the learning journey</li>
            </ul>
          </Card>
          <Card>
            <Badge variant="danger">Don&apos;t</Badge>
            <ul className="mt-2 space-y-1 text-sm text-hanji-600 dark:text-hanji-300">
              <li>Condescending or childish</li>
              <li>Technical jargon to learners</li>
              <li>Harsh error messages</li>
              <li>Overuse of exclamation marks</li>
            </ul>
          </Card>
        </div>
      </ShowcaseCard>

      {/* Spacing philosophy */}
      <ShowcaseCard
        title="Spacing Philosophy"
        description="Generous whitespace creates calm."
      >
        <p className="text-sm leading-relaxed text-hanji-600 dark:text-hanji-300">
          Birdie uses generous padding and margins throughout. Content breathes.
          Cards have <code className="rounded bg-hanji-200 px-1.5 py-0.5 text-xs dark:bg-namsaek-800">p-5</code> padding,
          sections use <code className="rounded bg-hanji-200 px-1.5 py-0.5 text-xs dark:bg-namsaek-800">gap-4</code> to{" "}
          <code className="rounded bg-hanji-200 px-1.5 py-0.5 text-xs dark:bg-namsaek-800">gap-8</code>,
          and the overall layout max-width is <code className="rounded bg-hanji-200 px-1.5 py-0.5 text-xs dark:bg-namsaek-800">6xl</code>.
          This creates a focused, magazine-like reading experience.
        </p>
      </ShowcaseCard>

      <MagpieTip>
        The Birdie brand is rooted in Korean cultural aesthetics, creating a
        warm, distinctive identity that stands apart from typical language
        learning apps.
      </MagpieTip>
    </div>
  );
}
