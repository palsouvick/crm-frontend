import { useState } from "react";
import { forgotPassword, verifyOtp, changePassword } from "../api/authApi";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Request OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      console.log("--------", email);
      const response = await forgotPassword({ email });

      // Axios success → directly here
      setMessage(response.data.message || "OTP sent successfully");
      setStep(2);
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await verifyOtp({ email, otp });

      setMessage("OTP verified successfully");
      setStep(3);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await changePassword({email, newPassword});

      const data = await response.json();

      navigate("/login");
      setMessage("Password reset successfully!");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white">
        <div>
          <div className="w-12 h-12 bg-white rounded-lg mb-6 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            {step === 1 && "Forgot Password? 🔐"}
            {step === 2 && "Verify Your Email ✉️"}
            {step === 3 && "Create New Password 🔑"}
          </h1>
          <p className="text-indigo-100 max-w-md">
            {step === 1 &&
              "No worries! Enter your email and we'll send you a one-time password to reset your account."}
            {step === 2 &&
              "We've sent a 6-digit OTP to your email. Please enter it below to verify your identity."}
            {step === 3 &&
              "You're almost there! Create a strong new password for your account."}
          </p>
        </div>

        <p className="text-sm text-indigo-200">
          © {new Date().getFullYear()} FlowCRM. All rights reserved.
        </p>
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">
              {step === 1 && "Reset Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "New Password"}
            </h2>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                1
              </div>
              <div
                className={`w-12 h-1 ${step >= 2 ? "bg-indigo-600" : "bg-gray-200"}`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                2
              </div>
              <div
                className={`w-12 h-1 ${step >= 3 ? "bg-indigo-600" : "bg-gray-200"}`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                3
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
              {message}
            </div>
          )}

          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-gray-500 mb-4">
                Enter your email address to receive an OTP
              </p>
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-gray-500 mb-4">
                Enter the 6-digit OTP sent to {email}
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                maxLength="6"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center text-2xl tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
              <button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full text-indigo-600 py-2 text-sm hover:underline"
              >
                ← Back to Email
              </button>
            </div>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-gray-500 mb-4">
                Create a strong password for your account
              </p>
              <input
                type="password"
                placeholder="New password"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          )}

          <div className="text-sm text-center mt-6">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
