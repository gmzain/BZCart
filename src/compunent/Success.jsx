import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";

const Success = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const finalizeOrder = async () => {
      const sessionId = new URLSearchParams(window.location.search).get(
        "session_id"
      );
      if (!sessionId) {
        setErrorMessage("Invalid payment session.");
        setIsProcessing(false);
        return;
      }

      try {
        await axios.post("https://bzbackend.online/api/orders/success", {
          session_id: sessionId,
        });
        toast.success("Payment successful! Order created.");
        setIsProcessing(false);
      } catch (error) {
        console.error(
          "Finalize order error:",
          error.response?.data || error.message
        );
        setErrorMessage(
          error.response?.data?.message || "Failed to finalize order."
        );
        setIsProcessing(false);
      }
    };

    finalizeOrder();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {isProcessing ? (
        <>
          <h2 className="text-3xl font-bold mb-4">Processing Payment...</h2>
          <PulseLoader size={15} color="blue" />
          <p className="mt-4 text-gray-600">
            Please wait while we verify your payment.
          </p>
        </>
      ) : errorMessage ? (
        <>
          <h2 className="text-3xl font-bold mb-4 text-red-600">
            Payment Failed
          </h2>
          <p className="text-gray-600">{errorMessage}</p>
          <button
            onClick={() => navigate("/cart")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Return to Cart
          </button>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-4 text-green-600">
            Payment Successful!
          </h2>
          <p className="text-gray-600">
            Your order has been created successfully.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Go to Home
          </button>
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Success;
