import clsx from "clsx";
import TableSkeleton from "./TableSkeleton";

const defaultEmptyState = (
  <div className="px-6 py-12 text-center text-ink-muted">No records found</div>
);

const DataTable = ({
  columns,
  data = [],
  loading = false,
  emptyState = defaultEmptyState,
  rowKey = "_id",
  onRowClick,
}) => {
  const getRowKey = (row, index) =>
    typeof rowKey === "function" ? rowKey(row) : row[rowKey] ?? index;

  return (
    <div className="bg-surface border border-border rounded-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-surface-hover">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={clsx(
                    "px-6 py-3 text-left text-caption font-medium text-ink-muted uppercase tracking-wider",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <TableSkeleton rows={5} columns={columns.length} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>{emptyState}</td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={clsx(
                    "transition-colors",
                    onRowClick && "cursor-pointer hover:bg-surface-hover"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={clsx("px-6 py-4 text-body text-ink", col.className)}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
