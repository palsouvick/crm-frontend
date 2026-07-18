import EmptyState from "../EmptyState";
import QuickActions from "./QuickActions";

const DashboardEmptyState = () => (
  <div className="space-y-6">
    <EmptyState
      icon="🚀"
      title="Welcome to your CRM"
      description="You haven't added any customers or leads yet. Get started by adding your first customer or lead."
      height="h-72"
    />
    <QuickActions />
  </div>
);

export default DashboardEmptyState;
