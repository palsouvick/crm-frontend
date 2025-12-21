import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { 
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  exportCustomerData
 } from "../api/customerApi";
import CustomerModal from "../components/CustomerModal";
import { getUsers } from "../api/userApi";

const Customers = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomers({
        page,
        limit: 5,
        search,
      });

      setCustomers(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    }catch (error) {
      console.error("Failed to fetch customers", error);
    }finally{
      setLoading(false);
    }
  }
  const handleSearch = () => {
    setPage(1);
    fetchCustomers();
  }

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCustomers();
  }, [page,search]);

  const handleCreate = async (data) => {
    await createCustomer(data);
    await fetchCustomers();     // refresh list
    setModalOpen(false);
    setSelectedCustomer(null); // reset
  };

  const handleUpdate = async (data) => {
    await updateCustomer(selectedCustomer._id, data);
    setSelectedCustomer(null);
    setModalOpen(false);
    await fetchCustomers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    await deleteCustomer(id);
    fetchCustomers();
  };

  const handleExport = async () => {
    const res = await exportCustomerData();
    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Customers</h1>

      {/* Search */}
      <div className="flex mb-4 gap-2 justify-between">
        <div>
          <input
            type="text"
            placeholder="Search name, email, phone"
            className="border px-3 py-2 rounded w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 rounded py-2 ml-2 cursor-pointer"
          >
            Search
          </button>
        </div>
        <div className="flex justify-between mb-4">
        

        <button
          onClick={handleExport}
          className="bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
        >
          Download CSV
        </button>
        <button
          onClick={() => {
            setSelectedCustomer(null);
            setModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded ml-2 cursor-pointer"
        >
          + Add Customer
        </button>
      </div>

      </div>

      {/* Table */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Assigned To</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">
                    {c.assignedTo?.name || "—"}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCustomer(c);
                        setModalOpen(true);
                      }}
                      className="text-blue-600 cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-600 cursor-pointer"
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
      <CustomerModal
        isOpen={modalOpen}
        customer={selectedCustomer}
        onClose={() => setModalOpen(false)}
        onSubmit={selectedCustomer ? handleUpdate : handleCreate}
        users={users}
      />
    </Layout>
    
  )
}


export default Customers