import { useState, useRef, useEffect } from "react";
import type { InputHTMLAttributes } from "react";

type DatePickerProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> & {
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
};

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday-based
}

const inputBase =
  "w-full rounded-xl border bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition cursor-pointer " +
  "dark:bg-namsaek-900 dark:text-hanji-100";

const stateClasses = {
  default:
    "border-hanji-300 focus:border-namsaek-400 focus:ring-2 focus:ring-namsaek-200 " +
    "dark:border-namsaek-700 dark:focus:border-namsaek-500 dark:focus:ring-namsaek-800",
  error:
    "border-dancheong-400 focus:border-dancheong-500 focus:ring-2 focus:ring-dancheong-200 " +
    "dark:border-dancheong-600 dark:focus:border-dancheong-500 dark:focus:ring-dancheong-900",
  disabled: "opacity-50 cursor-not-allowed bg-hanji-100 dark:bg-namsaek-800",
};

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDate(s: string): Date | null {
  const d = new Date(s + "T00:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

export function DatePicker({
  value,
  onChange,
  error,
  disabled,
  placeholder = "Select date...",
  className = "",
  ...rest
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = value ? parseDate(value) : null;
  const today = new Date();
  const [viewYear, setViewYear] = useState(parsed?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? today.getMonth());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const selectDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    onChange?.(formatDate(d));
    setOpen(false);
  };

  const displayValue = parsed
    ? parsed.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "";

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div ref={ref} className={"relative" + (className ? " " + className : "")}>
      <div className="relative">
        <input
          readOnly
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          className={
            inputBase +
            " pr-9 " +
            (disabled
              ? stateClasses.disabled
              : error
                ? stateClasses.error
                : stateClasses.default)
          }
          {...rest}
        />
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-namsaek-400 dark:text-hanji-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-72 rounded-2xl border border-hanji-300 bg-white p-3 shadow-lg dark:border-namsaek-700 dark:bg-namsaek-900">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-lg p-1 text-namsaek-500 hover:bg-hanji-100 dark:hover:bg-namsaek-800"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <span className="text-sm font-semibold text-namsaek-700 dark:text-hanji-100">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-lg p-1 text-namsaek-500 hover:bg-hanji-100 dark:hover:bg-namsaek-800"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
            {DAYS.map((d) => (
              <div key={d} className="py-1 font-semibold text-namsaek-400 dark:text-hanji-400">
                {d}
              </div>
            ))}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const isSelected =
                parsed?.getFullYear() === viewYear &&
                parsed?.getMonth() === viewMonth &&
                parsed?.getDate() === day;
              const isToday =
                today.getFullYear() === viewYear &&
                today.getMonth() === viewMonth &&
                today.getDate() === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={
                    "rounded-lg py-1.5 text-sm transition " +
                    (isSelected
                      ? "bg-namsaek-500 font-semibold text-white"
                      : isToday
                        ? "bg-namsaek-100 font-medium text-namsaek-700 dark:bg-namsaek-800 dark:text-hanji-200"
                        : "text-namsaek-700 hover:bg-hanji-100 dark:text-hanji-200 dark:hover:bg-namsaek-800")
                  }
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
