// src/compunent/Cashout.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector
import Footer from "./Footer";
import ShippingForm from "./ShippingForm";
import PaymentForm from "./PaymentForm";
import TrackOrders from "./TrackOrders";
import { ArrowLeft } from "lucide-react";
import { FaMapMarkerAlt, FaCreditCard, FaCheckCircle } from "react-icons/fa";

const Cashout = () => {
  const location = useLocation();
  const buyNowProduct = location.state?.buyNowProduct;
  const guestIdFromState = location.state?.guestId;

  // Retrieve authUser from Redux store
  const { user: authUser } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: authUser?.username || "",
    email: authUser?.email || "",
    phoneNumber: "",
    shippingAddress: "",
    discountCode: "",
    isValidDiscount: false,
    city: "",
  });
  const [errors, setErrors] = useState({});

  // Get guestId from localStorage or generate one
  const guestId = localStorage.getItem("guestId") || `guest_${Date.now()}`;

  // Use this cart for calculation (Buy Now or full cart)
  const displayCart = buyNowProduct ? [buyNowProduct] : [];

  useEffect(() => {
    if (!localStorage.getItem("guestId")) {
      localStorage.setItem("guestId", guestId);
    }
  }, [guestId]);

  // Prefill form data for logged-in users
  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: authUser.username || prev.fullName,
        email: authUser.email || prev.email,
      }));
    }
  }, [authUser]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const resetToCheckout = () => setStep(1); // Reset to step 1

  return (
    <>
      <div className="md:w-[35%] font-daraz bg-white p-4 rounded-xl shadow mx-auto mb-8">
        {step === 1 && (
          <ShippingForm
            onNext={nextStep}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            authUser={authUser}
          />
        )}
        {step === 2 && (
          <PaymentForm
            onBack={prevStep}
            onNext={nextStep}
            setOrderData={setOrderData}
            formData={formData}
            setFormData={setFormData}
            authUser={authUser}
            guestId={guestIdFromState || guestId}
            displayCart={displayCart}
          />
        )}
        {step === 3 && (
          <TrackOrders
            orderData={orderData}
            setOrderData={setOrderData}
            formData={formData}
            authUser={authUser}
            guestId={guestIdFromState || guestId}
            onBackToCheckout={resetToCheckout}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cashout;
