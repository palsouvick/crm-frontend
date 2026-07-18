import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import Button from "../components/ui/Button";
import CampaignSummaryCards from "../components/campaign/CampaignSummaryCards";
import CampaignFiltersBar from "../components/campaign/CampaignFiltersBar";
import BulkActionsBar from "../components/campaign/BulkActionsBar";
import CampaignsTable from "../components/campaign/CampaignsTable";
import Pagination from "../components/ui/Pagination";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import CampaignModal from "../components/CampaignModal";
import TestEmailModal from "../components/TestEmailModal";
import { exportCampaignData, sendTestEmail as sendTestEmailApi } from "../api/campaignApi";
import { getEmailTemplates } from "../api/emailTemplateApi";
import { getUsers } from "../api/userApi";
import {
  useCampaignsList,
  useCampaignFilterOptions,
  useDeleteCampaign,
  useDuplicateCampaign,
  usePauseCampaign,
  useResumeCampaign,
  useArchiveCampaign,
  useBulkPauseCampaigns,
  useBulkResumeCampaigns,
  useBulkArchiveCampaigns,
  useBulkDeleteCampaigns,
} from "../hooks/useCampaigns";

const INITIAL_FILTERS = {
  search: "",
  status: "",
  type: "",
  emailTemplate: "",
  createdBy: "",
  audienceType: "",
  tags: [],
  dateFrom: "",
  dateTo: "",
  overdueOnly: false,
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

const Campaigns = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [testEmailTarget, setTestEmailTarget] = useState(null);
  const [sendingTest, setSendingTest] = useState(false);

  const { data, isLoading, isError, refetch } = useCampaignsList({
    page,
    limit: 10,
    ...filters,
    tags: filters.tags.join(","),
  });
  const { data: filterOptions } = useCampaignFilterOptions();

  const campaigns = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const deleteCampaignMutation = useDeleteCampaign();
  const duplicateCampaignMutation = useDuplicateCampaign();
  const pauseCampaignMutation = usePauseCampaign();
  const resumeCampaignMutation = useResumeCampaign();
  const archiveCampaignMutation = useArchiveCampaign();
  const bulkPauseMutation = useBulkPauseCampaigns();
  const bulkResumeMutation = useBulkResumeCampaigns();
  const bulkArchiveMutation = useBulkArchiveCampaigns();
  const bulkDeleteMutation = useBulkDeleteCampaigns();

  useEffect(() => {
    getEmailTemplates({ limit: 200 })
      .then((res) => {
        const templates = res.data?.data ?? [];
        setTemplateOptions(templates.map((t) => ({ value: t._id, label: t.name })));
      })
      .catch(() => {});
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
      const res = await exportCampaignData(params);
      downloadCsv(res.data, "campaigns.csv");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteCampaignMutation.mutate(deleteTarget._id, {
      onSuccess: () => {
        toast.success("Campaign deleted successfully");
        setDeleteOpen(false);
        setDeleteTarget(null);
      },
      onError: (error) => toast.error(error?.response?.data?.message || "Failed to delete campaign"),
    });
  };

  const handleDuplicate = (campaign) => {
    duplicateCampaignMutation.mutate(campaign._id, {
      onSuccess: () => toast.success(`Duplicated "${campaign.name}" as a new draft`),
      onError: () => toast.error("Failed to duplicate campaign"),
    });
  };

  const handlePause = (campaign) => {
    pauseCampaignMutation.mutate(campaign._id, {
      onSuccess: () => toast.success("Campaign paused"),
      onError: (error) => toast.error(error?.response?.data?.message || "Failed to pause campaign"),
    });
  };

  const handleResume = (campaign) => {
    resumeCampaignMutation.mutate(campaign._id, {
      onSuccess: () => toast.success("Campaign resumed"),
      onError: (error) => toast.error(error?.response?.data?.message || "Failed to resume campaign"),
    });
  };

  const handleArchive = (campaign) => {
    archiveCampaignMutation.mutate(campaign._id, {
      onSuccess: () => toast.success("Campaign archived"),
      onError: (error) => toast.error(error?.response?.data?.message || "Failed to archive campaign"),
    });
  };

  const handleSendTest = async (email) => {
    if (!testEmailTarget) return;
    try {
      setSendingTest(true);
      await sendTestEmailApi(testEmailTarget._id, { email });
      toast.success("Test email sent successfully");
      setTestEmailTarget(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send test email");
    } finally {
      setSendingTest(false);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const handleToggleSelectAll = () => {
    const pageIds = campaigns.map((c) => c._id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : pageIds);
  };

  const handleBulkPause = () => {
    bulkPauseMutation.mutate(selectedIds, {
      onSuccess: () => {
        toast.success("Selected campaigns paused");
        setSelectedIds([]);
      },
      onError: () => toast.error("Bulk pause failed"),
    });
  };

  const handleBulkResume = () => {
    bulkResumeMutation.mutate(selectedIds, {
      onSuccess: () => {
        toast.success("Selected campaigns resumed");
        setSelectedIds([]);
      },
      onError: () => toast.error("Bulk resume failed"),
    });
  };

  const handleBulkArchive = () => {
    bulkArchiveMutation.mutate(selectedIds, {
      onSuccess: () => {
        toast.success("Selected campaigns archived");
        setSelectedIds([]);
      },
      onError: () => toast.error("Bulk archive failed"),
    });
  };

  const confirmBulkDelete = () => {
    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        toast.success(`${selectedIds.length} campaigns deleted`);
        setSelectedIds([]);
        setBulkDeleteOpen(false);
      },
      onError: () => toast.error("Bulk delete failed"),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        subtitle="Plan, schedule, and track your email campaigns"
        primaryActionText="Add Campaign"
        onPrimaryAction={() => {
          setSelectedCampaign(null);
          setModalOpen(true);
        }}
      />

      <CampaignSummaryCards />

      <CampaignFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onExport={() => handleExport()}
        isExporting={isExporting}
        filterOptions={filterOptions}
        templateOptions={templateOptions}
        userOptions={userOptions}
      />

      <BulkActionsBar
        selectedCount={selectedIds.length}
        onPause={handleBulkPause}
        onResume={handleBulkResume}
        onArchive={handleBulkArchive}
        onDelete={() => setBulkDeleteOpen(true)}
        onExportSelected={() => handleExport(selectedIds)}
        onClear={() => setSelectedIds([])}
        isBusy={
          bulkPauseMutation.isPending ||
          bulkResumeMutation.isPending ||
          bulkArchiveMutation.isPending ||
          bulkDeleteMutation.isPending
        }
      />

      {isError ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-body text-ink-muted">We couldn't load campaigns right now.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <CampaignsTable
            campaigns={campaigns}
            isLoading={isLoading}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onView={(campaign) => navigate(`/campaigns/${campaign._id}`)}
            onEdit={(campaign) => {
              setSelectedCampaign(campaign);
              setModalOpen(true);
            }}
            onDuplicate={handleDuplicate}
            onPause={handlePause}
            onResume={handleResume}
            onSendTest={(campaign) => setTestEmailTarget(campaign)}
            onArchive={handleArchive}
            onDelete={(campaign) => {
              setDeleteTarget(campaign);
              setDeleteOpen(true);
            }}
          />

          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}

      <CampaignModal
        isOpen={modalOpen}
        campaign={selectedCampaign}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          toast.success(selectedCampaign ? "Campaign updated successfully" : "Campaign created successfully");
          refetch();
        }}
      />

      <TestEmailModal
        isOpen={Boolean(testEmailTarget)}
        onClose={() => setTestEmailTarget(null)}
        onSend={handleSendTest}
        template={testEmailTarget?.emailTemplate}
        loading={sendingTest}
      />

      <ConfirmDeleteModal
        isOpen={deleteOpen}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        loading={deleteCampaignMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={bulkDeleteOpen}
        title="Delete Campaigns"
        message={`Are you sure you want to delete ${selectedIds.length} selected campaigns? This action cannot be undone.`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={confirmBulkDelete}
        loading={bulkDeleteMutation.isPending}
      />
    </div>
  );
};

export default Campaigns;
