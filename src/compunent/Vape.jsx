import React, { useState } from "react";
import Navbar from "./Navbar";
import ViewList from "./ViewList";

const Vape = () => {
  return (
    <div className="relative min-h-screen ">
      
      {/* Page Content */}
      <div className="relative z-20">
        <Navbar />

        <div className="pt-10 pb-20 px-4 sm:px-8 lg:px-16 w-full max-w-8xl mx-auto">
          {/* Page Heading */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 drop-shadow-lg animate-fade-in-up">
              Explore Vapes
            </h1>
          </div>

          {/* Product List Container */}
          <div className="rounded-2xl p-6 sm:p-10 ">
            <ViewList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vape;
