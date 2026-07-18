import {
  Eye,
  Pencil,
  Users,
  UserPlus,
  Target,
  CalendarPlus,
  Mail,
  History,
  Archive,
  Trash2,
  MoreVertical,
} from "lucide-react";
import DropdownMenu from "../ui/DropdownMenu";

const CompanyRowActionsMenu = ({
  company,
  onView,
  onEdit,
  onAssignOwner,
  onAddContact,
  onCreateLead,
  onScheduleFollowUp,
  onSendEmail,
  onViewTimeline,
  onArchive,
  onDelete,
}) => {
  const items = [
    { key: "view", label: "View Company", icon: <Eye size={16} />, onSelect: () => onView(company) },
    { key: "edit", label: "Edit", icon: <Pencil size={16} />, onSelect: () => onEdit(company) },
    {
      key: "assign-owner",
      label: "Assign Owner",
      icon: <Users size={16} />,
      onSelect: () => onAssignOwner(company),
    },
    {
      key: "add-contact",
      label: "Add Contact",
      icon: <UserPlus size={16} />,
      onSelect: () => onAddContact(company),
    },
    {
      key: "create-lead",
      label: "Create Lead",
      icon: <Target size={16} />,
      onSelect: () => onCreateLead(company),
    },
    {
      key: "schedule-follow-up",
      label: "Schedule Follow-up",
      icon: <CalendarPlus size={16} />,
      onSelect: () => onScheduleFollowUp(company),
    },
    {
      key: "send-email",
      label: "Send Email",
      icon: <Mail size={16} />,
      onSelect: () => onSendEmail(company),
    },
    {
      key: "view-timeline",
      label: "View Timeline",
      icon: <History size={16} />,
      onSelect: () => onViewTimeline(company),
    },
    {
      key: "archive",
      label: "Archive",
      icon: <Archive size={16} />,
      onSelect: () => onArchive(company),
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 size={16} />,
      variant: "danger",
      onSelect: () => onDelete(company),
    },
  ];

  return (
    <DropdownMenu
      trigger={
        <span
          aria-label={`Actions for ${company.name}`}
          className="inline-flex items-center justify-center w-8 h-8 rounded-control text-ink-muted hover:bg-surface-hover hover:text-ink"
        >
          <MoreVertical size={18} />
        </span>
      }
      items={items}
    />
  );
};

export default CompanyRowActionsMenu;
