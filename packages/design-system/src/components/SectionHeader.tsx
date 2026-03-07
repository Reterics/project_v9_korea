import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
};

export function SectionHeader({ title, subtitle, right, className = "" }: SectionHeaderProps) {
  return (
    <div className={"flex items-center justify-between gap-3 " + className}>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        {subtitle && (
          <div className="text-xs text-hanji-500 dark:text-hanji-400">{subtitle}</div>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}