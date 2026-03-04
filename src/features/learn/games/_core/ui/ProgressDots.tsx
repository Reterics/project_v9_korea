type ProgressDotsProps = {
  current: number;
  total: number;
};

export function ProgressDots({ current, total }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            i < current ? "bg-blue-500" : i === current ? "bg-blue-300" : "bg-gray-200"
          }`}
        />
      ))}
      <span className="ml-2 text-xs text-gray-400">
        {current + 1}/{total}
      </span>
    </div>
  );
}
