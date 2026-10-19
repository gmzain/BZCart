import React, { useEffect, useState, memo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toSlug } from "../utils/slugify";

const Favorites = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        let url = "https://bzbackend.online/api/products/wishlist";
        const config = { headers: getAuthHeaders() };

        if (!token && guestId) {
          url += `?guestId=${guestId}`;
        }

        const res = await axios.get(url, config);
        setFavorites(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, guestId]);

  const removeFromWishlist = async (item) => {
    const productId = item.product_id._id || item.product_id;
    const image = item.selected_image || item.product_id.product_images?.[0];
    setRemovingId(productId);

    try {
      const payload = { product_id: productId, selected_image: image };
      if (!token && guestId) payload.guestId = guestId;

      await axios.post(
        "https://bzbackend.online/api/products/wishlist/remove",
        payload,
        { headers: getAuthHeaders() }
      );

      setFavorites((prev) =>
        prev.filter((i) => i.product_id._id !== productId)
      );
    } catch (err) {
      alert("Failed to remove");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      {/* 🔥 Overlay */}
      <div
        onClick={() => navigate(-1)}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* 👉 Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-50 bg-white
        w-[80%] sm:w-[620px]
        flex flex-col
        animate-slideIn"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-lg font-semibold">
            My Favorites ❤️ ({favorites.length})
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading &&
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} height={90} className="rounded-lg" />
              ))}

          {!loading && favorites.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No favorites yet 🤍
            </div>
          )}

          {!loading &&
            favorites.map((item) => {
              const product = item.product_id;
              const image = product.product_images?.[0] || item.selected_image;

              return (
                <div key={item._id} className="flex gap-4 border-b pb-4">
                  <img
                    src={image}
                    className="w-20 h-24 object-cover rounded"
                    alt=""
                  />

                  <div className="flex-1">
                    <Link
                      to={`/product/${toSlug(product.product_name)}`}
                      className="text-sm font-semibold line-clamp-2"
                    >
                      {product.product_name}
                    </Link>

                    <p className="text-xs text-gray-500 mt-1">
                      PKR {product.product_discounted_price}
                    </p>

                    <div className="flex items-center gap-4 mt-2">
                      <button
                        className="text-sm underline"
                        onClick={() =>
                          navigate(`/product/${toSlug(product.product_name)}`)
                        }
                      >
                        View
                      </button>

                      <button
                        onClick={() => removeFromWishlist(item)}
                        disabled={removingId === product._id}
                        className="text-red-500 text-lg"
                      >
                        {removingId === product._id ? "…" : "🗑"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default memo(Favorites);
