import { useState, useRef, useEffect, useMemo } from "react";

type MultiSelectOption = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
};

const inputBase =
  "w-full min-h-[2.75rem] rounded-xl border bg-white px-2 py-1.5 text-sm shadow-sm outline-none transition cursor-text " +
  "dark:bg-namsaek-900 dark:text-hanji-100";

const stateClasses = {
  default:
    "border-hanji-300 focus-within:border-namsaek-400 focus-within:ring-2 focus-within:ring-namsaek-200 " +
    "dark:border-namsaek-700 dark:focus-within:border-namsaek-500 dark:focus-within:ring-namsaek-800",
  error:
    "border-dancheong-400 focus-within:border-dancheong-500 focus-within:ring-2 focus-within:ring-dancheong-200 " +
    "dark:border-dancheong-600 dark:focus-within:border-dancheong-500 dark:focus-within:ring-dancheong-900",
  disabled: "opacity-50 cursor-not-allowed bg-hanji-100 dark:bg-namsaek-800",
};

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  error,
  disabled,
  className = "",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => new Set(value),
    [value],
  );

  const filtered = useMemo(
    () =>
      options.filter(
        (o) =>
          !selected.has(o.value) &&
          (query.trim() === "" || o.label.toLowerCase().includes(query.toLowerCase())),
      ),
    [options, selected, query],
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
  }, [query]);

  const add = (val: string) => {
    onChange?.([...value, val]);
    setQuery("");
    inputRef.current?.focus();
  };

  const remove = (val: string) => {
    onChange?.(value.filter((v) => v !== val));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && query === "" && value.length > 0) {
      remove(value[value.length - 1]);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((i) => (i <= 0 ? filtered.length - 1 : i - 1));
    } else if (e.key === "Enter" && highlightIdx >= 0 && filtered[highlightIdx]) {
      e.preventDefault();
      add(filtered[highlightIdx].value);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const selectedOptions = value
    .map((v) => options.find((o) => o.value === v))
    .filter(Boolean) as MultiSelectOption[];

  return (
    <div ref={ref} className={"relative" + (className ? " " + className : "")}>
      <div
        className={
          inputBase +
          " flex flex-wrap items-center gap-1 " +
          (disabled
            ? stateClasses.disabled
            : error
              ? stateClasses.error
              : stateClasses.default)
        }
        onClick={() => {
          if (!disabled) {
            inputRef.current?.focus();
            setOpen(true);
          }
        }}
      >
        {selectedOptions.map((opt) => (
          <span
            key={opt.value}
            className="inline-flex items-center gap-1 rounded-lg bg-namsaek-100 px-2 py-0.5 text-xs font-semibold text-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200"
          >
            {opt.label}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(opt.value);
                }}
                className="ml-0.5 text-namsaek-400 hover:text-dancheong-500 dark:text-hanji-400 dark:hover:text-dancheong-400"
                aria-label={`Remove ${opt.label}`}
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            )}
          </span>
        ))}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-[4rem] flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-hanji-400 dark:placeholder:text-namsaek-400"
        />
      </div>

      {open && filtered.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-hanji-300 bg-white py-1 shadow-lg dark:border-namsaek-700 dark:bg-namsaek-900"
        >
          {filtered.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={i === highlightIdx}
              onMouseDown={() => add(opt.value)}
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

      {open && filtered.length === 0 && query.trim() && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-hanji-300 bg-white px-3 py-3 text-sm text-namsaek-400 shadow-lg dark:border-namsaek-700 dark:bg-namsaek-900 dark:text-hanji-400">
          No results found
        </div>
      )}
    </div>
  );
}
