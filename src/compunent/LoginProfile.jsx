import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginProfile() {
  return (
    <div className="relative flex flex-col justify-between items-center bg-gradient-to-b from-white via-light to-white text-center px-6 py-10 font-daraz overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 right-1/2 translate-x-1/2 w-72 h-72 bg-orange-200/30 blur-[120px] rounded-full" />
      </div>

      {/* Center Section */}
      <div className="flex flex-col items-center justify-center flex-1 animate-slideInUp">
        <div className="relative w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 animate-bounce-slow">
          <img
            src="/logg.png"
            alt="Logo"
            className="w-24 h-24 object-contain drop-shadow-md animate-glow"
          />
        </div>

        <h1 className="text-5xl font-extrabold text-dark mt-8 tracking-tight drop-shadow-sm">
          bzcart
        </h1>

        <p className="text-gray-700 mt-4 text-base leading-relaxed max-w-xs">
          Discover amazing products and exclusive deals — <br />
          your one-stop shop for everything you love.
        </p>
      </div>

      {/* Bottom Section */}
      <div className="w-full md:w-auto mt-16 animate-slideInUp">
        <Link to="/auth?mode=signup">
          <button className="w-full bg-gradient-to-r from-primary to-orange-500 text-white font-semibold py-3.5 rounded-xl text-lg shadow-lg shadow-orange-200 hover:scale-[1.02] hover:shadow-xl active:scale-95 transition-all duration-300">
            Sign up
          </button>
        </Link>

        <Link
          to="/auth"
          className="flex justify-center items-center gap-1 mt-5 text-sm text-gray-600 hover:text-primary transition"
        >
          <span>I already have an account</span>
          <ArrowRight size={16} className="text-primary" />
        </Link>
      </div>
    </div>
  );
}
