// src/compunent/PaymentForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../features/cart/cartSlice";
import axios from "axios";
import { ArrowLeft, Tag } from "lucide-react";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaMoneyBillAlt,
} from "react-icons/fa";

const PaymentForm = ({
  onBack,
  onNext,
  setOrderData,
  formData,
  setFormData,
  authUser,
  guestId,
  displayCart,
}) => {
  const dispatch = useDispatch();
  const reduxCart = useSelector((state) => state.cart.items);
  const cart = displayCart || reduxCart;

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [agree, setAgree] = useState(
    Array.isArray(displayCart) && displayCart.length > 0
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [isValidDiscount, setIsValidDiscount] = useState(false);
  const [discountMessage, setDiscountMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    setDiscountCode(formData.discountCode || "");
    setIsValidDiscount(formData.isValidDiscount || false);
    if (formData.discountCode && formData.isValidDiscount) {
      setDiscountMessage("10% discount applied!");
    }
  }, [formData]);

  useEffect(() => {
    console.log("PaymentForm - Cart items:", cart);
  }, [cart]);

  const getStock = (item) => {
    if (!item.product_id && !item._id) return 0;
    const product = item.product_id || item;
    if (product.sizes?.length > 0) {
      if (!item.selected_size) return 0;
      const size = product.sizes.find((s) => s.size === item.selected_size);
      return size?.stock || 0;
    }
    return product.product_stock || 0;
  };

  const validatePhone = (value) => {
    const phoneRegex = /^(?:\+92\d{10}|\d{11})$/;
    if (!phoneRegex.test(value)) {
      setPhoneError(
        "Phone must be 11 digits (e.g. 03001234567) or +92XXXXXXXXXX"
      );
    } else {
      setPhoneError("");
    }
  };

  useEffect(() => {
    if (formData.phoneNumber) validatePhone(formData.phoneNumber);
  }, [formData.phoneNumber]);

  const calculateSubtotal = () => {
    return Array.isArray(cart)
      ? cart.reduce((total, item) => {
          const price =
            item.product_id?.product_discounted_price ||
            item.product_discounted_price ||
            0;
          const qty = item.quantity || 1;
          return total + price * qty;
        }, 0)
      : 0;
  };

  const calculateShipping = () => {
    return Array.isArray(cart)
      ? cart.reduce((total, item) => {
          const product = item.product_id || item;
          const shipping = product.shipping || 0;
          const qty = item.quantity || 1;
          return total + shipping * qty;
        }, 0)
      : 0;
  };

  const handleDiscountCodeChange = async (e) => {
    const code = e.target.value.toUpperCase().trim();
    setDiscountCode(code);

    if (code) {
      if (!formData.email && !authUser?.email) {
        setIsValidDiscount(false);
        setDiscountMessage(
          "Please enter an email address to apply a discount code"
        );
        return;
      }

      try {
        const response = await axios.post(
          "https://bzbackend.online/api/users/validate-discount",
          { email: formData.email || authUser?.email, code }
        );
        if (response.data.isValid) {
          setIsValidDiscount(true);
          setDiscountMessage("10% discount applied!");
        } else {
          setIsValidDiscount(false);
          setDiscountMessage(response.data.message || "Invalid discount code");
        }
      } catch (error) {
        setIsValidDiscount(false);
        setDiscountMessage(
          error.response?.data?.message || "Failed to validate discount code"
        );
      }
    } else {
      setIsValidDiscount(false);
      setDiscountMessage("");
    }
  };

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const originalTotal = subtotal + shipping;
  const discountedSubtotal = isValidDiscount
    ? Math.round(subtotal * 0.9 * 100) / 100
    : subtotal;
  const grandTotal = discountedSubtotal + shipping;
  const discountAmount = subtotal - discountedSubtotal;

  const handlePlaceOrder = async () => {
    console.log("PaymentForm: handlePlaceOrder called", { formData, cart });
    if (!agree) {
      alert("Please agree to Terms and Conditions first");
      return;
    }
    if (
      !formData.fullName ||
      !formData.shippingAddress ||
      !formData.email ||
      !formData.phoneNumber ||
      phoneError
    ) {
      alert("Please fill in all fields correctly");
      return;
    }
    if (
      cart.some(
        (item) =>
          (item.product_id?.sizes?.length > 0 || item.sizes?.length > 0) &&
          !item.selected_size
      )
    ) {
      alert("Please select a size for all size-based products");
      return;
    }
    if (cart.some((item) => getStock(item) < (item.quantity || 1))) {
      alert("One or more items are out of stock");
      return;
    }

    setIsSubmitting(true);

    const orderDataToSend = {
      products: cart.map((item) => ({
        product_id: item.product_id?._id || item.product_id || item._id,
        quantity: item.quantity || 1,
        selected_image: item.selected_image,
        selected_size: item.selected_size || null,
      })),
      total_amount: subtotal,
      shipping_address: formData.shippingAddress,
      city: formData.city || undefined,
      order_email: formData.email,
      phone_number: formData.phoneNumber,
      full_name: formData.fullName,
      guestId,
      discount_code: isValidDiscount ? discountCode : undefined,
    };

    try {
      console.log("PaymentForm: dispatching createOrder", orderDataToSend);
      const result = await dispatch(createOrder(orderDataToSend)).unwrap();
      console.log("PaymentForm: createOrder result", result);

      // NO TOAST — INSTEAD PASS JUSTPLACED FLAG
      setOrderData({
        ...result,
        justPlaced: true, // This triggers celebration screen
      });

      // Clear form
      setFormData({
        ...formData,
        fullName: authUser?.username || "",
        email: authUser?.email || "",
        phoneNumber: "",
        shippingAddress: "",
        city: "",
        discountCode: "",
        isValidDiscount: false,
      });
      setIsValidDiscount(false);
      setDiscountMessage("");

      onNext(); // Go to TrackOrders
    } catch (err) {
      console.error("PaymentForm: createOrder error", err);
      alert(err?.message || err || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-5 max-w-lg mx-auto bg-white rounded-2xl shadow-xl">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-black transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-semibold flex-1 text-center bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
          Checkout
        </h1>
        <div className="w-6" />
      </div>

      <div className="flex items-center justify-between mb-12 w-full max-w-2xl mx-auto">
        <div className="flex ">
          <FaMapMarkerAlt size={25} className="text-black" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-5">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-full bg-gray-400"></div>
            ))}
        </div>
        <div className="flex">
          <FaCreditCard size={25} className="text-black" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-5">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-full bg-gray-400"></div>
            ))}
        </div>
        <div className="flex text-gray-400">
          <FaCheckCircle size={25} />
        </div>
      </div>

      <h3 className="text-xs font-medium tracking-wider text-gray-500 mb-1">
        STEP 2
      </h3>
      <h2 className="text-2xl font-bold mb-6">Payment</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { type: "cash", label: "Cash", icon: <FaMoneyBillAlt /> },
          { type: "credit", label: "Card", icon: <FaCreditCard /> },
          {
            type: "other",
            label: "Other",
            icon: <span className="text-xl">⋯</span>,
          },
        ].map((method) => (
          <button
            key={method.type}
            onClick={() => setPaymentMethod(method.type)}
            className={`flex flex-col items-center p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
              paymentMethod === method.type
                ? "border-black bg-gray-50 shadow-md scale-105"
                : "border-gray-200 hover:border-black hover:bg-gray-50"
            }`}
          >
            <div className="mb-1 text-lg">{method.icon}</div>
            {method.label}
          </button>
        ))}
      </div>

      {(paymentMethod === "credit" || paymentMethod === "other") && (
        <div className="mb-6 animate-fade-in">
          <div className="bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-3 rounded-lg flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 mr-2 text-yellow-600 animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 18a9 9 0 100-18 9 9 0 000 18z"
              />
            </svg>
            Payment method{" "}
            <span className="font-semibold mx-1 capitalize">
              {paymentMethod}
            </span>{" "}
            coming soon!
          </div>
        </div>
      )}

      {authUser && (
        <div className="mb-6">
          <label className="block text-gray-600 mb-2 font-semibold tracking-wide">
            Discount Code
          </label>
          <div className="relative group">
            <Tag
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <input
              type="text"
              value={discountCode}
              onChange={handleDiscountCodeChange}
              placeholder="Enter your 10% discount code"
              maxLength={8}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 shadow placeholder-gray-400 tracking-widest uppercase focus:border-transparent focus:ring-2 focus:ring-primary/70 focus:shadow-lg focus:shadow-primary/20 hover:shadow-md hover:border-gray-300 outline-none transition-all duration-300 text-dark font-semibold"
            />
          </div>
          {discountCode && (
            <p
              className={`text-sm mt-2 font-medium transition ${
                isValidDiscount ? "text-green-600" : "text-red-500"
              }`}
            >
              {discountMessage}
            </p>
          )}
        </div>
      )}

      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-dark mb-2">Order Items:</h4>
        {cart.map((item) => {
          const product = item.product_id || item;
          const isSizeMissing =
            product.sizes?.length > 0 && !item.selected_size;
          return (
            <div
              key={`${item.product_id?._id || item._id || item.product_id}-${
                item.selected_image
              }-${item.selected_size}`}
              className="flex justify-between text-sm text-dark py-1 border-b border-gray-200 last:border-b-0"
            >
              <span className="truncate">
                {item.quantity || 1}x {product.product_name || "Product"}
                {item.selected_size && ` (Size: ${item.selected_size})`}
                {isSizeMissing && (
                  <span className="text-red-500 ml-2">(Select size)</span>
                )}
              </span>
              <span className="font-medium">
                Rs.{" "}
                {(product.product_discounted_price || 0) * (item.quantity || 1)}
              </span>
            </div>
          );
        })}
      </div>
      <hr className="my-4" />
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Product Price:</span>
          <span>Rs. {subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping:</span>
          <span>Rs. {shipping}</span>
        </div>
        {isValidDiscount && (
          <>
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount (10%):</span>
              <span>-Rs. {discountAmount}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Code Applied:</span>
              <span className="font-mono">{discountCode}</span>
            </div>
          </>
        )}
        <div className="flex justify-between text-xl font-bold text-dark border-t pt-2">
          <span>Total Amount:</span>
          <span className={isValidDiscount ? "text-green-600" : ""}>
            Rs. {grandTotal}
          </span>
        </div>
      </div>

      <div className="flex items-start mb-6">
        <input
          type="checkbox"
          checked={agree}
          onChange={() => setAgree(!agree)}
          className="mr-3 w-4 h-4 border-gray-400 rounded"
        />
        <p className="text-sm text-gray-600 leading-snug">
          I agree to{" "}
          <a href="#" className="text-blue-600 underline font-medium">
            Terms and conditions
          </a>
        </p>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={
          isSubmitting ||
          !agree ||
          paymentMethod !== "cash" ||
          !formData.fullName ||
          !formData.shippingAddress ||
          !formData.email ||
          !formData.phoneNumber ||
          phoneError ||
          cart.some((item) => getStock(item) < (item.quantity || 1)) ||
          cart.some((item) => {
            const product = item.product_id || item;
            return product.sizes?.length > 0 && !item.selected_size;
          })
        }
        className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
          paymentMethod !== "cash"
            ? "bg-gray-400 cursor-not-allowed text-gray-100"
            : "bg-primary hover:bg-primary/90 text-white"
        }`}
      >
        {paymentMethod !== "cash" ? (
          <>
            <svg
              className="w-4 h-4 mr-2 text-yellow-300 animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 18a9 9 0 100-18 9 9 0 000 18z"
              />
            </svg>
            Coming Soon
          </>
        ) : isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Placing Order...
          </>
        ) : (
          "PLACE ORDER (Cash on Delivery)"
        )}
      </button>

      {/* Disabled reason helper to make it obvious why button is inert */}
      <div className="mt-2 text-sm text-red-600">
        {(() => {
          if (paymentMethod !== "cash")
            return "Payment method must be 'Cash' for placing this order.";
          if (!agree) return "You must agree to Terms and Conditions.";
          if (
            !formData.fullName ||
            !formData.shippingAddress ||
            !formData.email ||
            !formData.phoneNumber
          )
            return "Please complete all required shipping fields.";
          if (phoneError) return phoneError;
          if (cart.some((item) => getStock(item) < (item.quantity || 1)))
            return "One or more items are out of stock.";
          if (
            cart.some((item) => {
              const product = item.product_id || item;
              return product.sizes?.length > 0 && !item.selected_size;
            })
          )
            return "Please select sizes for products that require them.";
          return null;
        })()}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
        <p className="font-medium mb-1">Payment Method: Cash on Delivery</p>
        <p className="text-xs">Pay Rs. {grandTotal} to the delivery person</p>
      </div>
    </div>
  );
};

export default PaymentForm;
