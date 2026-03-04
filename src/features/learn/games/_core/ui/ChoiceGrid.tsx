type Choice = {
  label: string;
  value: string;
  variant?: "default" | "success" | "danger";
};

type ChoiceGridProps = {
  choices: Choice[];
  onSelect: (value: string) => void;
  disabled?: boolean;
};

const variantStyles: Record<string, string> = {
  default:
    "border-zinc-200 bg-white hover:-translate-y-0.5 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700",
  success:
    "border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900",
  danger:
    "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800",
};

export function ChoiceGrid({ choices, onSelect, disabled }: ChoiceGridProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      {choices.map((choice, i) => {
        const key = i + 1;
        return (
          <button
            key={choice.value}
            onClick={() => onSelect(choice.value)}
            disabled={disabled}
            className={
              "group relative rounded-3xl border p-4 text-left shadow-sm transition " +
              variantStyles[choice.variant ?? "default"] +
              (disabled ? " opacity-60 cursor-not-allowed" : " cursor-pointer")
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-2xl font-semibold tracking-tight">
                {choice.label}
              </div>
              <div className="rounded-2xl bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                {key}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
