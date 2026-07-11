import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { registerUser } from "../api/authApi";
import { registerSchema } from "../lib/validation/authSchemas";
import AuthLayout from "./AuthLayout";
import PasswordInput from "../components/ui/PasswordInput";
import FieldError from "../components/ui/FieldError";
import logo from "../assets/download.svg";

const Register = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setServerError("");
    setSuccess("");
    try {
      await registerUser(data);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout
      heading="Join FlowCRM 🚀"
      description="Create your account and start managing leads, customers, and sales in one powerful platform."
    >
      <div className="flex items-center gap-3 mb-6">
        <img src={logo} alt="FlowCRM" className="w-8" />
        <h2 className="text-2xl font-bold">Create Account</h2>
      </div>

      <p className="text-gray-500 mb-6">Fill in the details below to get started</p>

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
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role="status"
            className="mb-4 text-green-600 text-sm bg-green-50 p-2 rounded"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="sr-only">
            Full name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Full name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            className={`w-full px-4 py-3 border rounded-lg outline-none transition focus:ring-2 ${
              errors.name
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>

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
          <label htmlFor="phone" className="sr-only">
            Phone number
          </label>
          <input
            id="phone"
            type="text"
            placeholder="Phone number"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            className={`w-full px-4 py-3 border rounded-lg outline-none transition focus:ring-2 ${
              errors.phone
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <PasswordInput
            id="password"
            placeholder="Password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            error={!!errors.password}
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="text-sm text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 font-medium">
          Log in
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
