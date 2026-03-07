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
    "border-hanji-300 bg-white hover:-translate-y-0.5 hover:border-namsaek-300 hover:shadow-md dark:border-namsaek-700 dark:bg-namsaek-900 dark:hover:border-namsaek-600",
  success:
    "border-cheongja-400 bg-cheongja-50 text-cheongja-700 dark:border-cheongja-500 dark:bg-cheongja-900/30 dark:text-cheongja-300",
  danger:
    "border-dancheong-300 bg-dancheong-50 text-dancheong-700 dark:border-dancheong-600 dark:bg-dancheong-900/30 dark:text-dancheong-300",
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
              <div className="rounded-2xl bg-hanji-100 px-2 py-1 text-xs font-semibold text-namsaek-600 dark:bg-namsaek-800 dark:text-hanji-300">
                {key}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}