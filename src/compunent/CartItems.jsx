import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  fetchCart,
  addToCart,
  removeFromCart,
} from "../features/cart/cartSlice";
import { v4 as uuidv4 } from "uuid";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const colorNames = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Black",
  "White",
  "Silver",
];

const CartItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cart, loading, error } = useSelector((state) => state.cart);
  const { user, token, userLoading } = useSelector((state) => state.auth);

  const [guestId] = useState(() => {
    const storedGuestId = localStorage.getItem("guestId");
    if (!storedGuestId) {
      const newGuestId = `guest_${uuidv4()}`;
      localStorage.setItem("guestId", newGuestId);
      console.log("CartItems - Generated new guestId:", newGuestId);
      return newGuestId;
    }
    return storedGuestId;
  });

  useEffect(() => {
    if (!userLoading) {
      console.log("CartItems - Fetching cart with:", {
        userId: user?._id,
        guestId: user && token ? undefined : guestId,
        token,
      });
      dispatch(fetchCart({ guestId: user && token ? undefined : guestId }))
        .unwrap()
        .catch((err) => {
          console.error("CartItems - Error fetching cart:", err);
          toast.error(err?.message || "Failed to load cart", {
            position: "top-right",
          });
        });
    } else {
      console.log("CartItems - Waiting for auth to resolve");
    }
  }, [dispatch, guestId, user, token, userLoading]);

  // Log cart for debugging
  useEffect(() => {
    console.log("CartItems - Cart items:", cart);
  }, [cart]);

  // Check stock for a specific size or product_stock
  const getStock = (item) => {
    if (!item.product_id) {
      console.warn("CartItems - Missing product_id for item:", item);
      return 0;
    }
    if (item.product_id.sizes?.length > 0) {
      if (!item.selected_size) {
        console.warn(
          `CartItems - Missing selected_size for size-based product: ${item.product_id.product_name}`
        );
        return 0;
      }
      const size = item.product_id.sizes.find(
        (s) => s.size === item.selected_size
      );
      if (!size) {
        console.warn(
          `CartItems - Size ${item.selected_size} not found for product ${item.product_id.product_name}`
        );
        return 0;
      }
      return size.stock || 0;
    }
    return item.product_id.product_stock || 0;
  };

  const handleAddItem = (item) => {
    if (!item.product_id) {
      toast.error("Invalid product data", { position: "top-right" });
      return;
    }
    if (item.product_id.sizes?.length > 0 && !item.selected_size) {
      toast.error("Please select a size for this product", {
        position: "top-right",
      });
      return;
    }
    const stock = getStock(item);
    if (stock <= item.quantity) {
      toast.error(
        `Cannot add more: ${item.selected_size || "Item"} out of stock`,
        {
          position: "top-right",
        }
      );
      return;
    }
    const cartData = {
      product_id: item.product_id._id,
      selected_image: item.selected_image,
      selected_size: item.selected_size || null,
      guestId: user && token ? undefined : guestId,
    };
    console.log("CartItems - Adding item:", {
      cartData,
      userId: user?._id,
      token,
    });
    dispatch(addToCart({ cartData, userId: user?._id, token }))
      .unwrap()
      .then(() => toast.success("Quantity updated!", { position: "top-right" }))
      .catch((err) =>
        toast.error(err?.message || "Failed to update quantity", {
          position: "top-right",
        })
      );
  };

  const handleRemoveItem = (item) => {
    if (!item.product_id) {
      toast.error("Invalid product data", { position: "top-right" });
      return;
    }
    const cartData = {
      product_id: item.product_id._id,
      selected_image:
        item.selected_image || item.product_id?.product_images?.[0] || null,
      selected_size: item.selected_size || null,
      guestId: user && token ? undefined : guestId,
    };
    console.log("CartItems - Removing item:", {
      cartData,
      userId: user?._id,
      token,
    });
    dispatch(removeFromCart({ ...cartData, removeAll: item.quantity <= 1 }))
      .unwrap()
      .then(() =>
        toast.success(
          item.quantity <= 1 ? "Item removed!" : "Quantity decreased!",
          {
            position: "top-right",
          }
        )
      )
      .catch((err) =>
        toast.error(err?.message || "Failed to update cart", {
          position: "top-right",
        })
      );
  };

  const totalItems = () =>
    Array.isArray(cart)
      ? cart.reduce((t, item) => t + (item.quantity || 1), 0)
      : 0;

  const totalPrice = () =>
    Array.isArray(cart)
      ? cart.reduce(
          (t, item) =>
            t +
            (item.quantity || 1) *
              (item.product_id?.product_discounted_price || 0),
          0
        )
      : 0;

  if (loading || userLoading) {
    return (
      <div className="md:w-[65%] mx-auto p-6 bg-light min-h-screen">
        <h2 className="text-3xl font-bold mb-4 text-dark">Loading Cart...</h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 mb-4">
            <Skeleton width={80} height={80} />
            <div className="flex-1">
              <Skeleton width="60%" height={20} />
              <Skeleton width="40%" height={20} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-light min-h-screen">
        <h3 className="font-bold text-2xl mb-2 text-dark">
          Error Loading Cart
        </h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="text-center p-6 bg-light min-h-screen">
        <h3 className="font-bold text-2xl mb-2 text-dark">
          Your Cart is Empty
        </h3>
        <p className="text-dark/70">Explore our products to fill your cart!</p>
      </div>
    );
  }

  return (
    <div className="md:w-[70%] mx-auto md:p-4 bg-light">
      <h2 className="text-3xl font-bold mb-6 text-dark">
        🛒 Your Cart{" "}
        <span className="text-xl font-medium text-primary">
          ({totalItems()} items)
        </span>
      </h2>

      <div className="bg-white p-5 rounded-xl shadow space-y-4">
        {cart.map((item, index) => {
          const isVapeOrPod =
            item.product_id?.category?.name?.includes("Disposables") ||
            item.product_id?.category?.name?.includes("Devices");
          const colorIndex =
            item.product_id?.product_images?.indexOf(item.selected_image) || -1;
          const stock = getStock(item);
          const isSizeMissing =
            item.product_id?.sizes?.length > 0 && !item.selected_size;
          return (
            <div
              key={`${item.product_id?._id || index}-${item.selected_image}-${
                item.selected_size
              }`}
              className="flex items-center justify-between border-b last:border-0 pb-4 mb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.selected_image || "https://via.placeholder.com/150"}
                  alt={item.product_id?.product_name || "Product"}
                  className="w-20 h-20 rounded-lg object-cover border"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-semibold text-lg text-dark">
                    {item.product_id?.product_name || "Unknown Product"}
                    {isVapeOrPod && colorIndex !== -1 && (
                      <span className="text-sm text-dark/60 ml-2">
                        ({colorNames[colorIndex] || "Selected Color"})
                      </span>
                    )}
                    {item.selected_size && (
                      <div className="text-sm font-medium text-gray-700 mt-1">
                        Size: {item.selected_size}
                      </div>
                    )}
                  </h4>
                  <p className="text-primary font-bold mt-1">
                    Rs. {item.product_id?.product_discounted_price || 0}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      stock <= 5 || isSizeMissing
                        ? "text-red-500"
                        : "text-dark/70"
                    }`}
                  >
                    {isSizeMissing
                      ? "Please select a size"
                      : `Stock: ${stock} ${
                          item.selected_size ? "in size" : "units"
                        }`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleRemoveItem(item)}
                  className="bg-red-100 text-red-600 rounded-full p-2 hover:bg-red-200 transition"
                  disabled={item.quantity <= 0}
                >
                  <FaTrash size={12} />
                </button>

                <span className="font-medium text-dark">{item.quantity}</span>
                <button
                  onClick={() => handleAddItem(item)}
                  className="bg-green-100 text-green-600 rounded-full p-2 hover:bg-green-200 transition"
                  disabled={stock <= item.quantity || isSizeMissing}
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-5 bg-white rounded-xl shadow flex flex-col md:hidden justify-between items-center gap-4">
        <h3 className="text-lg font-bold text-dark">
          Total: <span className="text-primary">Rs. {totalPrice()}</span>
        </h3>
        <button
          onClick={() =>
            navigate("/Checkout", {
              state: { guestId: user && token ? undefined : guestId },
            })
          }
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          Proceed to Payment <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default CartItems;
