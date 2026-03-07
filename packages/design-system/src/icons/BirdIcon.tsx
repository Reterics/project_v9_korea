type BirdIconProps = {
  size?: number;
  className?: string;
};

export function BirdIcon({ size = 30, className = "" }: BirdIconProps) {
  return (
    <img
      src="/brand/logo-icon.svg"
      alt="My Korean Birdie"
      style={{ height: size, width: "auto" }}
      className={className}
    />
  );
}