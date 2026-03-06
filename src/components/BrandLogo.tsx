type BrandLogoProps = {
  variant?: "primary" | "icon";
  size?: number;
};

export function BrandLogo({ variant = "primary", size = 30 }: BrandLogoProps) {
  if (variant === "icon") {
    return (
      <img
        src="/brand/logo-icon.svg"
        alt="My Korean Birdie"
        style={{ height: size, width: "auto" }}
      />
    );
  }

  return (
    <div className="flex items-center gap-2.5">
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
