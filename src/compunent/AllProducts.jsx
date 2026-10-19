import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Footer from "./Footer";
import { toSlug } from "../utils/slugify";
import axios from "axios";

const AllProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

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

  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    dispatch(fetchProducts())
      .unwrap()
      .catch(() => {});
  }, [dispatch]);

  // Wishlist fetch
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

  const query = new URLSearchParams(location.search);
  const filter = query.get("filter");

  const filteredProducts = useMemo(() => {
    let list = products || [];
    if (filter === "new-arrivals") list = list.filter((p) => p.isNewArrival);
    else if (filter === "best-sellers")
      list = list.filter((p) => p.isBestSeller);
    return [...list].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [products, filter]);

  const getDiscountPercent = (base, discounted) => {
    if (!base || !discounted || base <= 0) return null;
    return Math.round(((base - discounted) / base) * 100);
  };

  const isNewProduct = (createdAt) =>
    new Date() - new Date(createdAt) < 24 * 60 * 60 * 1000;

  return (
    <>
      <div className="md:w-[95%] mx-auto px-2 md:px-0 py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          {filter === "new-arrivals"
            ? "New Arrivals"
            : filter === "best-sellers"
            ? "Best Sellers"
            : "All Products"}
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-6">
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
        ) : error ? (
          <p className="text-center w-full text-red-600">Error: {error}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center w-full text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-6">
            {filteredProducts.map((product) => {
              const image = product.product_images?.[0] || "";
              const wishlistKey = `${product._id}-${image}`;
              const isInWishlist = wishlistStatus[wishlistKey] || false;
              const isLoadingToggle = isToggling[wishlistKey];
              const isLoaded = loadedImages[product._id];

              return (
                <div key={product._id} className="snap-start flex-shrink-0">
                  <div className="group mb-3 bg-white rounded-2xl border border-primary shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                    {/* Heart Icon */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      disabled={isLoadingToggle}
                      className="absolute top-2 left-2 z-10 hover:scale-110 transition-transform"
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

                    {/* Discount & NEW badges */}
                    {getDiscountPercent(
                      product.product_base_price,
                      product.product_discounted_price
                    ) !== null && (
                      <div className="absolute top-2 right-2 bg-[#f06621] text-white text-xs font-semibold px-2 py-1 rounded-bl-lg z-10">
                        {getDiscountPercent(
                          product.product_base_price,
                          product.product_discounted_price
                        )}
                        % OFF
                      </div>
                    )}
                    {isNewProduct(product.createdAt) && (
                      <div className="absolute top-10 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-br-lg z-10">
                        NEW
                      </div>
                    )}

                    {/* Product Image */}
                    <Link to={`/product/${toSlug(product.product_name)}`}>
                      <div
                        className="md:h-48 flex items-center justify-center"
                        style={{
                          backgroundColor: product.bg_color || "#f3f4f6",
                        }}
                      >
                        <img
                          src={image || "https://via.placeholder.com/150"}
                          alt={product.product_name || "Product"}
                          className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onLoad={() => handleImageLoad(product._id)}
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
                          {product.product_name || "Unknown Product"}
                        </h3>
                      </div>

                      {/* Price */}
                      <div className="px-2 pb-4">
                        <div className="flex items-center justify-start gap-3">
                          <span className="font-semibold text-black">
                            Rs. {product.product_discounted_price}
                          </span>
                          <span className="line-through text-gray-400 text-xs">
                            Rs. {product.product_base_price}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
