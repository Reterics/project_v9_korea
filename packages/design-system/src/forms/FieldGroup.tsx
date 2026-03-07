import type { HTMLAttributes, ReactNode } from "react";

type FieldGroupProps = HTMLAttributes<HTMLFieldSetElement> & {
  legend?: string;
  children: ReactNode;
};

export function FieldGroup({ legend, children, className = "", ...rest }: FieldGroupProps) {
  return (
    <fieldset
      className={
        "flex flex-col gap-4 rounded-2xl border border-hanji-300 p-4 dark:border-namsaek-700" +
        (className ? " " + className : "")
      }
      {...rest}
    >
      {legend && (
        <legend className="px-2 text-sm font-semibold text-namsaek-700 dark:text-hanji-200">
          {legend}
        </legend>
      )}
      {children}
    </fieldset>
  );
}
