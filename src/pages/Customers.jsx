import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  exportCustomerData,
} from "../api/customerApi";
import CustomerModal from "../components/CustomerModal";
import { getUsers } from "../api/userApi";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import EmptyState from "../components/EmptyState";
import {
  Megaphone,
  UserCheck,
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
  UserCircle,
} from "lucide-react";

const Customers = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomers({
        page,
        limit: 5,
        search,
        status: statusFilter,
        assignedTo: assignedToFilter,
      });

      setCustomers(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, []);

  // Initial customers fetch
  useEffect(() => {
    fetchCustomers();
  }, [page, search, statusFilter, assignedToFilter]);

  const handleCreate = async (data) => {
    await createCustomer(data);
    await fetchCustomers(); // refresh list
    setModalOpen(false);
    setSelectedCustomer(null); // reset
  };

  const handleUpdate = async (data) => {
    await updateCustomer(selectedCustomer._id, data);
    setSelectedCustomer(null);
    setModalOpen(false);
    await fetchCustomers();
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteCustomer(deleteTarget._id);
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchCustomers();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    console.log("Exporting...");
    const res = await exportCustomerData();
    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
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

  return (
    <Layout>
      <div className=" min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <UserCheck className="w-8 h-8 text-indigo-600" />
                  Customers
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your Customers database
                </p>
              </div>
              <div className="flex flex-row gap-3">
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setModalOpen(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Customer
                </button>
                <button
                  onClick={handleExport}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg mr-4"
                >
                  Download CSV
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search customer..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
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
                  onChange={(e) => setAssignedToFilter(e.target.value)} 
                  value={assignedToFilter}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Assigned To (TBD)</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setStatusFilter("");
                      setAssignedToFilter("");
                      setSearch("");
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
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <TableSkeleton rows={5} cols={6} />
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="h-56 flex flex-col items-center justify-center text-gray-500">
                        <EmptyState
                          icon="🗂️"
                          title="No Customers Yet"
                          description="You haven’t added any customer. Start by creating one."
                          actionText="+ Add First Customer"
                          onAction={() => setOpen(true)}
                        />
                      </div>
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c._id} className="border-t">
                      <td className="px-3 py-4">{c.name}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {c.phone}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {c.email}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {c.assignedTo?.name || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedCustomer(c);
                              setModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setDeleteTarget(c);
                              setDeleteOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
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
          <CustomerModal
            isOpen={modalOpen}
            customer={selectedCustomer}
            onClose={() => setModalOpen(false)}
            onSubmit={selectedCustomer ? handleUpdate : handleCreate}
            users={users}
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
      </div>
    </Layout>
  );
};

export default Customers;
