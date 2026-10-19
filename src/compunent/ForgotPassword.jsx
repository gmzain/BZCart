import React, { useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setLoading(true);
    try {
      await axios.post("/users/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-100 via-white to-orange-50 px-4 py-8 font-daraz relative">
      {/* Background Logo */}
      <div
        className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-contain"
        style={{ backgroundImage: "url('/logg.png')" }}
      ></div>

      <div className="w-full h-auto max-w-sm bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 relative z-10">
        {/* Header */}
        <div className="relative mb-3 bg-gradient-to-br from-orange-600 to-orange-400 py-10 px-6 text-center text-white rounded-b-3xl shadow-lg">
          <button
            onClick={() => navigate("/auth")}
            className="absolute top-6 left-6 text-white/90 hover:text-white transition"
          >
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-3xl font-bold drop-shadow-sm">Reset Password</h2>
          <p className="text-white/90 text-sm mt-2 tracking-wide">
            We'll send you a link to reset your password
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-gray-100/80 text-gray-800 rounded-xl px-4 py-3 shadow-inner outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3.5 rounded-xl text-base shadow-md hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-0.5 transition-all duration-300 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Remember your password?{" "}
                <span
                  onClick={() => navigate("/auth")}
                  className="text-orange-500 font-medium hover:underline cursor-pointer"
                >
                  Back to Login
                </span>
              </p>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={48} className="text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Check Your Email
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  We've sent a password reset link to{" "}
                  <span className="font-semibold">{email}</span>
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <p className="text-xs text-orange-700">
                    <span className="font-bold">⏱️ Note:</span> The reset link
                    is valid for <span className="font-bold">1 hour</span>. If
                    you don't see the email, check your spam folder.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/auth")}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3.5 rounded-xl text-base shadow-md hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
