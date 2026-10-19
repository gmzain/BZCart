import React from "react";
import Footer from "./Footer";
import {
  FaCheckCircle,
  FaShoppingBag,
  FaUsers,
  FaBullseye,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-dark text-white py-20 md:py-28 text-center overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg animate-slideInLeft">
            About Us
          </h1>
          <p className="mt-6 text-lg md:text-xl opacity-90 font-medium animate-slideInRight">
            ONE STORE,{" "}
            <span className="text-yellow-300">ENDLESS POSSIBILITIES</span>
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-[95%] max-w-6xl font-daraz mx-auto my-8 space-y-7">
        {/* Who We Are */}
        <div className="bg-white/90 backdrop-blur-md shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInLeft">
          <FaUsers className="mx-auto text-primary text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            <span className="font-bold text-dark">BZCART.STORE</span>, based in
            <span className="text-primary"> Dinga, District Gujrat</span>, is
            Pakistan’s first professional multi-niche e-commerce platform. Our
            mission is simple — to make online shopping in Pakistan
            <span className="text-primary font-semibold"> reliable</span>,
            <span className="text-primary font-semibold"> modern</span>, and{" "}
            <span className="text-primary font-semibold">customer-focused</span>
            . More than just a marketplace, we are building a trusted brand,
            created for our people, by our people.
          </p>
        </div>

        {/* What We Offer */}
        <div className="bg-gradient-to-br from-white to-slate-100 shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInRight">
          <FaShoppingBag className="mx-auto text-dark text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            What We Offer
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto mb-8">
            Our store covers a wide range of categories designed to meet your
            everyday needs:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-gray-700 text-left">
            {[
              "Men’s & Women’s Watches",
              "Skincare & Grooming",
              "Men’s & Women’s Fashion",
              "Babies & Toddlers’ Essentials",
              "Home & Kitchen Products",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <FaCheckCircle className="text-primary text-lg" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-700 leading-relaxed mt-6 max-w-2xl mx-auto">
            And this is only the beginning. With time,
            <span className="font-bold text-dark"> BZCART.STORE</span>
            will continue expanding to bring even more variety, quality, and
            value — all in one trusted place.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInLeft">
          <FaCheckCircle className="mx-auto text-green-500 text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            Why Choose BZCART.STORE?
          </h2>
          <ul className="max-w-3xl mx-auto space-y-5 text-gray-700 text-left">
            {[
              "A professional online shopping experience built with international standards.",
              "A customer-first approach, where satisfaction and quality are never compromised.",
              "Products that cover every age, every lifestyle, and every household need.",
              "A proud Pakistani brand, designed to serve and grow with the people of Pakistan.",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <FaCheckCircle className="text-primary mt-1 text-lg" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Vision */}
        <div className="bg-gradient-to-tr from-slate-100 to-white shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInLeft">
          <FaBullseye className="mx-auto text-dark text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            We envision a future where Pakistan has its very own national-level
            e-commerce brand — a platform that brings trust, convenience, and
            endless possibilities into every household. With dedication,
            honesty, and innovation,
            <span className="text-primary font-bold"> BZCART.STORE</span>
            is on a journey to become that name.
          </p>
        </div>

        {/* Note to Customers */}
        <div className="bg-gradient-to-r from-primary to-dark text-white rounded-3xl p-8 text-center shadow-xl animate-slideInLeft">
          <h2 className="text-3xl font-extrabold mb-4">
            A Note to Our Customers
          </h2>
          <p className="leading-relaxed max-w-3xl mx-auto text-lg">
            At <span className="font-bold">BZCART.STORE</span>, our commitment
            goes beyond selling products. We are here to create trust, build
            relationships, and deliver convenience with every order. Together,
            with your support, <span className="italic">In Sha Allah</span>, we
            will continue to grow and shape a future where online shopping is
            <span className="text-yellow-300"> simple</span>,
            <span className="text-yellow-300"> professional</span>, and proudly{" "}
            <span className="font-semibold">Pakistani</span>.
          </p>

          {/* CTA */}
          <div className="mt-8">
            <a
              href="/"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-dark font-bold px-6 py-3 rounded-full shadow-md transition"
            >
              Start Shopping Now
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
