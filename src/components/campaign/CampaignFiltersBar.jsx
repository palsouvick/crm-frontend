import Select from "react-select";
import { Search, Download, RotateCcw } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import NativeSelect from "../ui/Select";
import DateInput from "../ui/DateInput";
import Checkbox from "../ui/Checkbox";
import Button from "../ui/Button";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  ...["draft", "scheduled", "running", "paused", "completed", "failed", "archived"].map((v) => ({
    value: v,
    label: v.charAt(0).toUpperCase() + v.slice(1),
  })),
];

// Real data is always "email" today — the model enum was widened for future
// channels, but the filter doesn't pretend sms/social/push are usable yet.
const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "email", label: "Email" },
];

const AUDIENCE_TYPE_OPTIONS = [
  { value: "", label: "All Audiences" },
  { value: "customers", label: "Customers only" },
  { value: "leads", label: "Leads only" },
  { value: "mixed", label: "Mixed" },
  { value: "empty", label: "Empty" },
];

const CampaignFiltersBar = ({
  filters,
  onFilterChange,
  onReset,
  onExport,
  isExporting,
  filterOptions,
  templateOptions,
  userOptions,
}) => {
  const tagOptions = (filterOptions?.tags ?? []).map((t) => ({ value: t, label: t }));

  return (
    <Card>
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[240px]">
          <Input
            placeholder="Search campaigns..."
            leftIcon={<Search size={16} />}
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>
        <NativeSelect
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="min-w-[160px]"
        />
        <NativeSelect
          options={TYPE_OPTIONS}
          value={filters.type}
          onChange={(e) => onFilterChange({ type: e.target.value })}
          className="min-w-[140px]"
        />
        <Button variant="outline" leftIcon={<RotateCcw size={16} />} onClick={onReset}>
          Reset
        </Button>
        <Button
          variant="outline"
          leftIcon={<Download size={16} />}
          isLoading={isExporting}
          onClick={onExport}
        >
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border">
        <Select
          options={templateOptions}
          value={templateOptions.find((opt) => opt.value === filters.emailTemplate) ?? null}
          onChange={(selected) => onFilterChange({ emailTemplate: selected?.value ?? "" })}
          placeholder="Email Template"
          isClearable
          aria-label="Email Template"
        />
        <Select
          options={userOptions}
          value={userOptions.find((opt) => opt.value === filters.createdBy) ?? null}
          onChange={(selected) => onFilterChange({ createdBy: selected?.value ?? "" })}
          placeholder="Created By"
          isClearable
          aria-label="Created By"
        />
        <NativeSelect
          options={AUDIENCE_TYPE_OPTIONS}
          value={filters.audienceType}
          onChange={(e) => onFilterChange({ audienceType: e.target.value })}
          aria-label="Audience Type"
        />
        <Select
          isMulti
          options={tagOptions}
          value={tagOptions.filter((opt) => filters.tags.includes(opt.value))}
          onChange={(selected) => onFilterChange({ tags: selected ? selected.map((s) => s.value) : [] })}
          placeholder="Tags"
          aria-label="Tags"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 items-center">
        <DateInput
          value={filters.dateFrom}
          onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
          aria-label="Scheduled from"
        />
        <DateInput
          value={filters.dateTo}
          onChange={(e) => onFilterChange({ dateTo: e.target.value })}
          aria-label="Scheduled to"
        />
        <Checkbox
          label="Overdue only"
          checked={filters.overdueOnly}
          onChange={(e) => onFilterChange({ overdueOnly: e.target.checked })}
        />
      </div>
    </Card>
  );
};

export default CampaignFiltersBar;
