import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, CheckCircle2, Truck, Package, Clock } from "lucide-react";
import { toast } from "react-toastify";
import Footer from "./Footer";

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://bzbackend.online/api/orders/order/${id}`
        );
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-700 font-medium">Loading your order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Order Not Found
        </h2>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const steps = [
    { label: "Order Placed", icon: Clock },
    { label: "Order Processed", icon: Package },
    { label: "Shipped", icon: Truck },
    { label: "Delivered", icon: CheckCircle2 },
  ];

  const getStatusIndex = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "processing":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      default:
        return 0;
    }
  };

  const activeStep = getStatusIndex(order.status);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto backdrop-blur-md bg-white/60 shadow-xl rounded-2xl p-8 border border-white/40">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate("/orders")}
              className="text-gray-600 hover:text-indigo-700 transition"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800 flex-1 text-center">
              Track Your Order
            </h1>
          </div>

          {/* Order Summary */}
          <div className="text-center mb-10">
            <p className="text-sm text-gray-600">
              Tracking Number:{" "}
              <span className="font-semibold text-gray-800">{order._id}</span>
            </p>
            <p className="text-2xl text-gray-600 mt-1">
              Status:{" "}
              <span
                className={`font-medium capitalize ${
                  order.status === "delivered"
                    ? "text-green-600"
                    : order.status === "shipped"
                    ? "text-blue-600"
                    : "text-primary"
                }`}
              >
                {order.status}
              </span>
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-2 bottom-2 w-1 bg-gray-200 rounded-full"></div>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= activeStep;
              return (
                <div
                  key={index}
                  className="flex items-start mb-10 relative z-10"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full shadow-md ${
                      isActive
                        ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="ml-5">
                    <h3
                      className={`text-lg font-medium ${
                        isActive ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {isActive
                        ? `Completed on ${new Date(
                            order.updatedAt
                          ).toLocaleDateString()}`
                        : "Pending"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rating Section */}
          {order.status === "delivered" && (
            <div className="mt-10 p-6 text-center bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 shadow-inner">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Rate Your Experience
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Help us improve by rating your delivery.
              </p>
              <div className="flex justify-center gap-2 text-yellow-400 text-2xl">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TrackOrder;
