import { Card, PageHeader, MagpieTip } from "@reterics/birdie-ui";
import { Heart, Eye, Zap, Accessibility, Smartphone } from "lucide-react";

const principles = [
  {
    icon: Heart,
    title: "Calm & Supportive",
    desc: "Learning can be stressful. Our UI creates a calm, encouraging environment. Warm colors, generous spacing, and gentle feedback help learners stay motivated without feeling overwhelmed.",
  },
  {
    icon: Eye,
    title: "Clarity First",
    desc: "Every element serves a purpose. We avoid decorative clutter in favor of clear hierarchy and readable typography. Information is easy to scan and act on.",
  },
  {
    icon: Zap,
    title: "Responsive & Fluid",
    desc: "Interactions feel immediate and natural. Animations are purposeful and brief. The interface responds to input instantly, maintaining user confidence.",
  },
  {
    icon: Accessibility,
    title: "Accessible",
    desc: "All components support keyboard navigation, screen readers, and sufficient color contrast. Dark mode is a first-class citizen, not an afterthought.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    desc: "Designed for phones first, then enhanced for larger screens. Touch targets are generous, content is prioritized, and layouts adapt gracefully.",
  },
];

export function PrinciplesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Design Principles"
        description="The values that guide every design decision in the Birdie system."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {principles.map(({ icon: Icon, title, desc }) => (
          <Card key={title}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-namsaek-50 text-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-200">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-hanji-600 dark:text-hanji-300">
              {desc}
            </p>
          </Card>
        ))}
      </div>

      <MagpieTip title="Cultural Roots">
        The &quot;Korean Notebook&quot; theme draws from traditional Korean
        aesthetics: namsaek indigo, celadon ceramics, dancheong temple patterns,
        and hanji paper. These cultural references create a distinctive, warm
        identity that feels both authentic and modern.
      </MagpieTip>
    </div>
  );
}
