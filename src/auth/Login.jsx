import {useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { loginUser } from "../api/authApi";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const handleSubmit = async(e) => {
        const data = { email, password };
        e.preventDefault();
        setError("");
        try{
            const res = await loginUser({ email, password });

            // Store token
            localStorage.setItem("token", res.data.token);

            // Redirect to dashboard
            navigate("/");
        }catch(err){
            setError(err.response?.data?.message || "Login failed");
        }
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6">
          CRM Login
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login