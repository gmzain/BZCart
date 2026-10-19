import React, { useState } from "react";
import Footer from "./Footer";
import {
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaLock,
  FaMoneyBillWave,
  FaTruck,
  FaUndoAlt,
  FaHeadset,
  FaTag,
} from "react-icons/fa";

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      icon: <FaLock className="text-primary text-2xl" />,
      question: "Do I need an account to place an order?",
      answer:
        "No, you can shop without creating an account. However, creating one saves your details for faster checkout next time.",
    },
    {
      icon: <FaMoneyBillWave className="text-green-500 text-2xl" />,
      question: "What payment methods do you accept?",
      answer:
        "We currently accept Cash on Delivery (COD) nationwide. Prepaid orders can be made via WhatsApp using Easypaisa, JazzCash, or Bank Transfer.",
    },
    {
      icon: <FaTruck className="text-yellow-500 text-2xl" />,
      question: "How long will my order take to arrive?",
      answer:
        "Orders are usually delivered within 2 to 5 working days anywhere in Pakistan through Leopards Courier or PostEx.",
    },
    {
      icon: <FaUndoAlt className="text-red-500 text-2xl" />,
      question: "Can I cancel my order?",
      answer:
        "Yes, you can cancel within 2 to 4 hours after placing the order. Once dispatched, cancellation isn’t possible.",
    },
    {
      icon: <FaUndoAlt className="text-blue-500 text-2xl" />,
      question: "What is your return and refund policy?",
      answer:
        "Report return requests within 3 days of delivery. Valid reasons include damaged, wrong, or expired products. We usually replace items; if not possible, refunds are issued within 3–4 days.",
    },
    {
      icon: <FaTag className="text-purple-500 text-2xl" />,
      question: "Are there any minimum order requirements?",
      answer: "No minimum limit — order any product of any value!",
    },
    {
      icon: <FaLock className="text-primary text-2xl" />,
      question: "How secure is my information?",
      answer:
        "Your data is fully protected. Our website uses SSL (green lock). You can also request data removal after your order is completed.",
    },
    {
      icon: <FaMoneyBillWave className="text-green-600 text-2xl" />,
      question: "Do you offer discounts?",
      answer:
        "Yes! Advance/prepaid orders may receive special discounts during promotions. Eligibility is always confirmed by our official team.",
    },
    {
      icon: <FaHeadset className="text-yellow-400 text-2xl" />,
      question: "How can I contact customer support?",
      answer:
        "📧 Email: info@bzcart.store | 💬 WhatsApp: Our official support number (listed on our website). We usually respond instantly!",
    },
    {
      icon: <FaTruck className="text-indigo-500 text-2xl" />,
      question: "Do you deliver outside Pakistan?",
      answer:
        "Currently, we deliver only within Pakistan — but international shipping may come soon!",
    },
  ];

  return (
    <div className="bg-slate-50 font-daraz">


      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-dark text-white text-center py-20 md:py-28 overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg animate-slideInLeft">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg md:text-xl opacity-90 font-medium animate-slideInRight">
            Got Questions?{" "}
            <span className="text-yellow-300">We’ve Got Answers!</span>
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-[95%] max-w-5xl mx-auto my-10 space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white/90 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all rounded-3xl p-6 md:p-8 cursor-pointer animate-fadeInUp"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {faq.icon}
                <h2 className="text-lg md:text-xl font-semibold text-dark">
                  {faq.question}
                </h2>
              </div>
              <div className="text-primary text-xl transition-transform duration-300">
                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {openIndex === index && (
              <p className="mt-4 text-gray-700 leading-relaxed pl-9 transition-all duration-300 ease-in-out">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Contact Support CTA */}
      <div className="bg-gradient-to-r from-primary to-dark text-white text-center py-16 px-6 rounded-none">
        <FaHeadset className="mx-auto text-yellow-300 text-6xl mb-6 animate-bounce" />
        <h2 className="text-3xl font-extrabold mb-3">Still Need Help?</h2>
        <p className="max-w-2xl mx-auto text-lg opacity-90 mb-6">
          Our customer care team is available 24/7 to assist you.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a
            href="mailto:info@bzcart.store"
            className="bg-yellow-400 hover:bg-yellow-500 text-dark font-bold px-6 py-3 rounded-full shadow-md transition"
          >
            📧 Email Support
          </a>
          <a
            href="https://wa.me/923297609190"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full shadow-md transition"
          >
            💬 WhatsApp Support
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Faqs;
