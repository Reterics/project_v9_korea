import type { ButtonHTMLAttributes } from "react";

type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
};

export function Switch({
  checked = false,
  onChange,
  label,
  disabled,
  className = "",
  ...rest
}: SwitchProps) {
  return (
    <label
      className={
        "inline-flex items-center gap-2 text-sm" +
        (disabled ? " opacity-50 cursor-not-allowed" : " cursor-pointer") +
        (className ? " " + className : "")
      }
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={
          "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition " +
          (checked
            ? "bg-namsaek-500 dark:bg-namsaek-400"
            : "bg-hanji-300 dark:bg-namsaek-700") +
          (disabled ? " cursor-not-allowed" : " cursor-pointer")
        }
        {...rest}
      >
        <span
          className={
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition " +
            (checked ? "translate-x-5" : "translate-x-0")
          }
        />
      </button>
      {label && (
        <span className="text-namsaek-700 dark:text-hanji-200">{label}</span>
      )}
    </label>
  );
}
