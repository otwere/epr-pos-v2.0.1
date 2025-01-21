'use client';
import React, { useState, useEffect } from "react";
import { Layout, Breadcrumb, Typography } from "antd";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import ShiftTable from "../Components/ShiftTableComponent/ShiftTable";

import { HomeOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;

const ShiftList = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(prevState => !prevState);
  };

  // Ensure useEffect has a dependency array if it exists
  useEffect(() => {
    // Any effect logic here
    // Example: Fetch data or set up subscriptions
  }, []); // Empty dependency array to run only once

  const breadcrumbItems = [
    {
      title: (
        <span>
          <HomeOutlined style={{ marginRight: 4 , color: '#1890ff'}} />
          Home
        </span>
      ),
      href: "/Dashboard",
    },
    {
      title: "Shift List",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />
      
      {/* Main Layout */}
      <Layout className="flex-1 bg-gray-100">
        {/* Header */}
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        
        {/* Content */}
        <Content
          className={`transition-all duration-300 p-6 ${collapsed ? "ml-0 w-full" : "ml-0 w-full"}`}
        >
          {/* Breadcrumb */}
          <div className="!mb-0">
            <Breadcrumb className="mb-4" items={breadcrumbItems} />
            <hr />

            {/* Page Header */}
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="!mb-0 mt-4 text-blue-600">
                Shift Management
              </Title>
              <Text type="secondary" className="text-right mb-0">
                Manage all Branches shift effectively
              </Text>
            </div>
          </div>

          <hr className="mb-4"/>

          {/* Shift Table Section */}
          <ShiftTable />
        </Content>

        {/* Footer */}
        <Footer />
      </Layout>
    </div>
  );
};

export default ShiftList;