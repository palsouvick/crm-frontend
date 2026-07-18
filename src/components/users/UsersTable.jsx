import { useMemo, useEffect, useRef } from "react";
import DataTable from "../ui/DataTable";
import Checkbox from "../ui/Checkbox";
import Badge from "../ui/Badge";
import Avatar from "../ui/Avatar";
import EmptyState from "../EmptyState";
import UserRowActionsMenu from "./UserRowActionsMenu";

const ROLE_BADGE_VARIANT = {
  admin: "primary",
  manager: "info",
  sales: "success",
  support: "warning",
  user: "neutral",
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

const SelectAllCheckbox = ({ checked, indeterminate, onChange }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <Checkbox
      ref={ref}
      checked={checked}
      onChange={onChange}
      aria-label="Select all users on this page"
    />
  );
};

const UsersTable = ({
  users,
  isLoading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  onResetPassword,
  onAssignRole,
  onToggleStatus,
  onView,
}) => {
  const allSelectedOnPage = users.length > 0 && users.every((u) => selectedIds.includes(u._id));
  const someSelectedOnPage = users.some((u) => selectedIds.includes(u._id));

  const columns = useMemo(
    () => [
      {
        key: "select",
        header: (
          <SelectAllCheckbox
            checked={allSelectedOnPage}
            indeterminate={someSelectedOnPage && !allSelectedOnPage}
            onChange={onToggleSelectAll}
          />
        ),
        render: (user) => (
          <Checkbox
            checked={selectedIds.includes(user._id)}
            onChange={() => onToggleSelect(user._id)}
            aria-label={`Select ${user.name}`}
          />
        ),
        width: 48,
      },
      {
        key: "name",
        header: "Name",
        render: (user) => (
          <div className="flex items-center gap-3">
            <Avatar name={user.name} />
            <div>
              <p className="font-medium text-ink">{user.name}</p>
              <p className="text-caption text-ink-muted">{user.email}</p>
            </div>
          </div>
        ),
      },
      { key: "employeeId", header: "Employee ID", render: (user) => user.employeeId || "—" },
      { key: "phone", header: "Phone", render: (user) => user.phone || "—" },
      { key: "department", header: "Department", render: (user) => user.department || "—" },
      { key: "designation", header: "Designation", render: (user) => user.designation || "—" },
      {
        key: "role",
        header: "Role",
        render: (user) => (
          <Badge variant={ROLE_BADGE_VARIANT[user.role] ?? "neutral"} className="capitalize">
            {user.role}
          </Badge>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (user) => (
          <Badge variant={user.status === "active" ? "success" : "neutral"} dot className="capitalize">
            {user.status}
          </Badge>
        ),
      },
      { key: "lastLogin", header: "Last Login", render: (user) => formatDate(user.lastLogin) },
      {
        key: "assignedLeadsCount",
        header: "Assigned Leads",
        render: (user) => user.assignedLeadsCount ?? 0,
      },
      {
        key: "assignedCustomersCount",
        header: "Assigned Customers",
        render: (user) => user.assignedCustomersCount ?? 0,
      },
      { key: "createdAt", header: "Created", render: (user) => formatDate(user.createdAt) },
      {
        key: "actions",
        header: "",
        className: "text-right",
        render: (user) => (
          <div className="flex justify-end">
            <UserRowActionsMenu
              user={user}
              onView={onView}
              onEdit={onEdit}
              onResetPassword={onResetPassword}
              onAssignRole={onAssignRole}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          </div>
        ),
      },
    ],
    [selectedIds, allSelectedOnPage, someSelectedOnPage, users]
  );

  return (
    <DataTable
      columns={columns}
      data={users}
      loading={isLoading}
      rowKey="_id"
      emptyState={
        <EmptyState
          icon="👥"
          title="No users found"
          description="Try adjusting your search or filters, or add a new user to get started."
          height="h-56"
        />
      }
    />
  );
};

export default UsersTable;
