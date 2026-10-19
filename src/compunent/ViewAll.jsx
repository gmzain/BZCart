import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toSlug } from "../utils/slugify";
import { fetchProducts } from "../features/products/productSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";

const ViewAll = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { user, token } = useSelector((state) => state.auth);

  const [wishlistStatus, setWishlistStatus] = useState({});
  const [isToggling, setIsToggling] = useState({});
  const [loadedImages, setLoadedImages] = useState({});

  // Guest ID logic
  const getGuestId = () => {
    if (user || token) return null;
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("guestId", id);
    }
    return id;
  };
  const guestId = getGuestId();

  const getAuthHeaders = () =>
    token ? { Authorization: `Bearer ${token}` } : {};

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Fetch wishlist status
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!products?.length) return;
      try {
        let url = "https://bzbackend.online/api/products/wishlist";
        const config = { headers: getAuthHeaders() };
        if (!token && guestId) url += `?guestId=${guestId}`;

        const res = await axios.get(url, config);
        const statusMap = {};
        res.data.forEach((item) => {
          const prod = item.product_id;
          const img = item.selected_image || prod?.product_images?.[0] || "";
          const key = `${prod._id}-${img}`;
          statusMap[key] = true;
        });
        setWishlistStatus(statusMap);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      }
    };
    fetchWishlist();
  }, [products, token, guestId]);

  // Toggle wishlist
  const toggleWishlist = async (product) => {
    const image = product.product_images?.[0] || "";
    const key = `${product._id}-${image}`;
    if (isToggling[key]) return;

    setIsToggling((prev) => ({ ...prev, [key]: true }));
    try {
      const isRemove = wishlistStatus[key];
      const endpoint = isRemove ? "/wishlist/remove" : "/wishlist/add";
      const url = `https://bzbackend.online/api/products${endpoint}`;

      const payload = { product_id: product._id, selected_image: image };
      if (!token && guestId) payload.guestId = guestId;

      await axios.post(url, payload, { headers: getAuthHeaders() });
      setWishlistStatus((prev) => ({ ...prev, [key]: !prev[key] }));
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      alert("Failed to update wishlist. Please try again.");
    } finally {
      setIsToggling((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Calculate discount %
  const calculateDiscount = (base, discounted) => {
    if (!base || !discounted || base <= 0) return null;
    return Math.round(((base - discounted) / base) * 100);
  };

  const isNewProduct = (createdAt) =>
    new Date() - new Date(createdAt) < 24 * 60 * 60 * 1000;

  // Categories
  const categories = [
    ...new Set(
      products.map(
        (product) =>
          product.category?.name || product.category || "Uncategorized"
      )
    ),
  ];

  const groupedProducts = categories.reduce((acc, categoryName) => {
    acc[categoryName] = products.filter(
      (product) =>
        (product.category?.name || product.category || "Uncategorized") ===
        categoryName
    );
    return acc;
  }, {});

  return (
    <div className="md:w-[95%] mx-auto px-4 sm:px-0 py-12 font-cabin">
      <h2 className="text-4xl font-extrabold text-dark mb-12 text-center">
        Our <span className="text-primary">Products</span>
      </h2>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border p-3">
                <Skeleton height={150} className="rounded-lg mb-3" />
                <Skeleton width="80%" height={16} className="mb-2" />
                <Skeleton width="60%" height={14} />
              </div>
            ))}
        </div>
      )}

      {!loading &&
        !error &&
        categories.length > 0 &&
        categories.map((categoryName) => (
          <div key={categoryName} className="mb-12">
            <h3 className="text-2xl font-bold text-dark mb-6 capitalize">
              {categoryName}
              <div className="px-2 py-[1px] bg-primary w-24"></div>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-7">
              {groupedProducts[categoryName].map((item) => {
                const discount = calculateDiscount(
                  item.product_base_price,
                  item.product_discounted_price
                );
                const image = item.product_images?.[0] || "";
                const wishlistKey = `${item._id}-${image}`;
                const isInWishlist = wishlistStatus[wishlistKey] || false;
                const isLoadingToggle = isToggling[wishlistKey];
                const isLoaded = loadedImages[item._id];

                return (
                  <div
                    key={item._id}
                    className="group relative bg-white border border-primary rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Heart Icon */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(item);
                      }}
                      disabled={isLoadingToggle}
                      className="absolute top-2 left-3 z-10 hover:scale-110 transition-transform"
                      aria-label="Toggle wishlist"
                    >
                      {isLoadingToggle ? (
                        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="text-2xl">
                          {isInWishlist ? "🧡" : "🤍"}
                        </span>
                      )}
                    </button>

                    {/* Discount Badge */}
                    {discount && (
                      <span className="absolute top-0 right-0 bg-[#f06621] text-white text-xs font-semibold px-2 py-1 rounded-bl-lg z-10">
                        {discount}% OFF
                      </span>
                    )}

                    {/* NEW Badge */}
                    {isNewProduct(item.createdAt) && (
                      <span className="absolute top-10 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-br-lg z-10">
                        NEW
                      </span>
                    )}

                    {/* Image */}
                    <Link to={`/product/${toSlug(item.product_name)}`}>
                      <div
                        className="md:h-48 flex items-center justify-center"
                        style={{ backgroundColor: item.bg_color || "#f3f4f6" }}
                      >
                        <img
                          src={image || "https://via.placeholder.com/150"}
                          alt={item.product_name || "Product"}
                          loading="lazy"
                          className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
                          onLoad={() => handleImageLoad(item._id)}
                          style={{
                            opacity: isLoaded ? 1 : 0,
                            transition: "opacity 0.3s",
                          }}
                        />
                        {!isLoaded && (
                          <div className="absolute inset-0 z-10">
                            <Skeleton className="h-full w-full rounded-lg" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="px-2 py-2 md:py-4 border-t">
                        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1 hover:text-[#f06621] transition-colors duration-200">
                          {item.product_name || "Unknown Product"}
                        </h3>
                      </div>

                      {/* Price */}
                      <div className="px-2 pb-4">
                        <div className="flex items-center justify-start gap-3">
                          <span className="font-semibold text-black">
                            Rs. {item.product_discounted_price || "N/A"}
                          </span>
                          <span className="line-through text-gray-400 text-xs">
                            Rs. {item.product_base_price || "N/A"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {!loading && !error && categories.length === 0 && (
        <p className="text-center">No products found.</p>
      )}
    </div>
  );
};

export default ViewAll;
