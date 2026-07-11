import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { loginUser } from "../api/authApi";
import { loginSchema } from "../lib/validation/authSchemas";
import AuthLayout from "./AuthLayout";
import PasswordInput from "../components/ui/PasswordInput";
import FieldError from "../components/ui/FieldError";
import logo from "../assets/download.svg";

const Login = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await loginUser(data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setServerError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <AuthLayout
      heading="Hello FlowCRM! 👋"
      description="Manage leads, customers, and sales smarter with automation and real-time insights."
    >
      <div className="flex items-center gap-3 mb-6">
        <img src={logo} alt="FlowCRM" className="w-8" />
        <h2 className="text-2xl font-bold">Welcome Back!</h2>
      </div>

      <p className="text-gray-500 mb-6">Login to access your CRM dashboard</p>

      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role="alert"
            className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded"
          >
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={`w-full px-4 py-3 border rounded-lg outline-none transition focus:ring-2 ${
              errors.email
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <PasswordInput
            id="password"
            placeholder="Password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            error={!!errors.password}
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-indigo-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="text-sm text-center mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-indigo-600 font-medium">
          Create one
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
