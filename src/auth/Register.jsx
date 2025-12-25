import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import logo from "../assets/download.svg";

const Register = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await registerUser(form);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white">
        <div>
          <img src={logo} alt="FlowCRM" className="w-12 mb-6" />
          <h1 className="text-4xl font-bold mb-4">
            Join FlowCRM 🚀
          </h1>
          <p className="text-indigo-100 max-w-md">
            Create your account and start managing leads, customers, and sales in one powerful platform.
          </p>
        </div>

        <p className="text-sm text-indigo-200">
          © {new Date().getFullYear()} FlowCRM. All rights reserved.
        </p>
      </div>

      {/* RIGHT REGISTER FORM */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="FlowCRM" className="w-8" />
            <h2 className="text-2xl font-bold">Create Account</h2>
          </div>

          <p className="text-gray-500 mb-6">
            Fill in the details below to get started
          </p>

          {error && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 text-green-600 text-sm bg-green-50 p-2 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              name="name"
              type="text"
              placeholder="Full name"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              type="text"
              placeholder="Phone number"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Create Account
            </button>
          </form>

          <div className="text-sm text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium">
              Log in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
