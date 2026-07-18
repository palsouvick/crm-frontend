import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ChartCard from "../ui/ChartCard";
import ChartTooltip from "../ui/ChartTooltip";
import { leadStatusColor, chartColor } from "../../lib/chartTheme";

const LeadStatusChart = ({ data, isLoading, isError, onRetry }) => {
  const chartData = useMemo(() => data ?? [], [data]);
  const total = chartData.reduce((sum, row) => sum + row.value, 0);

  return (
    <ChartCard
      title="Lead Status"
      description="Distribution across the pipeline"
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      isEmpty={!isLoading && !isError && total === 0}
      emptyMessage="Lead status breakdown will appear once you add leads."
      height={280}
    >
      <div role="img" aria-label={`Lead status distribution across ${chartData.length} statuses, totaling ${total} leads`}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={leadStatusColor[entry.status] ?? chartColor.neutral}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => <span className="text-body text-ink-muted">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default LeadStatusChart;
