import React, { useState, useEffect, useRef } from "react";
import {
  FaShoppingCart,
  FaRegUser,
  FaSignOutAlt,
  FaBars,
  FaChevronDown,
} from "react-icons/fa";
import { SlHandbag } from "react-icons/sl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/users/userSlice";
import { fetchCart } from "../features/cart/cartSlice";
import { setSearchTerm } from "../features/products/productSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { toSlug } from "../utils/slugify";
import { CiDeliveryTruck } from "react-icons/ci";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setLocalSearchTerm] = useState("");
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Total cart items
  const totalCartItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );
  const Tracking = ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg
      class="sr4-icon sr4-icon--track-order"
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      <use href="#icon-h-track-order"></use>
    </svg>
  );

  useEffect(() => {
    const preferredOrder = [
      "Men’s Watches",
      "Men’s Fashion",
      "Women’s Fashion",
      "Skin Care",
      "Home & Kitchen",
      "Babies & Toddlers",
      "Fragrances & Perfumes",
    ];

    axios
      .get("https://bzbackend.online/api/categories/categories")
      .then((res) => {
        const parent = res.data.filter((c) => !c.parent_category);

        let formatted = parent.map((p) => ({
          name: p.name,
          _id: p._id,
          sub: res.data
            .filter((s) => s.parent_category?._id === p._id)
            .map((s) => ({ name: s.name, _id: s._id })),
        }));

        // Sort categories according to preferredOrder
        formatted.sort(
          (a, b) =>
            preferredOrder.indexOf(a.name) - preferredOrder.indexOf(b.name)
        );

        setCategories(formatted);
      })
      .catch(() => toast.error("Failed to fetch categories"));
  }, []);

  // Fetch cart
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  // Search handling
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    dispatch(setSearchTerm(value));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logoutUser());
      localStorage.removeItem("myUser");
      setIsMenuOpen(false);
      toast.success("Logged out successfully!");
      navigate("/");
    }
  };

  const getUserDisplayName = () => {
    if (!user) return null;
    return (
      user.name ||
      user.username ||
      user.fullName ||
      user.firstName ||
      user.email ||
      "User"
    ).slice(0, 15);
  };

  // Toggle category dropdown in mobile
  const toggleCategory = (index) => {
    setOpenCategoryIndex(openCategoryIndex === index ? null : index);
  };

  return (
    <div className="sticky top-0 z-20 font-sans shadow bg-white">
      {/* Sliding Promo Banner */}
      <div className="relative bg-gradient-to-r from-[#7d3d01] via-[#fb3200] to-[#f99304] text-white text-center text-[12px] overflow-hidden py-1 shadow-md">
        <div className="whitespace-nowrap animate-slideBanner">
          ✨ Big Sale Alert! 🎉 Shop above{" "}
          <span className="font-extrabold underline underline-offset-2">
            PKR 5000
          </span>{" "}
          & enjoy <span className="text-yellow-300">Free Delivery</span> 🚚
          across Pakistan 🇵🇰 — Don’t miss out! 🛒
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shine_3s_linear_infinite]" />
      </div>
      {/* Top Info */}
      {/* <div className="bg-gray-100 text-gray-600 text-xs py-1 max-lg:hidden">
        <div className="w-full max-w-7xl mx-auto flex justify-between px-2 md:px-0">
          <p>Dinga, Tehsil Kharian District Gujrat, Punjab – Pakistan</p>
          <div className="flex gap-4">
            <span className="cursor-pointer">Eng ▾</span>
            <span className="cursor-pointer">PKR ▾</span>
          </div>
        </div>
      </div> */}
      {/* Main Navbar */}
      <div className="flex justify-between w-full max-w-7xl mx-auto px-2 md:px-0 items-center py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars size={22} />
          </button>
          <Link to="/">
            <img
              loading="lazy"
              src="/loggo.png"
              alt="logo"
              className="w-[150px] md:w-[200px] object-contain"
            />
          </Link>
        </div>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center border border-gray-300 rounded-md overflow-hidden w-1/2"
        >
          <input
            type="text"
            placeholder="Search for products or categories..."
            className="px-3 py-2 w-full outline-none text-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            type="submit"
            className="bg-primary text-white px-5 py-2 text-sm font-medium hover:bg-primary"
          >
            Search
          </button>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-4 md:gap-6 text-gray-600">
          <div className="text-right hidden md:block">
            <p className="text-xs text-gray-500">Customer Services</p>
            <p className="font-semibold text-sm">+92 329-7609190</p>
          </div>
          <Link to="/orders" className="hover:text-primary md:hidden">
            <CiDeliveryTruck size={28} />
          </Link>
          <div className="relative mr-1">
            <Link to="/payment" className="hover:text-primary">
              <SlHandbag size={22} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-primary text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
              {totalCartItems}
            </span>
          </div>

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-primary"
            >
              {/* Hide name on mobile, show only logout icon */}
              <span className="hidden sm:inline">{getUserDisplayName()}</span>
              <FaSignOutAlt size={20} />
            </button>
          ) : (
            <>
              {/* Desktop → User Icon */}
              <Link
                to="/loginprofile"
                className="hover:text-primary hidden md:block"
              >
                <FaRegUser size={20} />
              </Link>

              {/* Mobile → Truck Delivery Icon */}
            </>
          )}
        </div>
      </div>
      {/* Mobile Search */}
      {/* <div className="md:hidden px-4 mt-2 pb-3">
        <form
          onSubmit={handleSearch}
          className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full"
        >
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 w-full outline-none text-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary"
          >
            Search
          </button>
        </form>
      </div> */}
      {/* Categories Menu (Desktop) */}
      <div className="bg-black">
        <div className="py-2 hidden md:flex w-full max-w-7xl mx-auto px-2 md:px-0 text-white items-center gap-9">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsCatOpen(!isCatOpen)}
              className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary/90 transition"
            >
              <FaBars /> All Categories <FaChevronDown size={12} />
            </button>

            {isCatOpen && (
              <div className="absolute left-0 top-full bg-white text-gray-800 shadow-2xl rounded-md mt-2 min-w-[250px] z-50 animate-fadeIn">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="relative group/item border-b last:border-none"
                  >
                    <Link
                      to={`/${toSlug(cat.name)}`}
                      className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 transition text-sm font-medium"
                    >
                      {cat.name}
                      {cat.sub.length > 0 && (
                        <FaChevronDown
                          size={10}
                          className="transform rotate-[-90deg] text-gray-500"
                        />
                      )}
                    </Link>
                    {cat.sub.length > 0 && (
                      <div className="absolute left-full top-0 bg-white shadow-xl rounded-md hidden group-hover/item:block min-w-[220px] transition-all">
                        {cat.sub.map((sub) => (
                          <Link
                            key={sub._id}
                            to={`/${toSlug(sub.name)}`}
                            className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-6 text-sm font-medium ml-6">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <Link to="/favorites" className="hover:text-primary">
              Favorites
            </Link>
            <Link to="/cart" className="hover:text-primary">
              Shop
            </Link>
            <Link to="/about" className="hover:text-primary">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-primary">
              Contact Us
            </Link>
            <Link to="/privacypolicy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="/returnandrefund" className="hover:text-primary">
              Return & Refund Policy
            </Link>
            <Link to="/termsandconditions" className="hover:text-primary">
              Terms & Conditions
            </Link>
            <Link to="/faqs" className="hover:text-primary">
              FAQS
            </Link>
            <Link to="/orders" className="hover:text-primary">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-50 md:hidden flex pointer-events-none`}>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Sliding Menu */}
        <div
          className={`relative w-[80%] bg-gray-200 text-gray-900 flex flex-col transform transition-transform duration-700 ease-in-out shadow-lg ${
            isMenuOpen
              ? "translate-x-0 pointer-events-auto"
              : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-300 flex-shrink-0">
            <h2 className="text-xl font-bold">MENU</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-900 text-2xl font-bold"
            >
              &times;
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Mobile account area: show profile and allow upload */}
            {user ? (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white border">
                  <img
                    loading="lazy"
                    src={user.profileImage || "/default-avatar.png"}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {getUserDisplayName()}
                  </div>
                  <label className="text-xs text-primary hover:underline cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const reader = new FileReader();
                        reader.onload = async () => {
                          try {
                            const imageUrl = reader.result;
                            // call backend to update profile image
                            await axios.patch("/users/profile-image", {
                              imageUrl,
                            });
                            // update localStorage user
                            const stored = JSON.parse(
                              localStorage.getItem("myUser") || "{}"
                            );
                            stored.profileImage = imageUrl;
                            localStorage.setItem(
                              "myUser",
                              JSON.stringify(stored)
                            );
                            window.location.reload();
                          } catch (err) {
                            toast.error(
                              err?.response?.data?.message ||
                                "Failed to upload image"
                            );
                          }
                        };
                        reader.readAsDataURL(f);
                      }}
                    />
                    Change Photo
                  </label>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <Link
                  to="/loginprofile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 px-3 bg-primary text-white rounded-lg text-center"
                >
                  Sign in / Register
                </Link>
              </div>
            )}
            {/* Categories */}
            {categories.map((cat, index) => (
              <div key={cat._id} className="border-b border-gray-300 pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer hover:text-orange-500 transition-colors py-2"
                  onClick={() => toggleCategory(index)}
                >
                  <span className="font-medium">{cat.name}</span>
                  {cat.sub.length > 0 && (
                    <FaChevronDown
                      className={`transition-transform duration-300 ${
                        openCategoryIndex === index
                          ? "rotate-180 text-orange-500"
                          : "rotate-0 text-gray-500"
                      }`}
                    />
                  )}
                </div>

                {/* Subcategories */}
                {cat.sub.length > 0 && openCategoryIndex === index && (
                  <div className="ml-4 flex flex-col space-y-1 mt-1 text-sm text-gray-600">
                    {cat.sub.map((sub) => (
                      <Link
                        key={sub._id}
                        to={`/${toSlug(sub.name)}`}
                        className="py-1 hover:text-orange-500 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Quick Links */}
            {/* <div className="border-t border-gray-300 pt-4 space-y-2">
              <p className="font-semibold text-lg text-primary">Quick Links</p>
              {[
                { to: "/", label: "Home" },
                { to: "/cart", label: "Shop" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact Us" },
                { to: "/privacypolicy", label: "Privacy Policy" },
                { to: "/returnandrefund", label: "Return & Refund Policy" },
                { to: "/termsandconditions", label: "Terms & Conditions" },
                { to: "/faqs", label: "FAQS" },
                { to: "/orders", label: "Track Order" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block hover:text-orange-500 transition-colors py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div> */}

            {/* Account / Wishlist */}
            {/* <div className="border-t pb-20 border-gray-300 pt-4 flex flex-col space-y-2">
              <Link
                to="/loginprofile"
                className="flex items-center gap-2 hover:text-orange-500"
              >
                <FaRegUser /> Account
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
