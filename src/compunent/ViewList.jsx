import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import { fetchProducts } from "../features/products/productSlice";
import { addToCart, fetchCart } from "../features/cart/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EdiblesMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { error: cartError } = useSelector((state) => state.cart);
  const [loadingItems, setLoadingItems] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (cartError) {
      toast.error(cartError, {
        toastId: "cart-error",
      });
    }
  }, [cartError]);

  const handleAddToCart = (item) => {
    if (!user) {
      toast.warn("Please log in to add items to cart", {
        toastId: "login-warning",
      });
      navigate("/login");
      return;
    }

    setLoadingItems((prev) => ({ ...prev, [item._id]: true }));

    const cartItem = {
      prod_id: item._id,
      selected_image: item.product_images?.[0] || null,
    };

    dispatch(addToCart(cartItem))
      .unwrap()
      .then(() => {
        toast.success(`${item.product_name} added to cart!`, {
          toastId: `cart-success-${item._id}`,
        });
        dispatch(fetchCart());
      })
      .catch((err) => {
        toast.error(err || "Failed to add to cart", {
          toastId: `cart-fail-${item._id}`,
        });
      })
      .finally(() => {
        setLoadingItems((prev) => ({ ...prev, [item._id]: false }));
      });
  };

  const ediblesOnly = products.filter((item) =>
    item.product_catagory?.some((cat) => cat.toLowerCase() === "disposables")
  );

  const calculateDiscount = (base, discounted) => {
    if (!base || !discounted || base <= 0) return 0;
    return Math.round(((base - discounted) / base) * 100);
  };

  return (
    <div>
      {loading ? (
        <div className="text-center py-10">
          <PulseLoader size={15} color="blue" />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : ediblesOnly.length === 0 ? (
        <h2 className="text-center text-gray-700 text-2xl font-medium">
          No Products Available
        </h2>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ediblesOnly.map((item) => {
            const discount = calculateDiscount(
              item.product_base_price,
              item.product_discounted_price
            );
            return (
              <div
                key={item._id}
                className="relative bg-white rounded-2xl p-4 shadow hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={
                      item.product_images?.[0] ||
                      "https://via.placeholder.com/300"
                    }
                    alt={item.product_name}
                    loading="lazy"
                    className="h-48 w-full rounded-md object-cover mb-3 hover:opacity-90 transition-opacity duration-200"
                  />
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {discount}% off
                    </span>
                  )}
                </div>
                <h6 className="font-semibold text-lg text-gray-800 mb-1 hover:text-blue-600 transition-colors duration-200">
                  {item.product_name}
                </h6>
                <p className="text-gray-600 text-sm mb-1 line-clamp-2">
                  {item.product_description}
                </p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(item.rating || 4)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.285-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.951-.69l1.286-3.967z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    ({item.rating || 4})
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 line-through text-sm">
                    Rs. {item.product_base_price}
                  </span>
                  <span className="text-blue-600 font-bold text-lg">
                    Rs. {item.product_discounted_price}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={loadingItems[item._id]}
                  className={`w-full py-2 rounded-3xl text-white font-medium transition-all duration-200 ${
                    loadingItems[item._id]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {loadingItems[item._id] ? (
                    <PulseLoader size={8} color="white" />
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EdiblesMenu;
