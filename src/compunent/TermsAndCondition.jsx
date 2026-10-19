import React from "react";
import Footer from "./Footer";
import {
  FaClipboardList,
  FaTruck,
  FaMoneyBillWave,
  FaTags,
  FaClipboardCheck,
  FaUndo,
  FaUserShield,
  FaExclamationTriangle,
  FaSyncAlt,
} from "react-icons/fa";

const TermsAndConditions = () => {
  return (
    <div className="bg-slate-50">

      {/* Hero Section */}
      <div className="relative font-daraz bg-gradient-to-r from-primary to-dark text-white py-20 md:py-28 text-center overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg animate-slideInLeft">
            Terms & Conditions
          </h1>
          <p className="mt-6 text-lg md:text-xl opacity-90 font-medium animate-slideInRight">
            Please read carefully before placing any order
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-[95%] max-w-6xl font-daraz mx-auto my-8 space-y-7">
        {/* General */}
        <div className="bg-white/90 backdrop-blur-md shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInLeft">
          <FaClipboardList className="mx-auto text-primary text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">1. General</h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            These Terms & Conditions govern all purchases made through our
            website and official WhatsApp number. By placing an order, you
            acknowledge that you have read, understood, and agreed to these
            Terms. We reserve the right to update or modify them at any time
            without prior notice.
          </p>
        </div>

        {/* Delivery */}
        <div className="bg-gradient-to-br from-white to-slate-100 shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInRight">
          <FaTruck className="mx-auto text-dark text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            2. Delivery
          </h2>
          <ul className="list-disc pl-6 max-w-2xl mx-auto text-gray-700 text-left space-y-2">
            <li>We deliver across Pakistan via Leopards Courier and PostEx.</li>
            <li>Standard delivery time is 2 to 5 working days.</li>
            <li>
              Delivery timelines are estimated; courier delays are beyond our
              control.
            </li>
          </ul>
        </div>

        {/* Payment Methods */}
        <div className="bg-white shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInLeft">
          <FaMoneyBillWave className="mx-auto text-green-500 text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            3. Payment Methods
          </h2>
          <ul className="list-disc pl-6 max-w-2xl mx-auto text-gray-700 text-left space-y-2">
            <li>
              <strong>Cash on Delivery (COD):</strong> Available for all website
              orders.
            </li>
            <li>
              <strong>Advance Payment:</strong> Available only via WhatsApp.
            </li>
            <li>
              Our team will share bank account details for prepaid orders.
            </li>
            <li>
              Customers must send proof of payment via WhatsApp for
              confirmation.
            </li>
          </ul>
        </div>

        {/* Pricing & Discounts */}
        <div className="bg-gradient-to-tr from-slate-100 to-white shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInRight">
          <FaTags className="mx-auto text-dark text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            4. Pricing & Discounts
          </h2>
          <ul className="list-disc pl-6 max-w-2xl mx-auto text-gray-700 text-left space-y-2">
            <li>
              All prices listed are final and inclusive of applicable charges.
            </li>
            <li>
              Discounts on advance payments may be offered at our discretion.
            </li>
            <li>
              We reserve the right to change prices or offers without prior
              notice.
            </li>
          </ul>
        </div>

        {/* Order Policy */}
        <div className="bg-white shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInLeft">
          <FaClipboardCheck className="mx-auto text-primary text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            5. Order Policy
          </h2>
          <ul className="list-disc pl-6 max-w-2xl mx-auto text-gray-700 text-left space-y-2">
            <li>No minimum order restriction.</li>
            <li>Orders can be cancelled within 2–4 hours of placing them.</li>
            <li>Once dispatched, orders cannot be cancelled or modified.</li>
          </ul>
        </div>

        {/* Returns & Refunds */}
        <div className="bg-gradient-to-r from-primary to-dark text-white rounded-3xl p-8 text-center shadow-xl animate-slideInRight">
          <FaUndo className="mx-auto text-yellow-300 text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold mb-4">6. Returns & Refunds</h2>
          <p className="leading-relaxed max-w-3xl mx-auto text-lg">
            Please refer to our dedicated{" "}
            <span className="font-semibold">Return & Refund Policy</span> page
            for detailed information.
          </p>
        </div>

        {/* Customer Responsibilities */}
        <div className="bg-white shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInLeft">
          <FaUserShield className="mx-auto text-dark text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            7. Customer Responsibilities
          </h2>
          <ul className="list-disc pl-6 max-w-2xl mx-auto text-gray-700 text-left space-y-2">
            <li>Customers must provide accurate delivery details.</li>
            <li>
              Ensure availability to receive parcels at the provided address.
            </li>
            <li>
              Re-delivery costs due to incorrect address or failed attempts are
              the customer’s responsibility.
            </li>
          </ul>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-gradient-to-br from-white to-slate-100 shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInRight">
          <FaExclamationTriangle className="mx-auto text-red-500 text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            8. Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            We are not liable for courier delays, damages during transit, or any
            factors beyond our control. Our responsibility ends once the product
            has been dispatched to the courier company.
          </p>
        </div>

        {/* Modifications */}
        <div className="bg-white shadow-lg hover:shadow-2xl transition rounded-3xl p-8 text-center animate-slideInLeft">
          <FaSyncAlt className="mx-auto text-primary text-6xl mb-6" />
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            9. Modifications
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            We reserve the right to update, modify, or change these Terms &
            Conditions anytime without prior notice. Continued use of our
            services after updates will be considered acceptance of the new
            Terms.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
