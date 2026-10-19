import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

export default function Auth() {
  const location = useLocation();

  // Check URL query (?mode=signup)
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");

  // Default to login unless mode=signup
  const [isSignIn, setIsSignIn] = useState(mode !== "signup");

  // Update when URL changes
  useEffect(() => {
    setIsSignIn(mode !== "signup");
  }, [mode]);

  return (
    <div className="md:min-h-screen flex items-center justify-center bg-light font-cabin md:p-8 overflow-hidden">
      <div className="relative w-full md:max-w-[80rem] h-auto shadow-xl rounded-2xl bg-white overflow-hidden flex flex-col md:flex-row">
        {/* Container with transition */}
        <div className="w-full transition-all duration-500 ease-in-out">
          {isSignIn ? (
            <div className="animate-slideInLeft">
              <Login setIsSignIn={setIsSignIn} />
            </div>
          ) : (
            <div className="animate-slideInRight">
              <Signup setIsSignIn={setIsSignIn} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
