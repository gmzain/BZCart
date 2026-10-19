import React from "react";
import Footer from "./Footer";
import {
  FaLock,
  FaUserShield,
  FaMoneyBillWave,
  FaClipboardCheck,
  FaHeadset,
  FaDatabase,
  FaCheckCircle,
} from "react-icons/fa";

const PrivacyPolicy = () => {
  return (
    <div className="bg-slate-50">

      {/* Hero Section */}
      <div className="relative font-daraz bg-gradient-to-r from-primary to-dark text-white py-20 md:py-28 text-center overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg animate-slideInLeft">
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg md:text-xl opacity-90 font-medium animate-slideInRight">
            ONE STORE,{" "}
            <span className="text-yellow-300">ENDLESS POSSIBILITIES</span>
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-[95%] max-w-6xl font-daraz mx-auto my-8 space-y-7">
        {/* Commitment */}
        <div className="bg-white/90 backdrop-blur-md shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInLeft">
          <FaUserShield className="mx-auto text-primary text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            Our Commitment to Your Privacy
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            At <span className="font-bold text-dark">BZCART.STORE</span> (based
            in <span className="text-primary">Dinga, District Gujrat</span>), we
            value your trust and are committed to protecting your personal
            information. This Privacy Policy explains how we collect, use, and
            safeguard your data while ensuring a secure and customer-friendly
            shopping experience.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-gradient-to-br from-white to-slate-100 shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInRight">
          <FaDatabase className="mx-auto text-dark text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            1. Information We Collect
          </h2>
          <ul className="grid gap-4 max-w-2xl mx-auto text-gray-700 text-left">
            {[
              "Basic details you provide when placing an order (name, phone number, delivery address, email).",
              "Optional details if you contact us via WhatsApp or email for support.",
              "We do not collect sensitive information like CNIC or card details through our website.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <FaLock className="text-primary mt-1 text-lg" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* How We Use Information */}
        <div className="bg-white shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInLeft">
          <FaClipboardCheck className="mx-auto text-green-500 text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            2. How We Use Your Information
          </h2>
          <ul className="max-w-3xl mx-auto space-y-4 text-gray-700 text-left">
            {[
              "To process and deliver your orders quickly and accurately.",
              "To keep you informed about your order status via WhatsApp, SMS, or email.",
              "To improve our services and ensure a smooth online shopping experience.",
              "To respond to queries, complaints, or support requests.",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <FaCheckCircle className="text-primary mt-1 text-lg" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Data Security */}
        <div className="bg-gradient-to-tr from-slate-100 to-white shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInRight">
          <FaLock className="mx-auto text-dark text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            3. Data Security
          </h2>
          <ul className="grid gap-4 max-w-2xl mx-auto text-gray-700 text-left">
            {[
              "Our website is fully Google-secured with SSL (green lock), ensuring safe browsing.",
              "Your personal information is protected and never shared with third parties.",
              "Customers have the right to request removal of their data once their order has been successfully delivered.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <FaCheckCircle className="text-primary mt-1 text-lg" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Methods */}
        <div className="bg-white shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInLeft">
          <FaMoneyBillWave className="mx-auto text-green-600 text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            4. Payment Methods
          </h2>
          <ul className="max-w-3xl mx-auto space-y-4 text-gray-700 text-left">
            {[
              "On Website Orders: Currently, only Cash on Delivery (COD) is available.",
              "On WhatsApp Orders: Advance payments can be made via Easypaisa, JazzCash, or Bank Transfer.",
              "Customers who choose advance payment may receive a special discount, which will be decided by BZCART.STORE management.",
              "We do not save or misuse your payment details.",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <FaCheckCircle className="text-primary mt-1 text-lg" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Rights */}
        <div className="bg-gradient-to-br from-white to-slate-100 shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInRight">
          <FaUserShield className="mx-auto text-dark text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            5. Customer Rights
          </h2>
          <ul className="grid gap-4 max-w-2xl mx-auto text-gray-700 text-left">
            {[
              "Every customer has the right to a secure shopping experience, with no age restrictions.",
              "Customers may request data deletion after order delivery.",
              "Customers paying in advance may receive discounts, depending on promotions or management discretion.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <FaCheckCircle className="text-primary mt-1 text-lg" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Complaints & Support */}
        <div className="bg-gradient-to-r from-primary to-dark text-white rounded-3xl p-8 text-center shadow-xl animate-slideInLeft">
          <FaHeadset className="mx-auto text-yellow-300 text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold mb-4">
            6. Complaints & Support
          </h2>
          <p className="leading-relaxed max-w-3xl mx-auto text-lg mb-6">
            For any queries, complaints, or order-related issues, you can reach
            us at:
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="mailto:info@bzcart.store"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-dark font-bold px-6 py-3 rounded-full shadow-md transition"
            >
              📧 info@bzcart.store
            </a>
            <a
              href="https://wa.me/923297609190"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full shadow-md transition"
            >
              💬 WhatsApp Support
            </a>
          </div>
          <p className="leading-relaxed max-w-3xl mx-auto text-lg mt-6">
            Our dedicated support team ensures instant action. If your issue is
            not resolved promptly, you may escalate via our official email.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
