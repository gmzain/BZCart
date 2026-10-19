import React from "react";
import Navbar from "./Navbar";
import CartItems from "./CartItems";
import PaymentMethods from "./PaymentMethods";
import { useSelector } from "react-redux";
import Checkout from "./Checkout";

const Payment = () => {

  return (
    <>
      <div className="md:w-[98%] hidden mx-auto pt-8 md:flex flex-col lg:flex-row justify-between gap-6 p-4 min-h-screen bg-light font-montserrat">
        <CartItems />
        {/* ✅ pass calculateTotal */}
        <Checkout />
      </div>
      <div className="flex md:hidden md:w-[98%]  mx-auto pt-8 p-4 min-h-screen bg-light font-montserrat">
        <CartItems />
      </div>
    </>
  );
};

export default Payment;
