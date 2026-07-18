import { useMemo, useEffect, useRef } from "react";
import DataTable from "../ui/DataTable";
import Checkbox from "../ui/Checkbox";
import Badge from "../ui/Badge";
import EmptyState from "../EmptyState";
import CampaignRowActionsMenu from "./CampaignRowActionsMenu";

const STATUS_BADGE_VARIANT = {
  draft: "neutral",
  scheduled: "warning",
  running: "success",
  paused: "info",
  completed: "primary",
  failed: "danger",
  archived: "neutral",
};

const PRIORITY_BADGE_VARIANT = {
  low: "neutral",
  medium: "info",
  high: "danger",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "—";

const SelectAllCheckbox = ({ checked, indeterminate, onChange }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return <Checkbox ref={ref} checked={checked} onChange={onChange} aria-label="Select all campaigns on this page" />;
};

const CampaignsTable = ({
  campaigns,
  isLoading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onEdit,
  onDuplicate,
  onPause,
  onResume,
  onSendTest,
  onArchive,
  onDelete,
}) => {
  const allSelectedOnPage = campaigns.length > 0 && campaigns.every((c) => selectedIds.includes(c._id));
  const someSelectedOnPage = campaigns.some((c) => selectedIds.includes(c._id));

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
        render: (campaign) => (
          <Checkbox
            checked={selectedIds.includes(campaign._id)}
            onChange={() => onToggleSelect(campaign._id)}
            aria-label={`Select ${campaign.name}`}
          />
        ),
        width: 48,
      },
      { key: "name", header: "Name", render: (campaign) => <p className="font-medium text-ink">{campaign.name}</p> },
      {
        key: "type",
        header: "Type",
        render: (campaign) => <Badge variant="neutral" className="capitalize">{campaign.type}</Badge>,
      },
      {
        key: "emailTemplate",
        header: "Email Template",
        render: (campaign) => campaign.emailTemplate?.name || "—",
      },
      {
        key: "audience",
        header: "Audience",
        render: (campaign) => (
          <div className="flex gap-1 flex-wrap">
            <Badge variant="info" size="sm">{campaign.customers?.length ?? 0} customers</Badge>
            <Badge variant="info" size="sm">{campaign.leads?.length ?? 0} leads</Badge>
          </div>
        ),
      },
      {
        key: "tags",
        header: "Tags",
        render: (campaign) =>
          campaign.tags?.length ? (
            <div className="flex gap-1 flex-wrap">
              {campaign.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
              ))}
              {campaign.tags.length > 2 && (
                <Badge variant="neutral" size="sm">+{campaign.tags.length - 2}</Badge>
              )}
            </div>
          ) : (
            "—"
          ),
      },
      {
        key: "priority",
        header: "Priority",
        render: (campaign) => (
          <Badge variant={PRIORITY_BADGE_VARIANT[campaign.priority] ?? "neutral"} className="capitalize">
            {campaign.priority}
          </Badge>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (campaign) => (
          <Badge variant={STATUS_BADGE_VARIANT[campaign.status] ?? "neutral"} dot className="capitalize">
            {campaign.status}
          </Badge>
        ),
      },
      { key: "scheduledAt", header: "Scheduled At", render: (campaign) => formatDate(campaign.scheduledAt) },
      { key: "sentCount", header: "Emails Sent", render: (campaign) => campaign.sentCount ?? 0 },
      { key: "createdBy", header: "Created By", render: (campaign) => campaign.createdBy?.name || "—" },
      { key: "createdAt", header: "Created", render: (campaign) => formatDate(campaign.createdAt) },
      {
        key: "actions",
        header: "",
        className: "text-right",
        render: (campaign) => (
          <div className="flex justify-end">
            <CampaignRowActionsMenu
              campaign={campaign}
              onView={onView}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onPause={onPause}
              onResume={onResume}
              onSendTest={onSendTest}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          </div>
        ),
      },
    ],
    [selectedIds, allSelectedOnPage, someSelectedOnPage, campaigns]
  );

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      loading={isLoading}
      rowKey="_id"
      emptyState={
        <EmptyState
          icon="📣"
          title="No campaigns found"
          description="Try adjusting your search or filters, or create a new campaign to get started."
          height="h-56"
        />
      }
    />
  );
};

export default CampaignsTable;
