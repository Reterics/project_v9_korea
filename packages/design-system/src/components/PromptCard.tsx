type PromptCardProps = {
  text: string;
  subtitle?: string;
  title?: string;
  rightSlot?: React.ReactNode;
  className?: string;
};

export function PromptCard({ text, subtitle, title, rightSlot, className = "" }: PromptCardProps) {
  return (
    <div
      className={
        "rounded-3xl border border-hanji-300 bg-hanji-50 p-5 dark:border-namsaek-700 dark:bg-namsaek-950/40 " +
        className
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {title && (
            <div className="text-xs font-semibold text-hanji-500 dark:text-hanji-400">
              {title}
            </div>
          )}
          <div className="mt-2 text-4xl font-semibold tracking-tight">{text}</div>
          {subtitle && (
            <div className="mt-2 text-sm text-namsaek-600 dark:text-hanji-300">
              {subtitle}
            </div>
          )}
        </div>
        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
    </div>
  );
}