import type { ReactNode } from "react";

type IconSize = "sm" | "md" | "lg";

type IconProps = {
  children: ReactNode;
  size?: IconSize;
  className?: string;
};

const sizeClasses: Record<IconSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-9 w-9",
};

export function Icon({ children, size = "md", className = "" }: IconProps) {
  return (
    <span className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}