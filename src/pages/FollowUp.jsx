import {useState} from 'react'
import Layout from "../components/Layout";

const FollowUp = () => {
  const [followUps, setFollowUps] = useState([]);
  const [open, setOpen] = useState(false);
  return (
    <Layout>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">Follow Ups</h1>
          <button
            onClick={() => setOpen(true)}
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
            {followUps.map((f) => (
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
            ))}
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
  )
}

export default FollowUp