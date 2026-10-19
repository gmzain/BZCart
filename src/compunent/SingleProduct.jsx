import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Footer from "./Footer";
import {
  FaHeadset,
  FaMoneyBillAlt,
  FaTruck,
  FaUndo,
  FaStar,
  FaAngleDown,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";
import {
  fetchProductById,
  fetchReviews,
  submitReview,
  clearCurrentProduct, // ← Now we use this
} from "../features/products/productSlice";
import { addToCart, fetchCart } from "../features/cart/cartSlice";
import { v4 as uuidv4 } from "uuid";
import Loader from "./Loader";
import Slider from "react-slick";
import { fromSlug, toSlug } from "../utils/slugify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SingleProduct = () => {
  const navigate = useNavigate();
  const { productName } = useParams();
  const dispatch = useDispatch();

  const {
    product,
    loading,
    error,
    reviews,
    reviewsLoading,
    reviewsError, // ← ADD THIS
  } = useSelector((state) => state.products);
  const { user, userLoading, token } = useSelector((state) => state.auth);

  // Local state
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  // Add these lines with your other useState hooks
  const [openDesc, setOpenDesc] = useState(false);
  const [openShip, setOpenShip] = useState(false);
  const [openCare, setOpenCare] = useState(false);
  const [openNote, setOpenNote] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Critical: Track if we're currently resolving the product
  const [resolvingProduct, setResolvingProduct] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);

  const mainSliderRef = useRef(null);
  const WHATSAPP_NUMBER = "923297609190";

  const [guestId] = useState(() => {
    const stored = localStorage.getItem("guestId");
    if (stored) return stored;
    const newId = `guest_${uuidv4()}`;
    localStorage.setItem("guestId", newId);
    return newId;
  });

  const hasFetchedCart = useRef(false);

  // ─────────────────────────────────────
  // 1. Reset everything when productName changes
  // ─────────────────────────────────────
  useEffect(() => {
    dispatch(clearCurrentProduct()); // ← This clears old product instantly
    setResolvingProduct(true);
    setProductNotFound(false);
    setSelectedImage("");
    setSelectedSize("");
    setActiveSlide(0);
    hasFetchedCart.current = false;
    window.scrollTo(0, 0); // Scroll to top when product changes
  }, [productName, dispatch]);

  // ─────────────────────────────────────
  // 2. Resolve slug → ID → fetch product
  // ─────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const resolveAndFetchProduct = async () => {
      if (!mounted) return;

      setResolvingProduct(true);
      setProductNotFound(false);

      try {
        const res = await fetch(
          "https://bzbackend.online/api/products/products"
        );
        const allProducts = await res.json();

        const normalize = (str) =>
          String(str)
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]/g, "")
            .replace(/\-+/g, "-");

        const target = normalize(productName);
        const decoded = fromSlug(productName);

        const foundProduct = allProducts.find((p) => {
          const nameNorm = normalize(p.product_name);
          const nameLower = p.product_name.toLowerCase();
          return (
            nameNorm === target ||
            nameLower === decoded.toLowerCase() ||
            nameLower === productName.toLowerCase()
          );
        });

        if (!foundProduct) {
          if (mounted) {
            setProductNotFound(true);
            toast.error("Product not found");
          }
          return;
        }

        // Fetch the full product
        await dispatch(fetchProductById(foundProduct._id)).unwrap();
        await dispatch(fetchReviews(foundProduct._id)).unwrap();

        if (mounted) setResolvingProduct(false);
      } catch (err) {
        console.error("Error resolving product:", err);
        if (mounted) {
          setProductNotFound(true);
          toast.error("Failed to load product");
        }
      } finally {
        if (mounted) setResolvingProduct(false);
      }
    };

    resolveAndFetchProduct();

    return () => {
      mounted = false;
    };
  }, [productName, dispatch]);

  // ─────────────────────────────────────
  // 3. Set default image & size after load
  // ─────────────────────────────────────
  useEffect(() => {
    if (product && product.product_images?.[0]) {
      setSelectedImage((prev) => prev || product.product_images[0]);
    }
    if (product?.sizes?.length > 0 && !selectedSize) {
      const available = product.sizes.find((s) => s.stock > 0);
      if (available) setSelectedSize(available.size);
    }
  }, [product, selectedSize]);

  // ─────────────────────────────────────
  // 4. Fetch cart once resolved
  // ─────────────────────────────────────
  useEffect(() => {
    if (
      !hasFetchedCart.current &&
      !userLoading &&
      product &&
      (user || guestId)
    ) {
      hasFetchedCart.current = true;
      dispatch(fetchCart({ guestId: user ? undefined : guestId }));
    }
  }, [user, userLoading, guestId, product, dispatch]);

  // ─────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to submit a review");
    if (!reviewText.trim()) return toast.error("Please write a review");

    dispatch(
      submitReview({
        productId: product._id,
        reviewData: { comment: reviewText, rating },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Review submitted!");
        setReviewText("");
        setRating(5);
      })
      .catch((err) => toast.error(err || "Failed to submit review"));
  };

  const handleAddToCart = () => {
    if (
      !product ||
      !selectedImage ||
      (product.sizes?.length > 0 && !selectedSize)
    )
      return toast.error("Please complete selection");

    const sizeStock =
      product.sizes?.find((s) => s.size === selectedSize)?.stock || 0;
    if (product.sizes?.length > 0 && sizeStock <= 0)
      return toast.error("Selected size is out of stock");

    dispatch(
      addToCart({
        cartData: {
          product_id: product._id,
          selected_image: selectedImage,
          selected_size: selectedSize || null,
          guestId: user ? undefined : guestId,
        },
        userId: user?._id,
        token,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Added to cart!");
        dispatch(fetchCart({ guestId: user ? undefined : guestId }));
      })
      .catch((err) => toast.error(err || "Failed to add to cart"));
  };

  const handleBuyNow = () => {
    if (
      !product ||
      !selectedImage ||
      (product.sizes?.length > 0 && !selectedSize)
    )
      return toast.error("Please complete selection");

    const buyNowProduct = {
      _id: product._id,
      product_name: product.product_name,
      product_discounted_price: product.product_discounted_price,
      selected_image: selectedImage,
      selected_size: selectedSize || null,
      shipping: product.shipping || 0,
      // Include stock and sizes so checkout can validate availability for Buy Now
      product_stock: product.product_stock,
      sizes: product.sizes,
    };

    navigate("/Cashout", {
      state: { buyNowProduct, guestId: user ? undefined : guestId },
    });
  };

  const handleOrderOnWhatsapp = () => {
    const url = `${window.location.origin}/product/${toSlug(
      product.product_name
    )}`;
    const msg = encodeURIComponent(
      `Hello! I want to order:\n\nProduct: ${
        product.product_name
      }\nPrice: Rs. ${product.product_discounted_price}\n${
        selectedSize ? `Size: ${selectedSize}\n` : ""
      }Link: ${url}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const renderStars = (r) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar
          key={s}
          className={`text-lg ${s <= r ? "text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );

  // ─────────────────────────────────────
  // Render Logic
  // ─────────────────────────────────────
  if (resolvingProduct || loading) {
    return <Loader />;
  }

  if (productNotFound || error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl mb-4">
          {error || "Product not found"}
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-[#f06621] font-medium hover:underline flex items-center gap-2 mx-auto"
        >
          Back to Home
        </button>
      </div>
    );
  }

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
      <div className="md:w-[95%] mx-auto md:px-0 px-4 py-2 font-darazs">
        <div className="md:grid md:grid-cols-2 md:gap-8">
          {/* 📱 Mobile View Images */}
          <div className="md:hidden relative flex flex-col items-center">
            {/* Main Slider */}
            <Slider
              ref={mainSliderRef}
              dots={false}
              infinite={false}
              speed={400}
              slidesToShow={1}
              slidesToScroll={1}
              arrows={false}
              afterChange={(index) => setActiveSlide(index)}
              className="w-full mb-3"
            >
              {product.product_images?.map((img, i) => (
                <div key={i}>
                  <img
                    src={img}
                    alt={`${product.product_name} image ${i}`}
                    loading="lazy"
                    className="w-full max-h-[300px] object-contain rounded-md border bg-gray-50"
                  />
                </div>
              ))}
            </Slider>

            {/* Thumbnail Row */}
            <div className="flex h-20 gap-3 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-2 w-full">
              {product.product_images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.product_name} thumbnail ${i}`}
                  loading="lazy"
                  onClick={() => mainSliderRef.current?.slickGoTo(i)}
                  className={`h-16 w-16 mt-1 object-contain rounded-md border flex-shrink-0 cursor-pointer transition-transform duration-200 ${
                    activeSlide === i
                      ? "border-red-600 scale-105 shadow-md"
                      : "border-gray-300 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="hidden md:flex gap-4">
            <div className="flex flex-col gap-3 w-20">
              {product.product_images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  loading="lazy"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 border rounded-md cursor-pointer ${
                    selectedImage === img ? "border-red-600" : ""
                  }`}
                />
              ))}
            </div>
            <div
              className="flex-1 relative overflow-hidden rounded-md border border-gray-200 bg-gray-50"
              style={{ height: "450px" }}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomPosition({ x, y });
              }}
            >
              <img
                src={selectedImage || product.product_images?.[0]}
                alt={product.product_name}
                loading="eager"
                className="w-full h-full object-contain transition-transform duration-300"
                style={{
                  transform: isZoomed ? "scale(2)" : "scale(1)",
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-2 md:mt-0  text-gray-800">
            <div className="space-y-1">
              {/* 🏷️ Product Name & Brand */}
              <div>
                <h2 className="text-2xl md:text-4xl font- text-gray-900 leading-tight tracking-tight">
                  {product.product_name}
                </h2>
                <p className="text-sm md:text-base text-gray-500 mt-1">
                  Brand:{" "}
                  <span className="font-semibold text-gray-900">
                    {product.brand_name}
                  </span>
                </p>
              </div>

              {/* ⭐ Rating + Reviews */}
              {/* <div className="flex items-center ">
                {renderStars(product.rating || 0)}
                <p className="text-gray-500 text-sm ml-2 font-medium">
                  {reviews.length > 0
                    ? `${reviews.length} review${reviews.length > 1 ? "s" : ""}`
                    : "No reviews yet"}
                </p>
              </div> */}

              {/* 💰 Pricing */}
              <div>
                <div className="flex items-end gap-3">
                  <p className="text-2xl font-bold text-gradient bg-gradient-to-r from-orange-600 to-pink-500 bg-clip-text text-transparent">
                    Rs. {product.product_discounted_price}
                  </p>
                  {product.product_base_price >
                    product.product_discounted_price && (
                    <p className="text-gray-400 mb-0.5 line-through text-sm font-medium">
                      Rs. {product.product_base_price}
                    </p>
                  )}
                </div>
                {product.product_base_price >
                  product.product_discounted_price && (
                  <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                    Save Rs.{" "}
                    {product.product_base_price -
                      product.product_discounted_price}
                  </span>
                )}
              </div>

              {/* 📏 Size Selection or Stock */}
              {product.sizes?.length > 0 ? (
                <div>
                  <label className="block text-gray-800 font-semibold mb-3 text-sm sm:text-base uppercase tracking-wide">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size.size;
                      const isOutOfStock = size.stock === 0;
                      return (
                        <button
                          key={size.size}
                          onClick={() =>
                            !isOutOfStock && setSelectedSize(size.size)
                          }
                          disabled={isOutOfStock}
                          className={`relative px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-300 border group 
                  ${
                    isOutOfStock
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : isSelected
                      ? "bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-md scale-105"
                      : "bg-gray-50 border-gray-300 text-gray-700 hover:border-orange-400 hover:shadow-sm hover:scale-105"
                  }`}
                        >
                          {size.size}
                          {isOutOfStock && (
                            <span className="absolute -top-2 -right-2 bg-gray-400 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white shadow-sm">
                              ✖
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  {/* {product.product_stock > 0 ? (
                    <div
                      className={`flex items-center gap-2 text-sm font-semibold ${
                        product.product_stock < 4
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      <span className="text-lg">
                        {product.product_stock < 4 ? "⚠️" : "✔️"}
                      </span>
                      {product.product_stock < 4
                        ? `Only ${product.product_stock} left in stock!`
                        : `In Stock (${product.product_stock} available)`}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                      <span className="text-lg">❌</span>
                      Out of Stock
                    </div>
                  )} */}
                </div>
              )}

              {/* 🚚 Shipping, Warranty, Payment */}
              {/* <div className="space-y-1 text-[15px]">
                <p className="flex items-center gap-2 mt-2">
                  <span className="text-gray-600 font-medium">
                    🚚 Shipping:
                  </span>
                  <span className="font-semibold text-gray-700">
                    {product.shipping === 0
                      ? "Free"
                      : `Rs. ${product.shipping}`}
                  </span>
                </p>

                {product.warranty && (
                  <p className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">
                      🛡️ Warranty:
                    </span>
                    <span className="font-semibold text-gray-700">
                      {product.warranty}
                    </span>
                  </p>
                )}

                <p className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">
                    💳 Payment Methods:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {product.payment?.join(", ")}
                  </span>
                </p>
              </div> */}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-center gap-2">
                {/* 🛒 Add to Cart / Buy Now Buttons */}
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3 rounded-lg font-semibold shadow-lg border border-primary transition-all duration-300 ${
                    product.sizes?.length > 0
                      ? !selectedSize ||
                        product.sizes.find((s) => s.size === selectedSize)
                          ?.stock <= 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg--500 hover:shadow-lg hover:scale-[1.02]"
                      : product.product_stock > 0
                      ? "  hover:shadow-lg hover:scale-[1.02]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  disabled={
                    product.sizes?.length > 0
                      ? !selectedSize ||
                        product.sizes.find((s) => s.size === selectedSize)
                          ?.stock <= 0
                      : product.product_stock <= 0
                  }
                >
                  ADD TO CART
                </button>

                <button
                  onClick={handleBuyNow}
                  className={`w-full py-3 rounded-lg font-semibold  border border-primary shadow-lg hover:shadow[inset_0_3px_6px_rgba(0,0,0,0.08),_0_3px_6px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-300 ${
                    product.sizes?.length > 0
                      ? !selectedSize ||
                        product.sizes.find((s) => s.size === selectedSize)
                          ?.stock <= 0
                        ? "bg-gray-500 text-gray-400 cursor-not-allowed shadow-none"
                        : ""
                      : product.product_stock > 0
                      ? "bg- hover:shadow-lg hover:scale-[1.02]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  disabled={
                    product.sizes?.length > 0
                      ? !selectedSize ||
                        product.sizes.find((s) => s.size === selectedSize)
                          ?.stock <= 0
                      : product.product_stock <= 0
                  }
                >
                  BUY IT NOW
                </button>
              </div>
              {/* 💬 WhatsApp */}
              <button
                onClick={handleOrderOnWhatsapp}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg  font-semibold  border border-primary text- shadow-lg transition-all duration-300 ${
                  product.sizes?.length > 0
                    ? !selectedSize ||
                      product.sizes.find((s) => s.size === selectedSize)
                        ?.stock <= 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg- hover:shadow-lg hover:scale-[1.02]"
                    : product.product_stock > 0
                    ? "bg- hover:shadow-lg hover:scale-[1.02]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={
                  product.sizes?.length > 0
                    ? !selectedSize ||
                      product.sizes.find((s) => s.size === selectedSize)
                        ?.stock <= 0
                    : product.product_stock <= 0
                }
              >
                WHATSAPP
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.04 2c-5.52 0-10 4.47-10 9.99 0 1.76.46 3.46 1.34 4.97L2 22l5.19-1.36c1.45.79 3.08 1.2 4.85 1.2 5.53 0 10-4.48 10-10s-4.47-9.84-10-9.84zm.04 18.03c-1.54 0-3.02-.41-4.3-1.2l-.31-.19-3.07.8.82-3.02-.2-.31c-.84-1.33-1.28-2.86-1.28-4.41 0-4.53 3.7-8.23 8.23-8.23 2.19 0 4.25.85 5.79 2.39 1.55 1.55 2.4 3.61 2.4 5.79-.01 4.53-3.7 8.38-8.28 8.38zm4.67-6.23c-.26-.13-1.54-.76-1.78-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.01-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.1-1.27-.77-.68-1.28-1.52-1.43-1.78-.15-.26-.02-.41.11-.54.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.07-.13-.58-1.39-.8-1.9-.21-.51-.42-.44-.58-.45-.15-.01-.32-.01-.49-.01-.17 0-.45.07-.69.32-.24.26-.9.88-.9 2.15s.92 2.49 1.05 2.66c.13.17 1.8 2.75 4.35 3.86.61.27 1.09.43 1.46.55.61.19 1.17.16 1.61.1.49-.07 1.54-.63 1.76-1.23.22-.61.22-1.13.15-1.23-.06-.1-.24-.16-.5-.29z" />
                </svg>
              </button>
            </div>

            {/* ==================== NEW COLLAPSIBLE ACCORDION SECTION (Clean & Working) ==================== */}
            <div className="mt-10 md:w-[95%] mx-auto md:px-0 font-darazs">
              {/* WhatsApp Big Button */}

              <div className="mt-10 space-y-4">
                {/* DESCRIPTION */}
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
                  <button
                    onClick={() => setOpenDesc(!openDesc)}
                    className="w-full px-6 py-5 text-left font-bold text-gray-800 bg-white hover:bg-gray-50 transition-all duration-300 flex justify-between items-center group"
                  >
                    <span className="uppercase tracking-wider text-sm md:text-base">
                      DESCRIPTION
                    </span>
                    <FaAngleDown
                      className={`text-xl transition-transform duration-500 ease-out ${
                        openDesc ? "rotate-180" : ""
                      } group-hover:scale-110`}
                    />
                  </button>

                  {/* Animated Content */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openDesc ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 py-6 bg-gray-50 text-gray-700 text-sm leading-relaxed space-y-5">
                      <p className="whitespace-pre-line">
                        {product.product_description ||
                          "No description available."}
                      </p>

                      {product.highlights && product.highlights.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-bold text-gray-900">Highlights:</p>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            {product.highlights.map((h, i) => (
                              <li key={i} className="text-gray-600">
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {product.warranty && (
                        <p className="font-medium">
                          <span className="text-gray-900 font-bold">
                            Warranty:
                          </span>{" "}
                          {product.warranty}
                        </p>
                      )}

                      {product.sizes?.length > 0 && (
                        <div className="mt-4">
                          <p className="font-bold text-gray-900 mb-3">
                            Available Sizes:
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {product.sizes.map((s) => (
                              <span
                                key={s.size}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium border-2 transition-all duration-300 ${
                                  s.stock > 0
                                    ? "bg-green-50 text-green-700 border-green-400 hover:bg-green-100"
                                    : "bg-red-50 text-red-600 border-red-300 line-through"
                                }`}
                              >
                                {s.size}{" "}
                                {s.stock > 0
                                  ? `(${s.stock} left)`
                                  : "(Sold Out)"}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* PRODUCT HIGHLIGHTS */}
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
                  <button
                    onClick={() => setOpenNote(!openNote)}
                    className="w-full px-6 py-5 text-left font-bold text-gray-800 bg-white hover:bg-gray-50 transition-all duration-300 flex justify-between items-center group"
                  >
                    <span className="uppercase tracking-wider text-sm md:text-base">
                      PRODUCT HIGHLIGHTS
                    </span>
                    <FaAngleDown
                      className={`text-xl transition-transform duration-500 ease-out ${
                        openNote ? "rotate-180" : ""
                      } group-hover:scale-110`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openNote ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 py-6 bg-gradient-to-b from-gray-50 to-white">
                      <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
                        {product.highlights?.map((h, idx) => (
                          <li key={idx} className="pl-2">
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SHIPPING INFORMATION */}
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
                  <button
                    onClick={() => setOpenShip(!openShip)}
                    className="w-full px-6 py-5 text-left font-bold text-gray-800 bg-white hover:bg-gray-50 transition-all duration-300 flex justify-between items-center group"
                  >
                    <span className="uppercase tracking-wider text-sm md:text-base">
                      SHIPPING INFORMATION
                    </span>
                    <FaAngleDown
                      className={`text-xl transition-transform duration-500 ease-out ${
                        openShip ? "rotate-180" : ""
                      } group-hover:scale-110`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openShip ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 py-6 bg-gray-50 text-sm text-gray-700 space-y-3">
                      <p>
                        • Delivery within <strong>3–7 business days</strong>
                      </p>
                      <p>• Cash on Delivery (COD) available nationwide</p>
                      <p>• Tracking number provided after dispatch</p>
                      {product.shipping > 0 ? (
                        <p className="text-orange-600 font-bold">
                          • Shipping charges: Rs. {product.shipping}
                        </p>
                      ) : (
                        <p className="text-green-600 font-bold text-lg">
                          Free Shipping
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* CARE INSTRUCTION */}
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
                  <button
                    onClick={() => setOpenCare(!openCare)}
                    className="w-full px-6 py-5 text-left font-bold text-gray-800 bg-white hover:bg-gray-50 transition-all duration-300 flex justify-between items-center group"
                  >
                    <span className="uppercase tracking-wider text-sm md:text-base">
                      CARE INSTRUCTION
                    </span>
                    <FaAngleDown
                      className={`text-xl transition-transform duration-500 ease-out ${
                        openCare ? "rotate-180" : ""
                      } group-hover:scale-110`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openCare ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 py-6 bg-gray-50">
                      <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-center gap-3">
                          <span className="text-green-600">•</span> Machine wash
                          cold
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="text-green-600">•</span> Do not
                          bleach
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="text-green-600">•</span> Tumble dry
                          low
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="text-green-600">•</span> Iron on low
                          heat if needed
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="text-green-600">•</span> Wash with
                          similar colors
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ==================== END OF ACCORDION SECTION ==================== */}
          </div>
        </div>

        <div className="mt-8">
          {/* 🌟 Description Section */}

          {activeTab === "reviews" && (
            <div className="mt-">
              {/* If user is logged in → show review form at the top */}

              <div id="review-form" className="mb-12 px-2 py-6 bg-white ">
                <h2 className="text-4xl text-center font-bold text-gray-800 mb-10">
                  Write Your Review
                </h2>
                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  {/* Star Rating */}
                  <div className="mx-auto">
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={36}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="cursor-pointer transition-all duration-200 hover:scale-110"
                          fill={
                            star <= (hoverRating || rating) ? "#facc15" : "none"
                          }
                          stroke="#f59e0b"
                          strokeWidth={2}
                        />
                      ))}
                      <span className="ml-4 text-lg font-medium text-gray-600">
                        {rating} Star{rating > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                      rows={5}
                      placeholder="Share your experience with this product..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full   py-4  font-bold text-lg  transition transform hover:scale-[1.01] shadow-lg border rounded-lg border-primary"
                  >
                    Submit Review
                  </button>
                </form>
              </div>

              {/* Show actual reviews if any exist */}
              {reviews.length > 0 && (
                <div className="mt-12 max-w-4xl mx-auto px-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-8">
                    Reviews ({reviews.length})
                  </h3>
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="bg-white p-6 rounded-lg shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-800">
                              {review.user_id?.username || "Anonymous"}
                            </span>
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-center gap-8 mt-10 pb-8">
            <a
              target="_blank"
              href="https://www.facebook.com/share/1D4cs4MYZy/"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-[#1877f2] transition"
            >
              <FaFacebook size={22} />
              <span className="text-sm font-medium">Share</span>
            </a>
            <a
              target="_blank"
              href="https://www.instagram.com/bzcart"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-[#1877f2] transition"
            >
              <FaInstagram size={22} />
              <span className="text-sm font-medium">Pin it</span>
            </a>
            <a
              href="https://www.tiktok.com/@bzcart.store"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-[#1877f2] transition"
            >
              <FaTiktok size={22} />
              <span className="text-sm font-medium">Share</span>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SingleProduct;
