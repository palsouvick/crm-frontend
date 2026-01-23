import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { createUser, getUsers, updateUser, deleteUser } from "../api/userApi";
import UserModal from "../components/UserModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useCrudMutation from "../hooks/useCrudMutation";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import toast from "react-hot-toast";
import {
  Megaphone,
  UsersIcon,
  Building2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Globe,
  MapPin,
  DollarSign,
  Calendar,
  Tag,
  X,
  Upload,
  ChevronDown,
  ChevronUp,
  Briefcase,
} from "lucide-react";

const Users = () => {
  // const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // const fetchUsers = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await getUsers({
  //       page,
  //       limit: 5,
  //       search,
  //     });
  //     setUsers(res.data.data);
  //     setTotalPages(res.data.pagination.totalPages);
  //   } catch (error) {
  //     console.error("Failed to fetch users", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const handleSearch = () => {
  //   setPage(1);
  //   fetchUsers();
  // };
  // useEffect(() => {
  //   fetchUsers();
  // }, [page, search]);
  const { data, isLoading } = useQuery({
    queryKey: ["users", page, searchTerm, statusFilter, roleFilter],
    queryFn: () =>
      getUsers({
        page,
        limit: 5,
        search: searchTerm,
        status: statusFilter,
        role: roleFilter,
      }),
  });
  const users = data?.data?.data || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;

  // const handleCreate = async (data) => {
  //   const res = await createUser(data);
  //   await fetchUsers();
  //   setModalOpen(false);
  //   setSelectedUsers(null);
  // };

  // const handleUpdate = async (data) => {
  //   // To be implemented
  //   await updateUser(selectedUsers._id, data);
  //   await fetchUsers();
  //   setModalOpen(false);
  //   setSelectedUsers(null);
  // };
  const createUserMutation = useCrudMutation({
    mutationFn: createUser,
    queryKey: ["users"],
  });

  const handleCreate = (formData) => {
    setServerErrors(null);

    createUserMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("User created successfully");
        setModalOpen(false);
        setSelectedUsers(null);
      },
      onError: (error) => {
        const data = error?.response?.data;
        console.log("data ---", data);
        if (data?.field) {
          // 🔥 email error modal এ পাঠাবো
          setServerErrors({
            [data.field]: data.message,
          });
        } else {
          alert(data?.message || "Something went wrong");
        }
      },
    });
  };

  // update
  const updateUserMutation = useCrudMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    queryKey: ["users"],
  });

  const handleUpdate = (formData) => {
    setServerErrors(null);

    updateUserMutation.mutate(
      {
        id: selectedUsers._id,
        data: formData,
      },
      {
        onSuccess: () => {
          toast.success("User updated successfully");
          setModalOpen(false);
          setSelectedUsers(null);
        },
        onError: (error) => {
          const data = error?.response?.data;

          if (data?.field) {
            setServerErrors({
              [data.field]: data.message,
            });
          } else {
            alert(data?.message || "Update failed");
          }
        },
      },
    );
  };

  // delete
  const deleteUserMutation = useCrudMutation({
    mutationFn: deleteUser,
    queryKey: ["users"],
  });

  const StatusBadge = ({ status }) => {
    const map = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-200 text-gray-600",
    };

    return (
      <span
        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
          map[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </span>
    );
  };

  const RoleBadge = ({ role }) => {
    const map = {
      admin: "bg-indigo-100 text-indigo-700",
      user: "bg-blue-100 text-blue-700",
    };

    return (
      <span
        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
          map[role] || "bg-gray-100 text-gray-600"
        }`}
      >
        {role}
      </span>
    );
  };

  const TableSkeleton = ({ rows = 5, cols = 6 }) => (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
  const openDeleteModal = (user) => {
    setDeleteTarget(user);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!deleteTarget) return;
      deleteUserMutation.mutate(deleteTarget._id, {
        onSuccess: () => {
          toast.success("User deleted successfully");
          setDeleteOpen(false);
          setDeleteTarget(null);
        },
      });
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <UsersIcon className="w-8 h-8 text-indigo-600" />
                  Users
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your company database
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedUsers(null);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add User
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {showFilters ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="sale">Sale</option>
                  </select>
                  <button
                    onClick={() => {
                      setStatusFilter("");
                      setSearchTerm("");
                      setRoleFilter("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <TableSkeleton rows={5} cols={6} />
                ) : users.length === 0 ? (
                  <tr className="hover:bg-gray-50">
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u, index) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 font-medium text-gray-800">
                        {u.name}
                      </td>

                      <td className="px-3 py-4 text-gray-600">
                        {u.phone || "—"}
                      </td>

                      <td className="px-3 py-4 text-gray-600">{u.email}</td>

                      <td className="px-3 py-4">
                        <StatusBadge status={u.status} />
                      </td>

                      <td className="px-3 py-4">
                        <RoleBadge role={u.role} />
                      </td>

                      <td className="px-3 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedUsers(u);
                              setModalOpen(true);
                            }}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => openDeleteModal(u)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex gap-2 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-3 py-1">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <UserModal
        isOpen={modalOpen}
        user={selectedUsers}
        onClose={() => setModalOpen(false)}
        onSubmit={selectedUsers ? handleUpdate : handleCreate}
        serverErrors={serverErrors}
      />
      <ConfirmDeleteModal
        isOpen={deleteOpen}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </Layout>
  );
};

export default Users;
