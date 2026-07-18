import { useMemo } from "react";
import { Users, Target, CheckCircle2, Trophy, Clock, Percent } from "lucide-react";
import StatCard from "../ui/StatCard";

const findStatusValue = (leadStatus, status) =>
  leadStatus?.find((row) => row.status === status)?.value ?? 0;

const buildStats = (summary) => {
  const totalLeads = summary.leads.total;
  const qualified = findStatusValue(summary.leadStatus, "qualified");
  const won = findStatusValue(summary.leadStatus, "won");
  const conversionRate = totalLeads > 0 ? Math.round((won / totalLeads) * 100) : 0;

  const growth = summary.leadsGrowth ?? [];
  const leadsSparkline = growth.map((row) => ({ value: row.leads }));
  let leadsTrend;
  if (growth.length >= 2) {
    const prev = growth[growth.length - 2].leads;
    const last = growth[growth.length - 1].leads;
    if (prev > 0) leadsTrend = Math.round(((last - prev) / prev) * 100);
  }

  return [
    {
      key: "customers",
      title: "Total Customers",
      value: summary.customers.total,
      icon: Users,
      accent: "primary",
    },
    {
      key: "leads",
      title: "Total Leads",
      value: totalLeads,
      icon: Target,
      accent: "info",
      trend: leadsTrend,
      sparklineData: leadsSparkline,
    },
    {
      key: "qualified",
      title: "Qualified Leads",
      value: qualified,
      icon: CheckCircle2,
      accent: "warning",
    },
    {
      key: "won",
      title: "Won Deals",
      value: won,
      icon: Trophy,
      accent: "success",
    },
    {
      key: "followUps",
      title: "Pending Follow-ups",
      value: summary.followUps.total,
      icon: Clock,
      accent: "warning",
    },
    {
      key: "conversion",
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: Percent,
      accent: "success",
    },
  ];
};

const StatsGrid = ({ summary, isLoading, onCardClick }) => {
  const stats = useMemo(() => (summary ? buildStats(summary) : []), [summary]);
  const cards = isLoading ? Array.from({ length: 6 }) : stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
      {cards.map((stat, i) => (
        <div key={stat?.key ?? i} className="md:col-span-3 lg:col-span-4">
          <StatCard
            isLoading={isLoading}
            title={stat?.title}
            value={stat?.value}
            icon={stat?.icon}
            accent={stat?.accent}
            trend={stat?.trend}
            sparklineData={stat?.sparklineData}
            onClick={stat ? () => onCardClick?.(stat.key) : undefined}
          />
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
