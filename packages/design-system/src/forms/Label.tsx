import type { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export function Label({ children, required, className = "", ...rest }: LabelProps) {
  return (
    <label
      className={
        "block text-sm font-semibold text-namsaek-700 dark:text-hanji-200" +
        (className ? " " + className : "")
      }
      {...rest}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-dancheong-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
