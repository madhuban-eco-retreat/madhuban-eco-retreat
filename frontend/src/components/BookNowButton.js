// src/components/BookNowButton.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BookNowButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 transition-all duration-300 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        } z-30`}
    >
      <Link
        to="/booking"
        className="flex items-center justify-center bg-green-800 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-full shadow-lg transition-all hover:shadow-xl"
      >
        Book Now
      </Link>
    </div>
  );
};

export default BookNowButton;
