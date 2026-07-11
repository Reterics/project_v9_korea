import type { InputHTMLAttributes } from "react";

export type ColorSwatch = {
  label: string;
  value: string;
};

type ColorPickerProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> & {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  swatches?: ColorSwatch[];
  error?: string;
};

const defaultSwatches: ColorSwatch[] = [
  { label: "Ink", value: "#1B3050" },
  { label: "Paper", value: "#FDFBF8" },
  { label: "Celadon", value: "#3D8F7D" },
  { label: "Coral", value: "#C75B4A" },
  { label: "Gold", value: "#A67D30" },
  { label: "Charcoal", value: "#282420" },
  { label: "White", value: "#FFFFFF" },
  { label: "Black", value: "#000000" },
];

const hexPattern = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export function ColorPicker({
  label,
  value,
  onChange,
  swatches = defaultSwatches,
  error,
  disabled,
  className = "",
  id,
  ...rest
}: ColorPickerProps) {
  const isValidHex = hexPattern.test(value);
  const colorInputValue = isValidHex ? value.slice(0, 7) : "#000000";
  const feedback = error ?? (!isValidHex ? "Use a valid hex color, for example #2B4C7E." : undefined);

  return (
    <div className={"flex w-full flex-col gap-2" + (className ? " " + className : "")}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-namsaek-700 dark:text-hanji-200">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2" role="listbox" aria-label={label ?? "Color swatches"}>
        {swatches.map((swatch) => {
          const selected = swatch.value.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={swatch.value}
              type="button"
              role="option"
              aria-selected={selected}
              aria-label={swatch.label}
              title={swatch.label}
              disabled={disabled}
              onClick={() => onChange?.(swatch.value)}
              className={
                "h-8 w-8 rounded-lg border shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-namsaek-300 disabled:cursor-not-allowed disabled:opacity-50 " +
                (selected
                  ? "border-namsaek-500 ring-2 ring-namsaek-200 dark:border-hanji-100 dark:ring-namsaek-700"
                  : "border-hanji-300 hover:scale-105 dark:border-namsaek-700")
              }
              style={{ backgroundColor: swatch.value }}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={colorInputValue}
          disabled={disabled}
          onChange={(event) => onChange?.(event.currentTarget.value)}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-xl border border-hanji-300 bg-white p-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-namsaek-700 dark:bg-namsaek-900"
          aria-label={label ? `${label} custom color` : "Custom color"}
        />
        <input
          id={id}
          type="text"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange?.(event.currentTarget.value)}
          className={
            "w-full rounded-xl border bg-white px-3 py-2.5 font-mono text-sm shadow-sm outline-none transition dark:bg-namsaek-900 dark:text-hanji-100 " +
            (disabled
              ? "cursor-not-allowed bg-hanji-100 opacity-50 dark:bg-namsaek-800"
              : feedback
                ? "border-dancheong-400 focus:border-dancheong-500 focus:ring-2 focus:ring-dancheong-200 dark:border-dancheong-600"
                : "border-hanji-300 focus:border-namsaek-400 focus:ring-2 focus:ring-namsaek-200 dark:border-namsaek-700")
          }
          placeholder="#2B4C7E"
          {...rest}
        />
      </div>
      {feedback && (
        <p className="text-xs font-medium text-dancheong-600 dark:text-dancheong-300">{feedback}</p>
      )}
    </div>
  );
}
