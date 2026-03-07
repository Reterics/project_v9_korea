import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
};

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  onRowClick,
  emptyMessage = "No data to display",
  className = "",
}: DataTableProps<T>) {
  return (
    <div
      className={
        "overflow-x-auto rounded-2xl border border-hanji-300 bg-white shadow-sm dark:border-namsaek-700 dark:bg-namsaek-900" +
        (className ? " " + className : "")
      }
    >
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-hanji-200 dark:border-namsaek-800">
            {columns.map((col) => (
              <th
                key={col.key}
                className={
                  "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-namsaek-400 dark:text-hanji-400" +
                  (col.className ? " " + col.className : "")
                }
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-namsaek-400 dark:text-hanji-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={String(row[keyField])}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={
                  "border-b border-hanji-100 last:border-b-0 dark:border-namsaek-800" +
                  (onRowClick
                    ? " cursor-pointer transition hover:bg-hanji-50 dark:hover:bg-namsaek-800/60"
                    : "")
                }
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={
                      "px-4 py-3 text-namsaek-700 dark:text-hanji-200" +
                      (col.className ? " " + col.className : "")
                    }
                  >
                    {col.render
                      ? col.render(row)
                      : (row[col.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
