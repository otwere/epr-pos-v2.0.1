'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "antd";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Content from "../Components/ContentComponent/Content";
import Footer from "../Components/FooterComponent/Footer";
import CardsDashboard from "../Components/CardsDashboardComponents/CardsDashboard";
import StockAlertComponent from "../Components/StockAlertComponent/StockAlertComponent";
import BarChartComponent from "../Components/BarChartComponent/BarChartComponent";
import SalesSummaryBoardComponent from "../Components/SalesSummaryBoardComponent/SalesSummaryBoardComponent";
import { POSProvider } from "../Components/POSContextComponent/POSContext";
import 'tailwindcss/tailwind.css';
import "../globals.css";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/Dashboard');
    }
  }, [router]);

  return (
    <POSProvider>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <Sidebar collapsed={collapsed} />
          <div className={`flex flex-col flex-1 ${collapsed ? 'content-collapsed' : ''}`}>
            <Header collapsed={collapsed} setCollapsed={setCollapsed} />
            <Content style={{ margin: "0 10px" }}>
              <CardsDashboard collapsed={collapsed} setCollapsed={setCollapsed} />
            </Content>
            <Layout />
            <StockAlertComponent collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className="flex flex-col items-center p-4 bg-gray-200">
              <div className="w-full max-w-8xl flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-2/3">
                  <BarChartComponent />
                </div>
                <div className="w-full lg:w-1/3">
                  <SalesSummaryBoardComponent />
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </POSProvider>
  );
};

export default Dashboard;