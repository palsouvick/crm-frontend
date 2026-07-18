import { Building2, CheckCircle2, Sparkles, XCircle, CalendarPlus, Handshake } from "lucide-react";
import StatCard from "../ui/StatCard";
import { useCompanySummary } from "../../hooks/useCompanies";

const CompanySummaryCards = () => {
  const { data: summary, isLoading } = useCompanySummary();

  const cards = [
    { key: "total", title: "Total Companies", value: summary?.total, icon: Building2, accent: "primary" },
    { key: "active", title: "Active Companies", value: summary?.active, icon: CheckCircle2, accent: "success" },
    { key: "prospect", title: "Prospect Companies", value: summary?.prospect, icon: Sparkles, accent: "info" },
    { key: "inactive", title: "Inactive Companies", value: summary?.inactive, icon: XCircle, accent: "warning" },
    { key: "new", title: "New This Month", value: summary?.newThisMonth, icon: CalendarPlus, accent: "primary" },
    {
      key: "openDeals",
      title: "Companies With Open Deals",
      value: summary?.companiesWithOpenDeals,
      icon: Handshake,
      accent: "success",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
      {cards.map((card) => (
        <div key={card.key} className="md:col-span-3 lg:col-span-4">
          <StatCard
            title={card.title}
            value={card.value ?? 0}
            icon={card.icon}
            accent={card.accent}
            isLoading={isLoading}
          />
        </div>
      ))}
    </div>
  );
};

export default CompanySummaryCards;
