import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getCampaigns } from "../api/campaignApi";
import CampaignModal from "../components/CampaignModal";
import { useNavigate } from "react-router-dom";
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
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [open, setOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await getCampaigns({
        search: searchTerm,
        status: statusFilter,
        page,
        limit: 5,
      });
      setCampaigns(response.data.data);
      setTotalPages(response.data.pagenation.totalPages);
      console.log(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [searchTerm, page, statusFilter]);

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
            <PageHeader
              icon={<Megaphone className="w-8 h-8 text-indigo-600" />}
              title="Campaigns"
              subtitle="Manage your campaigns database"
              primaryActionText="+ Create Campaign"
              onPrimaryAction={() => setOpen(true)}
            />

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search campaigns..."
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
                    <option value="draft">Draft</option>
                    <option value="send">Send</option>
                  </select>
                  {/* <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="sale">Sale</option>
                </select> */}
                  <button
                    onClick={() => {
                      setStatusFilter("");
                      setSearchTerm("");
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Is Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <TableSkeleton rows={5} cols={6} />
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="h-56 flex flex-col items-center justify-center text-gray-500">
                        <EmptyState
                          icon="🗂️"
                          title="No Campaigns Yet"
                          description="You haven’t added any campaigns. Start by creating one."
                          actionText="+ Add First Campaign"
                          onAction={() => setOpen(true)}
                        />
                      </div>
                    </td>
                  </tr>
                ) : (
                  campaigns.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-3 py-4">{c.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                        {c.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {c.emailTemplate.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {c.isScheduled ? "✅" : "❌"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                        {c.status}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                            onClick={() => navigate(`/campaigns/${c._id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              prev
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
      <CampaignModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onCreated={fetchCampaign}
      />
    </Layout>
  );
};

export default Campaigns;
