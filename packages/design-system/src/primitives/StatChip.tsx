type StatChipProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
};

export function StatChip({ icon, label, value, className = "" }: StatChipProps) {
  return (
    <div
      className={
        "flex items-center gap-3 rounded-2xl border border-hanji-200 bg-hanji-50 px-3 py-3 dark:border-namsaek-700 dark:bg-namsaek-950/40" +
        (className ? " " + className : "")
      }
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-namsaek-800">
        {icon}
      </div>
      <div className="leading-tight">
        <div className="text-xs text-hanji-500 dark:text-hanji-400">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}