import lightBirdIconSrc from "@reterics/birdie-ui/assets/brand/logo-icon.svg";
import darkBirdIconSrc from "@reterics/birdie-ui/assets/brand/logo-icon-dark.svg";

type BirdIconProps = {
  size?: number;
  className?: string;
};

export function BirdIcon({ size = 30, className = "" }: BirdIconProps) {
  return (
    <>
      <img
          src={lightBirdIconSrc}
          alt="My Korean Birdie"
          style={{ height: size, width: "auto" }}
          className={(className ? className + " " : "") + "dark:hidden"}
      />
      <img
          src={darkBirdIconSrc}
          alt="My Korean Birdie"
          style={{ height: size, width: "auto" }}
          className={(className ? className + " " : "") + "hidden dark:block"}
      />
    </>
  );
}
