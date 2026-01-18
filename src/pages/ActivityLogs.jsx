import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getActivities } from "../api/activityApi";

const ActivityLogs = () => {
  const navigate = useNavigate();
  const [activitys, setActivitys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const res = await getActivities({
        page,
        limit: 5,
        search,
      });
      setActivitys(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchActivity();
  }, [page]);

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
          <h1 className="text-2xl font-bold">Activity Logs</h1>
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">Module</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-left">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : activitys.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-3 text-center text-gray-500">
                    No Activity Log found.
                  </td>
                </tr>
              ) : (
                activitys.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="p-3">{c.userId?.name || "N/A"}</td>
                    <td className="p-3">{c.action}</td>
                    <td className="p-3">{c.module}</td>
                    <td className="p-3">{c.description}</td>
                    <td className="p-3">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {new Date(c.updatedAt).toLocaleDateString()}
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
    </Layout>
  );
};

export default ActivityLogs;
