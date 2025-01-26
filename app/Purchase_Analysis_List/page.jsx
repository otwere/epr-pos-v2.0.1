"use client";
import React, { useState, useMemo } from "react";
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
  Tooltip,
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
const { Title, Text } = Typography;

const PurchaseAnalysisList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);

  // Sample purchase data
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

  // Calculate price difference
  const calculatePriceDiff = (previousPrice, currentPrice) => {
    return currentPrice - previousPrice;
  };

  // Determine price difference status
  const determinePriceDiffStatus = (priceDiff) => {
    if (priceDiff > 0) return { status: "Up", color: "red" };
    if (priceDiff < 0) return { status: "Down", color: "green" };
    return { status: "No Change", color: "gray" };
  };

  // Filter data based on price difference status
  const filteredData = useMemo(() => {
    return filterStatus
      ? purchaseData.filter((record) => {
          const priceDiff = calculatePriceDiff(record.previousPrice, record.currentPrice);
          return determinePriceDiffStatus(priceDiff).status === filterStatus;
        })
      : purchaseData;
  }, [filterStatus, purchaseData]);

  // Calculate counts for each status
  const statusCounts = useMemo(() => {
    return purchaseData.reduce(
      (acc, record) => {
        const priceDiff = calculatePriceDiff(record.previousPrice, record.currentPrice);
        const { status } = determinePriceDiffStatus(priceDiff);
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { Up: 0, Down: 0, "No Change": 0 }
    );
  }, [purchaseData]);

  // Table columns
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
          <Tooltip title="More actions">
            <Button icon={<MoreOutlined />} className="border-none hover:bg-gray-100" />
          </Tooltip>
        </Dropdown>
      ),
      align: "right",
    },
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />

      <Layout className="flex-1 bg-gray-100">
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
                href: "/Dashboard",
              },
              { title: "Purchase Analysis Report" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          {/* Status Cards */}
          <Row gutter={16} className="mb-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Col span={8} key={status}>
                <Card
                  hoverable
                  onClick={() => setFilterStatus(filterStatus === status ? null : status)}
                  className={`border ${
                    filterStatus === status
                      ? "border-blue-500 shadow-lg"
                      : "border-gray-200"
                  } transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                    status === "Up"
                      ? "bg-red-50"
                      : status === "Down"
                      ? "bg-green-50"
                      : "bg-gray-100"
                  }`}
                >
                  <Title level={5} className="mb-2">
                    {status}
                  </Title>
                  <Text strong>{count} items</Text>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Purchase Analysis Table */}
          <Card className="bg-gray-50 rounded-sm">
            <Title level={4} className="mb-4">
              Purchase Analysis Report
            </Title>
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              className="rounded-lg"
            />
          </Card>
        </Content>
        <Footer />
      </Layout>
    </div>
  );
};

export default React.memo(PurchaseAnalysisList);