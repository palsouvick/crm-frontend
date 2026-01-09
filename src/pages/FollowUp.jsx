import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { getFollowUps } from "../api/followUpApi";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";

const FollowUp = () => {
  const [followUps, setFollowUps] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const fetchFollowup = async () => {
    try {
      const res = await getFollowUps();
      setFollowUps(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchFollowup();
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
        <h1 className="text-xl font-bold mb-2">Follow Ups</h1>

        <div className="flex justify-between mb-4">
          <input
            className="border px-3 py-1 mt-1 rounded-lg w-72 focus:ring-2 focus:ring-indigo-500"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => navigate("/follow-up/create")}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            + Add Follow-up
          </button>
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Assigned</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
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
                    <td className="p-2">{f.customer?.name}</td>
                    <td className="capitalize">{f.type}</td>
                    <td>{new Date(f.followUpDate).toLocaleString()}</td>
                    <td>
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
                    <td>{f.assignedTo?.name}</td>
                    <td className="space-x-2">
                      {f.followUpStatus === "pending" && (
                        <button
                          onClick={() => handleComplete(f._id)}
                          className="border px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Done
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(f._id)}
                        className="border bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
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
