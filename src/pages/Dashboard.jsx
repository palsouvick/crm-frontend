import { useNavigate } from "react-router-dom";
import Section from "../components/Section";
import Button from "../components/ui/Button";
import { getUser } from "../utils/auth";
import { useDashboardSummary } from "../hooks/useDashboard";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import DashboardEmptyState from "../components/dashboard/DashboardEmptyState";
import DashboardHero from "../components/dashboard/DashboardHero";
import SalesPipeline from "../components/dashboard/SalesPipeline";
import QuickActions from "../components/dashboard/QuickActions";
import StatsGrid from "../components/dashboard/StatsGrid";
import LeadGrowthChart from "../components/dashboard/LeadGrowthChart";
import LeadStatusChart from "../components/dashboard/LeadStatusChart";

const CARD_CLICK_ROUTE = {
  customers: "/customers",
  leads: "/leads",
  qualified: "/leads",
  won: "/leads",
  followUps: "/follow-up",
  conversion: "/leads",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const { data: summary, isLoading, isError, refetch } = useDashboardSummary();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-body text-ink-muted">
          We couldn't load your dashboard right now.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const isNewTenant =
    summary.customers.total === 0 &&
    summary.leads.total === 0 &&
    summary.activities.total === 0;

  if (isNewTenant) {
    return <DashboardEmptyState />;
  }

  return (
    <div className="space-y-8">
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
          <div className="md:col-span-6 lg:col-span-8">
            <DashboardHero
              userName={user?.name}
              followUpsCount={summary.followUps.total}
              leadsCount={summary.leads.total}
            />
          </div>
          <div className="md:col-span-6 lg:col-span-4">
            <SalesPipeline leadStatus={summary.leadStatus} />
          </div>
        </div>
      </Section>

      <QuickActions />

      <Section title="Business Metrics">
        <StatsGrid
          summary={summary}
          onCardClick={(key) => navigate(CARD_CLICK_ROUTE[key] ?? "/")}
        />
      </Section>

      <Section title="Analytics">
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
          <div className="md:col-span-6 lg:col-span-8">
            <LeadGrowthChart data={summary.leadsGrowth} />
          </div>
          <div className="md:col-span-6 lg:col-span-4">
            <LeadStatusChart data={summary.leadStatus} />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Dashboard;
