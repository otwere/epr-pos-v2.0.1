import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import NavbarComponent from "../NavbarComponent/NavbarComponent";
// import HeaderProfile from "../HeaderProfileComponent/HeaderProfile";
// import NotificationIcon from "../NotificationIconComponent/NotificationIcon";
// import DesktopIconComponent from "../DesktopIconComponent/DesktopIconComponent";
// import PosIcon from "../PosIconComponent/PosIcon";

const Header = ({ collapsed, setCollapsed }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);

  const handleToggle = (e) => {
    e.preventDefault(); // Prevents default action
    setCollapsed(!collapsed);
  };

  const handleScroll = () => {
    if (window.scrollY > prevScrollY) {
      setIsOpen(false); // Scrolling down
    } else {
      setIsOpen(true); // Scrolling up
    }
    setPrevScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollY]);

  return (
    <nav>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={handleToggle}
        className="text-lg w-16 h-16"
      />
      <div className="">
      <NavbarComponent/>
      </div>
    </nav>
    
  );
};

export default Header;
