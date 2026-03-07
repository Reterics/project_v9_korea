import lightLogoSrc from "@birdie/ui/assets/brand/logo-primary.svg";
import darkLogoSrc from "@birdie/ui/assets/brand/logo-primary-dark.svg";

type BrandLogoProps = {
  variant?: "primary" | "icon";
  size?: number;
  className?: string;
};

export function BrandLogo({ variant = "primary", size = 30, className = "" }: BrandLogoProps) {
  const textSize = Math.max(12, Math.round(size * 0.47));
  const gap = Math.max(6, Math.round(size * 0.33));

  if (variant === "icon") {
    return (
      <>
        <img
          src={lightLogoSrc}
          alt="My Korean Birdie"
          style={{ height: size, width: "auto" }}
          className={(className ? className + " " : "") + "dark:hidden"}
        />
        <img
          src={darkLogoSrc}
          alt="My Korean Birdie"
          style={{ height: size, width: "auto" }}
          className={(className ? className + " " : "") + "hidden dark:block"}
        />
      </>
    );
  }

  return (
    <div className={"flex items-center " + className} style={{ gap }}>
      <img
        src={lightLogoSrc}
        alt="My Korean Birdie"
        style={{ height: size, width: "auto" }}
        className="dark:hidden"
      />
      <img
        src={darkLogoSrc}
        alt="My Korean Birdie"
        style={{ height: size, width: "auto" }}
        className="hidden dark:block"
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
