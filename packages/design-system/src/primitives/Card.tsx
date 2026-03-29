import type { HTMLAttributes, ReactNode } from "react";

/** "default" — rounded-3xl with shadow (standard cards, hub page)
 *  "section" — rounded-2xl without shadow (settings/help page inner sections) */
type CardVariant = "default" | "section";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hoverable?: boolean;
  variant?: CardVariant;
};

const variantBase: Record<CardVariant, string> = {
  default: "rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900",
  section: "rounded-2xl border border-hanji-300 bg-white p-5 dark:border-namsaek-700 dark:bg-namsaek-900",
};

export function Card({ children, hoverable, variant = "default", className = "", ...rest }: CardProps) {
  return (
    <div
      className={
        variantBase[variant] +
        (hoverable
          ? " transition hover:-translate-y-0.5 hover:border-namsaek-300 hover:shadow-md dark:hover:border-namsaek-600"
          : "") +
        (className ? " " + className : "")
      }
      {...rest}
    >
      {children}
    </div>
  );
}