import React from "react";
import { Dropdown } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";

const loginName = "Fadhili Achieng";
const role = "Company CEO";
const companyFullName = " Snave Webhub Africa (K) Limited";

const HeaderProfile = () => {
  const menuItems = [
    {
      key: "1",
      label: (
        <div className="flex flex-col items-start p-1 shadow-sm">
          <h6 className="text-sm font-bold text-blue-600">{companyFullName}</h6>         
          <span className="flex justify-center text-xs text-gray-600 font-semibold text-nowrap">
            Login By : {loginName} - {role}
          </span>
        </div>
      ),
      type: "group",
    },
    {
      key: "2",
      label: (
        <a href="/" className="text-xs">
          My Profile
        </a>
      ),
      icon: <UserOutlined />,
    },
    { type: "divider" },
    {
      key: "3",
      label: (
        <a href="users-profile.html" className="text-xs">
          Account Settings
        </a>
      ),
      icon: <SettingOutlined />,
    },
    { type: "divider" },
    {
      key: "4",
      label: (
        <a href="/" className="text-xs">
          Need Help?
        </a>
      ),
      icon: <QuestionCircleOutlined />,
    },
    { type: "divider" },
    {
      key: "5",
      label: (
        <a href="/login_page" className="text-xs">
          Sign Out
        </a>
      ),
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <div className="p-4">
      <Dropdown
        menu={{
          items: menuItems, // Pass menu items to the 'menu' prop
        }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <div className="flex items-center mr-4 cursor-pointer">
          
          <span className="ml-3 text-blue-600 text-[18px] font-bold truncate">
           {loginName}
          </span>
          <DownOutlined className="ml-2 mr-3 text-gray-900 text-sm" />
        </div>
      </Dropdown>
    </div>
  );
};

export default HeaderProfile;
