import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  PackageCheck,
} from "lucide-react";

import Footer from "./Footer";
import { fetchMyOrders } from "../features/order/orderSlice";

const OrdersList = ({ guestId: propGuestId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  // Only use guestId if we don't have a logged in user
  const guestId =
    !user &&
    (propGuestId || localStorage.getItem("guestId") || `guest_${Date.now()}`);

  useEffect(() => {
    // Only set guestId in localStorage if we're not logged in
    if (!user && !localStorage.getItem("guestId")) {
      localStorage.setItem("guestId", guestId);
    }

    // If logged in, don't pass guestId at all
    dispatch(fetchMyOrders(guestId ? { guestId } : {}))
      .unwrap()
      .catch((err) => {
        console.error("OrdersList error:", err);
        toast.error(err || "Failed to fetch orders");
      });
  }, [dispatch, guestId, user]);

  const handleRefresh = () => {
    dispatch(fetchMyOrders({ guestId }))
      .unwrap()
      .then(() => toast.success("Orders refreshed"))
      .catch((err) => toast.error(err || "Failed to refresh orders"));
  };

  // Loader
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600 font-medium">Loading your orders...</p>
      </div>
    );

  // Error
  if (error)
    return (
      <div className="text-center min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-red-500 font-medium mb-3">{error}</p>
        <button
          onClick={handleRefresh}
          className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:bg-orange-700 transition"
        >
          <RefreshCw size={18} /> Retry
        </button>
      </div>
    );

  // Empty state
  if (orders.length === 0)
    return (
      <div className="text-center min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-600 mb-4 text-lg">You have no orders yet.</p>
        <button
          onClick={handleRefresh}
          className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:bg-orange-700 transition"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>
    );

  const statusSteps = [
    { key: "pending", label: "Pending", icon: Clock },
    { key: "processing", label: "Processing", icon: PackageCheck },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  const getCurrentStep = (status) =>
    statusSteps.findIndex((s) => s.key === status);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "processing":
        return "text-blue-500";
      case "shipped":
        return "text-orange-700";
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto backdrop-blur-md bg-white/70 shadow-xl rounded-2xl p-8 border border-white/40">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-gray-700 hover:text-orange-700 transition"
            >
              <ArrowLeft size={20} /> Back
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">My Orders</h1>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg shadow-md hover:bg-orange-700 transition"
            >
              <RefreshCw size={18} /> <p className="hidden md:block">Refresh</p>
            </button>
          </div>

          {/* Orders List */}
          <div className="space-y-8">
            {orders.map((order) => {
              const currentStep = getCurrentStep(order.status);
              const isCancelled = order.status === "cancelled";

              return (
                <div
                  key={order._id}
                  className="relative bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-200 p-6 cursor-pointer group"
                  onClick={() => navigate(`/track-order/${order._id}`)}
                >
                  {/* Floating glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-100 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition"></div>

                  {/* Header */}
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <p className="font-semibold text-gray-800">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 ml-4">
                      {order.city ? `City: ${order.city}` : "City: N/A"}
                    </p>
                    <div className="mt-2 text-sm">
                      {order.items &&
                        order.items.map((item, idx) => (
                          <p key={idx} className="text-gray-600">
                            {item.product_id?.product_name}
                            {item.selected_size && (
                              <span className="text-gray-500">
                                {" "}
                                (Size: {item.selected_size})
                              </span>
                            )}
                            <span className="text-gray-500">
                              {" "}
                              × {item.quantity}
                            </span>
                          </p>
                        ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  {isCancelled ? (
                    <div className="flex items-center gap-2 text-red-500 relative z-10">
                      <XCircle size={20} />
                      <p className="font-medium">Order Cancelled</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-6 relative z-10">
                      {statusSteps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = index <= currentStep;
                        return (
                          <div
                            key={step.key}
                            className={`flex flex-col items-center relative ${
                              index !== statusSteps.length - 1 ? "flex-1" : ""
                            }`}
                          >
                            {/* Connecting line */}
                            {index !== statusSteps.length - 1 && (
                              <div
                                className={`absolute top-4 left-1/2 w-full h-[2px] ${
                                  index < currentStep
                                    ? "bg-orange-700"
                                    : "bg-gray-200"
                                }`}
                              ></div>
                            )}

                            {/* Step icon */}
                            <div
                              className={`z-10 w-10 h-10 flex items-center justify-center rounded-full ${
                                isActive
                                  ? "bg-gradient-to-br from-orange-700 to-primary text-white shadow-md"
                                  : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              <StepIcon size={18} />
                            </div>

                            {/* Label */}
                            <p
                              className={`mt-2 text-xs font-medium ${
                                isActive ? "text-gray-800" : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Footer Info */}
                  <div className="mt-8 flex justify-between items-center text-sm relative z-10">
                    <p className="text-gray-600">
                      Items: {order.products.length}
                    </p>
                    <p
                      className={`font-semibold capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </p>
                    <p className="text-gray-800 font-semibold">
                      Rs. {order.total_amount}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrdersList;
