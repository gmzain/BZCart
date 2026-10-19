import React from "react";
import { FaShoppingCart } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="w-24 h-24 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Cart Icon */}
        <img
          className="absolute text-orange-500 text-4xl animate-pulse"
          src="/logg.png"
          alt=""
        />
      </div>
    </div>
  );
};

export default Loader;
