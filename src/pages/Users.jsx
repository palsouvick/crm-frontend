import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Button from "../components/ui/Button";
import UserSummaryCards from "../components/users/UserSummaryCards";
import UserFiltersBar from "../components/users/UserFiltersBar";
import BulkActionsBar from "../components/users/BulkActionsBar";
import UsersTable from "../components/users/UsersTable";
import Pagination from "../components/ui/Pagination";
import UserModal from "../components/UserModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import ResetPasswordModal from "../components/users/ResetPasswordModal";
import AssignRoleModal from "../components/users/AssignRoleModal";
import ImportUsersModal from "../components/users/ImportUsersModal";
import { exportUserData } from "../api/userApi";
import {
  useUsersList,
  useUserFilterOptions,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useResetUserPassword,
  useBulkUpdateUserStatus,
  useBulkDeleteUsers,
  useImportUsers,
} from "../hooks/useUsers";

const INITIAL_FILTERS = {
  search: "",
  role: "",
  status: "",
  department: "",
  designation: "",
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

const Users = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [serverErrors, setServerErrors] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [resetPasswordTarget, setResetPasswordTarget] = useState(null);
  const [assignRoleTarget, setAssignRoleTarget] = useState(null);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useUsersList({ page, limit: 10, ...filters });
  const { data: filterOptions } = useUserFilterOptions();

  const users = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const resetPasswordMutation = useResetUserPassword();
  const bulkStatusMutation = useBulkUpdateUserStatus();
  const bulkDeleteMutation = useBulkDeleteUsers();
  const importUsersMutation = useImportUsers();

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
      const params = ids && ids.length ? { ids: ids.join(",") } : filters;
      const res = await exportUserData(params);
      downloadCsv(res.data, "users.csv");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreate = (formData) => {
    setServerErrors(null);
    createUserMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("User created successfully");
        setModalOpen(false);
        setSelectedUser(null);
      },
      onError: (error) => {
        const data = error?.response?.data;
        if (data?.field) {
          setServerErrors({ [data.field]: data.message });
        } else {
          toast.error(data?.message || "Something went wrong");
        }
      },
    });
  };

  const handleUpdate = (formData) => {
    setServerErrors(null);
    updateUserMutation.mutate(
      { id: selectedUser._id, data: formData },
      {
        onSuccess: () => {
          toast.success("User updated successfully");
          setModalOpen(false);
          setSelectedUser(null);
        },
        onError: (error) => {
          const data = error?.response?.data;
          if (data?.field) {
            setServerErrors({ [data.field]: data.message });
          } else {
            toast.error(data?.message || "Update failed");
          }
        },
      }
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteUserMutation.mutate(deleteTarget._id, {
      onSuccess: () => {
        toast.success("User deleted successfully");
        setDeleteOpen(false);
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to delete user"),
    });
  };

  const handleToggleStatus = (user) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    updateUserMutation.mutate(
      { id: user._id, data: { status: nextStatus } },
      {
        onSuccess: () => toast.success(`User ${nextStatus === "active" ? "activated" : "deactivated"}`),
        onError: () => toast.error("Failed to update status"),
      }
    );
  };

  const handleResetPassword = (password) => {
    resetPasswordMutation.mutate(
      { id: resetPasswordTarget._id, password },
      {
        onSuccess: () => {
          toast.success("Password reset successfully");
          setResetPasswordTarget(null);
        },
        onError: (error) =>
          toast.error(error?.response?.data?.message || "Failed to reset password"),
      }
    );
  };

  const handleAssignRole = (role) => {
    updateUserMutation.mutate(
      { id: assignRoleTarget._id, data: { role } },
      {
        onSuccess: () => {
          toast.success("Role updated successfully");
          setAssignRoleTarget(null);
        },
        onError: () => toast.error("Failed to update role"),
      }
    );
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const handleToggleSelectAll = () => {
    const pageIds = users.map((u) => u._id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : pageIds);
  };

  const handleBulkStatus = (status) => {
    bulkStatusMutation.mutate(
      { ids: selectedIds, status },
      {
        onSuccess: () => {
          toast.success(`${selectedIds.length} users updated`);
          setSelectedIds([]);
        },
        onError: () => toast.error("Bulk update failed"),
      }
    );
  };

  const handleImport = (file) => {
    return importUsersMutation.mutateAsync(file, {
      onSuccess: (result) => {
        if (result.createdCount > 0) {
          toast.success(`${result.createdCount} user${result.createdCount === 1 ? "" : "s"} imported`);
        }
      },
      onError: () => toast.error("Import failed"),
    });
  };

  const confirmBulkDelete = () => {
    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        toast.success(`${selectedIds.length} users deleted`);
        setSelectedIds([]);
        setBulkDeleteOpen(false);
      },
      onError: () => toast.error("Bulk delete failed"),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Manage your company's team members and permissions"
        primaryActionText="Add User"
        onPrimaryAction={() => {
          setSelectedUser(null);
          setModalOpen(true);
        }}
        secondaryActionText="Import Users"
        onSecondaryAction={() => setImportModalOpen(true)}
      />

      <UserSummaryCards />

      <UserFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onExport={() => handleExport()}
        isExporting={isExporting}
        filterOptions={filterOptions}
      />

      <BulkActionsBar
        selectedCount={selectedIds.length}
        onActivate={() => handleBulkStatus("active")}
        onDeactivate={() => handleBulkStatus("inactive")}
        onDelete={() => setBulkDeleteOpen(true)}
        onExportSelected={() => handleExport(selectedIds)}
        onClear={() => setSelectedIds([])}
        isBusy={bulkStatusMutation.isPending || bulkDeleteMutation.isPending}
      />

      {isError ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-body text-ink-muted">We couldn't load users right now.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <UsersTable
            users={users}
            isLoading={isLoading}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onView={(user) => navigate(`/users/${user._id}`)}
            onEdit={(user) => {
              setSelectedUser(user);
              setModalOpen(true);
            }}
            onResetPassword={(user) => setResetPasswordTarget(user)}
            onAssignRole={(user) => setAssignRoleTarget(user)}
            onToggleStatus={handleToggleStatus}
            onDelete={(user) => {
              setDeleteTarget(user);
              setDeleteOpen(true);
            }}
          />

          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}

      <UserModal
        isOpen={modalOpen}
        user={selectedUser}
        onClose={() => setModalOpen(false)}
        onSubmit={selectedUser ? handleUpdate : handleCreate}
        serverErrors={serverErrors}
      />

      <ConfirmDeleteModal
        isOpen={deleteOpen}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        loading={deleteUserMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={bulkDeleteOpen}
        title="Delete Users"
        message={`Are you sure you want to delete ${selectedIds.length} selected users? This action cannot be undone.`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={confirmBulkDelete}
        loading={bulkDeleteMutation.isPending}
      />

      <ResetPasswordModal
        isOpen={Boolean(resetPasswordTarget)}
        user={resetPasswordTarget}
        onClose={() => setResetPasswordTarget(null)}
        onSubmit={handleResetPassword}
        isSubmitting={resetPasswordMutation.isPending}
      />

      <AssignRoleModal
        isOpen={Boolean(assignRoleTarget)}
        user={assignRoleTarget}
        onClose={() => setAssignRoleTarget(null)}
        onSubmit={handleAssignRole}
        isSubmitting={updateUserMutation.isPending}
      />

      <ImportUsersModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
        isSubmitting={importUsersMutation.isPending}
      />
    </div>
  );
};

export default Users;
