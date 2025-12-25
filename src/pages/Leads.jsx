import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LeadModal from "../components/LeadModal";
import { getLeads, createLead, updateLead } from "../api/leadApi";
import { getCustomers } from "../api/customerApi";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const [leadRes, custRes] = await Promise.all([
      getLeads(),
      getCustomers({
        page,
        limit: 5,
        search,
      }),
    ]);
    console.log("Leads API response:", leadRes.data);
    setLeads(leadRes.data.leads);
    setCustomers(custRes.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (data) => {
    await createLead(data);
    setModalOpen(false);
    fetchData();
  };

  const handleStatusChange = async (id, status) => {
    await updateLead(id, { status });
    fetchData();
  };

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
                <th className="p-3 text-left">Customer Email</th>
                <th className="p-3">Value</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l._id} className="border-t">
                  <td className="p-3">{l.customar?.name}</td>
                  <td className="p-3">{l.customar?.email}</td>
                  <td className="p-3">{l.expectedValue || "—"}</td>
                  <td className="p-3 capitalize">{l.status}</td>
                  <td className="p-3">
                    <select
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
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <LeadModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreate}
          customers={customers}
        />
      </div>
    </Layout>
  );
};

export default Leads;
