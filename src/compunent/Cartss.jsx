import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  fetchCart,
  addToCart,
  removeFromCart,
  createOrder,
} from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Loader from "./Loader";

const colorNames = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Black",
  "White",
  "Silver",
];

const Cartss = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cart, loading, error } = useSelector((state) => state.cart);

  const [fullName, setFullName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [guestId] = useState(
    localStorage.getItem("guestId") || `guest_${uuidv4()}`
  );

  useEffect(() => {
    localStorage.setItem("guestId", guestId);
    dispatch(fetchCart({ guestId }));
  }, [dispatch, guestId]);

  // Log cart for debugging
  useEffect(() => {
    console.log("Cartss - Cart items:", cart);
  }, [cart]);

  // Validate phone number (aligned with backend)
  const validatePhone = (value) => {
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(value)) {
      setPhoneError("Phone number must be 10-15 digits, optional + prefix");
    } else {
      setPhoneError("");
    }
  };

  // Check stock for a specific size or product_stock
  const getStock = (item) => {
    if (!item.product_id) {
      console.warn("Cartss - Missing product_id for item:", item);
      return 0;
    }
    if (item.product_id.sizes?.length > 0) {
      if (!item.selected_size) {
        console.warn(
          `Cartss - Missing selected_size for size-based product: ${item.product_id.product_name}`
        );
        return 0;
      }
      const size = item.product_id.sizes.find(
        (s) => s.size === item.selected_size
      );
      if (!size) {
        console.warn(
          `Cartss - Size ${item.selected_size} not found for product ${item.product_id.product_name}`
        );
        return 0;
      }
      return size.stock || 0;
    }
    return item.product_id.product_stock || 0;
  };

  // Increase quantity
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
    dispatch(
      addToCart({
        prod_id: item.product_id._id,
        selected_image: item.selected_image,
        selected_size: item.selected_size,
        guestId,
      })
    )
      .unwrap()
      .then(() => toast.success("Quantity updated!", { position: "top-right" }))
      .catch((err) =>
        toast.error(err?.message || err || "Failed to update quantity", {
          position: "top-right",
        })
      );
  };

  // Decrease / remove item
  const handleRemoveItem = (item) => {
    if (!item.product_id) {
      toast.error("Invalid product data", { position: "top-right" });
      return;
    }
    dispatch(
      removeFromCart({
        prod_id: item.product_id._id,
        selected_image: item.selected_image,
        selected_size: item.selected_size,
        guestId,
      })
    )
      .unwrap()
      .then(() => toast.success("Item removed!", { position: "top-right" }))
      .catch((err) =>
        toast.error(err?.message || err || "Failed to remove item", {
          position: "top-right",
        })
      );
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!fullName || !shippingAddress || !email || !phoneNumber || phoneError) {
      toast.error("Please fill in all fields correctly", {
        position: "top-right",
      });
      return;
    }
    if (
      cart.some(
        (item) => item.product_id.sizes?.length > 0 && !item.selected_size
      )
    ) {
      toast.error("Please select a size for all size-based products", {
        position: "top-right",
      });
      return;
    }
    if (cart.some((item) => getStock(item) < item.quantity)) {
      toast.error("One or more items are out of stock", {
        position: "top-right",
      });
      return;
    }

    const orderData = {
      products: cart.map((item) => ({
        product_id: item.product_id._id,
        quantity: item.quantity,
        selected_image: item.selected_image,
        selected_size: item.selected_size,
      })),
      total_amount: calculateTotal(),
      shipping_address: shippingAddress,
      order_email: email,
      phone_number: phoneNumber,
      full_name: fullName,
      guestId,
    };

    dispatch(createOrder(orderData))
      .unwrap()
      .then(() => {
        toast.success("Order placed successfully!", { position: "top-right" });
        localStorage.removeItem("guestId");
        navigate("/");
      })
      .catch((err) =>
        toast.error(err?.message || err || "Failed to place order", {
          position: "top-right",
        })
      );
  };

  // Total items & price
  const totalItems = () =>
    Array.isArray(cart)
      ? cart.reduce((t, item) => t + (item.quantity || 1), 0)
      : 0;

  const calculateTotal = () =>
    Array.isArray(cart)
      ? cart.reduce(
          (sum, item) =>
            sum +
            (item.product_id?.product_discounted_price || 0) *
              (item.quantity || 1),
          0
        )
      : 0;

  if (loading) return <Loader />;

  if (error && !error.includes("phone")) {
    return (
      <div className="text-center p-4 bg-light min-h-screen">
        <h3 className="font-bold text-2xl mb-2 text-dark">
          Error Loading Cart
        </h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="text-center p-4 bg-light min-h-screen">
        <h3 className="font-bold text-2xl mb-2 text-dark">
          Your Cart is Empty
        </h3>
        <p className="text-dark/70">Explore our products to fill your cart!</p>
      </div>
    );
  }

  return (
    <div className="bg-light font-montserrat">
      <div className="md:w-[98%] mx-auto pt-8 flex flex-col lg:flex-row justify-between gap-6 p-4 min-h-screen">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-3xl font-bold mb-4 text-dark">
            ← Cart{" "}
            <span className="text-xl font-medium">({totalItems()} items)</span>
          </h2>
          <div className="bg-white p-4 rounded-xl space-y-4 shadow">
            {cart.map((item, index) => {
              const isVapeOrPod =
                item.product_id?.category?.name?.includes("Disposables") ||
                item.product_id?.category?.name?.includes("Devices");
              const colorIndex =
                item.product_id?.product_images?.indexOf(item.selected_image) ||
                -1;
              const stock = getStock(item);
              const isSizeMissing =
                item.product_id?.sizes?.length > 0 && !item.selected_size;
              return (
                <div
                  key={
                    item._id ||
                    `${item.product_id?._id || index}-${item.selected_image}-${
                      item.selected_size
                    }`
                  }
                  className="flex items-center justify-between bg-light p-4 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.selected_image || "https://via.placeholder.com/150"
                      }
                      alt={item.product_id?.product_name || "Product"}
                      className="w-20 h-20 rounded-xl object-cover"
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
                          <span className="text-sm text-dark/60 ml-2">
                            (Size: {item.selected_size})
                          </span>
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="bg-primary/10 text-primary rounded-full p-2"
                      disabled={item.quantity <= 0}
                    >
                      <FaTrash size={12} />
                    </button>
                    <span className="font-medium text-dark">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleAddItem(item)}
                      className="bg-primary/10 text-primary rounded-full p-2"
                      disabled={stock <= item.quantity || isSizeMissing}
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checkout Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4 text-dark">Total</h3>

            <div className="mb-4">
              <label className="block text-dark mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-dark/20 rounded-lg p-2"
                placeholder="Enter full name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-dark mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-dark/20 rounded-lg p-2"
                placeholder="Enter email address"
              />
            </div>
            <div className="mb-4">
              <label className="block text-dark mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  validatePhone(e.target.value);
                }}
                className={`w-full border rounded-lg p-2 ${
                  phoneError ? "border-red-500" : "border-dark/20"
                }`}
                placeholder="Enter phone number (e.g., +923001234567)"
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-dark mb-2">Shipping Address</label>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full border border-dark/20 rounded-lg p-2"
                placeholder="Enter shipping address"
              />
            </div>

            <p className="text-sm text-dark/70 mb-2">
              Estimated Delivery Time: <strong>45 Mins</strong>
            </p>

            {cart.map((item) => (
              <div
                key={
                  item._id ||
                  `${item.product_id?._id || item._id}-${item.selected_image}-${
                    item.selected_size
                  }`
                }
                className="flex justify-between text-sm text-dark"
              >
                <span>
                  {item.quantity} x{" "}
                  {item.product_id?.product_name || "Unknown Product"}
                  {item.selected_size && ` (Size: ${item.selected_size})`}
                </span>
                <span>
                  Rs.{" "}
                  {(item.product_id?.product_discounted_price || 0) *
                    item.quantity}
                </span>
              </div>
            ))}

            <hr className="my-4" />
            <div className="flex justify-between text-xl font-bold text-dark">
              <span>Due Payment</span>
              <span>Rs. {calculateTotal()}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={
                !fullName ||
                !shippingAddress ||
                !email ||
                !phoneNumber ||
                phoneError ||
                cart.some((item) => getStock(item) < item.quantity) ||
                cart.some(
                  (item) =>
                    item.product_id.sizes?.length > 0 && !item.selected_size
                )
              }
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-semibold disabled:bg-gray-400"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cartss;
