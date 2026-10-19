import React, { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";

const Footer = () => {
  const [open, setOpen] = useState(null);

  const toggleSection = (section) => {
    setOpen(open === section ? null : section);
  };

  return (
    <footer className="pt">
      <div className="bg-[#F26C2B] w-[95%] max-w-7xl mt-6 mx-auto my-2 text-white  grid md:grid-cols-4 gap-6 border-b border-white/20 pb- rounded-3xl p-3 md:p-6 text-sm md:text-sm font-darazs">
        {/* 🏢 Contact Details */}
        <div>
          <div className="flex gap-3 items-center justify-start md:justify-start mb-4">
            <img
              loading="lazy"
              src="/logg.png"
              className="w-10 h-10 bg-white/70 rounded-full object-cover"
              alt="BZ Cart Logo"
            />
            <h2 className="text-xl font-bold">BZ Cart.store</h2>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <FaLocationDot className="text-white mt-1" />
              <p>Dinga, Tehsil Kharian District Gujrat, Punjab – Pakistan</p>
            </div>

            <div className="flex items-start gap-2">
              <FaPhoneAlt className="text-white mt-1" />
              <a href="tel:03297609190" className="hover:underline">
                0329 7609190
              </a>
            </div>

            <div className="flex items-start gap-2">
              <FaEnvelope className="text-white mt-1" />
              <a href="mailto:info@bzcart.store" className="hover:underline">
                info@bzcart.store
              </a>
            </div>
          </div>
        </div>

        {/* 💬 Customer Services */}
        <div>
          <button
            onClick={() => toggleSection("services")}
            className="w-full flex justify-between items-center md:block text-left font-semibold md:mb-3"
          >
            Customer Services
            <IoIosArrowDown
              className={`md:hidden transition-transform ${
                open === "services" ? "rotate-180" : ""
              }`}
            />
          </button>
          <ul
            className={`space-y-1 md:block ${
              open === "services" ? "block" : "hidden"
            }`}
          >
            {/* <li className="hover:text-white transition-colors">
              Contact Us & Location
            </li> */}
            <li className="hover:text-white transition-colors">
              Delivery Info
            </li>
            <li className="hover:text-white transition-colors">FAQs</li>
            <li className="hover:text-white transition-colors">
              BZCart Loyalty
            </li>
          </ul>
        </div>

        {/* 📘 Information */}
        <div>
          <button
            onClick={() => toggleSection("info")}
            className="w-full flex justify-between items-center md:block text-left font-semibold md:mb-3"
          >
            Information
            <IoIosArrowDown
              className={`md:hidden transition-transform ${
                open === "info" ? "rotate-180" : ""
              }`}
            />
          </button>
          <ul
            className={`space-y-1 md:block ${
              open === "info" ? "block" : "hidden"
            }`}
          >
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/returnandrefund"
                className="hover:text-white transition-colors"
              >
                Return & Refund
              </Link>
            </li>
            <li>
              <Link
                to="/privacypolicy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/termsandconditions"
                className="hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* ✉️ Newsletter */}
        <div>
          <button
            onClick={() => toggleSection("newsletter")}
            className="w-full flex justify-between items-center md:block text-left font-semibold mb-3"
          >
            Subscribe to our Newsletter
            <IoIosArrowDown
              className={`md:hidden transition-transform ${
                open === "newsletter" ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`md:block ${open === "newsletter" ? "block" : "hidden"}`}
          >
            <p className="mb-3">Get the latest offers and promotions!</p>
            <div className="flex mb-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-2 py-1.5 w-full rounded-l-lg text-white text-xs outline-none"
              />
              <button className="bg-black px-3 py-1.5 rounded-r-lg font-medium text-xs text-white hover:bg-gray-900 transition">
                Subscribe
              </button>
            </div>
          </div>

          {/* 🌐 Social Icons */}
          <div className="flex mt-5 items-center justify-center gap-4 text-lg">
            <a
              target="_blank"
              href="https://www.facebook.com/share/1D4cs4MYZy/"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/60 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
            >
              <FaFacebookF />
            </a>
            <a
              target="_blank"
              href="https://www.instagram.com/bzcart"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/60 text-[#ff002f] hover:bg-[#E4405F] hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.tiktok.com/@bzcart.store"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/60 text-black hover:bg-gray-700 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
            >
              <FaTiktok />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/60 text-[rgb(255,5,5)] hover:bg-[#FF0000] hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* ⚙️ Bottom Bar */}
      {/* <div className="bg-black text-center py-5 text-white font-daraz text border-t border-white/10">
        <p className="text-white/80 tracking-wide">
          Copyright © {new Date().getFullYear()}{" "}
          <span className="text-primary font-semibold hover:text-white transition-all duration-300">
            Codes Spark
          </span>
          . All rights reserved.
        </p>
        <p className="mt-1 text-[10px] text-white/50">
          Crafted with ❤️ by <span className="text-primary">BZCart</span>
        </p>
      </div> */}
    </footer>
  );
};

export default Footer;
