import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { createFollowUp } from "../api/followUpApi";
import { getCustomers } from "../api/customerApi";
import { getLeads } from "../api/leadApi";
import { getUsers } from "../api/userApi";

const FollowUpCreate = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    customer: "",
    lead: "",
    assignedTo: "",
    type: "call",
    followUpDate: "",
    followUpNotes: "",
    priority: "medium",
  });
  const validateForm = () => {
    const newErrors = {};

    if (!form.customer) {
      newErrors.customer = "Customer is required";
    }

    if (!form.assignedTo) {
      newErrors.assignedTo = "Please assign this follow-up";
    }

    if (!form.followUpDate) {
      newErrors.followUpDate = "Follow-up date & time is required";
    }

    // Meeting-specific rule (CRM behavior)
    if (form.type === "meeting" && !form.followUpDate) {
      newErrors.followUpDate = "Meeting date & time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [cRes, lRes, uRes] = await Promise.all([
      getCustomers(),
      getLeads(),
      getUsers(),
    ]);

    setCustomers(cRes.data.data);
    setLeads(lRes.data.data);
    setUsers(uRes.data.data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // ⛔ stop API call
    }
    try {
      await createFollowUp(form);
      navigate("/follow-ups");
    } catch (err) {
      console.error("Create follow-up failed", err);
    }
  };

  return (
    <Layout>
      <div className="w-full bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Create Follow-up</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🔹 BASIC INFO */}
          <div>
            <h2 className="font-semibold mb-3 text-gray-700">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <select
                  name="customer"
                  onChange={handleChange}
                  className={`border rounded px-3 py-2 w-full ${
                    errors.customer ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.customer && (
                  <span className="text-red-500 text-sm">
                    {errors.customer}
                  </span>
                )}
              </div>

              {/* <div>
                <select
                  name="lead"
                  onChange={handleChange}
                  className={`border rounded px-3 py-2 w-full ${
                    errors.lead ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select Lead</option>
                  {leads.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.status}
                    </option>
                  ))}
                </select>
                {errors.lead && (
                  <span className="text-red-500 text-sm">{errors.lead}</span>
                )}
              </div> */}

              <div>
                <select
                  name="assignedTo"
                  onChange={handleChange}
                  className={`border rounded px-3 py-2 w-full ${
                    errors.assignedTo ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Assign To</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>

                {errors.assignedTo && (
                  <p className="text-red-500 text-sm">{errors.assignedTo}</p>
                )}
              </div>
            </div>
          </div>

          {/* 🔹 FOLLOW-UP DETAILS */}
          <div>
            <h2 className="font-semibold mb-3 text-gray-700">
              Follow-up Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              >
                <option value="call">Call</option>
                <option value="meeting">Meeting</option>
                <option value="email">Email</option>
                <option value="demo">Demo</option>
                <option value="payment">Payment</option>
              </select>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* 🔹 SCHEDULE */}
          <div>
            <h2 className="font-semibold mb-3 text-gray-700">Schedule</h2>

            <input
              type="datetime-local"
              name="followUpDate"
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full md:w-1/2"
            />
          </div>

          {/* 🔹 NOTES */}
          <div>
            <h2 className="font-semibold mb-3 text-gray-700">Notes</h2>

            <textarea
              name="followUpNotes"
              placeholder="Discussion points, agenda, remarks..."
              rows="4"
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          {/* 🔹 ACTIONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/follow-ups")}
              className="border px-5 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded"
            >
              Save Follow-up
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default FollowUpCreate;
