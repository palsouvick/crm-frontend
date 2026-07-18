import {
  Megaphone,
  FileEdit,
  CalendarClock,
  Play,
  CheckCircle2,
  XCircle,
  Send,
} from "lucide-react";
import StatCard from "../ui/StatCard";
import { useCampaignSummary } from "../../hooks/useCampaigns";

const formatRate = (value) => (value === null || value === undefined ? "—" : `${value}%`);

const CampaignSummaryCards = () => {
  const { data: summary, isLoading } = useCampaignSummary();

  const cards = [
    { key: "total", title: "Total Campaigns", value: summary?.total, icon: Megaphone, accent: "primary" },
    { key: "draft", title: "Draft Campaigns", value: summary?.draft, icon: FileEdit, accent: "info" },
    { key: "scheduled", title: "Scheduled Campaigns", value: summary?.scheduled, icon: CalendarClock, accent: "warning" },
    { key: "running", title: "Running Campaigns", value: summary?.running, icon: Play, accent: "success" },
    { key: "completed", title: "Completed Campaigns", value: summary?.completed, icon: CheckCircle2, accent: "success" },
    { key: "failed", title: "Failed Campaigns", value: summary?.failed, icon: XCircle, accent: "warning" },
    { key: "emailsSent", title: "Emails Sent", value: summary?.emailsSent, icon: Send, accent: "primary" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
      {cards.map((card) => (
        <div key={card.key} className="md:col-span-3 lg:col-span-3">
          <StatCard
            title={card.title}
            value={card.value ?? 0}
            icon={card.icon}
            accent={card.accent}
            isLoading={isLoading}
          />
        </div>
      ))}
      {["openRate", "clickRate", "conversionRate"].map((key, i) => (
        <div key={key} className="md:col-span-3 lg:col-span-3">
          <StatCard
            title={["Open Rate", "Click Rate", "Conversion Rate"][i]}
            value={formatRate(summary?.[key])}
            icon={Megaphone}
            accent="info"
            isLoading={isLoading}
          />
        </div>
      ))}
    </div>
  );
};

export default CampaignSummaryCards;
