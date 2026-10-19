// src/compunent/OrderSuccessModal.jsx
import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccessModal = ({ show, onClose, onViewOrder }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onViewOrder();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onViewOrder]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
        <FaCheckCircle
          className="text-green-500 mx-auto mb-4 animate-bounce"
          size={80}
        />
        <h2 className="text-3xl font-bold text-green-600 mb-2">
          Order Confirmed!
        </h2>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onViewOrder}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
          >
            View My Order
          </button>
          <button
            onClick={onClose}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
