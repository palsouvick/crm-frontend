const TableSkeleton = ({ rows = 5, columns = 6 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i} className="border-b border-border">
        {Array.from({ length: columns }).map((_, j) => (
          <td key={j} className="px-6 py-4">
            <div className="h-4 bg-neutral-200 rounded animate-pulse" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default TableSkeleton;
