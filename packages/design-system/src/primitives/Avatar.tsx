import { useState } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarVariant = "primary" | "success" | "warning" | "danger";

type AvatarProps = {
  /** Image URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Fallback initials (1–2 characters) */
  initials?: string;
  /** Size variant */
  size?: AvatarSize;
  /** Background color for the initials fallback */
  variant?: AvatarVariant;
  className?: string;
};

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

const variantClasses: Record<AvatarVariant, string> = {
  primary: "bg-namsaek-100 text-namsaek-600 dark:bg-namsaek-800 dark:text-namsaek-200",
  success: "bg-cheongja-100 text-cheongja-600 dark:bg-cheongja-900/50 dark:text-cheongja-300",
  warning: "bg-geum-100 text-geum-600 dark:bg-geum-900/50 dark:text-geum-300",
  danger: "bg-dancheong-100 text-dancheong-600 dark:bg-dancheong-900/50 dark:text-dancheong-300",
};

const defaultPersonIcon = (
  <svg
    className="h-1/2 w-1/2"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  variant = "primary",
  className = "",
}: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const base =
    "inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none " +
    sizeClasses[size];

  if (src && !imgFailed) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setImgFailed(true)}
        className={
          base +
          " object-cover" +
          (className ? " " + className : "")
        }
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={alt || initials || "User avatar"}
      className={
        base +
        " " +
        variantClasses[variant] +
        (className ? " " + className : "")
      }
    >
      {initials ? initials.slice(0, 2).toUpperCase() : defaultPersonIcon}
    </span>
  );
}
