import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LeadModal from "../components/LeadModal";
import { getLeads, createLead, updateLead } from "../api/leadApi";
import { getCustomers } from "../api/customerApi";
import { getUsers } from "../api/userApi";
import { useNavigate } from "react-router-dom";

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leadRes, custRes, userRes] = await Promise.all([
        getLeads({
          page,
          limit: 5,
          search,
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
  }, []);

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
  }

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

  return (
    <Layout>
      <div className=" bg-white p-4 rounded shadow h-full">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Leads</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Lead
          </button>
        </div>

        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Customer Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3">Value</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center">
                    No customers found
                  </td>
                </tr>
              ) : (
                leads.map((l) => (
                  <tr key={l._id} className="border-t">
                    <td className="p-3">{l.customar?.name}</td>
                    <td className="p-3">{l.customar?.email}</td>
                    <td className="p-3">{l.customar?.phone}</td>
                    <td className="p-3">{l.expectedValue || "—"}</td>
                    <td className="p-3 capitalize">{l.status}</td>
                    <td className="p-3">
                      {/* <select
                        value={l.status}
                        onChange={(e) =>
                          handleStatusChange(l._id, e.target.value)
                        }
                        className="border px-2 py-1 rounded"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select> */}
                      <button
                        onClick={() => {
                          setSelectedLead(l);
                          setModalOpen(true);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>

                      <button
                       onClick={() => navigate(`/leads/${l._id}`)}
                       className="bg-green-500 text-white px-3 py-1 rounded text-sm ml-2">
                        View</button>

                      <button
                        onClick={() => handleDelete(l._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded cursor-pointer ml-2"
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
        <LeadModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={selectedLead ? handleUpdate : handleCreate}
          customers={customers}
          lead={selectedLead}
          users={users}
        />
      </div>
    </Layout>
  );
};

export default Leads;
