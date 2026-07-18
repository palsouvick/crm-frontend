import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "../ui/ChartCard";
import ChartTooltip from "../ui/ChartTooltip";
import { chartColor } from "../../lib/chartTheme";

const LeadGrowthChart = ({ data, isLoading, isError, onRetry }) => {
  const chartData = useMemo(() => data ?? [], [data]);

  return (
    <ChartCard
      title="Monthly Lead Growth"
      description="New leads created over the last 6 months"
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      isEmpty={!isLoading && !isError && chartData.length === 0}
      emptyMessage="Leads you create will show up here as a growth trend."
      height={280}
    >
      <div
        role="img"
        aria-label={`Lead growth over ${chartData.length} months, from ${chartData[0]?.leads ?? 0} to ${chartData[chartData.length - 1]?.leads ?? 0} leads`}
      >
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColor.grid} vertical={false} />
            <XAxis dataKey="month" stroke={chartColor.axisText} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={chartColor.axisText} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="leads"
              name="Leads"
              stroke={chartColor.primary}
              strokeWidth={2.5}
              dot={{ r: 3, fill: chartColor.primary }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default LeadGrowthChart;
