import { useState, useEffect } from "react";

const CustomerModal = ({ isOpen, onClose, onSubmit, customer, users = [] }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "active",
    assignedTo: "",
    notes: ""
  });
  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.company.trim()) newErrors.company = "Company is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
   const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

   useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        company: customer.company || "",
        status: customer.status || "active",
        assignedTo: customer.assignedTo?._id || "",
        notes: customer.notes || ""
      });
    }
  }, [customer]);

  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(form); // parent will handle close
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {customer ? "Edit Customer" : "Add Customer"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          <div>
            <input
              name="name"
              placeholder="Name"
              className="w-full border px-3 py-2 rounded"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <input
                name="email"
                placeholder="Email"
                className="w-full border px-3 py-2 rounded"
                value={form.email || ""}
                onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <input
                name="phone"
                placeholder="Phone"
                className="w-full border px-3 py-2 rounded"
                value={form.phone}
                onChange={handleChange}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div>
          <input
            name="company"
            placeholder="Company"
            className="w-full border px-3 py-2 rounded"
            value={form.company || ""}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
            {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
          </div>
          {/* Status */}
          <select
            name="status"
            className="w-full border px-3 py-2 rounded"
            value={form.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
           {/* Assigned To */}
          <select
            name="assignedTo"
            className="w-full border px-3 py-2 rounded"
            value={form.assignedTo}
            onChange={handleChange}
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
          {/* Notes */}
          <textarea
            name="notes"
            placeholder="Notes"
            className="w-full border px-3 py-2 rounded"
            value={form.notes}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-2 mt-4">
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
