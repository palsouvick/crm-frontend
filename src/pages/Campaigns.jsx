import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getCampaigns } from "../api/campaignApi";
import CampaignModal from "../components/CampaignModal";
import { useNavigate } from "react-router-dom";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [open, setOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await getCampaigns();
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
  }, []);

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
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <button
            onClick={() => setOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            + Create Campaign
          </button>
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Template Name</th>
                <th className="p-3 text-left">Is Schedule</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : (
                campaigns.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-3 text-center text-gray-500">
                      No campaigns found.
                    </td>
                  </tr>
              ) : ( campaigns.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.type}</td>
                  <td className="p-3">{c.emailTemplate.name}</td>
                  <td className="p-3">{c.isScheduled ? "✅" : "❌"}</td>
                  <td className="p-3 capitalize">{c.status}</td>
                  <td className="p-3">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button className="bg-blue-600 px-3 py-1.5 rounded mr-1.5">Edit</button>
                    <button className="bg-indigo-600 px-3 py-1.5 rounded mr-1.5" onClick={()=>navigate(`/campaigns/${c._id}`)}>view</button>
                  </td>
                </tr>
              ))))}
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
        <CampaignModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onCreated={fetchCampaign}
        />
      </div>
    </Layout>
  );
};

export default Campaigns;
