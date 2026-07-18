import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import Button from "../components/ui/Button";
import CompanySummaryCards from "../components/company/CompanySummaryCards";
import CompanyFiltersBar from "../components/company/CompanyFiltersBar";
import BulkActionsBar from "../components/company/BulkActionsBar";
import CompaniesTable from "../components/company/CompaniesTable";
import Pagination from "../components/ui/Pagination";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import AssignOwnerModal from "../components/company/AssignOwnerModal";
import BulkStatusModal from "../components/company/BulkStatusModal";
import { exportCompanyData } from "../api/companyApi";
import { getUsers } from "../api/userApi";
import {
  useCompaniesList,
  useCompanyFilterOptions,
  useUpdateCompany,
  useDeleteCompany,
  useBulkAssignOwner,
  useBulkUpdateCompanyStatus,
  useBulkDeleteCompanies,
} from "../hooks/useCompanies";

const INITIAL_FILTERS = {
  search: "",
  industry: "",
  status: "",
  companySize: "",
  country: "",
  state: "",
  assignedTo: "",
  tags: [],
  dateFrom: "",
  dateTo: "",
};

const downloadCsv = (blobData, filename) => {
  const blob = new Blob([blobData]);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

const Company = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [userOptions, setUserOptions] = useState([]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [assignOwnerTarget, setAssignOwnerTarget] = useState(null);
  const [bulkAssignOwnerOpen, setBulkAssignOwnerOpen] = useState(false);
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useCompaniesList({
    page,
    limit: 10,
    ...filters,
    tags: filters.tags.join(","),
  });
  const { data: filterOptions } = useCompanyFilterOptions();

  const companies = data?.data ?? [];
  const totalPages = data?.pagination?.pages ?? 1;

  const updateCompanyMutation = useUpdateCompany();
  const deleteCompanyMutation = useDeleteCompany();
  const bulkAssignOwnerMutation = useBulkAssignOwner();
  const bulkStatusMutation = useBulkUpdateCompanyStatus();
  const bulkDeleteMutation = useBulkDeleteCompanies();

  useEffect(() => {
    getUsers({ limit: 200 })
      .then((res) => {
        const users = res.data?.data ?? [];
        setUserOptions(users.map((u) => ({ value: u._id, label: u.name })));
      })
      .catch(() => {});
  }, []);

  const handleFilterChange = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
    setSelectedIds([]);
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
    setSelectedIds([]);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    setSelectedIds([]);
  };

  const handleExport = async (ids) => {
    try {
      setIsExporting(true);
      const params = ids && ids.length
        ? { ids: ids.join(",") }
        : { ...filters, tags: filters.tags.join(",") };
      const res = await exportCompanyData(params);
      downloadCsv(res.data, "companies.csv");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteCompanyMutation.mutate(deleteTarget._id, {
      onSuccess: () => {
        toast.success("Company deleted successfully");
        setDeleteOpen(false);
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to delete company"),
    });
  };

  const handleArchive = (company) => {
    updateCompanyMutation.mutate(
      { id: company._id, data: { status: "inactive" } },
      {
        onSuccess: () => toast.success("Company archived"),
        onError: () => toast.error("Failed to archive company"),
      }
    );
  };

  const handleAssignOwnerSubmit = (ownerIds) => {
    updateCompanyMutation.mutate(
      { id: assignOwnerTarget._id, data: { assignedTo: ownerIds } },
      {
        onSuccess: () => {
          toast.success("Owner(s) updated");
          setAssignOwnerTarget(null);
        },
        onError: () => toast.error("Failed to update owners"),
      }
    );
  };

  const handleBulkAssignOwnerSubmit = (ownerIds) => {
    bulkAssignOwnerMutation.mutate(
      { ids: selectedIds, ownerIds },
      {
        onSuccess: () => {
          toast.success(`${selectedIds.length} companies updated`);
          setSelectedIds([]);
          setBulkAssignOwnerOpen(false);
        },
        onError: () => toast.error("Bulk owner assignment failed"),
      }
    );
  };

  const handleBulkStatusSubmit = (status) => {
    bulkStatusMutation.mutate(
      { ids: selectedIds, status },
      {
        onSuccess: () => {
          toast.success(`${selectedIds.length} companies updated`);
          setSelectedIds([]);
          setBulkStatusOpen(false);
        },
        onError: () => toast.error("Bulk status update failed"),
      }
    );
  };

  const confirmBulkDelete = () => {
    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        toast.success(`${selectedIds.length} companies deleted`);
        setSelectedIds([]);
        setBulkDeleteOpen(false);
      },
      onError: () => toast.error("Bulk delete failed"),
    });
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const handleToggleSelectAll = () => {
    const pageIds = companies.map((c) => c._id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : pageIds);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies"
        subtitle="Manage your company database"
        primaryActionText="Add Company"
        onPrimaryAction={() => navigate("/company/create")}
      />

      <CompanySummaryCards />

      <CompanyFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onExport={() => handleExport()}
        isExporting={isExporting}
        filterOptions={filterOptions}
        ownerOptions={userOptions}
      />

      <BulkActionsBar
        selectedCount={selectedIds.length}
        onAssignOwner={() => setBulkAssignOwnerOpen(true)}
        onChangeStatus={() => setBulkStatusOpen(true)}
        onDelete={() => setBulkDeleteOpen(true)}
        onExportSelected={() => handleExport(selectedIds)}
        onClear={() => setSelectedIds([])}
        isBusy={bulkStatusMutation.isPending || bulkDeleteMutation.isPending || bulkAssignOwnerMutation.isPending}
      />

      {isError ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-body text-ink-muted">We couldn't load companies right now.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <CompaniesTable
            companies={companies}
            isLoading={isLoading}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onView={(company) => navigate(`/company/${company._id}`)}
            onEdit={(company) => navigate(`/company/${company._id}/edit`)}
            onAssignOwner={(company) => setAssignOwnerTarget(company)}
            onAddContact={() => navigate("/customers")}
            onCreateLead={() => navigate("/leads")}
            onScheduleFollowUp={() => navigate("/follow-up/create")}
            onSendEmail={() => navigate("/email-templates")}
            onViewTimeline={(company) => navigate(`/company/${company._id}/timeline`)}
            onArchive={handleArchive}
            onDelete={(company) => {
              setDeleteTarget(company);
              setDeleteOpen(true);
            }}
          />

          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}

      <ConfirmDeleteModal
        isOpen={deleteOpen}
        title="Delete Company"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        loading={deleteCompanyMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={bulkDeleteOpen}
        title="Delete Companies"
        message={`Are you sure you want to delete ${selectedIds.length} selected companies? This action cannot be undone.`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={confirmBulkDelete}
        loading={bulkDeleteMutation.isPending}
      />

      <AssignOwnerModal
        isOpen={Boolean(assignOwnerTarget)}
        company={assignOwnerTarget}
        initialOwnerIds={assignOwnerTarget?.assignedTo?.map((u) => u._id) ?? []}
        userOptions={userOptions}
        onClose={() => setAssignOwnerTarget(null)}
        onSubmit={handleAssignOwnerSubmit}
        isSubmitting={updateCompanyMutation.isPending}
      />

      <AssignOwnerModal
        isOpen={bulkAssignOwnerOpen}
        company={null}
        count={selectedIds.length}
        initialOwnerIds={[]}
        userOptions={userOptions}
        onClose={() => setBulkAssignOwnerOpen(false)}
        onSubmit={handleBulkAssignOwnerSubmit}
        isSubmitting={bulkAssignOwnerMutation.isPending}
      />

      <BulkStatusModal
        isOpen={bulkStatusOpen}
        count={selectedIds.length}
        onClose={() => setBulkStatusOpen(false)}
        onSubmit={handleBulkStatusSubmit}
        isSubmitting={bulkStatusMutation.isPending}
      />
    </div>
  );
};

export default Company;
