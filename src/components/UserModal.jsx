import { useState, useEffect } from "react";

const UserModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    role: "",
    status: "",
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    console.log("UserModal user prop:", user);
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
      dob: user?.dob || "",
      role: user?.role || "",
      status: user?.status || "",
    });
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    // ✅ password only when creating
    if (!user && !form.password.trim()) {
      newErrors.password = "Password is required";
    }
    if (!form.role.trim()) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (validate()) {
        onSubmit(form);
        onClose();
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {user ? "Edit Customer" : "Add Customer"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              name="name"
              placeholder="Name"
              className="w-full border px-3 py-2 rounded"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              name="email"
              placeholder="Email"
              className="w-full border px-3 py-2 rounded"
              value={form.email || ""}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              name="phone"
              placeholder="Phone"
              className="w-full border px-3 py-2 rounded"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>
          {!user && (
            <div>
              <input
                name="password"
                placeholder="Password"
                className="w-full border px-3 py-2 rounded"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
          )}
          <div>
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              className="w-full border px-3 py-2 rounded"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
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
          {/* Role To */}
          <select
            name="role"
            className="w-full border px-3 py-2 rounded"
            value={form.role}
            onChange={handleChange}
          >
            <option value="admin">Admin</option>
            <option value="sale">Sale</option>
            <option value="support">Support</option>
          </select>

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

export default UserModal;
