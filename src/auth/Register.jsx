import {useState} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { registerUser } from "../api/authApi";

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

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Handle registration logic here
    try{
        const res = await registerUser(form);

        setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }catch(err){
        setError( err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-4">
            {error}
          </p>
        )}

        {success && (
          <p className="bg-green-100 text-green-600 p-2 rounded mb-4">
            {success}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name='name'
              onChange={handleChange}
              type="text"
              className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
            name='email'
            onChange={handleChange}
              type="email"
              className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
            name='phone'
            onChange={handleChange}
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
            name='password'
            onChange={handleChange}
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register