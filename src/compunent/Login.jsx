import React, { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import InputWithIcon from "./InputWithIcon";
import { loginMyUser, userReset } from "../features/users/userSlice";

export default function Login({ setIsSignIn }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userLoading, userError, userMessage, userSuccess } =
    useSelector((state) => state.auth);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginMyUser(formData));
  };

  useEffect(() => {
    if (userSuccess && user) {
      localStorage.setItem("myUser", JSON.stringify(user));
      toast.success(`Welcome back, ${user.username}!`);
      navigate("/");
      dispatch(userReset());
    }
    if (userError) {
      toast.error(userMessage || "Failed to login");
    }
  }, [userSuccess, userError, userMessage, user, navigate, dispatch]);

  return (
    <>
      {/* ================= MOBILE VIEW ================= */}
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-100 via-white to-orange-50 px-4 py-8 font-daraz relative md:hidden">
        {/* Background Logo */}
        <div
          className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: "url('/logg.png')" }}
        ></div>

        <div className="w-full h-[70vh] max-w-sm bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40 relative z-10">
          {/* Header */}
          <div className="relative mb-3 bg-gradient-to-br from-orange-600 to-orange-400 py-10 px-6 text-center text-white rounded-b-3xl shadow-lg">
            <button
              onClick={() => setIsSignIn(false)}
              className="absolute top-6 left-6 text-white/90 hover:text-white transition"
            >
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-3xl font-bold drop-shadow-sm">Welcome Back</h2>
            <p className="text-white/90 text-sm mt-2 tracking-wide">
              Please log in to continue shopping
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-8">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                required
                className="w-full bg-gray-100/80 text-gray-800 rounded-xl px-4 py-3 shadow-inner outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-100/80 text-gray-800 rounded-xl px-4 py-3 pr-12 shadow-inner outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between my-3">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input type="checkbox" className="w-4 h-4 accent-orange-500" />
                <span>Remember me</span>
              </label>
              <a
                href="https://bzcart.store/forgot"
                className="text-orange-500 text-sm font-medium hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={userLoading}
              className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3.5 rounded-xl text-base shadow-md hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-0.5 transition-all duration-300 ${
                userLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {userLoading ? "Logging In..." : "LOG IN"}
            </button>

            {/* Signup Redirect */}
            <p className="text-center text-sm text-gray-600 mt-3">
              Don’t have an account?{" "}
              <span
                onClick={() => setIsSignIn(false)}
                className="text-orange-500 font-medium hover:underline cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:flex flex-row font-daraz">
        {/* Left Panel */}
        <div className="w-1/2 bg-white flex flex-col justify-center items-center p-12 shadow-lg">
          <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
            Sign in to <span className="text-orange-500">BZCart</span>
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <InputWithIcon
              type="email"
              name="email"
              placeholder="Email"
              Icon={FaEnvelope}
              value={formData.email}
              onChange={handleChange}
            />
            <InputWithIcon
              type="password"
              name="password"
              placeholder="Password"
              Icon={FaLock}
              value={formData.password}
              onChange={handleChange}
            />

            <div className="flex items-center justify-between mb-6 mt-2">
              <label htmlFor="remember" className="text-sm text-gray-600">
                <input type="checkbox" id="remember" className="mr-2 w-4 h-4" />
                Remember me
              </label>
              <a
                href="https://bzcart.store/forgot"
                className="text-orange-500 text-sm font-medium hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={userLoading}
              className={`w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all ${
                userLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {userLoading ? "Logging In..." : "Log In"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Don’t have an account?{" "}
            <button
              onClick={() => setIsSignIn(false)}
              className="text-orange-500 font-medium hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Right Panel */}
        <div
          className="w-1/2 relative text-white flex flex-col justify-between items-center p-10 bg-cover bg-center"
          style={{ backgroundImage: "url('./logo.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-orange-600/90 to-black/90" />
          <div className="z-10 flex-1 flex flex-col justify-center items-center text-center my-3 md:my-0">
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="max-w-xs">
              Enter your credentials to access your account and enjoy shopping
              with BZCart.
            </p>
          </div>
          <div className="z-10 flex flex-col gap-4 w-full max-w-xs">
            <button
              onClick={() => setIsSignIn(false)}
              className="w-full py-3 border border-white rounded-xl hover:bg-white hover:text-orange-600 transition font-semibold"
            >
              Sign Up
            </button>
            <Link
              to="/"
              className="w-full py-3 border border-white rounded-xl hover:bg-white hover:text-orange-600 transition font-semibold text-center"
            >
              Back To Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
