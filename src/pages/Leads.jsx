import { useEffect, useState } from "react";
import LeadModal from "../components/LeadModal";
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  exportLeadData,
} from "../api/leadApi";
import { getCustomers } from "../api/customerApi";
import { getUsers } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import {
  History,
  UserPlus,
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
} from "lucide-react";
import EmptyState from "../components/EmptyState";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leadRes, custRes, userRes] = await Promise.all([
        getLeads({
          page,
          limit: 5,
          search,
          status: statusFilter,
          source: sourceFilter,
        }),
        getCustomers({
          page,
          limit: 5,
          search,
        }),

        getUsers(),
      ]);
      console.log("Leads API response:", leadRes.data);
      setLeads(leadRes.data.data);
      setCustomers(custRes.data.data);
      setTotalPages(leadRes.data.pagination.totalPages);
      setUsers(userRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch leads or customers", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, page, statusFilter, sourceFilter]);

  const handleCreate = async (data) => {
    await createLead(data);
    await getLeads();
    setModalOpen(false);
    fetchData();
  };

  const handleUpdate = async (data) => {
    await updateLead(selectedLead._id, data);
    await getLeads();
    setModalOpen(false);
    fetchData();
  };

  const handleStatusChange = async (id, status) => {
    await updateLead(id, { status });
    fetchData();
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

  const handleExport = async () => {
    try {
      const res = await exportLeadData();
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.csv";
      a.click();
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteLead(deleteTarget._id);
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <UserPlus className="w-8 h-8 text-indigo-600" />
                  Leads
                </h1>
                <p className="text-gray-600 mt-1">Manage your Leads database</p>
              </div>
              <div className="flex flex-row gap-3">
                <button
                  onClick={() => {
                    setModalOpen(true);
                    setSelectedLead(null);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Lead
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
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>

                  <select
                    name="source"
                    className="w-full border px-3 py-2 rounded"
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                  >
                    <option value="">All Sources</option>
                    <option value="website">Website</option>
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="referral">Referral</option>
                    <option value="other">Other</option>
                  </select>

                  <button
                    onClick={() => {
                      setStatusFilter("");
                      setSourceFilter("");
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
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
                          title="No Leads Yet"
                          description="You haven’t added any lead. Start by creating one."
                          actionText="+ Add First Lead"
                          onAction={() => setModalOpen(true)}
                        />
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((l) => (
                    <tr key={l._id} className="border-t">
                      <td className="px-3 py-4">{l.customer?.name}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{l.customer?.email}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{l.customer?.phone}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{l.expectedValue || "—"}</td>
                      <td className="px-3 py-4 text-sm text-gray-500 capitalize">{l.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedLead(l);
                            setModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => navigate(`/leads/${l._id}`)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setDeleteTarget(l);
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
          <LeadModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={selectedLead ? handleUpdate : handleCreate}
            customers={customers}
            lead={selectedLead}
            users={users}
          />
          <ConfirmDeleteModal
            isOpen={deleteOpen}
            title="Delete Customer"
            message={`Are you sure you want to delete "${deleteTarget?.customer?.name}"? This action cannot be undone.`}
            onCancel={() => {
              setDeleteOpen(false);
              setDeleteTarget(null);
            }}
            onConfirm={confirmDelete}
            loading={deleting}
          />
        </div>
      </div>
    </>
  );
};

export default Leads;
