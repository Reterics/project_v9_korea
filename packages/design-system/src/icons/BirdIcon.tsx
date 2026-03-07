import birdIconSrc from "@birdie/ui/assets/brand/logo-icon.svg";

type BirdIconProps = {
  size?: number;
  className?: string;
};

export function BirdIcon({ size = 30, className = "" }: BirdIconProps) {
  return (
    <img
      src={birdIconSrc}
      alt="My Korean Birdie"
      style={{ height: size, width: "auto" }}
      className={className}
    />
  );
}
