import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  registerMyUser,
  verifyOTPData,
  userReset,
} from "../features/users/userSlice";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import InputWithIcon from "./InputWithIcon";

// ✅ Small SVG added for OTP verification illustration
const OtpSVG = () => (
  <div className="flex justify-center">
    <svg
      width="232"
      height="244"
      viewBox="0 0 232 244"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M115.481 222.507C168.057 222.743 210.869 180.313 211.105 127.737C211.342 75.1616 168.912 32.3491 116.336 32.1128C63.7606 31.8766 20.948 74.3062 20.7118 126.882C20.4756 179.458 62.9051 222.27 115.481 222.507Z"
        stroke="#F26C2B"
        strokeWidth="0.641063"
        strokeDasharray="3.85 3.85"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M115.39 242.7C179.118 242.986 231.012 191.556 231.299 127.828C231.585 64.1001 180.155 12.206 116.427 11.9197C52.6988 11.6334 0.804724 63.0632 0.518396 126.791C0.232069 190.52 51.6619 242.414 115.39 242.7Z"
        stroke="#F26C2B"
        strokeWidth="0.641063"
        strokeDasharray="3.85 3.85"
      />
      <path
        d="M192.971 164.418C193.035 150.984 182.864 139.708 169.495 138.39C156.125 137.072 143.949 146.145 141.388 159.333L61.3973 156.804L62.2138 170.552C62.2138 170.552 50.688 196.823 110.611 204.105L110.492 230.709L179.803 231.021L180.001 186.788C187.987 182.16 192.922 173.647 192.971 164.418Z"
        fill="url(#paint0_linear_1_18)"
      />
      <path
        d="M64.9581 171.142C64.9581 171.142 53.9213 196.299 111.307 203.281L111.193 228.77L177.571 229.068L177.874 161.568L64.1646 157.974L64.9581 171.142Z"
        fill="#FFCBB4"
      />
      <path
        d="M98.6054 66.1028C94.9768 71.7722 87.4508 73.4469 81.7605 69.8511L46.2265 46.2059C40.5571 42.5772 38.8824 35.0512 42.4782 29.361C46.1063 23.6994 53.6227 22.0255 59.3103 25.6126L94.8443 49.2578C100.518 52.8822 102.199 60.4092 98.6054 66.1028Z"
        fill="url(#paint1_linear_1_18)"
      />
      <path
        d="M96.6368 64.8119C93.2639 70.0817 86.2684 71.6384 80.979 68.2962L47.9378 46.3002C42.668 42.9273 41.1112 35.9318 44.4534 30.6424C47.8263 25.3726 54.8218 23.8159 60.1111 27.158L93.146 49.1413C98.4259 52.5126 99.9865 59.5182 96.6368 64.8119Z"
        fill="#FFCBB4"
      />
      <path
        d="M165.146 190.08C178.913 190.142 190.123 179.032 190.185 165.265C190.247 151.498 179.137 140.287 165.37 140.225C151.603 140.163 140.392 151.274 140.33 165.041C140.269 178.808 151.379 190.018 165.146 190.08Z"
        fill="#FFCBB4"
      />
      <path
        d="M161.509 0.720759L66.0174 0.29172C63.8489 0.281977 62.083 2.03202 62.0733 4.20055L61.2705 182.882C61.2607 185.051 63.0108 186.817 65.1793 186.826L160.671 187.255C162.84 187.265 164.605 185.515 164.615 183.346L165.418 4.66487C165.428 2.49634 163.678 0.730502 161.509 0.720759Z"
        fill="url(#paint2_linear_1_18)"
      />
      <path
        d="M159.652 3.23498L67.846 2.82251C65.4314 2.81166 63.4652 4.76028 63.4543 7.17487L62.6782 179.927C62.6673 182.341 64.6159 184.308 67.0305 184.318L158.836 184.731C161.251 184.742 163.217 182.793 163.228 180.378L164.004 7.62663C164.015 5.21204 162.066 3.24583 159.652 3.23498Z"
        fill="white"
      />
      <path
        d="M138.989 7.69375C138.37 11.6682 134.945 14.597 130.922 14.5907L96.1963 14.4346C92.1754 14.4032 88.778 11.4442 88.1951 7.46554L69.7967 7.38287C68.7837 7.37832 67.8101 7.77493 67.0903 8.48772C66.3705 9.20051 65.9634 10.1702 65.9589 11.1832L65.2187 175.935C65.2141 176.948 65.6107 177.921 66.3235 178.641C67.0363 179.361 68.006 179.768 69.019 179.773L156.889 180.167C157.902 180.172 158.875 179.775 159.595 179.062C160.315 178.35 160.722 177.38 160.726 176.367L161.467 11.6155C161.471 10.6025 161.075 9.62888 160.362 8.90905C159.649 8.18922 158.679 7.78222 157.666 7.77767L138.989 7.69375Z"
        fill="#E9ECFF"
      />
      <path
        d="M124.424 9.79839L103.298 9.70347C102.944 9.70188 102.656 9.9876 102.654 10.3416L102.654 10.4602C102.652 10.8143 102.938 11.1026 103.292 11.1042L124.418 11.1991C124.772 11.2007 125.06 10.915 125.062 10.5609L125.062 10.4423C125.064 10.0883 124.778 9.79998 124.424 9.79839Z"
        fill="#DBDBDB"
      />
      <path
        d="M129.818 11.4278C130.395 11.4304 130.864 10.965 130.867 10.3883C130.869 9.81155 130.404 9.34192 129.827 9.33933C129.251 9.33674 128.781 9.80217 128.778 10.3789C128.776 10.9556 129.241 11.4252 129.818 11.4278Z"
        fill="#DBDBDB"
      />
      <path
        d="M181.351 169.623C174.109 171.263 169.165 166.523 167.525 159.284L151.18 97.4854C149.558 90.2188 154.108 83.0066 161.365 81.341C168.632 79.7197 175.844 84.2698 177.509 91.5264L190.79 154.904C192.43 162.146 188.59 167.982 181.351 169.623Z"
        fill="url(#paint3_linear_1_18)"
      />
      <path
        d="M175.638 93.029C174.255 86.9186 168.18 83.0863 162.07 84.4692C155.959 85.8521 152.127 91.9266 153.51 98.037L168.498 164.26C169.881 170.371 175.955 174.203 182.066 172.82C188.176 171.437 192.008 165.363 190.625 159.252L175.638 93.029Z"
        fill="#FFCBB4"
      />
      <path
        d="M189.83 220.783L94.9538 220.357L94.8545 242.473L189.731 242.899L189.83 220.783Z"
        fill="url(#paint4_linear_1_18)"
      />
      <path
        d="M187.254 223.336L97.5066 222.932L97.4288 240.241L187.177 240.644L187.254 223.336Z"
        fill="#F26C2B"
      />
      <path
        d="M84.474 132.255C80.8894 137.857 73.4534 139.512 67.8312 135.96L43.9989 120.387C38.3969 116.802 36.7418 109.366 40.2946 103.744C43.8791 98.142 51.3151 96.4869 56.9373 100.04L80.7696 115.613C86.3716 119.197 88.0268 126.633 84.474 132.255Z"
        fill="url(#paint5_linear_1_18)"
      />
      <path
        d="M78.3266 164.964C74.7101 170.617 67.2063 172.288 61.533 168.703L46.7763 157.841C41.1229 154.224 39.4523 146.721 43.0374 141.047C46.6539 135.394 54.1576 133.723 59.831 137.308L74.5876 148.174C80.2391 151.79 81.9095 159.291 78.3266 164.964Z"
        fill="url(#paint6_linear_1_18)"
      />
      <g opacity="0.5">
        <path
          d="M113.212 122.605C129.133 122.677 142.098 109.828 142.169 93.9062C142.241 77.9848 129.392 65.0199 113.471 64.9484C97.5493 64.8769 84.5844 77.7257 84.5129 93.6472C84.4414 109.569 97.2902 122.533 113.212 122.605Z"
          fill="url(#paint7_linear_1_18)"
        />
      </g>
      <path
        d="M113.219 120.909C128.204 120.977 140.406 108.884 140.474 93.8986C140.541 78.9136 128.448 66.7113 113.463 66.644C98.478 66.5767 86.2757 78.6698 86.2084 93.6548C86.1411 108.64 98.2342 120.842 113.219 120.909Z"
        fill="#F26C2B"
      />
      <path
        d="M101.581 90.1019L111.713 99.4749L126.222 78.3432L131.293 82.6066L111.675 107.956L97.3329 91.7816L101.581 90.1019Z"
        fill="white"
      />
      <path
        d="M77.1346 164.154C73.7617 169.424 66.7662 170.981 61.4768 167.638L47.7137 157.525C42.4438 154.152 40.8871 147.156 44.2293 141.867C47.6022 136.597 54.5977 135.04 59.887 138.383L73.6469 148.516C78.9062 151.887 80.4631 158.868 77.1346 164.154Z"
        fill="#FFCBB4"
      />
      <path
        d="M83.1635 131.4C79.7907 136.67 72.7951 138.227 67.5058 134.885L45.0829 120.232C39.8131 116.859 38.2564 109.863 41.5985 104.574C44.9714 99.304 51.9669 97.7472 57.2563 101.089L79.6792 115.742C84.949 119.115 86.5057 126.111 83.1635 131.4Z"
        fill="#FFCBB4"
      />
      <path
        d="M90.8001 99.7015C87.1979 105.328 79.7284 106.99 74.0804 103.421L43.8791 83.5633C38.2525 79.9611 36.5906 72.4915 40.1591 66.8435C43.7613 61.217 51.2308 59.555 56.8788 63.1235L87.0801 82.9817C92.7067 86.5839 94.3686 94.0535 90.8001 99.7015Z"
        fill="url(#paint8_linear_1_18)"
      />
      <path
        d="M89.1956 98.6685C85.8227 103.938 78.8272 105.495 73.5378 102.153L45.2509 83.5534C39.9811 80.1805 38.4243 73.185 41.7665 67.8956C45.1394 62.6258 52.1349 61.0691 57.4243 64.4113L85.708 83.0108C90.9789 86.3826 92.5372 93.3783 89.1956 98.6685Z"
        fill="#FFCBB4"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_18"
          x1="126.874"
          y1="230.799"
          x2="127.29"
          y2="138.089"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F26C2B" stopOpacity="0.25" />
          <stop offset="0.54" stopColor="#F26C2B" stopOpacity="0.12" />
          <stop offset="1" stopColor="#F26C2B" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1_18"
          x1="70.4311"
          y1="71.6689"
          x2="70.6461"
          y2="23.8012"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F26C2B" stopOpacity="0.25" />
          <stop offset="0.54" stopColor="#F26C2B" stopOpacity="0.12" />
          <stop offset="1" stopColor="#F26C2B" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1_18"
          x1="112.925"
          y1="187.038"
          x2="113.763"
          y2="0.503037"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F26C2B" stopOpacity="0.25" />
          <stop offset="0.54" stopColor="#F26C2B" stopOpacity="0.12" />
          <stop offset="1" stopColor="#F26C2B" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_1_18"
          x1="170.811"
          y1="169.909"
          x2="171.21"
          y2="81.0391"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F26C2B" stopOpacity="0.25" />
          <stop offset="0.54" stopColor="#F26C2B" stopOpacity="0.12" />
          <stop offset="1" stopColor="#F26C2B" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_1_18"
          x1="142.299"
          y1="242.68"
          x2="142.398"
          y2="220.563"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F26C2B" stopOpacity="0.25" />
          <stop offset="0.54" stopColor="#F26C2B" stopOpacity="0.12" />
          <stop offset="1" stopColor="#F26C2B" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_1_18"
          x1="62.2906"
          y1="137.778"
          x2="62.4683"
          y2="98.2247"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F26C2B" stop-opacity="0.25" />
          <stop offset="0.54" stop-color="#F26C2B" stop-opacity="0.12" />
          <stop offset="1" stop-color="#F26C2B" stop-opacity="0.1" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_1_18"
          x1="60.6047"
          y1="170.558"
          x2="60.7625"
          y2="135.45"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F26C2B" stop-opacity="0.25" />
          <stop offset="0.54" stop-color="#F26C2B" stop-opacity="0.12" />
          <stop offset="1" stop-color="#F26C2B" stop-opacity="0.1" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_1_18"
          x1="113.212"
          y1="122.605"
          x2="113.471"
          y2="64.9452"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F26C2B" stop-opacity="0.25" />
          <stop offset="0.54" stop-color="#F26C2B" stop-opacity="0.12" />
          <stop offset="1" stop-color="#F26C2B" stop-opacity="0.1" />
        </linearGradient>
        <linearGradient
          id="paint8_linear_1_18"
          x1="65.3793"
          y1="105.245"
          x2="65.5766"
          y2="61.3227"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F26C2B" stop-opacity="0.25" />
          <stop offset="0.54" stop-color="#F26C2B" stop-opacity="0.12" />
          <stop offset="1" stop-color="#F26C2B" stop-opacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default function Signup({ setIsSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, tempUser, userLoading, userError, userMessage, userSuccess } =
    useSelector((state) => state.auth);

  // OTP handlers
  const handleOtpChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!showOtpInput) {
      dispatch(registerMyUser(formData));
    } else {
      dispatch(verifyOTPData({ otp: otp.join("") }));
    }
  };

  useEffect(() => {
    if (userError) {
      toast.error(userMessage);
      dispatch(userReset());
    }
    if (userSuccess && tempUser && !showOtpInput) {
      toast.success("OTP sent to your email!");
      setShowOtpInput(true);
      dispatch(userReset());
    } else if (userSuccess && user && showOtpInput) {
      toast.success(`Welcome, ${user.username}!`);
      navigate("/");
      dispatch(userReset());
    }
  }, [
    userSuccess,
    userError,
    userMessage,
    user,
    tempUser,
    showOtpInput,
    navigate,
    dispatch,
  ]);

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
          <div className="relative bg-gradient-to-br from-orange-600 to-orange-400 py-10 px-6 text-center text-white rounded-b-3xl shadow-lg">
            <button
              onClick={() => setIsSignIn(true)}
              className="absolute top-6 left-6 text-white/90 hover:text-white transition"
            >
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-3xl font-bold drop-shadow-sm">
              {showOtpInput ? "Verify Email" : "Sign Up"}
            </h2>
            <p className="text-white/90 text-sm mt-2 tracking-wide">
              {showOtpInput
                ? "Enter the OTP sent to your email"
                : "Please sign up to get started"}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className={`px-6  ${
              showOtpInput ? "py-0 space-y-3 -mt-3" : "py-8 space-y-6"
            } `}
          >
            {!showOtpInput ? (
              <>
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    NAME
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full bg-gray-100/80 text-gray-800 rounded-xl px-4 py-3 shadow-inner outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition placeholder-gray-400"
                  />
                </div>

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
                      className="w-full bg-gray-100/80 text-gray-800 rounded-xl px-4 py-3 shadow-inner outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-orange-500 transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="robot"
                    className="mr-2 w-4 h-4 accent-orange-500"
                    required
                  />
                  <label htmlFor="robot" className="text-sm text-gray-700">
                    I am not a robot
                  </label>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-">
                <div className="w-40">
                  <OtpSVG />
                </div>
                <p className="text-gray-700 text-sm text-center ">
                  We’ve sent a 6-digit verification code to your email.
                </p>
                <div className="flex space-x-3 my-4">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleBackspace(e, index)}
                      className="w-10 h-12 text-center text-lg font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={userLoading}
              className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3.5 rounded-xl text-base shadow-md hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-0.5 transition-all duration-300 ${
                userLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {userLoading
                ? showOtpInput
                  ? "Verifying OTP..."
                  : "Signing Up..."
                : showOtpInput
                ? "Verify OTP"
                : "SIGN UP"}
            </button>
          </form>
        </div>
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:flex flex-row font-draz">
        {/* Left Panel */}
        <div
          className="w-1/2 relative text-white flex flex-col justify-center items-center p-10 bg-cover bg-center"
          style={{ backgroundImage: "url('./logo.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-dark/90" />
          <div className="z-10 text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="max-w-xs mx-auto mb-6">
              Already have an account? Sign in to continue your journey.
            </p>
            <button
              onClick={() => setIsSignIn(true)}
              className="w-40 py-3 border border-white rounded-xl hover:bg-white hover:text-orange-600 font-semibold transition"
            >
              Log In
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-white flex flex-col justify-center items-center p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
            {showOtpInput ? "Verify Your Email" : "Create an Account"}
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            {!showOtpInput ? (
              <>
                <InputWithIcon
                  type="text"
                  name="username"
                  placeholder="Name"
                  Icon={FaUser}
                  value={formData.username}
                  onChange={handleChange}
                />
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
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="robot"
                    className="mr-2 w-4 h-4 accent-orange-500"
                  />
                  <label htmlFor="robot" className="text-sm text-gray-600">
                    I am not a robot
                  </label>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-6 mt-4">
                <OtpSVG />
                <div className="flex space-x-3">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleBackspace(e, index)}
                      className="w-10 h-12 text-center text-lg font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={userLoading}
              className={`w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-700 transition ${
                userLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {userLoading
                ? showOtpInput
                  ? "Verifying OTP..."
                  : "Signing Up..."
                : showOtpInput
                ? "Verify OTP"
                : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
