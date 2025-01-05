"use client";
import React, { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Typography,
  Breadcrumb,
  Button,
  Tag,
  Dropdown,
  Input,
} from "antd";
import {
  HomeOutlined,
  MoreOutlined,
  EyeOutlined,
  FileTextOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Title } = Typography;

const CancelledSalesList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [salesData, setSalesData] = useState([
    {
      key: "1",
      salesDate: "2024-01-20",
      invoiceNo: "INV-001",
      salesStatus: "Completed",
      createdBy: "John Doe",
      total: 25000,
      paidAmt: 25000,
      balance: 0,
      payStatus: "Paid",
      customerName: "Customer 1",
      branch: "Branch A",
    },
    {
      key: "2",
      salesDate: "2024-01-19",
      invoiceNo: "INV-002",
      salesStatus: "Order",
      createdBy: "Jane Smith",
      total: 15000,
      paidAmt: 0,
      balance: 15000,
      payStatus: "Unpaid",
      customerName: "Customer 2",
      branch: "Branch B",
    },
  ]);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    filterData();
  }, [searchTerm, salesData]);

  const filterData = () => {
    let filtered = salesData.map((invoice) => {
      if (invoice.salesStatus === "Completed" && invoice.payStatus === "Paid") {
        return {
          ...invoice,
          payStatus: "Canceled",
        };
      }
      return invoice;
    });

    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.total.toString().includes(searchTerm)
      );
    }

    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "SN",
      dataIndex: "key",
      key: "key",
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: "Sales Date",
      dataIndex: "salesDate",
      key: "salesDate",
      render: (salesDate) => new Date(salesDate).toLocaleDateString(),
      sorter: (a, b) => new Date(a.salesDate) - new Date(b.salesDate),
    },
    {
      title: "Invoice No.",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
      sorter: (a, b) => a.invoiceNo.localeCompare(b.invoiceNo),
    },
    {
      title: "Sales Status",
      dataIndex: "salesStatus",
      key: "salesStatus",
      render: (_, record) => (
        <Tag
          color={
            record.salesStatus === "Completed"
              ? "green"
              : record.salesStatus === "Canceled"
              ? "red"
              : "orange"
          }
        >
          {record.salesStatus}
        </Tag>
      ),
      sorter: (a, b) => a.salesStatus.localeCompare(b.salesStatus),
    },
    {
      title: "Created by",
      dataIndex: "createdBy",
      key: "createdBy",
      sorter: (a, b) => a.createdBy.localeCompare(b.createdBy),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => `KES ${total.toLocaleString()}`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Paid Amt",
      dataIndex: "paidAmt",
      key: "paidAmt",
      render: (paidAmt) => `KES ${paidAmt.toLocaleString()}`,
      sorter: (a, b) => a.paidAmt - b.paidAmt,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (balance) => `KES ${balance.toLocaleString()}`,
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: "Pay Status",
      dataIndex: "payStatus",
      key: "payStatus",
      render: (status) => (
        <Tag color={status === "Canceled" ? "red" : "blue"}>{status}</Tag>
      ),
      sorter: (a, b) => a.payStatus.localeCompare(b.payStatus),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      sorter: (a, b) => a.branch.localeCompare(b.branch),
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
                label: "View Sales",
              },
              {
                key: "2",
                icon: <FileTextOutlined />,
                label: "Credit Note",
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
              { title: "Cancelled Sales List" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          <div className="bg-gray-50 rounded-sm p-4">
            <div className="mb-4 flex justify-between items-center">
              <Title level={4}>Cancelled Sales List</Title>
            </div>

            <hr className="mb-4" />

            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16l-4-4m0 0l4-4m-4 4h16"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by customer name, invoice number, or total amount"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <hr className="mb-2" />

            <Table columns={columns} dataSource={filteredData} />
          </div>
        </Content>
        <Footer />
      </Layout>
    </div>
  );
};

export default CancelledSalesList;
