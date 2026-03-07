import { useState, useRef, useEffect, useMemo } from "react";
import type { InputHTMLAttributes } from "react";

type AutocompleteOption = {
  label: string;
  value: string;
};

type AutocompleteProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: AutocompleteOption) => void;
  error?: boolean;
};

const inputBase =
  "w-full rounded-xl border bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition " +
  "placeholder:text-hanji-400 " +
  "dark:bg-namsaek-900 dark:text-hanji-100 dark:placeholder:text-namsaek-400";

const stateClasses = {
  default:
    "border-hanji-300 focus:border-namsaek-400 focus:ring-2 focus:ring-namsaek-200 " +
    "dark:border-namsaek-700 dark:focus:border-namsaek-500 dark:focus:ring-namsaek-800",
  error:
    "border-dancheong-400 focus:border-dancheong-500 focus:ring-2 focus:ring-dancheong-200 " +
    "dark:border-dancheong-600 dark:focus:border-dancheong-500 dark:focus:ring-dancheong-900",
  disabled: "opacity-50 cursor-not-allowed bg-hanji-100 dark:bg-namsaek-800",
};

export function Autocomplete({
  options,
  value = "",
  onChange,
  onSelect,
  error,
  disabled,
  placeholder,
  className = "",
  ...rest
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(
    () =>
      value.trim()
        ? options.filter((o) => o.label.toLowerCase().includes(value.toLowerCase()))
        : options,
    [options, value],
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setHighlightIdx(-1);
  }, [value]);

  const pick = (opt: AutocompleteOption) => {
    onChange?.(opt.label);
    onSelect?.(opt);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((i) => (i <= 0 ? filtered.length - 1 : i - 1));
    } else if (e.key === "Enter" && highlightIdx >= 0 && filtered[highlightIdx]) {
      e.preventDefault();
      pick(filtered[highlightIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className={"relative" + (className ? " " + className : "")}>
      <input
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className={
          inputBase +
          " " +
          (disabled
            ? stateClasses.disabled
            : error
              ? stateClasses.error
              : stateClasses.default)
        }
        {...rest}
      />

      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-hanji-300 bg-white py-1 shadow-lg dark:border-namsaek-700 dark:bg-namsaek-900"
        >
          {filtered.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={i === highlightIdx}
              onMouseDown={() => pick(opt)}
              onMouseEnter={() => setHighlightIdx(i)}
              className={
                "cursor-pointer px-3 py-2 text-sm transition " +
                (i === highlightIdx
                  ? "bg-namsaek-100 text-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-100"
                  : "text-namsaek-600 dark:text-hanji-300")
              }
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {open && filtered.length === 0 && value.trim() && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-hanji-300 bg-white px-3 py-3 text-sm text-namsaek-400 shadow-lg dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-400">
          No results found
        </div>
      )}
    </div>
  );
}
