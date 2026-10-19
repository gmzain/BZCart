import React from "react";
import Footer from "./Footer";
import {
  FaUndoAlt,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";

const ReturnRefund = () => {
  return (
    <div className="bg-slate-50">

      {/* Hero Section */}
      <div className="relative font-daraz bg-gradient-to-r from-primary to-dark text-white py-20 md:py-28 text-center overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg animate-slideInLeft">
            Return & Refund Policy
          </h1>
          <p className="mt-6 text-lg md:text-xl opacity-90 font-medium animate-slideInRight">
            One Store,{" "}
            <span className="text-yellow-300">Endless Possibilities</span>
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-[95%] max-w-6xl font-daraz mx-auto my-8 space-y-7">
        {/* Intro */}
        <div className="bg-white/90 backdrop-blur-md shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInLeft">
          <FaInfoCircle className="mx-auto text-primary text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            Our Commitment to Your Satisfaction
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            At <span className="font-bold text-dark">BZCART.STORE</span> (Dinga,
            District Gujrat, Tehsil Kharian, Pakistan), customer satisfaction is
            our top priority. This Return & Refund Policy explains the
            conditions under which products can be{" "}
            <span className="text-primary font-semibold">returned</span>,{" "}
            <span className="text-primary font-semibold">replaced</span>, or{" "}
            <span className="text-primary font-semibold">refunded</span>.
          </p>
        </div>

        {/* Return & Replacement Conditions */}
        <div className="bg-gradient-to-br from-white to-slate-100 shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInRight">
          <FaUndoAlt className="mx-auto text-dark text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            Return & Replacement Conditions
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
            Customers may file a return or replacement request within{" "}
            <span className="font-semibold">3 days</span> of receiving the
            product, with valid proof such as pictures or videos.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-gray-700 text-left">
            {[
              "Broken, damaged, or defective product on delivery.",
              "Wrong product received.",
              "Expired product.",
              "Product delivered in an opened or used condition.",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <FaExclamationCircle className="text-primary text-lg" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-700 leading-relaxed mt-6 max-w-2xl mx-auto">
            <span className="font-bold text-dark">
              No return request will be accepted after 3 days of delivery.
            </span>
          </p>
        </div>

        {/* Replacement Policy */}
        <div className="bg-white shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInLeft">
          <FaExchangeAlt className="mx-auto text-green-500 text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            Replacement Policy (Preferred)
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6">
            Replacement is our first priority for resolving complaints. A
            replacement will be provided if:
          </p>
          <ul className="max-w-2xl mx-auto space-y-4 text-gray-700 text-left">
            {[
              "The same product is available in stock.",
              "The product defect or issue is verified through valid proof.",
              "An incorrect product was delivered.",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <FaCheckCircle className="text-primary mt-1 text-lg" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Refund Policy */}
        <div className="bg-gradient-to-tr from-slate-100 to-white shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInRight">
          <FaMoneyBillWave className="mx-auto text-dark text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            Refund Policy (Secondary Option)
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6">
            Refunds will only be provided when replacement is not possible:
          </p>
          <ul className="max-w-2xl mx-auto space-y-4 text-gray-700 text-left">
            {[
              "If the product is out of stock.",
              "If the issue cannot be resolved with a replacement.",
              "If the order was prepaid and the required product is unavailable.",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <FaCheckCircle className="text-primary mt-1 text-lg" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-700 leading-relaxed mt-6 max-w-3xl mx-auto">
            Refunds will be processed within{" "}
            <span className="font-semibold">3–4 working days</span> via
            Easypaisa, JazzCash, or Bank Transfer. Delivery charges may not be
            refunded unless the mistake is on our side.
          </p>
        </div>

        {/* How to Request a Return */}
        <div className="bg-white shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInLeft">
          <FaUndoAlt className="mx-auto text-primary text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            How to Request a Return
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6">
            Customers must contact us immediately after receiving the product
            through:
          </p>
          <ul className="max-w-2xl mx-auto space-y-3 text-gray-700 text-left">
            <li>
              WhatsApp:{" "}
              <a
                href="https://wa.me/923297609190"
                className="text-primary hover:text-accent transition-colors"
              >
                https://wa.me/923297609190
              </a>
            </li>
            <li>
              Email:{" "}
              <a
                href="mailto:info@bzcart.store"
                className="text-primary hover:text-accent transition-colors"
              >
                info@bzcart.store
              </a>
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-6 max-w-3xl mx-auto">
            The request must include the{" "}
            <span className="font-bold">Order ID</span>, product details, and
            reason for return. Our support team will verify and guide you
            through the process.
          </p>
        </div>

        {/* Important Notes */}
        <div className="bg-gradient-to-r from-primary to-dark text-white rounded-3xl p-8 text-center shadow-xl animate-slideInLeft">
          <h2 className="text-3xl font-extrabold mb-4">Important Notes</h2>
          <ul className="max-w-3xl mx-auto space-y-4 text-left text-lg">
            <li>
              Customers are strongly advised to check their order upon delivery
              and raise any concerns immediately.
            </li>
            <li>Complaints submitted after 3 days will not be entertained.</li>
            <li>
              For urgent escalation, customers may directly email us at{" "}
              <a
                href="mailto:info@bzcart.store"
                className="text-yellow-300 hover:text-white transition"
              >
                info@bzcart.store
              </a>
              .
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReturnRefund;
