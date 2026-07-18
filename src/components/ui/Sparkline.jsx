import { memo } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { chartColor } from "../../lib/chartTheme";

const Sparkline = ({
  data,
  dataKey = "value",
  color = chartColor.primary,
  height = 36,
  strokeWidth = 2,
  fillOpacity = 0.15,
}) => {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fill={color}
          fillOpacity={fillOpacity}
          strokeWidth={strokeWidth}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default memo(Sparkline);
