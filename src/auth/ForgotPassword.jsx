import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { forgotPassword, verifyOtp, changePassword } from "../api/authApi";
import {
  forgotPasswordEmailSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "../lib/validation/authSchemas";
import AuthLayout from "./AuthLayout";
import PasswordInput from "../components/ui/PasswordInput";
import FieldError from "../components/ui/FieldError";

const STEP_COPY = {
  1: {
    heading: "Forgot Password? 🔐",
    description:
      "No worries! Enter your email and we'll send you a one-time password to reset your account.",
    title: "Reset Password",
  },
  2: {
    heading: "Verify Your Email ✉️",
    description:
      "We've sent a 6-digit OTP to your email. Please enter it below to verify your identity.",
    title: "Verify OTP",
  },
  3: {
    heading: "Create New Password 🔑",
    description: "You're almost there! Create a strong new password for your account.",
    title: "New Password",
  },
};

const StepIndicator = ({ step }) => (
  <div className="flex items-center justify-center mb-6">
    <div className="flex items-center">
      {[1, 2, 3].map((n, i) => (
        <div key={n} className="flex items-center">
          {i > 0 && (
            <div className={`w-12 h-1 ${step >= n ? "bg-indigo-600" : "bg-gray-200"}`} />
          )}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= n ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            {n}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SubmitButton = ({ isSubmitting, label, loadingLabel, disabled }) => (
  <button
    type="submit"
    disabled={isSubmitting || disabled}
    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
  >
    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
    {isSubmitting ? loadingLabel : label}
  </button>
);

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const emailForm = useForm({ resolver: zodResolver(forgotPasswordEmailSchema) });
  const otpForm = useForm({ resolver: zodResolver(verifyOtpSchema) });
  const resetForm = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const handleSendOtp = async ({ email: submittedEmail }) => {
    setError("");
    setMessage("");
    try {
      const response = await forgotPassword({ email: submittedEmail });
      setEmail(submittedEmail);
      setMessage(response.data.message || "OTP sent successfully");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handleVerifyOtp = async ({ otp: submittedOtp }) => {
    setError("");
    setMessage("");
    try {
      await verifyOtp({ email, otp: submittedOtp });
      setOtp(submittedOtp);
      setMessage("OTP verified successfully");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
    }
  };

  const handleResetPassword = async ({ newPassword }) => {
    setError("");
    setMessage("");
    try {
      await changePassword({ email, otp, newPassword });
      setMessage("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const copy = STEP_COPY[step];

  return (
    <AuthLayout heading={copy.heading} description={copy.description}>
      <h2 className="text-2xl font-bold mb-6">{copy.title}</h2>

      <StepIndicator step={step} />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role="alert"
            className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
          >
            {error}
          </motion.div>
        )}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role="status"
            className="mb-4 text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form
            key="step-1"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            onSubmit={emailForm.handleSubmit(handleSendOtp)}
            noValidate
            className="space-y-4"
          >
            <p className="text-gray-500 mb-4">Enter your email address to receive an OTP</p>
            <div>
              <label htmlFor="fp-email" className="sr-only">
                Email address
              </label>
              <input
                id="fp-email"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                aria-invalid={!!emailForm.formState.errors.email}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition focus:ring-2 ${
                  emailForm.formState.errors.email
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
                {...emailForm.register("email")}
              />
              <FieldError message={emailForm.formState.errors.email?.message} />
            </div>
            <SubmitButton
              isSubmitting={emailForm.formState.isSubmitting}
              label="Send OTP"
              loadingLabel="Sending..."
            />
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            key="step-2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
            noValidate
            className="space-y-4"
          >
            <p className="text-gray-500 mb-4">Enter the 6-digit OTP sent to {email}</p>
            <div>
              <label htmlFor="fp-otp" className="sr-only">
                One-time password
              </label>
              <input
                id="fp-otp"
                type="text"
                inputMode="numeric"
                placeholder="Enter OTP"
                maxLength={6}
                aria-invalid={!!otpForm.formState.errors.otp}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition focus:ring-2 text-center text-2xl tracking-widest ${
                  otpForm.formState.errors.otp
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
                {...otpForm.register("otp", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  },
                })}
              />
              <FieldError message={otpForm.formState.errors.otp?.message} />
            </div>
            <SubmitButton
              isSubmitting={otpForm.formState.isSubmitting}
              label="Verify OTP"
              loadingLabel="Verifying..."
            />
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-indigo-600 py-2 text-sm hover:underline cursor-pointer"
            >
              ← Back to Email
            </button>
          </motion.form>
        )}

        {step === 3 && (
          <motion.form
            key="step-3"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            onSubmit={resetForm.handleSubmit(handleResetPassword)}
            noValidate
            className="space-y-4"
          >
            <p className="text-gray-500 mb-4">Create a strong password for your account</p>
            <div>
              <label htmlFor="fp-new-password" className="sr-only">
                New password
              </label>
              <PasswordInput
                id="fp-new-password"
                placeholder="New password"
                autoComplete="new-password"
                aria-invalid={!!resetForm.formState.errors.newPassword}
                error={!!resetForm.formState.errors.newPassword}
                {...resetForm.register("newPassword")}
              />
              <FieldError message={resetForm.formState.errors.newPassword?.message} />
            </div>
            <div>
              <label htmlFor="fp-confirm-password" className="sr-only">
                Confirm new password
              </label>
              <PasswordInput
                id="fp-confirm-password"
                placeholder="Confirm new password"
                autoComplete="new-password"
                aria-invalid={!!resetForm.formState.errors.confirmPassword}
                error={!!resetForm.formState.errors.confirmPassword}
                {...resetForm.register("confirmPassword")}
              />
              <FieldError message={resetForm.formState.errors.confirmPassword?.message} />
            </div>
            <SubmitButton
              isSubmitting={resetForm.formState.isSubmitting}
              label="Reset Password"
              loadingLabel="Resetting..."
            />
          </motion.form>
        )}
      </AnimatePresence>

      <div className="text-sm text-center mt-6">
        Remember your password?{" "}
        <Link to="/login" className="text-indigo-600 font-medium hover:underline">
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
