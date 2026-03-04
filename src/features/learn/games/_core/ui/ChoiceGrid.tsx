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
  default: "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-800",
  success: "bg-green-50 border-green-400 text-green-700",
  danger: "bg-red-50 border-red-400 text-red-700",
};

export function ChoiceGrid({ choices, onSelect, disabled }: ChoiceGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
      {choices.map((choice) => (
        <button
          key={choice.value}
          onClick={() => onSelect(choice.value)}
          disabled={disabled}
          className={`rounded-xl border-2 px-4 py-3 font-medium transition-colors ${
            variantStyles[choice.variant ?? "default"]
          } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}
