"use client";
import React, { useState } from "react";
import {
  Layout,
  Card,
  Table,
  Typography,
  Breadcrumb,
  Tag,
  Button,
  Dropdown,
  Row,
  Col,
} from "antd";
import {
  HomeOutlined,
  MoreOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from "@ant-design/icons";

import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Title } = Typography;

const PurchaseAnalysisList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);

  const purchaseData = [
    {
      key: "1",
      supplierName: "Supplier 1",
      productName: "Item A",
      previousPrice: 25000,
      currentPrice: 27000,
    },
    {
      key: "2",
      supplierName: "Supplier 2",
      productName: "Item B",
      previousPrice: 15000,
      currentPrice: 14000,
    },
    {
      key: "3",
      supplierName: "Supplier 3",
      productName: "Item C",
      previousPrice: 30000,
      currentPrice: 30000,
    },
  ];

  const calculatePriceDiff = (previousPrice, currentPrice) => {
    return currentPrice - previousPrice;
  };

  const determinePriceDiffStatus = (priceDiff) => {
    if (priceDiff > 0) return { status: "Up", color: "red" };
    if (priceDiff < 0) return { status: "Down", color: "green" };
    return { status: "No Change", color: "gray" };
  };

  const filteredData = filterStatus
    ? purchaseData.filter((record) => {
        const priceDiff = calculatePriceDiff(record.previousPrice, record.currentPrice);
        return determinePriceDiffStatus(priceDiff).status === filterStatus;
      })
    : purchaseData;

  const statusCounts = purchaseData.reduce(
    (acc, record) => {
      const priceDiff = calculatePriceDiff(record.previousPrice, record.currentPrice);
      const { status } = determinePriceDiffStatus(priceDiff);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { Up: 0, Down: 0, "No Change": 0 }
  );

  const columns = [
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName",
      sorter: (a, b) => a.supplierName.localeCompare(b.supplierName),
    },
    {
      title: "Product | Item Name",
      dataIndex: "productName",
      key: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: "Previous Price",
      dataIndex: "previousPrice",
      key: "previousPrice",
      sorter: (a, b) => a.previousPrice - b.previousPrice,
      render: (price) => `KES ${price.toLocaleString()}`,
      align: "right",
    },
    {
      title: "Current Price",
      dataIndex: "currentPrice",
      key: "currentPrice",
      sorter: (a, b) => a.currentPrice - b.currentPrice,
      render: (price) => `KES ${price.toLocaleString()}`,
      align: "right",
    },
    {
      title: "Price Diff",
      key: "priceDiff",
      sorter: (a, b) =>
        calculatePriceDiff(a.previousPrice, a.currentPrice) -
        calculatePriceDiff(b.previousPrice, b.currentPrice),
      render: (_, record) => {
        const priceDiff = calculatePriceDiff(record.previousPrice, record.currentPrice);
        return `KES ${priceDiff.toLocaleString()}`;
      },
      align: "right",
    },
    {
      title: "Price Diff Status",
      key: "priceDiffStatus",
      sorter: (a, b) => {
        const diffA = calculatePriceDiff(a.previousPrice, a.currentPrice);
        const diffB = calculatePriceDiff(b.previousPrice, b.currentPrice);
        return diffA - diffB;
      },
      render: (_, record) => {
        const priceDiff = calculatePriceDiff(record.previousPrice, record.currentPrice);
        const { status, color } = determinePriceDiffStatus(priceDiff);
        return <Tag color={color}>{status}</Tag>;
      },
      align: "right",
    },
    {
      title: "Action",
      key: "action",
      render: (_) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                icon: <EyeOutlined />,
                label: "View Purchase",
              },
              {
                key: "2",
                icon: <ShoppingCartOutlined />,
                label: "Receive Purchase",
              },
              {
                key: "3",
                icon: <DollarOutlined />,
                label: "View Payments",
              },
            ],
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button icon={<MoreOutlined />} className="border-none hover:bg-gray-100" />
        </Dropdown>
      ),
      align: "right",
    },
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />

      <Layout className="flex-1 bg-gray-50">
        <Header collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />

        <Content className="transition-all duration-300 p-6">
          <Breadcrumb
            items={[
              {
                title: (
                  <span>
                    <HomeOutlined /> Home
                  </span>
                ),
                href: "/",
              },
              { title: "Purchase Analysis List" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          <Row gutter={16} className="mb-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Col span={8} key={status}>
                <Card
                  hoverable
                  onClick={() => setFilterStatus(filterStatus === status ? null : status)}
                  className={`border ${
                    filterStatus === status
                      ? "border-blue-500"
                      : "border-gray-200"
                  } transition-all duration-300 transform hover:scale-95 hover:bg-blue-50 ${
                    status === "Up"
                      ? "bg-red-50"
                      : status === "Down"
                      ? "bg-green-100"
                      : "bg-gray-200"
                  }`}
                >
                  <Title level={5}>{status}</Title>
                  <p>{count} items</p>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="bg-gray-50 rounded-sm mb-2">
            <Title level={4}>Purchase Analysis List</Title>
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              className="shadow-none"
            />
          </Card>
        </Content>
        <Footer />
      </Layout>
    </div>
  );
};

export default PurchaseAnalysisList;
