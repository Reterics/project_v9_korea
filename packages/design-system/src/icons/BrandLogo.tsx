type BrandLogoProps = {
  variant?: "primary" | "icon";
  size?: number;
  className?: string;
};

export function BrandLogo({ variant = "primary", size = 30, className = "" }: BrandLogoProps) {
  if (variant === "icon") {
    return (
      <img
        src="/brand/logo-icon.svg"
        alt="My Korean Birdie"
        style={{ height: size, width: "auto" }}
        className={className}
      />
    );
  }

  return (
    <div className={"flex items-center gap-2.5 " + className}>
      <img
        src="/brand/logo-primary.svg"
        alt="My Korean Birdie"
        style={{ height: size, width: "auto" }}
      />
      <span className="text-sm font-semibold text-namsaek-900 dark:text-hanji-100">
        My Korean Birdie
      </span>
    </div>
  );
}