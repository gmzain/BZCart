import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Tag } from "lucide-react";
import { FaMapMarkerAlt, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import axios from "axios";

const ShippingForm = ({
  onNext,
  formData,
  setFormData,
  errors,
  setErrors,
  authUser,
}) => {
  const [localFormData, setLocalFormData] = useState({
    fullName: authUser?.username || formData.fullName || "",
    email: authUser?.email || formData.email || "",
    phoneNumber: formData.phoneNumber || "",
    shippingAddress: formData.shippingAddress || "",
    discountCode: formData.discountCode || "",
    city: formData.city || "",
  });

  const [phoneError, setPhoneError] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const [isValidDiscount, setIsValidDiscount] = useState(false);
  const [loadingDiscount, setLoadingDiscount] = useState(false);

  useEffect(() => {
    setLocalFormData({
      fullName: authUser?.username || formData.fullName || "",
      email: authUser?.email || formData.email || "",
      phoneNumber: formData.phoneNumber || "",
      shippingAddress: formData.shippingAddress || "",
      discountCode: formData.discountCode || "",
      city: formData.city || "",
    });
  }, [authUser, formData]);

  const validatePhone = (value) => {
    // Accept 11-digit local numbers (e.g. 03001234567) or international +92XXXXXXXXXX
    const phoneRegex = /^(?:\+92\d{10}|\d{11})$/;
    if (!phoneRegex.test(value)) {
      setPhoneError(
        "Phone must be 11 digits (e.g. 03001234567) or +92XXXXXXXXXX"
      );
    } else {
      setPhoneError("");
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const updatedValue =
      name === "discountCode" ? value.toUpperCase().trim() : value;

    setLocalFormData({ ...localFormData, [name]: updatedValue });

    if (name === "phoneNumber") validatePhone(value);

    // Handle Discount Code Validation
    if (name === "discountCode") {
      const code = updatedValue;

      if (!code) {
        setDiscountMessage("");
        setIsValidDiscount(false);
        return;
      }

      if (!localFormData.email && !authUser?.email) {
        setIsValidDiscount(false);
        setDiscountMessage("Please enter your email first.");
        return;
      }

      try {
        setLoadingDiscount(true);
        const response = await axios.post(
          "https://bzbackend.online/api/users/validate-discount",
          { email: localFormData.email || authUser?.email, code }
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
        setDiscountMessage("Failed to validate discount code");
      } finally {
        setLoadingDiscount(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!localFormData.fullName) newErrors.fullName = "Full name is required";
    if (!localFormData.email) newErrors.email = "Email is required";
    if (!localFormData.phoneNumber || phoneError)
      newErrors.phoneNumber = phoneError || "Phone number is required";
    if (!localFormData.shippingAddress)
      newErrors.shippingAddress = "Shipping address is required";
    if (!localFormData.city) newErrors.city = "City is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setFormData({
        ...formData,
        ...localFormData,
        isValidDiscount,
      });
      onNext();
    }
  };

  // 🧠 Disable button logic
  const isButtonDisabled =
    !localFormData.fullName ||
    !localFormData.email ||
    !localFormData.phoneNumber ||
    !localFormData.city ||
    !localFormData.shippingAddress ||
    phoneError ||
    loadingDiscount ||
    (localFormData.discountCode && !isValidDiscount);

  return (
    <div className="py-6 px-4 font-daraz">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button className="text-gray-600 hover:text-black">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-semibold flex-1 text-center">Checkout</h1>
        <div className="w-6" />
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 w-full max-w-2xl mx-auto">
        <div className="flex">
          <FaMapMarkerAlt size={25} className="text-black" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-5">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-full bg-gray-400"></div>
            ))}
        </div>
        <div className="flex text-gray-400">
          <FaCreditCard size={25} />
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

      {/* Title */}
      <h3 className="text-sm font-medium tracking-wide text-gray-500 mb-1">
        STEP 1
      </h3>
      <h2 className="text-2xl font-semibold mb-8">Shipping Details</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="fullName"
              value={localFormData.fullName}
              onChange={handleChange}
              disabled={!!authUser?.username}
              placeholder="Enter your full name"
              className={`w-full border-b py-2 pl-8 pr-2 bg-transparent outline-none transition-all duration-200 ${
                errors.fullName
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-black"
              } disabled:text-gray-900 disabled:border-gray-200`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              name="email"
              value={localFormData.email}
              onChange={handleChange}
              disabled={!!authUser?.email}
              placeholder="Enter your email address"
              className={`w-full border-b py-2 pl-8 pr-2 bg-transparent outline-none transition-all duration-200 ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-black"
              } disabled:text-gray-900 disabled:border-gray-200`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="tel"
              name="phoneNumber"
              value={localFormData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number (e.g., +923001234567)"
              className={`w-full border-b py-2 pl-8 pr-2 bg-transparent outline-none transition-all duration-200 ${
                errors.phoneNumber || phoneError
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-black"
              }`}
            />
          </div>
          {(errors.phoneNumber || phoneError) && (
            <p className="text-xs text-red-500 mt-1">
              {errors.phoneNumber || phoneError}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Shipping Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="shippingAddress"
              value={localFormData.shippingAddress}
              onChange={handleChange}
              placeholder="Enter your shipping address"
              className={`w-full border-b py-2 pl-8 pr-2 bg-transparent outline-none transition-all duration-200 ${
                errors.shippingAddress
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-black"
              }`}
            />
          </div>
          {errors.shippingAddress && (
            <p className="text-xs text-red-500 mt-1">
              {errors.shippingAddress}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="city"
              value={localFormData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              className={`w-full border-b py-2 pl-2 pr-2 bg-transparent outline-none transition-all duration-200 ${
                errors.city
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-black"
              }`}
            />
          </div>
          {errors.city && (
            <p className="text-xs text-red-500 mt-1">{errors.city}</p>
          )}
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Discount Code (Optional)
          </label>
          <div className="relative">
            <Tag
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="discountCode"
              value={localFormData.discountCode}
              onChange={handleChange}
              placeholder="Enter discount code"
              maxLength={8}
              className="w-full border-b py-2 pl-8 pr-2 bg-transparent uppercase tracking-widest outline-none transition-all duration-200 border-gray-300 focus:border-black"
            />
          </div>
          {discountMessage && (
            <p
              className={`text-xs mt-1 ${
                isValidDiscount ? "text-green-600" : "text-red-500"
              }`}
            >
              {loadingDiscount ? "Checking code..." : discountMessage}
            </p>
          )}
        </div>

        {/* Continue */}
        <div className="sticky bottom-0 left-0 right-0 bg-white pt-4 pb-2 mt-6">
          <button
            type="submit"
            disabled={isButtonDisabled}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;
