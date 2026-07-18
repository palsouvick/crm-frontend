import { useMemo, useEffect, useRef } from "react";
import { Globe } from "lucide-react";
import DataTable from "../ui/DataTable";
import Checkbox from "../ui/Checkbox";
import Badge from "../ui/Badge";
import Avatar from "../ui/Avatar";
import EmptyState from "../EmptyState";
import CompanyRowActionsMenu from "./CompanyRowActionsMenu";

const STATUS_BADGE_VARIANT = {
  active: "success",
  inactive: "neutral",
  lead: "warning",
  customer: "primary",
  prospect: "info",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "—";

const formatRevenue = (value) =>
  value ? `$${Number(value).toLocaleString()}` : "—";

const SelectAllCheckbox = ({ checked, indeterminate, onChange }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return <Checkbox ref={ref} checked={checked} onChange={onChange} aria-label="Select all companies on this page" />;
};

const CompaniesTable = ({
  companies,
  isLoading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onEdit,
  onDelete,
  onAssignOwner,
  onArchive,
  onAddContact,
  onCreateLead,
  onScheduleFollowUp,
  onSendEmail,
  onViewTimeline,
}) => {
  const allSelectedOnPage = companies.length > 0 && companies.every((c) => selectedIds.includes(c._id));
  const someSelectedOnPage = companies.some((c) => selectedIds.includes(c._id));

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
        render: (company) => (
          <Checkbox
            checked={selectedIds.includes(company._id)}
            onChange={() => onToggleSelect(company._id)}
            aria-label={`Select ${company.name}`}
          />
        ),
        width: 48,
      },
      {
        key: "name",
        header: "Company",
        render: (company) => (
          <div className="flex items-center gap-3">
            <Avatar name={company.name} src={company.logo?.url} shape="square" />
            <p className="font-medium text-ink">{company.name}</p>
          </div>
        ),
      },
      { key: "industry", header: "Industry", render: (company) => company.industry || "—" },
      {
        key: "website",
        header: "Website",
        render: (company) =>
          company.website ? (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary-600 hover:underline"
            >
              <Globe size={14} aria-hidden="true" />
              {company.website.replace(/^https?:\/\//, "")}
            </a>
          ) : (
            "—"
          ),
      },
      { key: "email", header: "Email", render: (company) => company.email || "—" },
      { key: "phone", header: "Phone", render: (company) => company.phone || "—" },
      { key: "state", header: "State", render: (company) => company.state || "—" },
      { key: "country", header: "Country", render: (company) => company.country || "—" },
      { key: "companySize", header: "Company Size", render: (company) => company.companySize || "—" },
      {
        key: "annualRevenue",
        header: "Annual Revenue",
        render: (company) => formatRevenue(company.annualRevenue),
      },
      {
        key: "assignedTo",
        header: "Assigned Owner",
        render: (company) =>
          company.assignedTo?.length ? (
            <div className="flex -space-x-2">
              {company.assignedTo.slice(0, 2).map((user) => (
                <Avatar key={user._id} name={user.name} size="sm" className="ring-2 ring-surface" />
              ))}
              {company.assignedTo.length > 2 && (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-200 text-caption font-medium text-ink-muted ring-2 ring-surface">
                  +{company.assignedTo.length - 2}
                </span>
              )}
            </div>
          ) : (
            "—"
          ),
      },
      {
        key: "openLeadsCount",
        header: "Open Leads/Deals",
        render: (company) => company.openLeadsCount ?? 0,
      },
      {
        key: "status",
        header: "Status",
        render: (company) => (
          <Badge variant={STATUS_BADGE_VARIANT[company.status] ?? "neutral"} dot className="capitalize">
            {company.status}
          </Badge>
        ),
      },
      { key: "createdAt", header: "Created", render: (company) => formatDate(company.createdAt) },
      {
        key: "lastContactedAt",
        header: "Last Activity",
        render: (company) => formatDate(company.lastContactedAt),
      },
      {
        key: "actions",
        header: "",
        className: "text-right",
        render: (company) => (
          <div className="flex justify-end">
            <CompanyRowActionsMenu
              company={company}
              onView={onView}
              onEdit={onEdit}
              onAssignOwner={onAssignOwner}
              onAddContact={onAddContact}
              onCreateLead={onCreateLead}
              onScheduleFollowUp={onScheduleFollowUp}
              onSendEmail={onSendEmail}
              onViewTimeline={onViewTimeline}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          </div>
        ),
      },
    ],
    [selectedIds, allSelectedOnPage, someSelectedOnPage, companies]
  );

  return (
    <DataTable
      columns={columns}
      data={companies}
      loading={isLoading}
      rowKey="_id"
      emptyState={
        <EmptyState
          icon="🏢"
          title="No companies found"
          description="Try adjusting your search or filters, or add a new company to get started."
          height="h-56"
        />
      }
    />
  );
};

export default CompaniesTable;
