import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userReset, verifyOTPData } from "../features/users/userSlice";
import { toast } from "react-toastify";

const OTPModal = ({ isOpen, onClose, onSubmit }) => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const { userLoading, userError, userMessage } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(verifyOTPData({ otp }));
    if (!userError) {
      dispatch(userReset());
      toast.success("OTP verified! Awaiting admin approval.");
      onSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Enter OTP</h2>
        <p className="text-gray-600 mb-4">
          Please enter the OTP sent to your email.
        </p>
        {userError && <p className="text-red-500 mb-4">{userMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={userLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {userLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPModal;
