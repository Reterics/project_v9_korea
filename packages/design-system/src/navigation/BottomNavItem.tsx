import type { HTMLAttributes, ReactNode } from "react";

type BottomNavItemProps = HTMLAttributes<HTMLElement> & {
  icon: ReactNode;
  label: string;
  active?: boolean;
};

export function BottomNavItem({
  icon,
  label,
  active,
  className = "",
  ...rest
}: BottomNavItemProps) {
  return (
    <div
      className={
        "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium outline-none transition cursor-pointer select-none " +
        (active
          ? "text-namsaek-600 dark:text-namsaek-300"
          : "text-hanji-500 hover:text-namsaek-500 dark:text-hanji-500 dark:hover:text-hanji-300") +
        (className ? " " + className : "")
      }
      {...rest}
    >
      <span className={"inline-flex h-5 w-5 items-center justify-center " + (active ? "[&>*]:stroke-[2.5]" : "[&>*]:stroke-[1.5]")}>
        {icon}
      </span>
      {label}
    </div>
  );
}
