import type { InputHTMLAttributes } from "react";

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

export function Radio({ label, disabled, className = "", id, ...rest }: RadioProps) {
  return (
    <label
      className={
        "inline-flex items-center gap-2 text-sm" +
        (disabled ? " opacity-50 cursor-not-allowed" : " cursor-pointer") +
        (className ? " " + className : "")
      }
    >
      <input
        type="radio"
        id={id}
        disabled={disabled}
        className={
          "h-4 w-4 border-hanji-300 text-namsaek-500 " +
          "focus:ring-2 focus:ring-namsaek-200 focus:ring-offset-0 " +
          "dark:border-namsaek-700 dark:bg-namsaek-900 dark:checked:bg-namsaek-500 dark:focus:ring-namsaek-800" +
          (disabled ? " cursor-not-allowed" : " cursor-pointer")
        }
        {...rest}
      />
      {label && (
        <span className="text-namsaek-700 dark:text-hanji-200">{label}</span>
      )}
    </label>
  );
}
