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
  logoSize = "h-14", // Default logo size
  showVersion = true, // Control visibility of version text
}) => {
  return (
    <Link href="/" className="block" aria-label="Go to homepage">
      <div
        className={`flex items-center justify-start p-2 h-16 w-full transition-all duration-300  ${backgroundColor} hover:bg-opacity-90`}
      >
        <img
          src={logoSrc}
          alt={`${companyName} Logo`}
          className={`transition-all duration-300 ${logoSize} ml-2 ${
            collapsed ? "w-12" : "w-14"
          }`}
        />
        {/* Only show text if not collapsed */}
        {!collapsed && (
          <div className="ml-5 w-full p-0 mt-[-2px] transition-opacity duration-300">
            <h6
              className={`font-bold text-lg mr-4 leading-tight ${textColor} text-nowrap`}
            >
              {companyName}
            </h6>
            {showVersion && (
              <span className="text-[11px] text-gray-600 font-semibold text-nowrap mr-2">
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