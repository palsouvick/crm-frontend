import { Eye, Pencil, KeyRound, ShieldCheck, Power, Trash2, MoreVertical } from "lucide-react";
import DropdownMenu from "../ui/DropdownMenu";

const UserRowActionsMenu = ({
  user,
  onView,
  onEdit,
  onResetPassword,
  onAssignRole,
  onToggleStatus,
  onDelete,
}) => {
  const isActive = user.status === "active";

  const items = [
    { key: "view", label: "View Profile", icon: <Eye size={16} />, onSelect: () => onView(user) },
    { key: "edit", label: "Edit", icon: <Pencil size={16} />, onSelect: () => onEdit(user) },
    {
      key: "reset-password",
      label: "Reset Password",
      icon: <KeyRound size={16} />,
      onSelect: () => onResetPassword(user),
    },
    {
      key: "assign-role",
      label: "Assign Role",
      icon: <ShieldCheck size={16} />,
      onSelect: () => onAssignRole(user),
    },
    {
      key: "toggle-status",
      label: isActive ? "Deactivate" : "Activate",
      icon: <Power size={16} />,
      onSelect: () => onToggleStatus(user),
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 size={16} />,
      variant: "danger",
      onSelect: () => onDelete(user),
    },
  ];

  return (
    <DropdownMenu
      trigger={
        <span
          aria-label={`Actions for ${user.name}`}
          className="inline-flex items-center justify-center w-8 h-8 rounded-control text-ink-muted hover:bg-surface-hover hover:text-ink"
        >
          <MoreVertical size={18} />
        </span>
      }
      items={items}
    />
  );
};

export default UserRowActionsMenu;
