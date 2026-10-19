import React from "react";
import Navbar from "./Navbar";
import WatchMenu from "./WatchMenu";

const Watch = () => {
  return (
    <div className="relative ">
      {/* Page Content */}
      <div className="relative z-20">
        <Navbar />

        <div className=" mx-auto">
          {/* Page Heading */}
          <div className=" text-center">
            <h1 className="text-4xl sm:text-5xl my-3 font-extrabold text-primary drop-shadow-lg animate-fade-in-up">
              Explore Watch
            </h1>
          </div>

          {/* Product List Container */}
          <div className="rounded-2xl">
           <WatchMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
