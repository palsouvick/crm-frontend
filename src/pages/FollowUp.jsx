import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { getFollowUps, deleteFollowUp } from "../api/followUpApi";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
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
  UserCircle,
  Check,
  RefreshCw,
} from "lucide-react";

const FollowUp = () => {
  const [followUps, setFollowUps] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const handleSearch = (e) => {
    console.log(e.target.value);
    setSearch(e.target.value);
    setPage(1);
  };

  const fetchFollowup = async () => {
    try {
      setLoading(true);
      const res = await getFollowUps({
        page,
        limit,
        search,
        type: typeFilter,
        priority: priorityFilter,
      });
      setFollowUps(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchFollowup();
  }, [search, page, limit, typeFilter, priorityFilter]);

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteFollowUp(deleteTarget._id);
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchFollowup();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
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
      <div className="bg-white p-4 rounded shadow h-full">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <RefreshCw className="w-8 h-8 text-indigo-600" />
                  Follow Ups
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your Follow Ups database
                </p>
              </div>
              <div className="flex flex-row gap-3">
                <button
                  onClick={() => navigate("/follow-up/create")}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Follow Ups
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
                      onChange={handleSearch}
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
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select Type</option>
                    <option value="call">Call</option>
                    <option value="meeting">Meeting</option>
                    <option value="email">Email</option>
                    <option value="demo">Demo</option>
                    <option value="payment">Payment</option>
                  </select>
                  <select
                    name="priority"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                  >
                    <option value="">Select Priority</option>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <button
                    onClick={() => {
                      setTypeFilter("");
                      setPriorityFilter("");
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

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <TableSkeleton rows={5} cols={6} />
                ) : followUps.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="h-56 flex flex-col items-center justify-center text-gray-500">
                        <EmptyState
                          icon="🗂️"
                          title="No Follow-Ups Yet"
                          description="You haven’t added any follow-ups. Start by creating one."
                          actionText="+ Add First Follow-Up"
                          navigateTo={() => navigate("/follow-up/create")}
                        />
                      </div>
                    </td>
                  </tr>
                ) : (
                  followUps.map((f) => (
                    <tr key={f._id} className="border-t">
                      <td className="px-3 py-4">
                        {f.lead?.customer?.name || "-"}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 capitalize">
                        {f.type}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {new Date(f.followUpDate).toLocaleString()}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 capitalize">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            f.followUpStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : f.followUpStatus === "done"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {f.followUpStatus}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {f.assignedTo?.name}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 capitalize">
                        {f.priority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {f.followUpStatus === "pending" && (
                            <button
                              onClick={() => handleComplete(f._id)}
                              className="flex items-center gap-1 border px-3 py-1 bg-green-600 text-white rounded"
                            >
                                <Check className="w-4 h-4" />
                              Done
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setDeleteTarget(f);
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
          <ConfirmDeleteModal
            isOpen={deleteOpen}
            title="Delete Customer"
            message={`Are you sure you want to delete "${deleteTarget?.lead?.customer?.name}"? This action cannot be undone.`}
            onCancel={() => {
              setDeleteOpen(false);
              setDeleteTarget(null);
            }}
            onConfirm={confirmDelete}
            loading={deleting}
          />
        </div>
      </div>

      {/* {open && (
        <FollowUpModal
          onClose={() => setOpen(false)}
          onSuccess={fetchFollowUps}
        />
      )} */}
    </Layout>
  );
};

export default FollowUp;
