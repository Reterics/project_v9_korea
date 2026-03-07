import type { HTMLAttributes } from "react";

type HelperTextProps = HTMLAttributes<HTMLParagraphElement>;

export function HelperText({ children, className = "", ...rest }: HelperTextProps) {
  return (
    <p
      className={
        "text-xs text-namsaek-400 dark:text-hanji-400" +
        (className ? " " + className : "")
      }
      {...rest}
    >
      {children}
    </p>
  );
}
