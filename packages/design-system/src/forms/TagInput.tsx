import { useState, useRef, useCallback } from "react";
import type { KeyboardEvent } from "react";

type TagInputSize = "sm" | "md" | "lg";

type TagInputProps = {
  /** Current tags */
  value: string[];
  /** Called when tags change */
  onChange: (tags: string[]) => void;
  /** Input placeholder */
  placeholder?: string;
  /** Size variant */
  size?: TagInputSize;
  /** Prevent editing */
  disabled?: boolean;
  /** Maximum number of tags */
  max?: number;
  className?: string;
};

const sizeClasses: Record<TagInputSize, { wrapper: string; tag: string; input: string }> = {
  sm: {
    wrapper: "min-h-8 gap-1 px-2 py-1",
    tag: "px-1.5 py-1 text-xs leading-none",
    input: "text-xs leading-none",
  },
  md: {
    wrapper: "min-h-10 gap-1.5 px-2.5 py-1.5",
    tag: "px-2 py-1 text-xs leading-none",
    input: "text-sm leading-none",
  },
  lg: {
    wrapper: "min-h-12 gap-2 px-3 py-2",
    tag: "px-2.5 py-1.5 text-sm leading-none",
    input: "text-sm leading-none",
  },
};

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter",
  size = "md",
  disabled = false,
  max,
  className = "",
}: TagInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const s = sizeClasses[size];

  const addTag = useCallback(
    (raw: string) => {
      const tag = raw.trim();
      if (!tag) return;
      if (value.includes(tag)) return;
      if (max && value.length >= max) return;
      onChange([...value, tag]);
      setInput("");
    },
    [value, onChange, max],
  );

  const removeTag = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag(input);
      } else if (e.key === "Backspace" && !input && value.length > 0) {
        removeTag(value.length - 1);
      }
    },
    [input, value, addTag, removeTag],
  );

  const handleBlur = useCallback(() => {
    if (input.trim()) addTag(input);
  }, [input, addTag]);

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={
        "flex flex-wrap items-center rounded-xl border border-hanji-300 bg-white transition-colors focus-within:border-namsaek-400 focus-within:ring-2 focus-within:ring-namsaek-200 dark:border-namsaek-700 dark:bg-namsaek-900 dark:focus-within:border-namsaek-500 dark:focus-within:ring-namsaek-800 " +
        s.wrapper +
        (disabled ? " opacity-50 cursor-not-allowed" : " cursor-text") +
        (className ? " " + className : "")
      }
    >
      {value.map((tag, i) => (
        <span
          key={tag}
          className={
            "inline-flex items-center gap-1 rounded-lg bg-namsaek-100 font-medium text-namsaek-700 dark:bg-namsaek-800 dark:text-namsaek-200 " +
            s.tag
          }
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(i);
              }}
              className="inline-flex items-center justify-center rounded opacity-60 transition hover:opacity-100 cursor-pointer"
              aria-label={`Remove ${tag}`}
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </span>
      ))}
      {!disabled && !(max && value.length >= max) && (
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={value.length === 0 ? placeholder : ""}
          className={
            "min-w-[80px] flex-1 border-none bg-transparent outline-none placeholder:text-hanji-400 dark:placeholder:text-namsaek-600 " +
            s.input
          }
        />
      )}
    </div>
  );
}
