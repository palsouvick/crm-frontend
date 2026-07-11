import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  deleteEmailTemplate,
  getEmailTemplates,
} from "../api/emailTemplateApi";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import EmailTemplateView from "../components/EmailTemplateView";
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
  Check 
} from "lucide-react";
import EmptyState from "../components/EmptyState";

const EmailTemplate = () => {
  const Navigate = useNavigate();
  const [emailTemplate, setEmailTemplate] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const fetchEmailTemplate = async () => {
    try {
      setLoading(true);
      const res = await getEmailTemplates({page, limit, search, status: statusFilter});
      console.log(res.data);
      setEmailTemplate(res.data.data);
      setTotalPages(res.data.pagination.pages);
      setLoading(false);
      const previewTemplate = Array.isArray(res.data.data)
        ? res.data.data[0]
        : res.data.data;
      console.log("Preview template:", previewTemplate);
      setPreviewTemplate(previewTemplate);
    } catch (error) {
      setLoading(false);
      console.error("Fecth failed", error);
    }
  };
  useEffect(() => {
    fetchEmailTemplate();
  }, [search, page, limit, statusFilter]);

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
  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteEmailTemplate(deleteTarget._id);
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchEmailTemplate();
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setDeleting(false);
    }
  };
  return (
    <>
      <div className=" bg-white p-4 rounded shadow h-full">
        <div className="max-w-7xl mx-auto">
          {/* <h1 className="text-2xl font-bold mb-4">Email Templates</h1>
        <div className="flex mb-4 gap-2 justify-between">
          <div>
            <input
              className="border px-4 py-2 rounded-lg w-72 focus:ring-2 focus:ring-indigo-500"
              placeholder="Search customer..."
               value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex justify-between mb-4">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              onClick={() => Navigate("/email-templates/create")}
            >
              + Add EMail Template
            </button>
          </div>
        </div> */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Mail className="w-8 h-8 text-indigo-600" />
                  Email Templates
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your Email Templates database
                </p>
              </div>
              <div className="flex flex-row gap-3">
                <button
                  onClick={() => navigate("/follow-up/create")}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Email Templates
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
                      placeholder="Search email templates..."
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
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {/* <select
                    name="priority"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                  >
                    <option value="">Select Priority</option>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select> */}
                  <button
                    onClick={() => {
                      setStatusFilter("");
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <TableSkeleton rows={5} cols={6} />
                ) : emailTemplate.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="h-56 flex flex-col items-center justify-center text-gray-500">
                        <EmptyState
                          icon="🗂️"
                          title="No Email Templates Yet"
                          description="You haven’t added any email templates. Start by creating one."
                          actionText="+ Add First Email Template"
                          navigateTo={() => navigate("/email-templates/create")}
                        />
                      </div>
                    </td>
                  </tr>
                ) : (
                  emailTemplate.map((t) => (
                    <tr key={t._id} className="border-t">
                      <td className="px-3 py-4">{t.name}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{t.subject}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {t.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          onClick={() =>
                            navigate(`/email-templates/${t._id}/edit`)
                          }
                        >
                           <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                          onClick={() => {
                            setShowPreview(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          onClick={() => {
                            setDeleteTarget(t);
                            setDeleteOpen(true);
                          }}
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
            message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
            onCancel={() => {
              setDeleteOpen(false);
              setDeleteTarget(null);
            }}
            onConfirm={confirmDelete}
            loading={deleting}
          />
          {/* Preview Modal */}
          {showPreview && (
            <EmailTemplateView
              template={previewTemplate}
              onClose={() => setShowPreview(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default EmailTemplate;
