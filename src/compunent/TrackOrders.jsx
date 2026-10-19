// src/compunent/TrackOrders.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
import { fetchMyOrders } from "../features/order/orderSlice";
import { ArrowLeft } from "lucide-react";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaList,
} from "react-icons/fa";

const TrackOrders = ({
  orderData: propOrderData,
  setOrderData,
  formData,
  authUser,
  guestId,
  onBackToCheckout,
}) => {
  const [showDetails, setShowDetails] = useState(true);
  const [localOrderData, setLocalOrderData] = useState(propOrderData);
  const [loading, setLoading] = useState(false);
  const [viewAllOrders, setViewAllOrders] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders: reduxOrders, loading: reduxLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    if (propOrderData) {
      setLocalOrderData(propOrderData);
      setViewAllOrders(false);
    }
  }, [propOrderData]);

  const fetchOrder = async () => {
    setLoading(true);
    const lastOrderId = localStorage.getItem("lastOrderId");
    let order = null;

    if (lastOrderId && !viewAllOrders) {
      try {
        const response = await api.get(`/orders/order/${lastOrderId}`);
        order = response.data;
      } catch (err) {
        console.error("Failed to fetch order:", err);
      }
    } else {
      try {
        const payload = await dispatch(fetchMyOrders({ guestId })).unwrap();
        if (Array.isArray(payload) && payload.length > 0) {
          setViewAllOrders(true);
        }
      } catch (err) {
        console.error("fetchMyOrders failed:", err);
      }
    }

    if (order && !viewAllOrders) {
      setLocalOrderData(order);
      if (setOrderData) setOrderData(order);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!propOrderData) {
      fetchOrder();
    }
  }, [propOrderData, guestId, dispatch, viewAllOrders]);

  const orderData = localOrderData;

  // Auto-hide celebration after 5 seconds
  useEffect(() => {
    if (orderData?.justPlaced) {
      const timer = setTimeout(() => {
        setLocalOrderData({ ...orderData, justPlaced: false });
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [orderData]);

  if (loading || reduxLoading) {
    return (
      <div className="py-6 px-4 text-center">
        <h3 className="text-2xl font-bold mb-5">Loading Order...</h3>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!orderData && !viewAllOrders && reduxOrders.length === 0) {
    return (
      <div className="py-6 px-4 text-center">
        <h3 className="text-2xl font-bold mb-5">No Orders Found</h3>
        <p className="text-gray-600">
          Start shopping to place your first order!
        </p>
        <button
          onClick={onBackToCheckout}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Back to Checkout
        </button>
      </div>
    );
  }



  
  // CELEBRATION SCREEN – JUST PLACED
  if (!viewAllOrders && orderData?.justPlaced) {
    return (
      <div className="py-12 px-6 text-center">
        <div className="mb-6  inline-flex items-center justify-center w-36 h-36 rounded-full bg-green-50 mx-auto">
          <svg
            width="100"
            height="100"
            viewBox="0 0 116 232"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M114.544 52.5231H112.561C112.17 52.5231 111.853 52.8407 111.853 53.2325V79.8797C111.853 80.2715 112.17 80.5891 112.561 80.5891H114.544C114.935 80.5891 115.252 80.2715 115.252 79.8797V53.2325C115.252 52.8407 114.935 52.5231 114.544 52.5231Z"
              fill="#F26C2B"
            />
            <path
              d="M101.634 0H12.0525C5.3961 0 0 5.40739 0 12.0777V219.458C0 226.128 5.3961 231.535 12.0525 231.535H101.634C108.291 231.535 113.687 226.128 113.687 219.458V12.0777C113.687 5.40739 108.291 0 101.634 0Z"
              fill="#3F3D56"
            />
            <path
              d="M57.5377 140.162C69.4153 140.162 79.044 130.513 79.044 118.61C79.044 106.708 69.4153 97.059 57.5377 97.059C45.6601 97.059 36.0314 106.708 36.0314 118.61C36.0314 130.513 45.6601 140.162 57.5377 140.162Z"
              fill="#3F3D56"
            />
            <path
              d="M85.8245 115.601C85.8243 121.298 84.1383 126.867 80.9797 131.603C77.8212 136.34 73.3319 140.032 68.0795 142.212C62.8272 144.392 57.0477 144.962 51.472 143.85C45.8962 142.739 40.7746 139.995 36.7548 135.967C32.735 131.938 29.9976 126.806 28.8887 121.218C27.7798 115.631 28.3492 109.839 30.5249 104.576C32.7006 99.313 36.385 94.8146 41.112 91.6497C45.839 88.4848 51.3964 86.7957 57.0815 86.7958C60.8562 86.796 64.5939 87.5411 68.0812 88.9888C71.5686 90.4364 74.7372 92.5582 77.4062 95.233C80.0753 97.9078 82.1924 101.083 83.6368 104.578C85.0813 108.073 85.8246 111.818 85.8245 115.601ZM53.7587 130.848L75.0808 109.481C75.2533 109.308 75.3903 109.104 75.4837 108.878C75.5771 108.652 75.6252 108.411 75.6252 108.166C75.6252 107.922 75.5771 107.68 75.4837 107.455C75.3903 107.229 75.2533 107.024 75.0808 106.852L72.4573 104.242C72.2855 104.069 72.0814 103.932 71.8566 103.839C71.6318 103.745 71.3908 103.697 71.1474 103.697C70.904 103.697 70.663 103.745 70.4382 103.839C70.2134 103.932 70.0093 104.069 69.8375 104.242L52.4472 121.669L44.3272 113.513C43.9787 113.166 43.5071 112.971 43.0155 112.971C42.5239 112.971 42.0523 113.166 41.7038 113.513L39.0803 116.158C38.7336 116.507 38.5391 116.979 38.5391 117.472C38.5391 117.965 38.7336 118.437 39.0803 118.786L51.1359 130.863C51.308 131.036 51.5124 131.173 51.7375 131.267C51.9626 131.36 52.2039 131.409 52.4476 131.409C52.6913 131.409 52.9326 131.36 53.1577 131.267C53.3828 131.173 53.5873 131.036 53.7594 130.863L53.7587 130.848Z"
              fill="#F26C2B"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-lg text-gray-700 mb-1">
          Your order has been confirmed, we will send you confirmation email
          shortly.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Order ID:{" "}
          <span className="font-mono font-bold">
            #{orderData._id?.slice(-6)}
          </span>
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onBackToCheckout}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() =>
              setLocalOrderData({ ...orderData, justPlaced: false })
            }
            className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition"
          >
            View Order Details
          </button>
        </div>

        <p className="mt-8 text-xs text-gray-500">
          Need help?{" "}
          <a
            href={`https://wa.me/923297609190?text=Hello! About order #%23${orderData._id?.slice(
              -6
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Chat on WhatsApp
          </a>
        </p>
      </div>
    );
  }

  // DETAILED ORDER VIEW
  if (!viewAllOrders && orderData) {
    const originalSubtotal =
      orderData.original_amount - orderData.shipping_amount;
    const discountAmount = orderData.discount_applied
      ? originalSubtotal * 0.1
      : 0;

    return (
      <div className="py-6 px-4">
        <div className="flex items-center mb-6 justify-center">
          <h1 className="text-lg font-semibold text-center">
            Order Confirmation
          </h1>
        </div>

        <div className="flex items-center justify-between mb-12 w-full max-w-2xl mx-auto">
          <div className="flex">
            <FaMapMarkerAlt size={25} className="text-green-500" />
          </div>
          <div className="flex-1 flex items-center justify-center gap-5">
            {Array(4)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-1 rounded-full bg-green-500"
                ></div>
              ))}
          </div>
          <div className="flex">
            <FaCreditCard size={25} className="text-green-500" />
          </div>
          <div className="flex-1 flex items-center justify-center gap-5">
            {Array(4)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-1 rounded-full bg-green-500"
                ></div>
              ))}
          </div>
          <div className="flex">
            <FaCheckCircle size={25} className="text-green-500" />
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors mb-3"
        >
          {showDetails
            ? "Hide Order Details"
            : `View Order #${orderData._id?.slice(-6)}`}
        </button>

        {showDetails && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <h4 className="font-bold text-dark mb-3 border-b pb-2">
              Order Confirmation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-right">
                #{orderData._id?.slice(-6)}
              </span>
              <span className="text-gray-600">Name:</span>
              <span className="text-right">{orderData.full_name}</span>
              <span className="text-gray-600">Email:</span>
              <span className="text-right">{orderData.order_email}</span>
              <span className="text-gray-600">Phone:</span>
              <span className="text-right">{orderData.phone_number}</span>
              <span className="text-gray-600">Address:</span>
              <span className="text-right">{orderData.shipping_address}</span>
              {orderData.discount_code && (
                <>
                  <span className="text-gray-600">Discount:</span>
                  <span className="text-green-600 text-right font-medium">
                    10% OFF - {orderData.discount_code}
                  </span>
                </>
              )}
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-right">Rs. {originalSubtotal}</span>
              <span className="text-gray-600">Shipping:</span>
              <span className="text-right">
                Rs. {orderData.shipping_amount}
              </span>
              <span className="text-gray-600">Total:</span>
              <span className="text-right font-bold text-lg text-primary">
                Rs. {orderData.total_amount}
              </span>
            </div>
            <div className="mt-3 pt-2 border-t text-center text-sm text-gray-600">
              <p>Order Status: {orderData.status}</p>
              <p className="text-xs mt-1">
                You'll receive a confirmation email shortly
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={onBackToCheckout}
            className="flex-1 py-2 bg-primary text-white rounded-lg font-semibold"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => setViewAllOrders(true)}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <FaList /> View All Orders
          </button>
        </div>
      </div>
    );
  }

  // ALL ORDERS VIEW
  if (viewAllOrders) {
    return (
      <div className="py-6 px-4">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setViewAllOrders(false)}
            className="text-gray-500 hover:text-black transition mr-2"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-semibold text-center flex-1">
            My Orders
          </h1>
        </div>

        {reduxOrders.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No orders found.</p>
            <button
              onClick={onBackToCheckout}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            >
              Back to Checkout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reduxOrders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-50 p-4 rounded-lg border cursor-pointer"
                onClick={() => {
                  setLocalOrderData(order);
                  setViewAllOrders(false);
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">
                    Order #{order._id.slice(-6)}
                  </span>
                  <span className="text-sm text-gray-600">{order.status}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Total: Rs. {order.total_amount}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default TrackOrders;
