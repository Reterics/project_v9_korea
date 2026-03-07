import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hoverable?: boolean;
};

export function Card({ children, hoverable, className = "", ...rest }: CardProps) {
  return (
    <div
      className={
        "rounded-3xl border border-hanji-300 bg-white p-5 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900" +
        (hoverable
          ? " transition hover:-translate-y-0.5 hover:border-namsaek-300 hover:shadow-md dark:hover:border-namsaek-600"
          : "") +
        (className ? " " + className : "")
      }
      {...rest}
    >
      {children}
    </div>
  );
}