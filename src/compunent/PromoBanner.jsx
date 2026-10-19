import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

const PromoBanner = () => {
  const { user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://bzbackend.online/api/users/subscribe",
        { email }
      );
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
      setEmail(user?.email || ""); // Reset only if not logged in
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to subscribe. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative font-cabin text-white py-48 px-4 flex flex-col items-center text-center min-h-[600px] overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        loading="lazy"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="./video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative max-w-2xl">
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">
          SAVE 10% ON YOUR FIRST ORDER!
        </h2>
        <p className="text-lg sm:text-xl mb-1">
          Subscribe to receive product updates and exclusive
        </p>
        <p className="text-lg sm:text-xl mb-8">
          Delta 8 Resellers coupon codes.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            disabled={user?.email || isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-gray-900/70 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition-all duration-300 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromoBanner;
