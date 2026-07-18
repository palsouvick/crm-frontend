import { Users, UserCheck, UserX, ShieldCheck, Briefcase, Headset } from "lucide-react";
import StatCard from "../ui/StatCard";
import { useUserSummary } from "../../hooks/useUsers";

const UserSummaryCards = () => {
  const { data: summary, isLoading } = useUserSummary();

  const cards = [
    { key: "total", title: "Total Users", value: summary?.total, icon: Users, accent: "primary" },
    { key: "active", title: "Active Users", value: summary?.active, icon: UserCheck, accent: "success" },
    { key: "inactive", title: "Inactive Users", value: summary?.inactive, icon: UserX, accent: "warning" },
    { key: "admin", title: "Admin Users", value: summary?.byRole?.admin, icon: ShieldCheck, accent: "info" },
    { key: "manager", title: "Managers", value: summary?.byRole?.manager, icon: Briefcase, accent: "info" },
    { key: "sales", title: "Sales Team", value: summary?.byRole?.sales, icon: Headset, accent: "primary" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
      {cards.map((card) => (
        <div key={card.key} className="md:col-span-3 lg:col-span-2">
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

export default UserSummaryCards;
