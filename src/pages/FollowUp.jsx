import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { getFollowUps } from "../api/followUpApi";
import { useNavigate } from "react-router-dom";

const FollowUp = () => {
  const [followUps, setFollowUps] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFollowup = async () => {
    try {
      const res = await getFollowUps();
      setFollowUps(res.data);
      console.log(" res-", res.data);
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
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">Follow Ups</h1>
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
                <th className="p-2">Customer</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : followUps.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="h-56 flex flex-col items-center justify-center text-gray-500">
                      <div className="text-5xl mb-3">🗂️</div>

                      <h3 className="text-lg font-semibold text-gray-700">
                        No Follow-Ups Yet
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        You haven’t added any follow-ups. Start by creating one.
                      </p>

                      <button
                        onClick={() => navigate("/follow-up/create")}
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
                      >
                        + Add First Follow-Up
                      </button>
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
                          className="text-green-600"
                        >
                          Done
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(f._id)}
                        className="text-red-600"
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
