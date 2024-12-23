import React, { useState, lazy, Suspense } from "react";
import {
  ShoppingCartOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";
import AdvanceDepositComponent from "../AdvancedDepositComponent/AdvancedDepositComponent";
import TopFastMovingItems from "../TopFastMovingItemsComponent/TopFastMovingItems";
import PaymentSummaryComponent from "../PaymentSummaryComponent/PaymentSummaryComponent";
import { Tabs, Alert, Table } from "antd";
import Link from "next/link";
import "tailwindcss/tailwind.css";

// Lazy load Happy Hour Component
const HappyHourComponent = lazy(() =>
  import("../HappyHourComponent/HappyHourComponent")
);

// Stock Alert Columns Configuration
const stockColumns = [
  { title: "#", dataIndex: "key", key: "key", className: "nowrap" },
  {
    title: "Category Name",
    dataIndex: "categoryName",
    key: "categoryName",
    className: "nowrap",
  },
  {
    title: "Item Name",
    dataIndex: "itemName",
    key: "itemName",
    className: "nowrap",
  },
  {
    title: "Re-order",
    dataIndex: "reOrder",
    key: "reOrder",
    align: "right",
    className: "nowrap",
  },
  {
    title: "Stock Available",
    dataIndex: "stockAvailable",
    key: "stockAvailable",
    align: "right",
    className: "nowrap",
  },
];

// Stock Data Sample
const stockData = [
  {
    key: "1",
    categoryName: "Bulbs",
    itemName: "Velmax Bulbs",
    reOrder: 50,
    stockAvailable: 30,
  },
  {
    key: "2",
    categoryName: "Cable Flex",
    itemName: "0.5 Flex Cable",
    reOrder: 100,
    stockAvailable: 80,
  },
  {
    key: "3",
    categoryName: "Stationery",
    itemName: "A4 Paper Reams",
    reOrder: 20,
    stockAvailable: 10,
  },
];

// Fast Moving Items Columns Configuration
const fastMovingColumns = [
  { title: "SN", dataIndex: "key", key: "key", className: "nowrap" },
  {
    title: "Item Name",
    dataIndex: "itemName",
    key: "itemName",
    className: "nowrap",
  },
  { 
    title: "Quantity", 
    dataIndex: "quantity", 
    key: "quantity", 
    className: "nowrap" 
  },
];

// Fast Moving Items Data Sample
const fastMovingData = [
  { key: "1", itemName: "Velmax Bulbs", quantity: 200 },
  { key: "2", itemName: "0.5 Flex Cable", quantity: 100 },
  { key: "3", itemName: "A4 Paper Reams", quantity: 50 },
];

// Reusable View All Link Component
const ViewAllLink = (props) => {
  return (
    <Link 
      href={props.href} 
      className="block text-center mt-4 text-blue-600 hover:underline text-xs"
    >
      {props.children || "View All"}
    </Link>
  );
};

export default function Home() {
  // State management for tabs and panel visibility
  const [activeTab, setActiveTab] = useState("1");
  const [isStockAlertOpen, setStockAlertOpen] = useState(true);
  const [isFastMovingItemsOpen, setFastMovingItemsOpen] = useState(true);

  // Toggle function for panels
  const togglePanels = () => {
    setStockAlertOpen((prev) => !prev);
    setFastMovingItemsOpen((prev) => !prev);
  };

  // Tab items configuration
  const tabItems = [
    {
      key: "1",
      label: "Stock Alert Tab",
      children: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50">
          {isStockAlertOpen && (
            <div className="bg-white p-4 rounded-lg shadow-none">
              <div className="flex justify-between items-center mb-4 border-b border-gray-300">
                <h1 className="text-xl text-blue-600 font-semibold flex items-center mb-4">
                  <ReconciliationOutlined className="mr-1 text-gray-800" />{" "}
                  Stock Alert
                </h1>
                <button
                  className="p-1 border rounded hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                  onClick={() => setStockAlertOpen(false)}
                >
                  -
                </button>
              </div>
              <Alert
                message="Stock Running Low !"
                type="warning"
                className="mb-4"
              />
              <Table
                columns={stockColumns}
                dataSource={stockData}
                pagination={false}
              />
              <ViewAllLink href="/Stock_Alert">View All</ViewAllLink>
            </div>
          )}
          {isFastMovingItemsOpen && (
            <div className="bg-white p-4 rounded-lg shadow-none">
              <div className="flex justify-between items-center mb-4 border-b border-gray-300">
                <h2 className="text-xl text-blue-600 font-semibold flex items-center mb-4">
                  <ShoppingCartOutlined className="mr-1 text-gray-800" /> Top
                  Fast Moving Items
                </h2>
                <button
                  className="p-1 border rounded hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                  onClick={() => setFastMovingItemsOpen(false)}
                >
                  -
                </button>
              </div>
              <TopFastMovingItems />
              <ViewAllLink href="/">View All</ViewAllLink>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "Advance Payment | Deposits",
      children: <AdvanceDepositComponent />,
    },
    {
      key: "3",
      label: "Payments Mode Detailed",
      children: <PaymentSummaryComponent />,
    },
    {
      key: "4",
      label: (
        <span>
          Happy Hour
          <span className="bg-orange-500 text-white rounded-md py-0 px-2 ml-1">
            new
          </span>
        </span>
      ),
      children: (
        <Suspense
          fallback={
            <div className="text-center text-green-600">
              Happy hour Loading...
            </div>
          }
        >
          <HappyHourComponent />
        </Suspense>
      ),
    },
  ];

  return (
    <div className="p-5 bg-gray-100">
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        className="bg-white p-4 rounded-lg shadow-none"
        tabBarExtraContent={
          <button
            className="p-1 border rounded hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
            onClick={togglePanels}
          >
            {isStockAlertOpen && isFastMovingItemsOpen ? "-" : "+"}
          </button>
        }
        items={tabItems}
      />
    </div>
  );
}