import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

const Logo = ({
  logoSrc = "/snavelogo.png",
  companyName = "Snave Webhub Africa",
  version = "Integrated Advanced - POS (v2.0.1)",
  collapsed = false,
  backgroundColor = "bg-gray-50",
  textColor = "text-blue-600",
  logoSize = "h-12", 
  showVersion = true,
}) => {
  return (
    <Link href="/Dashboard" className="block" aria-label="Go to Dashboard">
      <div
        className={`flex items-center justify-start p-4 h-20 w-80 transition-all duration-300 ${backgroundColor} hover:bg-opacity-90 cursor-pointer mb-1`}
      >
        <img
          src={logoSrc}
          alt={`${companyName} Logo`}
          className={`transition-all duration-300 ${logoSize} ${collapsed ? "w-10" : "w-12"}`}
        />
        {/* Only show text if not collapsed */}
        {!collapsed && (
          <div className="ml-1 w-full transition-opacity duration-300">
            <h6
              className={`font-semibold ml-4 text-lg leading-tight ${textColor} text-nowrap`}
            >
              {companyName}
            </h6>
            {showVersion && (
              <span className="text-xs ml-4 text-gray-500 font-medium text-nowrap">
                {version}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

// PropTypes for better validation
Logo.propTypes = {
  logoSrc: PropTypes.string,
  companyName: PropTypes.string,
  version: PropTypes.string,
  collapsed: PropTypes.bool,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  logoSize: PropTypes.string,
  showVersion: PropTypes.bool,
};

export default Logo;