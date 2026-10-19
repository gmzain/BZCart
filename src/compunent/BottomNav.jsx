import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/* ---- ICONS SAME AS YOURS (UNCHANGED) ---- */
// ⬇️ keep all your SVG components exactly same here
// CustomHomeIcon, Search, Heart, User, Catogery

const CustomHomeIcon = ({ className = "w-8 h-8", color = "currentColor" }) => (
  <svg
    className="feather feather-home"
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {" "}
    <path
      d="M8.6973 1.10445C9.05522 0.782874 9.51939 0.60498 10.0006 0.60498C10.4817 0.60498 10.9459 0.782874 11.3038 1.10445L18.4538 7.52905C18.6571 7.71186 18.8197 7.93538 18.931 8.1851C19.0423 8.43482 19.0998 8.70515 19.0999 8.97855V18.15C19.0999 18.6672 18.8945 19.1632 18.5288 19.5289C18.1631 19.8946 17.6671 20.1 17.1499 20.1H13.8999C13.3827 20.1 12.8867 19.8946 12.521 19.5289C12.1553 19.1632 11.9499 18.6672 11.9499 18.15V13.6C11.9499 13.4277 11.8814 13.2623 11.7595 13.1404C11.6376 13.0185 11.4723 12.95 11.2999 12.95H8.6999C8.52751 12.95 8.36218 13.0185 8.24028 13.1404C8.11838 13.2623 8.0499 13.4277 8.0499 13.6V18.15C8.0499 18.6672 7.84446 19.1632 7.47876 19.5289C7.11306 19.8946 6.61707 20.1 6.0999 20.1H2.8499C2.33273 20.1 1.83674 19.8946 1.47104 19.5289C1.10535 19.1632 0.899902 18.6672 0.899902 18.15V8.97855C0.899902 8.42605 1.1339 7.89955 1.5473 7.52905L8.6973 1.10445ZM10.4341 2.07165C10.3148 1.96458 10.1602 1.90535 9.9999 1.90535C9.83962 1.90535 9.68498 1.96458 9.5657 2.07165L2.4157 8.49625C2.34797 8.55705 2.29376 8.6314 2.25658 8.71448C2.21941 8.79757 2.2001 8.88753 2.1999 8.97855V18.15C2.1999 18.3224 2.26838 18.4878 2.39028 18.6097C2.51218 18.7316 2.67751 18.8 2.8499 18.8H6.0999C6.27229 18.8 6.43762 18.7316 6.55952 18.6097C6.68142 18.4878 6.7499 18.3224 6.7499 18.15V13.6C6.7499 13.0829 6.95535 12.5869 7.32104 12.2212C7.68674 11.8555 8.18273 11.65 8.6999 11.65H11.2999C11.8171 11.65 12.3131 11.8555 12.6788 12.2212C13.0445 12.5869 13.2499 13.0829 13.2499 13.6V18.15C13.2499 18.3224 13.3184 18.4878 13.4403 18.6097C13.5622 18.7316 13.7275 18.8 13.8999 18.8H17.1499C17.3223 18.8 17.4876 18.7316 17.6095 18.6097C17.7314 18.4878 17.7999 18.3224 17.7999 18.15V8.97855C17.7997 8.88753 17.7804 8.79757 17.7432 8.71448C17.706 8.6314 17.6518 8.55705 17.5841 8.49625L10.4341 2.07165Z"
      fill="#000"
    ></path>{" "}
  </svg>
);
const Search = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg
    className="feather feather-search"
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {" "}
    <path
      d="M14.5991 15.0179L14.279 14.6978L13.9288 14.9847C12.5192 16.1391 10.7227 16.8333 8.76628 16.8333C4.26622 16.8333 0.599609 13.1667 0.599609 8.66667C0.599609 4.16661 4.26622 0.5 8.76628 0.5C13.2663 0.5 16.9329 4.16661 16.9329 8.66667C16.9329 10.6231 16.2387 12.4196 15.0843 13.8292L14.7974 14.1794L15.1175 14.4995L20.2921 19.6741L20.2921 19.6742L20.2994 19.6813C20.3346 19.715 20.3627 19.7555 20.3821 19.8003C20.4014 19.8451 20.4117 19.8933 20.4122 19.9421C20.4126 19.9909 20.4034 20.0393 20.385 20.0844C20.3665 20.1296 20.3392 20.1706 20.3048 20.2051C20.2703 20.2396 20.2292 20.2669 20.184 20.2854C20.1389 20.3038 20.0905 20.313 20.0417 20.3125C19.9929 20.312 19.9447 20.3018 19.8999 20.2825C19.8551 20.2631 19.8147 20.235 19.7809 20.1998L19.7809 20.1997L19.7737 20.1925L14.5991 15.0179ZM16.1996 8.66667C16.1996 4.55108 12.8819 1.23333 8.76628 1.23333C4.65069 1.23333 1.33294 4.55108 1.33294 8.66667C1.33294 12.7822 4.65069 16.1 8.76628 16.1C12.8819 16.1 16.1996 12.7822 16.1996 8.66667Z"
      fill="white"
      stroke="#1E1E1E"
    ></path>{" "}
  </svg>
);
const Heart = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg
    className="feather feather-heart"
    width="24"
    height="20"
    viewBox="0 0 24 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {" "}
    <path
      d="M17.4545 0C15.1636 0 13.1716 1.00731 12 2.69539C10.8284 1.00731 8.83636 0 6.54545 0C4.81011 0.0019706 3.14642 0.675006 1.91935 1.87146C0.692279 3.06792 0.00202103 4.6901 0 6.38214C0 9.48812 1.98545 12.7207 5.90182 15.9883C7.69643 17.4794 9.63493 18.7974 11.6902 19.924C11.7854 19.9739 11.8919 20 12 20C12.1081 20 12.2146 19.9739 12.3098 19.924C14.3651 18.7974 16.3036 17.4794 18.0982 15.9883C22.0145 12.7207 24 9.48812 24 6.38214C23.998 4.6901 23.3077 3.06792 22.0806 1.87146C20.8536 0.675006 19.1899 0.0019706 17.4545 0ZM12 18.6263C10.2098 17.619 1.30909 12.309 1.30909 6.38214C1.31053 5.02845 1.86269 3.73061 2.84438 2.77341C3.82608 1.81621 5.15713 1.27784 6.54545 1.27643C8.75782 1.27643 10.6156 2.4284 11.3945 4.28348C11.4439 4.40053 11.5277 4.50065 11.6356 4.57111C11.7434 4.64157 11.8702 4.67919 12 4.67919C12.1298 4.67919 12.2566 4.64157 12.3644 4.57111C12.4723 4.50065 12.5561 4.40053 12.6055 4.28348C13.3844 2.4284 15.2422 1.27643 17.4545 1.27643C18.8429 1.27784 20.1739 1.81621 21.1556 2.77341C22.1373 3.73061 22.6895 5.02845 22.6909 6.38214C22.6909 12.309 13.7902 17.619 12 18.6263Z"
      fill="#050709"
    ></path>{" "}
  </svg>
);
const User = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg
    className="feather feather-user"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {" "}
    <path
      d="M19.4329 20.1917C19.4329 16.4863 15.1552 15.6667 12.0996 15.6667C9.04405 15.6667 4.76628 16.4863 4.76628 20.1917M23.0996 12C23.0996 18.0752 18.1748 23 12.0996 23C6.02448 23 1.09961 18.0752 1.09961 12C1.09961 5.92487 6.02448 1 12.0996 1C18.1748 1 23.0996 5.92487 23.0996 12ZM15.7663 8.33333C15.7663 10.3584 14.1247 12 12.0996 12C10.0745 12 8.43294 10.3584 8.43294 8.33333C8.43294 6.30829 10.0745 4.66667 12.0996 4.66667C14.1247 4.66667 15.7663 6.30829 15.7663 8.33333Z"
      stroke="#2A2A2A"
      strokeWidth="1.38095"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>{" "}
  </svg>
);
const Catogery = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    className="w-6 h-6"
  >
    {" "}
    <rect x="3" y="3" width="7" height="7" rx="1" ry="1" />{" "}
    <rect x="14" y="3" width="7" height="7" rx="1" ry="1" />{" "}
    <rect x="3" y="14" width="7" height="7" rx="1" ry="1" />{" "}
    <rect x="14" y="14" width="7" height="7" rx="1" ry="1" />{" "}
  </svg>
);

const BottomNav = () => {
  const location = useLocation();
  const [active, setActive] = useState("/");
  const { user } = useSelector((state) => state.auth);

  const profilePath = user ? "/profile" : "/loginprofile";

  const navItems = [
    { path: "/", label: "Home", icon: <CustomHomeIcon /> },
    { path: "/search", label: "Search", icon: <Search /> },
    { path: "/favorites", label: "Favorite", icon: <Heart /> },
    { path: profilePath, label: "Profile", icon: <User /> },
    { path: "/categories", label: "Categories", icon: <Catogery /> },
  ];

  const getActiveKey = (pathname) => {
    if (pathname === "/") return "/";
    if (pathname.startsWith("/search")) return "/search";
    if (pathname.startsWith("/favorites")) return "/favorites";
    if (pathname.startsWith("/categories")) return "/categories";
    if (pathname.startsWith("/profile")) return "/profile";
    if (pathname.startsWith("/loginprofile")) return "/loginprofile";
    return "";
  };

  useEffect(() => {
    setActive(getActiveKey(location.pathname));
  }, [location.pathname]);

  const getIndicatorPosition = (path) => {
    const index = navItems.findIndex((item) => item.path === path);
    const safeIndex = index !== -1 ? index : 2;
    return `${(safeIndex * 100) / navItems.length + 50 / navItems.length}%`;
  };

  /* ✅ MAIN FIX */
 const handleNavClick = (e, path) => {
   // Favorites: already open → stop
   if (path === "/favorites" && location.pathname.startsWith("/favorites")) {
     e.preventDefault();
     setActive("/favorites");
     return;
   }

   // Search: already open → stop
   if (path === "/search" && location.pathname.startsWith("/search")) {
     e.preventDefault();
     setActive("/search");
     return;
   }

   // Normal navigation
   setActive(path);
 };


  return (
    <div className="fixed bottom-2 left-0 w-full flex justify-center z-50 font-daraz md:hidden">
      <div
        className="relative w-[90%] max-w-md rounded-full h-[6vh]
        bg-white/10 backdrop-blur-xl border border-white/10
        shadow-[0_8px_25px_rgba(0,0,0,0.25)]
        flex items-center justify-around transition-all duration-300"
      >
        {/* FLOATING INDICATOR */}
        {active && (
          <div
            className="absolute top-0 z-50 w-12 h-12 bg-primary rounded-full
            shadow-[0_6px_25px_rgba(242,108,43,0.5)]
            flex items-center justify-center transition-all duration-500"
            style={{
              left: getIndicatorPosition(active),
              transform: "translateX(-50%) translateY(-50%)",
            }}
          >
            <div className="text-white">
              {navItems.find((item) => item.path === active)?.icon}
            </div>
          </div>
        )}

        {/* CURVE */}
        {active && (
          <div
            className="absolute -top-0 w-14 h-8 bg-white/5 backdrop-blur-lg
            rounded-b-full shadow-[0_4px_12px_rgba(242,108,43,0.25)]
            border border-white/10 transition-all duration-500"
            style={{
              left: getIndicatorPosition(active),
              transform: "translateX(-50%) translateY(-1px)",
            }}
          />
        )}

        {/* NAV ITEMS */}
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={(e) => handleNavClick(e, item.path)}
            className="flex flex-col items-center justify-center w-full
            text-center transition-all duration-300 group relative"
          >
            <div
              className={`transition-all duration-300 transform group-hover:scale-110
              ${
                active === item.path
                  ? "opacity-0 scale-0"
                  : "opacity-100 scale-100 text-gray-800"
              }`}
            >
              {item.icon}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
