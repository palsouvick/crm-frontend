import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { createUser, getUsers, updateUser, deleteUser } from "../api/userApi";
import UserModal from "../components/UserModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useCrudMutation from "../hooks/useCrudMutation";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import toast from "react-hot-toast";

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
    queryKey: ["users", page, search],
    queryFn: () =>
      getUsers({
        page,
        limit: 5,
        search,
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
      }
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
      <div className=" bg-white p-4 rounded shadow h-full">
        <h1 className="text-2xl font-bold mb-4">Users</h1>

        {/* Search */}
        <div className="flex mb-4 gap-2 justify-between">
          <div>
            <input
              type="text"
              placeholder="Search name, email, phone"
              className="border px-3 py-2 rounded w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex justify-between mb-4">
            <button
              onClick={() => {
                setSelectedUsers(null);
                setModalOpen(true);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              + Add Customer
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-600">
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Phone</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Role</th>
                <th className="px-6 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u, index) => (
                  <tr
                    key={u._id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50 transition`}
                  >
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
      </div>
    </Layout>
  );
};

export default Users;
