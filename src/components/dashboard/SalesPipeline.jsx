import { useMemo } from "react";
import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";
import { leadStatusColor } from "../../lib/chartTheme";

// Reflects the Lead model's actual status enum (new/contacted/qualified/won/lost) —
// intentionally not the brief's 7-stage funnel, since "proposal"/"negotiation"
// aren't stages this data model tracks yet.
const STAGE_ORDER = ["new", "contacted", "qualified", "won", "lost"];
const STAGE_LABEL = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

const SalesPipeline = ({ leadStatus, isLoading }) => {
  const stages = useMemo(() => {
    if (!leadStatus) return [];
    const total = leadStatus.reduce((sum, row) => sum + row.value, 0) || 1;
    const byStatus = Object.fromEntries(leadStatus.map((row) => [row.status, row.value]));
    return STAGE_ORDER.map((status) => {
      const count = byStatus[status] ?? 0;
      return {
        status,
        label: STAGE_LABEL[status],
        count,
        percent: Math.round((count / total) * 100),
        color: leadStatusColor[status],
      };
    });
  }, [leadStatus]);

  return (
    <Card className="h-full">
      <h3 className="text-h4 font-semibold text-ink mb-4">Sales Pipeline</h3>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="text" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {stages.map((stage) => (
            <div key={stage.status}>
              <div className="flex items-center justify-between text-body mb-1.5">
                <span className="flex items-center gap-2 text-ink">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: stage.color }}
                    aria-hidden="true"
                  />
                  {stage.label}
                </span>
                <span className="text-ink-muted">
                  {stage.count} &middot; {stage.percent}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${stage.percent}%`, backgroundColor: stage.color }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default SalesPipeline;
