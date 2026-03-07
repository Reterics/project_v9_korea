import type { HTMLAttributes } from "react";

type FieldErrorProps = HTMLAttributes<HTMLParagraphElement>;

export function FieldError({ children, className = "", ...rest }: FieldErrorProps) {
  if (!children) return null;

  return (
    <p
      role="alert"
      className={
        "text-xs font-medium text-dancheong-600 dark:text-dancheong-400" +
        (className ? " " + className : "")
      }
      {...rest}
    >
      {children}
    </p>
  );
}
