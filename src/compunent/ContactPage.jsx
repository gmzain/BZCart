import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all required fields!");
      return;
    }

    // Template parameters
    const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      time: new Date().toLocaleString(), // timestamp
    };

    // Send email
    emailjs
      .send(
        "service_k948b8l", // Your Service ID
        "template_xr8d22o", // Your Template ID
        templateParams,
        "H5Z2iu_gtM4J3Txho" // Your Public Key
      )
      .then(
        (response) => {
          console.log("EmailJS success:", response);
          toast.success("Message sent successfully!");
          setFormData({ name: "", email: "", subject: "", message: "" });
        },
        (error) => {
          console.error("EmailJS error details:", error);
          toast.error("Something went wrong, try again!");
        }
      );
  };

  return (
    <>

      <div className="min-h-screen bg-light font-daraz overflow-hidden">
        {/* Header Section */}
        <div className="relative text-center py-12 md:py-20 px-4 bg-gradient-to-r from-primary to-dark text-white overflow-hidden">
          <h1 className="relative text-5xl md:text-6xl font-extrabold tracking-tight">
            Let's Connect
          </h1>
          <p className="relative mt-4 text-lg md:text-xl opacity-90">
            Drop us a message, and we'll get back to you soon!
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto py-20 px-6">
          <div className="relative bg-white shadow-2xl rounded-3xl p-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name */}
                <div>
                  <label className="block text-dark text-sm font-semibold mb-3">
                    Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full p-4 bg-light border border-dark/10 rounded-xl"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-dark text-sm font-semibold mb-3">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full p-4 bg-light border border-dark/10 rounded-xl"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-dark text-sm font-semibold mb-3">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  className="w-full p-4 bg-light border border-dark/10 rounded-xl"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-dark text-sm font-semibold mb-3">
                  Message <span className="text-primary">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows="7"
                  className="w-full p-4 bg-light border border-dark/10 rounded-xl resize-none"
                ></textarea>
              </div>

              {/* Submit */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-primary text-white font-semibold px-10 py-4 rounded-xl shadow-lg hover:bg-dark transition-all"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ContactPage;
