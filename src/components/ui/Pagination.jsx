import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

const getPageNumbers = (page, totalPages) => {
  const pages = [];
  const windowSize = 1;
  const start = Math.max(1, page - windowSize);
  const end = Math.min(totalPages, page + windowSize);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("ellipsis-start");
  }
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("ellipsis-end");
    pages.push(totalPages);
  }

  return pages;
};

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="p-2 rounded-control border border-border text-ink-muted hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        typeof p === "number" ? (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={clsx(
              "min-w-9 h-9 px-2 rounded-control text-sm font-medium cursor-pointer",
              p === page
                ? "bg-primary-600 text-white"
                : "text-ink-muted hover:bg-surface-hover"
            )}
          >
            {p}
          </button>
        ) : (
          <span key={p + i} className="px-2 text-ink-subtle">
            …
          </span>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="p-2 rounded-control border border-border text-ink-muted hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
