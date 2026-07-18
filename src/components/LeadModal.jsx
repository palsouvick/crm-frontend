import { useState,useEffect } from "react";
import { X } from "lucide-react";

const LeadModal = ({ isOpen, onClose, onSubmit, customers, lead, users }) => {
  const isEditMode = Boolean(lead?._id);
  const initialForm ={
    customer: "",
    title: "",
    description: "",
    status: "new",
    expectedValue: "",
    assignedTo: "",
    source: "website",
    remarks: "",
  };
  const [form, setForm] = useState(initialForm);
  console.log("lead -", lead);
  console.log("is edit mode -", isEditMode);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  
  useEffect(() => {
    if (isEditMode) {
      setForm({
        customer: lead.customer._id || "",
        title: lead.title || "",
        description: lead.description || "",
        status: lead.status || "new",
        expectedValue: lead.expectedValue || "",
        assignedTo: lead?.assignedTo?._id || "",
        source: lead.source || "website",
        remarks: lead.remarks || "",
      });
    } else {
       setForm(initialForm);
    }
  }, [lead, isOpen]);
if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? "Edit Lead" : "Create Lead"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 rounded p-1"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="px-6 py-4 space-y-3 overflow-y-auto"
        >
          {/* Customer */}
          <select
            name="customer"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            value={form.customer}
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
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            value={form.title}
            onChange={handleChange}
          />
          <input
            type="number"
            name="expectedValue"
            placeholder="Expected Deal Value"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            value={form.expectedValue}
            onChange={handleChange}
          />
          {/* <input
            type="text"
            name="description"
            placeholder="Description"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            value={form.description}
            onChange={handleChange}
          /> */}

          {/* Status */}
          <select
            name="status"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
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
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
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
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
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
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditMode ? "Save Changes" : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
