import type { ReactNode } from "react";

export type ToggleGroupItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
};

type SingleToggleGroupProps = {
  type?: "single";
  value?: string;
  onChange?: (value: string) => void;
};

type MultipleToggleGroupProps = {
  type: "multiple";
  value?: string[];
  onChange?: (value: string[]) => void;
};

type ToggleGroupProps = (SingleToggleGroupProps | MultipleToggleGroupProps) & {
  items: ToggleGroupItem[];
  label?: string;
  disabled?: boolean;
  className?: string;
};

export function ToggleGroup({
  items,
  label,
  disabled,
  className = "",
  ...props
}: ToggleGroupProps) {
  const isMultiple = props.type === "multiple";

  const isSelected = (id: string) =>
    isMultiple ? (props.value ?? []).includes(id) : props.value === id;

  const handleToggle = (id: string) => {
    if (isMultiple) {
      const current = props.value ?? [];
      props.onChange?.(current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
      return;
    }

    props.onChange?.(id);
  };

  return (
    <div
      role="group"
      aria-label={label}
      className={
        "inline-flex rounded-xl border border-hanji-300 bg-hanji-100 p-1 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900" +
        (className ? " " + className : "")
      }
    >
      {items.map((item) => {
        const selected = isSelected(item.id);
        const itemDisabled = disabled || item.disabled;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected}
            aria-label={item.ariaLabel ?? item.label}
            disabled={itemDisabled}
            onClick={() => handleToggle(item.id)}
            className={
              "flex min-h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-namsaek-300 disabled:cursor-not-allowed disabled:opacity-40 " +
              (selected
                ? "bg-white text-namsaek-700 shadow-sm dark:bg-namsaek-700 dark:text-hanji-50"
                : "text-namsaek-500 hover:bg-white/70 hover:text-namsaek-700 dark:text-hanji-400 dark:hover:bg-namsaek-800 dark:hover:text-hanji-100")
            }
          >
            {item.icon && <span className="flex h-4 w-4 items-center justify-center">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
