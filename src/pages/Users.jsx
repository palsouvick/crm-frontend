import {useState,useEffect} from 'react'
import Layout from "../components/Layout";
import { getUsers } from "../api/userApi";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getUsers({
                page,
                limit: 5,
                search,
            });
            setUsers(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSearch = () => {
       setPage(1);
       fetchUsers();
    }
    useEffect(() => {
        fetchUsers();
      }, [page,search]);
  return (
    <Layout>
          <h1 className="text-2xl font-bold mb-4">Users</h1>
    
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
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Role</th>
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
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      No Users found
                    </td>
                  </tr>
                ) : (
                  users.map((c) => (
                    <tr key={c._id} className="border-t">
                      <td className="p-3">{c.name}</td>
                      <td className="p-3">{c.phone}</td>
                      <td className="p-3">{c.email}</td>
                      <td className="p-3">{c.status}
                      </td>
                      <td className="p-3">{c.role}
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
          {/* <CustomerModal
            isOpen={modalOpen}
            customer={selectedCustomer}
            onClose={() => setModalOpen(false)}
            onSubmit={selectedCustomer ? handleUpdate : handleCreate}
            users={users}
          /> */}
        </Layout>
  )
}

export default Users