import { useNavigate } from "react-router-dom";
import { UserPlus, Target, CalendarPlus, ClipboardList, Megaphone } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const ACTIONS = [
  { key: "customer", label: "Customer", icon: UserPlus, to: "/customers" },
  { key: "lead", label: "Lead", icon: Target, to: "/leads" },
  { key: "meeting", label: "Meeting", icon: CalendarPlus, to: "/follow-up/create" },
  { key: "follow-up", label: "Follow-up", icon: ClipboardList, to: "/follow-up/create" },
  { key: "campaign", label: "Campaign", icon: Megaphone, to: "/campaigns" },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <h3 className="text-h4 font-semibold text-ink mb-4">Quick Actions</h3>
      <div className="flex flex-wrap gap-3">
        {ACTIONS.map(({ key, label, icon: Icon, to }) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            leftIcon={<Icon size={16} aria-hidden="true" />}
            onClick={() => navigate(to)}
          >
            {label}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;
