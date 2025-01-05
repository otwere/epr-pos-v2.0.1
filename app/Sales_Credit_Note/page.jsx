// page.jsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Typography,
  Breadcrumb,
  Button,
  Dropdown,
  Modal,
  Menu,
  Input,
} from "antd";
import {
  HomeOutlined,
  MoreOutlined,
  PlusOutlined,
  EyeOutlined,
  PrinterOutlined,
  FilePdfOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import RaiseCreditNote from "./RaiseCreditNote";

const { Content } = Layout;
const { Title } = Typography;

const Credit_Sales_Note = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const storedSalesData = JSON.parse(localStorage.getItem("salesData")) || [];
    setSalesData(storedSalesData);
  }, []);

  useEffect(() => {
    localStorage.setItem("salesData", JSON.stringify(salesData));
  }, [salesData]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = salesData.filter(
    (item) =>
      item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.invoiceNo.toLowerCase().includes(searchText.toLowerCase()) ||
      item.serialNo.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleMenuClick = (key, record) => {
    switch (key) {
      case "1":
        // View CR Note logic
        break;
      case "2":
        // Thermal Print logic
        break;
      case "3":
        // Print A4 Pdf logic
        break;
      case "4":
        // Delete logic
        setSalesData(salesData.filter(item => item.key !== record.key));
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: "SN",
      dataIndex: "key",
      key: "key",
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: "Credit Note Date",
      dataIndex: "creditNoteDate",
      key: "creditNoteDate",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.creditNoteDate) - new Date(b.creditNoteDate),
    },
    {
      title: "Serial No.",
      dataIndex: "serialNo",
      key: "serialNo",
      sorter: (a, b) => a.serialNo.localeCompare(b.serialNo),
    },
    {
      title: "Invoice No.",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
      sorter: (a, b) => a.invoiceNo.localeCompare(b.invoiceNo),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `KES ${amount.toLocaleString()}`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      sorter: (a, b) => a.createdBy.localeCompare(b.createdBy),
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
          menu={
            <Menu onClick={({ key }) => handleMenuClick(key, record)}>
              <Menu.Item key="1" icon={<EyeOutlined />}>
                View CR Note
              </Menu.Item>
              <Menu.Item key="2" icon={<PrinterOutlined />}>
                Thermal Print
              </Menu.Item>
              <Menu.Item key="3" icon={<FilePdfOutlined />}>
                Print A4 Pdf
              </Menu.Item>
              <Menu.Item key="4" icon={<DeleteOutlined />}>
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
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
                  <span>
                    <Link href="/">
                      <HomeOutlined /> Home
                    </Link>
                  </span>
                ),
              },
              { title: "Credit Notes" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          <div className="bg-gray-50 rounded-sm p-4">
            <div className="mb-4 flex justify-between items-center">
              <Title level={4}>Credit Notes List</Title>

              <Button
                type="primary"
                onClick={() => setIsModalOpen(true)}
                icon={<PlusOutlined />}
              >
                Raise Credit Note
              </Button>
            </div>

            <hr className="mb-4" />

            <Input.Search
              placeholder="Search by Customer Name, Invoice No, or Serial No"
              value={searchText}
              onChange={handleSearch}
              className="w-full"
            />

            <hr className="mt-4"/>

            <Table columns={columns} dataSource={filteredData} />
          </div>
        </Content>
        <Footer />
      </Layout>

      <Modal
        title="Raise Credit Note"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1000}
      >
        <RaiseCreditNote
          onClose={() => setIsModalOpen(false)}
          onSave={(newNote) => setSalesData([...salesData, newNote])}
        />
      </Modal>
    </div>
  );
};

export default Credit_Sales_Note;
