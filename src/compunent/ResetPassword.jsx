import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);
  const query = useQuery();
  const navigate = useNavigate();

  const token = query.get("token") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      await axios.post("/users/reset-password", { token, password });
      toast.success("Password reset successful!");
      setSuccess(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setInvalidToken(true);
    }
  }, [token, navigate]);

  if (invalidToken) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-100 via-white to-orange-50 px-4 py-8 font-daraz relative">
        <div
          className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: "url('/logg.png')" }}
        ></div>

        <div className="w-full h-auto max-w-sm bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 relative z-10">
          <div className="relative mb-3 bg-gradient-to-br from-red-600 to-red-400 py-10 px-6 text-center text-white rounded-b-3xl shadow-lg">
            <h2 className="text-3xl font-bold drop-shadow-sm">Invalid Link</h2>
            <p className="text-white/90 text-sm mt-2 tracking-wide">
              This reset link is expired or invalid
            </p>
          </div>

          <div className="px-6 py-8 text-center space-y-4">
            <div className="flex justify-center">
              <AlertCircle size={48} className="text-red-500" />
            </div>
            <p className="text-gray-600 text-sm">
              The password reset link you're trying to use is either expired or
              invalid.
            </p>
            <button
              onClick={() => navigate("/forgot")}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3.5 rounded-xl text-base shadow-md hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold drop-shadow-sm">
            Create New Password
          </h2>
          <p className="text-white/90 text-sm mt-2 tracking-wide">
            Set a new password for your account
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-6">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  NEW PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-100/80 text-gray-800 rounded-xl px-4 py-3 shadow-inner outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-gray-100/80 text-gray-800 rounded-xl px-4 py-3 shadow-inner outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition placeholder-gray-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3.5 rounded-xl text-base shadow-md hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-0.5 transition-all duration-300 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
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
                  Password Reset Complete!
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Your password has been successfully updated. You can now login
                  with your new password.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-xs text-green-700">
                    <span className="font-bold">✓ Success:</span> Your account
                    is now secure with your new password.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/auth")}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3.5 rounded-xl text-base shadow-md hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
