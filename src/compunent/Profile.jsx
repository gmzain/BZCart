import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/users/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/loginprofile");
  };

  const [uploading, setUploading] = useState(false);
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploading(true);
        await axios.patch("/users/profile-image", { imageUrl: reader.result });
        const stored = JSON.parse(localStorage.getItem("myUser") || "{}");
        stored.profileImage = reader.result;
        localStorage.setItem("myUser", JSON.stringify(stored));
        toast.success("Profile image updated");
        setUploading(false);
        window.location.reload();
      } catch (err) {
        setUploading(false);
        toast.error(err?.response?.data?.message || "Failed to upload image");
      }
    };
    reader.readAsDataURL(f);
  };

  if (!user) {
    navigate("/loginprofile");
    return null;
  }

  return (
    <div className="min-h-screen bg-light flex flex-col items-center justify-center text-center p-6 font-cabin">
      {/* 🧑‍🎨 Profile Picture */}
      <div className="mb-6 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg">
          <img
            src={user.profileImage || "/default-avatar.png"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <label className="mt-3 text-sm text-primary cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          {uploading ? "Uploading..." : "Change Photo"}
        </label>
      </div>

      <h1 className="text-3xl font-bold text-dark mb-2">
        Welcome, {user.username || "User"} 👋
      </h1>
      <p className="text-gray-700 mb-6">{user.email}</p>

      <button
        onClick={handleLogout}
        className="bg-primary text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
      >
        Logout
      </button>
    </div>
  );
}
