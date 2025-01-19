// components/MoneyPaymentsLayout.jsx
import React, { useState } from "react";
import { Layout } from "antd";

import Header from "../HeaderComponent/Header";
import Sidebar from "../SidebarComponent/Sidebar";
import Footer from "../FooterComponent/Footer";

const { Content } = Layout;

const MoneyPaymentsLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />
      <Layout className="flex-1 bg-gray-100">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="transition-all duration-300 p-6">{children}</Content>
        <Footer />
      </Layout>
    </div>
  );
};

export default MoneyPaymentsLayout;