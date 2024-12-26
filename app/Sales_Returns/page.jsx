"use client";
import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Table,
  Typography,
  Breadcrumb,
  Button,
  Tag,
  Dropdown,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  HomeOutlined,
  MoreOutlined,
  EyeOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Title } = Typography;

const Sales_Returns = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [salesData, setSalesData] = useState([
    {
      key: "1",
      saleCode: "SC001",
      salesDate: "2024-01-20",
      itemName: "Item A",
      saleQty: 3,
      total: 3000,
      salesPerson: "John Doe",
      returnedBy: "Admin",
      returnedQty: 1,
      returnedAmount: 1000,
      customer: "Customer 1",
    },
    {
      key: "2",
      saleCode: "SC002",
      salesDate: "2024-01-19",
      itemName: "Item B",
      saleQty: 5,
      total: 5000,
      salesPerson: "Jane Smith",
      returnedBy: "Branch Manager",
      returnedQty: 2,
      returnedAmount: 2000,
      customer: "Customer 2",
    },
  ]);

  const columns = [
    {
      title: "Sale Code",
      dataIndex: "saleCode",
      key: "saleCode",
      sorter: (a, b) => a.saleCode.localeCompare(b.saleCode),
    },
    {
      title: "Sales Date",
      dataIndex: "salesDate",
      key: "salesDate",
      sorter: (a, b) => new Date(a.salesDate) - new Date(b.salesDate),
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      sorter: (a, b) => a.itemName.localeCompare(b.itemName),
    },
    {
      title: "Sale Qty",
      dataIndex: "saleQty",
      key: "saleQty",
      sorter: (a, b) => a.saleQty - b.saleQty,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => `KES ${total.toLocaleString()}`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Sales Person",
      dataIndex: "salesPerson",
      key: "salesPerson",
      sorter: (a, b) => a.salesPerson.localeCompare(b.salesPerson),
    },
    {
      title: "Returned By",
      dataIndex: "returnedBy",
      key: "returnedBy",
      render: (role, record) => (
        <div>
          {role} (Qty: {record.returnedQty}, Amount: KES {record.returnedAmount.toLocaleString()})
        </div>
      ),
      sorter: (a, b) => a.returnedBy.localeCompare(b.returnedBy),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      sorter: (a, b) => a.customer.localeCompare(b.customer),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                icon: <EyeOutlined />,
                label: "View",
                onClick: () => handleViewSale(record),
              },
              {
                key: "2",
                icon: <PrinterOutlined />,
                label: "Print",
                onClick: () => handlePrintSale(record),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleViewSale = (record) => {
    Modal.info({
      title: `Sale Details - ${record.saleCode}`,
      content: (
        <div>
          <p>Customer: {record.customer}</p>
          <p>Sales Date: {record.salesDate}</p>
          <p>Item Name: {record.itemName}</p>
          <p>Sale Quantity: {record.saleQty}</p>
          <p>Total Amount: KES {record.total.toLocaleString()}</p>
          <p>Returned By: {record.returnedBy} (Qty : {record.returnedQty}, Amount : KES {record.returnedAmount.toLocaleString()})</p>
        </div>
      ),
      onOk() {},
    });
  };

  const handlePrintSale = (record) => {
    message.info(`Printing details for sale code ${record.saleCode}`);
  };

  const totalReturnedQty = salesData.reduce((acc, item) => acc + item.returnedQty, 0);
  const totalReturnedAmount = salesData.reduce((acc, item) => acc + item.returnedAmount, 0);

  return (
    <div className="min-h-screen flex">
      <Sidebar
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
      />

      <Layout className="flex-1 bg-gray-50">
        <Header
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        />

        <Content className="transition-all duration-300 p-6">
          <Breadcrumb
            items={[
              {
                title: (
                  <Link href="/">
                    <HomeOutlined /> Home
                  </Link>
                ),
              },
              { title: "Sales Returns List" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          <Row gutter={16} className="mb-4 font-semibold">
            <Col span={12}>
              <Card className="bg-green-50">
                <Statistic
                  title="Total Quantity Returned"
                  value={totalReturnedQty}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card className="bg-red-50">
                <Statistic
                  title="Total Amount Returned"
                  value={`KES :  ${totalReturnedAmount.toLocaleString()}`}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
          </Row>

          <Card className="bg-gray-50 rounded-sm">
            <div className="mb-4 flex justify-between items-center">
              <Title level={4}>Sales Returns List</Title>
            </div>
            <hr className="mb-4" />

            <Input
              placeholder="Search by sale code, customer name, or item name"
              prefix={<SearchOutlined />}
              style={{ marginBottom: 16 }}
            />

            <Table
              columns={columns}
              dataSource={salesData}
              pagination={{ pageSize: 10 }}
              onChange={(pagination, filters, sorter) => {
                console.log("Table changed", pagination, filters, sorter);
              }}
            />
          </Card>
        </Content>
        <Footer />
      </Layout>
    </div>
  );
};

export default Sales_Returns;
