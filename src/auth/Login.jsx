import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import logo from "../assets/download.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white">
        <div>
          <img src={logo} alt="FlowCRM" className="w-12 mb-6" />
          <h1 className="text-4xl font-bold mb-4">
            Hello FlowCRM! 👋
          </h1>
          <p className="text-indigo-100 max-w-md">
            Manage leads, customers, and sales smarter with automation and real-time insights.
          </p>
        </div>

        <p className="text-sm text-indigo-200">
          © {new Date().getFullYear()} FlowCRM. All rights reserved.
        </p>
      </div>

      {/* RIGHT LOGIN FORM */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="FlowCRM" className="w-8" />
            <h2 className="text-2xl font-bold">Welcome Back!</h2>
          </div>

          <p className="text-gray-500 mb-6">
            Login to access your CRM dashboard
          </p>

          {error && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Log in
            </button>
          </form>

          <div className="text-sm text-center mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-medium">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
