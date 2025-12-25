import { useState,useEffect } from "react";

const LeadModal = ({ isOpen, onClose, onSubmit, customers, lead, users }) => {
  const [form, setForm] = useState({
    customar: "",
    title: "",
    description: "",
    status: "new",
    expectedValue: "",
    assignedTo: "",
    source: "website",
    remarks: "",
  });

  
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  
  useEffect(() => {
    if (lead) {
      setForm({
        customar: lead.customar || "",
        title: lead.title || "",
        description: lead.description || "",
        status: lead.status || "new",
        expectedValue: lead.expectedValue || "",
        assignedTo: lead.assignedTo || "",
        source: lead.source || "website",
        remarks: lead.remarks || "",
      });
    } else {
      setForm({
        customar: "",
        title: "",
        description: "",
        status: "new",
        expectedValue: "",
        assignedTo: "",
        source: "website",
        remarks: "",
      });
    }
  }, [lead]);
if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Create Lead</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="space-y-3"
        >
          {/* Customer */}
          <select
            name="customar"
            className="w-full border px-3 py-2 rounded"
            value={form.customar}
            onChange={handleChange}
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Expected Value */}

          <input
            type="text"
            name="title"
            placeholder="Title"
            className="w-full border px-3 py-2 rounded"
            value={form.title}
            onChange={handleChange}
          />
          <input
            type="number"
            name="expectedValue"
            placeholder="Expected Deal Value"
            className="w-full border px-3 py-2 rounded"
            value={form.expectedValue}
            onChange={handleChange}
          />
          {/* <input
            type="text"
            name="description"
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
            value={form.description}
            onChange={handleChange}
          /> */}

          {/* Status */}
          <select
            name="status"
            className="w-full border px-3 py-2 rounded"
            value={form.status}
            onChange={handleChange}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>

          {/* Source */}
          <select
            name="source"
            className="w-full border px-3 py-2 rounded"
            value={form.source}
            onChange={handleChange}
          >
            <option value="website">Website</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="referral">Referral</option>
            <option value="other">Other</option>
          </select>

          {/* Assigned To (optional) */}
          {users.length > 0 && (
            <select
              name="assignedTo"
              className="w-full border px-3 py-2 rounded"
              value={form.assignedTo}
              onChange={handleChange}
            >
              <option value="">Assign to user (optional)</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          )}

          {/* Remarks */}
          <textarea
            name="description"
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
