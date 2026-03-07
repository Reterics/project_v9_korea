type BrandLogoProps = {
  variant?: "primary" | "icon";
  size?: number;
  className?: string;
};

export function BrandLogo({ variant = "primary", size = 30, className = "" }: BrandLogoProps) {
  const textSize = Math.max(12, Math.round(size * 0.47));
  const gap = Math.max(6, Math.round(size * 0.33));
  const brandLogoSrc = "/brand/logo-primary.svg";

  if (variant === "icon") {
    return (
      <img
        src={brandLogoSrc}
        alt="My Korean Birdie"
        style={{ height: size, width: "auto" }}
        className={className}
      />
    );
  }

  return (
    <div className={"flex items-center " + className} style={{ gap }}>
      <img
        src={brandLogoSrc}
        alt="My Korean Birdie"
        style={{ height: size, width: "auto" }}
      />
      <span
        className="font-semibold text-namsaek-900 dark:text-hanji-100"
        style={{ fontSize: textSize, lineHeight: 1.2 }}
      >
        My Korean Birdie
      </span>
    </div>
  );
}
