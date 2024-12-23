import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import HeaderProfile from "../HeaderProfileComponent/HeaderProfile";
import NotificationIcon from "../NotificationIconComponent/NotificationIcon";
import PosIcon from "../PosIconComponent/PosIcon";
import DesktopIcon from "../DesktopIconComponent/DesktopIconComponent";

const Header = ({ collapsed, setCollapsed }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Handle menu collapse toggle
  const handleToggle = () => {
    setCollapsed((prevState) => !prevState);
  };

  // Handle scroll events
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    // Smoothly hide/show the header based on scroll position
    requestAnimationFrame(() => {
      setIsOpen(currentScrollY < 100 || currentScrollY < window.scrollY); // Simplified scroll check
    });
  };

  // Add and remove scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="flex items-center justify-end max-w-full px-0 py-0 bg-gray-50 border-b border-gray-300 mb-0">
      {/* Left-Aligned Collapse Button */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={handleToggle}
        className="text-gray-700 hover:text-blue-600 transition-all duration-300 ease-in-out mr-auto mb-6"
        aria-label={collapsed ? "Expand menu" : "Collapse menu"}
      />
      
      {/* Right-Aligned Icons and Profile */}
      <div className="flex items-center space-x-8 mb-3">
        {/* Desktop Icon */}
        <div className="relative group cursor-pointer">
          <DesktopIcon className="text-gray-600 group-hover:text-blue-600 transition-all duration-300 ease-in-out" />
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded shadow transition-all duration-300">
            Dashboard
          </span>
        </div>
        
        {/* POS Icon */}
        <div className="relative group cursor-pointer">
          <PosIcon className="text-gray-600 group-hover:text-blue-600 transition-all duration-300 ease-in-out" />
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded shadow transition-all duration-300">
            POS
          </span>
        </div>

        {/* Notification Icon */}
        <div className="relative group cursor-pointer">
          <NotificationIcon className="text-gray-600 group-hover:text-blue-600 transition-all duration-300 ease-in-out" />
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded shadow transition-all duration-300">
            Notifications
          </span>
        </div>

        {/* Profile Icon */}
        <div className="flex items-center">
          <HeaderProfile className="cursor-pointer rounded-full border border-gray-300 shadow-sm hover:border-blue-500 transition-all duration-300 ease-in-out" />
        </div>
      </div>
    </div>
  );
};

export default Header;