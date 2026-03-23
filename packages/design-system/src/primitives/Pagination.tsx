type PaginationSize = "sm" | "md" | "lg";

type PaginationProps = {
  /** Current page (1-based) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Called when a page is selected */
  onPageChange: (page: number) => void;
  /** Maximum page buttons to show (excluding prev/next) */
  siblingCount?: number;
  /** Size variant */
  size?: PaginationSize;
  className?: string;
};

const sizeClasses: Record<PaginationSize, string> = {
  sm: "h-7 min-w-7 px-1.5 text-xs",
  md: "h-9 min-w-9 px-2 text-sm",
  lg: "h-11 min-w-11 px-3 text-base",
};

function buildRange(page: number, totalPages: number, siblingCount: number): (number | "ellipsis")[] {
  const totalSlots = siblingCount * 2 + 3; // siblings + current + first + last
  if (totalPages <= totalSlots + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(2, page - siblingCount);
  const right = Math.min(totalPages - 1, page + siblingCount);

  const items: (number | "ellipsis")[] = [1];

  if (left > 2) items.push("ellipsis");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < totalPages - 1) items.push("ellipsis");

  items.push(totalPages);
  return items;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  size = "md",
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = buildRange(page, totalPages, siblingCount);

  const btnBase =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-namsaek-300 dark:focus-visible:ring-namsaek-600 outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ";

  const inactive =
    "text-namsaek-600 hover:bg-hanji-200 dark:text-hanji-300 dark:hover:bg-namsaek-800 ";

  const active =
    "bg-namsaek-500 text-white dark:bg-namsaek-400 dark:text-namsaek-950 ";

  return (
    <nav aria-label="Pagination" className={"flex items-center gap-1 " + className}>
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={btnBase + inactive + sizeClasses[size]}
        aria-label="Previous page"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {items.map((item, i) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            className={
              "inline-flex items-center justify-center text-namsaek-400 dark:text-hanji-500 " +
              sizeClasses[size]
            }
            aria-hidden="true"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={
              btnBase +
              (item === page ? active : inactive) +
              sizeClasses[size]
            }
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={btnBase + inactive + sizeClasses[size]}
        aria-label="Next page"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </nav>
  );
}
