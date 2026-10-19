import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Footer from "./Footer";
import {
  FaTruck,
  FaUndo,
  FaMoneyBillAlt,
  FaHeadset,
  FaStar,
} from "react-icons/fa";
import { fetchDealById } from "../features/deals/dealSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SingleDeal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentDeal, loading, error } = useSelector((state) => state.deals);
  const user = JSON.parse(localStorage.getItem("myUser") || "{}");
  const guestId = localStorage.getItem("guestId") || null;

  const mainSliderRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [timeLeft, setTimeLeft] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  // WhatsApp number
  const WHATSAPP_NUMBER = "923297609190";

  // Fetch deal
  useEffect(() => {
    dispatch(fetchDealById(id))
      .unwrap()
      .then((deal) => {
        if (deal.deal_images?.[0]) {
          setSelectedImage(deal.deal_images[0]);
        }
      })
      .catch(() => {
        toast.error("Failed to load deal");
      });
  }, [dispatch, id]);

  // Countdown timer
  useEffect(() => {
    if (!currentDeal?.deal_expiry) return;

    const interval = setInterval(() => {
      const diff = new Date(currentDeal.deal_expiry).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Deal Expired");
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentDeal?.deal_expiry]);

  // Scroll to top
  // Scroll-to-top removed

  // Buy Now
  const handleBuyNow = () => {
    if (!selectedImage) {
      toast.error("Please select an image");
      return;
    }

    const buyNowDeal = {
      _id: currentDeal._id,
      product_id: currentDeal._id,
      product_name: currentDeal.deal_name,
      product_discounted_price: currentDeal.deal_price,
      quantity: 1,
      selected_image: selectedImage,
      product_stock: currentDeal.deal_stock,
      shipping: 0,
    };

    navigate("/Cashout", {
      state: {
        buyNowProduct: buyNowDeal,
        guestId: user._id ? undefined : guestId,
      },
    });
  };

  // WhatsApp Order
  const handleOrderOnWhatsapp = () => {
    const productUrl = `${window.location.origin}/deal/${id}`;
    const message =
      `Hello! I want to order this deal.\n\n` +
      `Deal: ${currentDeal.deal_name}\n` +
      `Price: Rs. ${currentDeal.deal_price}\n` +
      `Deal Code: ${currentDeal.deal_code}\n` +
      `Expires in: ${timeLeft}\n` +
      `Link: ${productUrl}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  // Back to home
  const handleBack = () => navigate("/");

  // Star rating
  const renderStars = (rating) => {
    const full = Math.floor(rating || 0);
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`text-lg ${
              star <= full ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Loading
  if (loading) {
    return (
      <>
        <div className="md:w-[95%] mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error / Not Found
  if (error || !currentDeal) {
    return (
      <>
        <div className="text-center py-12">
          <p className="text-red-500">{error || "Deal not found"}</p>
          <button
            onClick={handleBack}
            className="mt-4 text-orange-600 font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Discount calculation
  const discount =
    currentDeal.original_price && currentDeal.deal_price
      ? Math.round(
          ((currentDeal.original_price - currentDeal.deal_price) /
            currentDeal.original_price) *
            100
        )
      : null;

  // Slider arrows
  const NextArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-black/50 p-2 rounded-full"
      onClick={onClick}
    >
      ❯
    </div>
  );
  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-black/50 p-2 rounded-full"
      onClick={onClick}
    >
      ❮
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <>
      <div className="md:w-[95%] mx-auto md:px-0 px-4 py-2 font-daraz">
        <div className="md:grid md:grid-cols-2 md:gap-8">
          {/* Mobile Slider */}
          <div className="md:hidden">
            <Slider
              ref={mainSliderRef}
              dots={false}
              infinite={false}
              speed={400}
              slidesToShow={1}
              slidesToScroll={1}
              arrows={false}
              afterChange={setActiveSlide}
              className="w-full mb-3"
            >
              {currentDeal.deal_images?.map((img, i) => (
                <div key={i}>
                  <img
                    src={img}
                    alt={`${currentDeal.deal_name} ${i}`}
                    className="w-full max-h-[300px] object-contain rounded-md border bg-gray-50"
                  />
                </div>
              ))}
            </Slider>
            <div className="flex h-20 gap-3 overflow-x-auto px-2 w-full">
              {currentDeal.deal_images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb ${i}`}
                  onClick={() => mainSliderRef.current?.slickGoTo(i)}
                  className={`h-16 w-16 object-contain rounded-md border cursor-pointer transition-transform ${
                    activeSlide === i
                      ? "border-orange-600 scale-105 shadow-md"
                      : "border-gray-300 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Gallery */}
          <div className="hidden md:flex gap-4">
            <div className="flex flex-col gap-3 w-20">
              {currentDeal.deal_images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb ${i}`}
                  className={`w-20 h-20 border rounded-md cursor-pointer hover:border-orange-600 ${
                    selectedImage === img ? "border-orange-600" : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
            <div className="flex-1 bg-gray-50 p-2 rounded-md border">
              <img
                src={selectedImage || currentDeal.deal_images?.[0]}
                alt={currentDeal.deal_name}
                className="w-full h-[450px] object-contain"
              />
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 md:mt-0 text-gray-800">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
                {currentDeal.deal_name}
              </h2>

              {/* Category */}
              <p className="text-sm text-gray-500">
                Category:{" "}
                <span className="font-semibold text-gray-900">
                  {currentDeal.category?.name || "Uncategorized"}
                </span>
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2">
                {renderStars(currentDeal.rating || 4)}
                <span className="text-sm text-gray-500">
                  ({currentDeal.rating || 4}/5)
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-500 bg-clip-text text-transparent">
                  Rs. {currentDeal.deal_price?.toFixed(2)}
                </p>
                {discount && (
                  <p className="text-lg line-through text-gray-400">
                    Rs. {currentDeal.original_price?.toFixed(2)}
                  </p>
                )}
              </div>
              {discount && (
                <span className="inline-block text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                  Save {discount}% (Rs.{" "}
                  {currentDeal.original_price - currentDeal.deal_price})
                </span>
              )}

              {/* Expiry Timer */}
              <div className="flex items-center gap-2 text-orange-600 font-semibold">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{timeLeft || "Calculating..."}</span>
              </div>

              {/* Deal Code */}
              <div className="flex items-center gap-2">
                <code className="bg-gray-100 px-3 py-1 rounded-md text-sm font-mono">
                  {currentDeal.deal_code}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentDeal.deal_code);
                    toast.success("Code copied!");
                  }}
                  className="text-orange-600 hover:underline text-sm"
                >
                  Copy
                </button>
              </div>

              {/* Stock */}
              <div
                className={`flex items-center gap-2 text-sm font-semibold ${
                  currentDeal.deal_stock < 5
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                <span>
                  {currentDeal.deal_stock < 5 ? "Warning" : "Checkmark"}
                </span>
                {currentDeal.deal_stock > 0
                  ? `${currentDeal.deal_stock} left in stock`
                  : "Out of Stock"}
              </div>

              {/* Icons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:shadow-md transition">
                  <FaTruck className="text-orange-600 text-xl" />
                  <div>
                    <h4 className="font-semibold text-sm">Fast Shipping</h4>
                    <p className="text-xs text-gray-500">1–3 Days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:shadow-md transition">
                  <FaUndo className="text-orange-600 text-xl" />
                  <div>
                    <h4 className="font-semibold text-sm">Free Returns</h4>
                    <p className="text-xs text-gray-500">7 Days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:shadow-md transition">
                  <FaMoneyBillAlt className="text-orange-600 text-xl" />
                  <div>
                    <h4 className="font-semibold text-sm">Cash on Delivery</h4>
                    <p className="text-xs text-gray-500">COD Available</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:shadow-md transition">
                  <FaHeadset className="text-orange-600 text-xl" />
                  <div>
                    <h4 className="font-semibold text-sm">Support</h4>
                    <p className="text-xs text-gray-500">24/7 Help</p>
                  </div>
                </div>
              </div>

              {/* Buy Now + WhatsApp */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleBuyNow}
                  disabled={currentDeal.deal_stock <= 0}
                  className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ${
                    currentDeal.deal_stock > 0
                      ? "bg-gradient-to-r from-orange-500 to-orange-700 hover:shadow-lg hover:scale-[1.02]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Buy Now
                </button>

                <button
                  onClick={handleOrderOnWhatsapp}
                  disabled={currentDeal.deal_stock <= 0}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ${
                    currentDeal.deal_stock > 0
                      ? "bg-gradient-to-r from-green-500 to-green-700 hover:shadow-lg hover:scale-[1.02]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.04 2c-5.52 0-10 4.47-10 9.99 0 1.76.46 3.46 1.34 4.97L2 22l5.19-1.36c1.45.79 3.08 1.2 4.85 1.2 5.53 0 10-4.48 10-10s-4.47-9.84-10-9.84zm.04 18.03c-1.54 0-3.02-.41-4.3-1.2l-.31-.19-3.07.8.82-3.02-.2-.31c-.84-1.33-1.28-2.86-1.28-4.41 0-4.53 3.7-8.23 8.23-8.23 2.19 0 4.25.85 5.79 2.39 1.55 1.55 2.4 3.61 2.4 5.79-.01 4.53-3.7 8.38-8.28 8.38zm4.67-6.23c-.26-.13-1.54-.76-1.78-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.01-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.1-1.27-.77-.68-1.28-1.52-1.43-1.78-.15-.26-.02-.41.11-.54.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.07-.13-.58-1.39-.8-1.9-.21-.51-.42-.44-.58-.45-.15-.01-.32-.01-.49-.01-.17 0-.45.07-.69.32-.24.26-.9.88-.9 2.15s.92 2.49 1.05 2.66c.13.17 1.8 2.75 4.35 3.86.61.27 1.09.43 1.46.55.61.19 1.17.16 1.61.1.49-.07 1.54-.63 1.76-1.23.22-.61.22-1.13.15-1.23-.06-.1-.24-.16-.5-.29z" />
                  </svg>
                  Order on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description */}
        <div className="mt-8">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 font-semibold transition-colors ${
                activeTab === "description"
                  ? "border-b-2 border-orange-600 text-gray-700"
                  : "text-gray-600 hover:text-orange-500"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
          </div>

          {activeTab === "description" && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border text-sm text-gray-600">
              <p className="whitespace-pre-line leading-relaxed">
                {currentDeal.deal_description || "No description available."}
              </p>
              {currentDeal.deal_code && (
                <p className="mt-3">
                  <strong>Deal Code:</strong>{" "}
                  <code className="bg-white px-2 py-1 rounded">
                    {currentDeal.deal_code}
                  </code>
                </p>
              )}
              <p className="mt-2">
                <strong>Expires:</strong>{" "}
                {new Date(currentDeal.deal_expiry).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SingleDeal;
