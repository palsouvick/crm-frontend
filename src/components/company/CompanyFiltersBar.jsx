import Select from "react-select";
import { Search, Download, RotateCcw } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import NativeSelect from "../ui/Select";
import DateInput from "../ui/DateInput";
import Button from "../ui/Button";

const INDUSTRY_OPTIONS = [
  { value: "", label: "All Industries" },
  ...[
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Real Estate",
    "Consulting",
    "Marketing",
    "Legal",
    "Other",
  ].map((v) => ({ value: v, label: v })),
];

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  ...["active", "inactive", "lead", "customer", "prospect"].map((v) => ({
    value: v,
    label: v.charAt(0).toUpperCase() + v.slice(1),
  })),
];

const SIZE_OPTIONS = [
  { value: "", label: "All Sizes" },
  ...["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map((v) => ({ value: v, label: v })),
];

// City is deliberately not offered here — it doesn't exist anywhere on the
// Company schema (only state/country), so a City filter would be fake.
const CompanyFiltersBar = ({
  filters,
  onFilterChange,
  onReset,
  onExport,
  isExporting,
  filterOptions,
  ownerOptions,
}) => {
  const countryOptions = [
    { value: "", label: "All Countries" },
    ...(filterOptions?.countries ?? []).map((c) => ({ value: c, label: c })),
  ];
  const stateOptions = [
    { value: "", label: "All States" },
    ...(filterOptions?.states ?? []).map((s) => ({ value: s, label: s })),
  ];
  const tagOptions = (filterOptions?.tags ?? []).map((t) => ({ value: t, label: t }));

  return (
    <Card>
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[240px]">
          <Input
            placeholder="Search by name, email, phone or description..."
            leftIcon={<Search size={16} />}
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>
        <NativeSelect
          options={INDUSTRY_OPTIONS}
          value={filters.industry}
          onChange={(e) => onFilterChange({ industry: e.target.value })}
          className="min-w-[160px]"
        />
        <NativeSelect
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="min-w-[160px]"
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
        <NativeSelect
          options={SIZE_OPTIONS}
          value={filters.companySize}
          onChange={(e) => onFilterChange({ companySize: e.target.value })}
          aria-label="Company size"
        />
        <NativeSelect
          options={countryOptions}
          value={filters.country}
          onChange={(e) => onFilterChange({ country: e.target.value })}
          aria-label="Country"
        />
        <NativeSelect
          options={stateOptions}
          value={filters.state}
          onChange={(e) => onFilterChange({ state: e.target.value })}
          aria-label="State"
        />
        <Select
          options={ownerOptions}
          value={ownerOptions.find((opt) => opt.value === filters.assignedTo) ?? null}
          onChange={(selected) => onFilterChange({ assignedTo: selected?.value ?? "" })}
          placeholder="Owner"
          isClearable
          aria-label="Owner"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        <Select
          isMulti
          options={tagOptions}
          value={tagOptions.filter((opt) => filters.tags.includes(opt.value))}
          onChange={(selected) => onFilterChange({ tags: selected ? selected.map((s) => s.value) : [] })}
          placeholder="Tags"
          aria-label="Tags"
        />
        <DateInput
          value={filters.dateFrom}
          onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
          aria-label="Created from"
        />
        <DateInput
          value={filters.dateTo}
          onChange={(e) => onFilterChange({ dateTo: e.target.value })}
          aria-label="Created to"
        />
      </div>
    </Card>
  );
};

export default CompanyFiltersBar;
