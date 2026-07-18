import {
  Eye,
  Pencil,
  Copy,
  Pause,
  Play,
  Send,
  Archive,
  Trash2,
  MoreVertical,
} from "lucide-react";
import DropdownMenu from "../ui/DropdownMenu";

const CampaignRowActionsMenu = ({
  campaign,
  onView,
  onEdit,
  onDuplicate,
  onPause,
  onResume,
  onSendTest,
  onArchive,
  onDelete,
}) => {
  const canPause = ["running", "scheduled"].includes(campaign.status);
  const canResume = campaign.status === "paused";
  const canArchive = !["running", "archived"].includes(campaign.status);
  const canDelete = campaign.status !== "running";

  const items = [
    { key: "view", label: "View Campaign", icon: <Eye size={16} />, onSelect: () => onView(campaign) },
    { key: "edit", label: "Edit", icon: <Pencil size={16} />, onSelect: () => onEdit(campaign) },
    { key: "duplicate", label: "Duplicate", icon: <Copy size={16} />, onSelect: () => onDuplicate(campaign) },
    ...(canPause
      ? [{ key: "pause", label: "Pause", icon: <Pause size={16} />, onSelect: () => onPause(campaign) }]
      : []),
    ...(canResume
      ? [{ key: "resume", label: "Resume", icon: <Play size={16} />, onSelect: () => onResume(campaign) }]
      : []),
    {
      key: "send-test",
      label: "Send Test Email",
      icon: <Send size={16} />,
      onSelect: () => onSendTest(campaign),
    },
    ...(canArchive
      ? [{ key: "archive", label: "Archive", icon: <Archive size={16} />, onSelect: () => onArchive(campaign) }]
      : []),
    ...(canDelete
      ? [
          {
            key: "delete",
            label: "Delete",
            icon: <Trash2 size={16} />,
            variant: "danger",
            onSelect: () => onDelete(campaign),
          },
        ]
      : []),
  ];

  return (
    <DropdownMenu
      trigger={
        <span
          aria-label={`Actions for ${campaign.name}`}
          className="inline-flex items-center justify-center w-8 h-8 rounded-control text-ink-muted hover:bg-surface-hover hover:text-ink"
        >
          <MoreVertical size={18} />
        </span>
      }
      items={items}
    />
  );
};

export default CampaignRowActionsMenu;
