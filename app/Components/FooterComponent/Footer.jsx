'use client';

import React, { useState, useEffect } from "react";
import CallToActionButton from "../CallToActionButton/CallToActionButton";


const Footer = ({ collapsed }) => {
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsHidden(window.scrollY <= 1500);
    };

    const debouncedHandleScroll = debounce(handleScroll, 300);

    window.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, []);

  return (
    <footer
      className={`sticky bottom-0 left-0 right-0 w-full h-16 flex flex-col md:flex-row 
        justify-between items-center p-6 bg-gray-200 text-gray-600  transition-transform duration-300 ${
        isHidden ? 'translate-y-full' : 'translate-y-0'
      }`}
      style={{
        transform: isHidden ? 'translateY(100%)' : 'translateY(0)',
      }}
      role="contentinfo"
      aria-label="Site Footer"
    >
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left text-gray-600">
            <span className="text-xs font-medium">
              &copy; 2023 - {new Date().getFullYear()}{" "}
              <a
                href="https://www.snave.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                title="Visit Snave Webhub Africa"
              >
                Snave Webhub Africa
              </a>{" "}
              | All Rights Reserved.
            </span>
          </div>
          <div className="md:order-last">
            <CallToActionButton collapsed={collapsed} />
          </div>
          {!collapsed && (
            <div className=" text-gray-600 text-xs font-semibold md:order-2 ml-[44rem]">
              <span className="hidden md:inline">
                Integrated Advanced EPR - POS (v2.0.1)
              </span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

// Utility function to debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default Footer;
