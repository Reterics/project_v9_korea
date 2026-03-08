import birdIconSrc from "@reterics/birdie-ui/assets/brand/logo-icon.svg";

type MagpieTipProps = {
  children: React.ReactNode;
  title?: string;
};

export function MagpieTip({ children, title = "Birdie Tip" }: MagpieTipProps) {
  return (
    <div className="flex gap-3 rounded-2xl border border-namsaek-200 bg-namsaek-50/60 p-3 dark:border-namsaek-700/50 dark:bg-namsaek-900/30">
      <img
        src={birdIconSrc}
        alt=""
        aria-hidden="true"
        style={{ height: 20, width: "auto" }}
        className="mt-0.5 shrink-0 opacity-80"
      />
      <div>
        <div className="text-xs font-semibold text-namsaek-600 dark:text-namsaek-300 mb-0.5">
          {title}
        </div>
        <div className="text-sm text-namsaek-700 dark:text-hanji-200">{children}</div>
      </div>
    </div>
  );
}
