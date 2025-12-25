import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getLeadById } from "../api/leadApi";

const LeadView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLead = async () => {
    try {
      setLoading(true);
      console.log("Fetching lead with ID:", id);
      const res = await getLeadById(id);
      console.log("Lead data received:", res.data);
      setLead(res.data.lead);
    } catch (err) {
      setError("Failed to load lead details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  return (
    <Layout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Lead Details
          </h1>
          <p className="text-sm text-gray-500">
            View complete lead information
          </p>
        </div>

        <button
          onClick={() => navigate("/leads")}
          className="px-4 py-2 border rounded-lg text-sm"
        >
          ← Back to Leads
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          Loading lead...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* LEAD CARD */}
      {!loading && lead && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">

          {/* TITLE + STATUS */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {lead.title || "—"}
            </h2>

            <StatusBadge status={lead.status} />
          </div>

          {/* DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Detail label="Customer" value={lead.customar?.name || "—"} />
            <Detail label="Email" value={lead.customar?.email || "—"} />
            <Detail label="Phone" value={lead.customar?.phone || "—"} />
            <Detail label="Company" value={lead.customar?.company || "—"} />

            <Detail label="Expected Value" value={`₹ ${lead.expectedValue || 0}`} />
            <Detail label="Source" value={lead.source} />

            <Detail label="Assigned To" value={lead.assignedTo?.name || "Unassigned"} />
            <Detail label="Created At" value={new Date(lead.createdAt).toLocaleString()} />

          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Description
            </h3>
            <p className="text-gray-600 text-sm">
              {lead.description || "No description provided"}
            </p>
          </div>

          {/* REMARKS */}
          {lead.remarks && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Remarks
              </h3>
              <p className="text-gray-600 text-sm">
                {lead.remarks}
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => navigate(`/leads?edit=${lead._id}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Edit Lead
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    qualified: "bg-indigo-100 text-indigo-700",
    won: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

export default LeadView;
