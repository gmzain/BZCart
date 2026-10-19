// src/components/LazyWrapper.jsx
import React, { useState, useEffect, useRef } from "react";
import Loader from "./Loader";

const LazyWrapper = ({ children, height = "250px" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // stop observing after load
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {isVisible ? children : <Loader />}
    </div>
  );
};

export default LazyWrapper;
