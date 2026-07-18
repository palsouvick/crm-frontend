import { Search, Download, RotateCcw } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";
import DateInput from "../ui/DateInput";
import Button from "../ui/Button";

const ROLE_OPTIONS = [
  { value: "", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "user", label: "User" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const UserFiltersBar = ({
  filters,
  onFilterChange,
  onReset,
  onExport,
  isExporting,
  filterOptions,
}) => {
  const departmentOptions = [
    { value: "", label: "All Departments" },
    ...(filterOptions?.departments ?? []).map((d) => ({ value: d, label: d })),
  ];
  const designationOptions = [
    { value: "", label: "All Designations" },
    ...(filterOptions?.designations ?? []).map((d) => ({ value: d, label: d })),
  ];

  return (
    <Card>
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[240px]">
          <Input
            placeholder="Search by name, email or phone..."
            leftIcon={<Search size={16} />}
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>
        <Select
          options={ROLE_OPTIONS}
          value={filters.role}
          onChange={(e) => onFilterChange({ role: e.target.value })}
          className="min-w-[160px]"
        />
        <Select
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
        <Select
          options={departmentOptions}
          value={filters.department}
          onChange={(e) => onFilterChange({ department: e.target.value })}
          aria-label="Department"
        />
        <Select
          options={designationOptions}
          value={filters.designation}
          onChange={(e) => onFilterChange({ designation: e.target.value })}
          aria-label="Designation"
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

export default UserFiltersBar;
