import Card from "./Card";
import Button from "./Button";
import Skeleton from "./Skeleton";
import EmptyState from "../EmptyState";

const ChartCard = ({
  title,
  description,
  actions,
  isLoading = false,
  isError = false,
  onRetry,
  isEmpty = false,
  emptyMessage = "No data available yet",
  height = 300,
  children,
}) => {
  return (
    <Card padding="none">
      {(title || actions) && (
        <Card.Header className="flex items-start justify-between">
          <div>
            {title && <h3 className="text-h4 font-semibold text-ink">{title}</h3>}
            {description && (
              <p className="text-body text-ink-muted mt-1">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </Card.Header>
      )}

      <Card.Body>
        {isLoading ? (
          <Skeleton height={height} />
        ) : isError ? (
          <div
            className="flex flex-col items-center justify-center gap-3 text-center"
            style={{ height }}
          >
            <p className="text-body text-ink-muted">
              Something went wrong loading this chart.
            </p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        ) : isEmpty ? (
          <div style={{ height }}>
            <EmptyState
              icon="📊"
              title="Nothing to show yet"
              description={emptyMessage}
              height="h-full"
            />
          </div>
        ) : (
          children
        )}
      </Card.Body>
    </Card>
  );
};

export default ChartCard;
