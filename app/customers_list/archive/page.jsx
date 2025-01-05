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
  Modal,
  message,
  Statistic,
  Input,
} from "antd";
import {
  HomeOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Header from "../../Components/HeaderComponent/Header";
import Sidebar from "../../Components/SidebarComponent/Sidebar";
import Footer from "../../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Title } = Typography;

const Archive_Customer_list = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentCustomers, setCurrentCustomers] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [CustomersData, setCustomersData] = useState([
    {
      key: "1",
      CustomersName: "Customers 1",
      phoneNo: "123456789",
      altPhoneNo: "123456780",
      email: "Customers1@example.com",
      address: "Address 1",
      curBalance: 5000,
      creditLimit: 10000,
      creditAmount: 2000,
      loyaltyPoints: 150,
      estate: "Estate A",
      branch: "Branch A",
      lastPurchaseDate: "2023-01-20",
      recentPurchase: true,
    },
    {
      key: "2",
      CustomersName: "Customers 2",
      phoneNo: "987654321",
      altPhoneNo: "987654320",
      email: "Customers2@example.com",
      address: "Address 2",
      curBalance: 10000,
      creditLimit: 20000,
      creditAmount: 5000,
      loyaltyPoints: 300,
      estate: "Estate B",
      branch: "Branch B",
      lastPurchaseDate: "2022-01-19",
      recentPurchase: false,
    },
    {
      key: "3",
      CustomersName: "Customers 3",
      phoneNo: "456789123",
      altPhoneNo: "456789120",
      email: "Customers3@example.com",
      address: "Address 3",
      curBalance: 15000,
      creditLimit: 30000,
      creditAmount: 10000,
      loyaltyPoints: 450,
      estate: "Estate C",
      branch: "Branch C",
      lastPurchaseDate: "2023-01-18",
      recentPurchase: false,
    },
  ]);

  useEffect(() => {
    // Fetch customers data and update archive list based on purchase history
    // ...existing code...
  }, []);

  const getStatus = (lastPurchaseDate, recentPurchase) => {
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    if (recentPurchase) return "Active";
    return new Date(lastPurchaseDate) < threeYearsAgo ? "Archived" : "Active";
  };

  const handleViewProfile = (Customers) => {
    setCurrentCustomers(Customers);
    setProfileModalOpen(true);
  };

  const handleDeleteCustomers = (Customers) => {
    Modal.confirm({
      title: `Are you sure you want to delete ${Customers.CustomersName}?`,
      content: "This action cannot be undone.",
      onOk: () => {
        setCustomersData((prev) =>
          prev.filter((item) => item.key !== Customers.key)
        );
        message.success("Customers deleted successfully.");
      },
    });
  };

  const filteredData = CustomersData.filter((Customers) => {
    if (
      activeFilter !== "all" &&
      getStatus(Customers.lastPurchaseDate, Customers.recentPurchase) !== activeFilter
    ) {
      return false;
    }
    const searchFields = [
      Customers.CustomersName,
      Customers.phoneNo,
      Customers.email,
      Customers.address,
      Customers.curBalance.toString(),
      Customers.branch,
      getStatus(Customers.lastPurchaseDate, Customers.recentPurchase),
    ];
    return searchFields.some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "CustomersName",
      key: "CustomersName",
      sorter: (a, b) => a.CustomersName.localeCompare(b.CustomersName),
    },
    {
      title: "Phone No.",
      dataIndex: "phoneNo",
      key: "phoneNo",
      sorter: (a, b) => a.phoneNo.localeCompare(b.phoneNo),
    },
    {
      title: "Alt. Phone",
      dataIndex: "altPhoneNo",
      key: "altPhoneNo",
      sorter: (a, b) => a.altPhoneNo.localeCompare(b.altPhoneNo),
    },
    {
      title: "Credit Limit",
      dataIndex: "creditLimit",
      key: "creditLimit",
      sorter: (a, b) => a.creditLimit - b.creditLimit,
    },
    {
      title: "Credit Amount",
      dataIndex: "creditAmount",
      key: "creditAmount",
      sorter: (a, b) => a.creditAmount - b.creditAmount,
    },
    {
      title: "L.Points",
      dataIndex: "loyaltyPoints",
      key: "loyaltyPoints",
      sorter: (a, b) => a.loyaltyPoints - b.loyaltyPoints,
    },
    {
      title: "Estate",
      dataIndex: "estate",
      key: "estate",
      sorter: (a, b) => a.estate.localeCompare(b.estate),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      sorter: (a, b) => a.branch.localeCompare(b.branch),
    },
    {
      title: "Status",
      dataIndex: "lastPurchaseDate",
      key: "status",
      render: (text, record) => {
        const status = getStatus(record.lastPurchaseDate, record.recentPurchase);
        return (
          <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (text, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: (
                  <Button
                    icon={<EyeOutlined />}
                    block
                    className="mb-2"
                    onClick={() => handleViewProfile(record)}
                  >
                    Customers Profile
                  </Button>
                ),
              },
              {
                key: "2",
                label: (
                  <Button
                    icon={<DeleteOutlined />}
                    block
                    danger
                    onClick={() => handleDeleteCustomers(record)}
                  >
                    Delete
                  </Button>
                ),
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

      <Layout className="flex-1 bg-gray-100">
        <Header
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        />

        <Content className="p-6">
          <Breadcrumb
            items={[
              {
                title: (
                  <Link href="/">
                    <HomeOutlined /> Home
                  </Link>
                ),
              },
              { title: " Archived Customers" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          <div className="mb-4 flex justify-between items-center">
            <Title level={4}> Archived Customers List</Title>
          </div>
          
          <hr className="mb-4" />

          <div className="flex flex-row gap-4 mb-6">
            <div
              className={`w-full bg-blue-100 p-4 rounded-lg cursor-pointer transition-transform transform hover:scale-95 hover:shadow-sm ease-in duration-300 ${
                activeFilter === "all" ? "ring-1 ring-blue-500" : ""
              }`}
              onClick={() => setActiveFilter("all")}
            >
              <Statistic title="All Customers" value={CustomersData.length} />
            </div>

            <div
              className={`w-full bg-green-50 p-4 rounded-lg cursor-pointer transition-transform transform hover:scale-95 hover:shadow-sm ease-in duration-300 ${
                activeFilter === "Active" ? "ring-1 ring-green-500" : ""
              }`}
              onClick={() => setActiveFilter("Active")}
            >
              <Statistic
                title="Active Customers"
                value={
                  CustomersData.filter(
                    (Customers) =>
                      getStatus(
                        Customers.lastPurchaseDate,
                        Customers.recentPurchase
                      ) === "Active"
                  ).length
                }
              />
            </div>

            <div
              className={`w-full bg-red-50 p-4 rounded-lg cursor-pointer transition-transform transform hover:scale-95 hover:shadow-sm ease-in duration-300 ${
                activeFilter === "Dormant" ? "ring-1 ring-red-500" : ""
              }`}
              onClick={() => setActiveFilter("Dormant")}
            >
              <Statistic
                title="Dormant Customers"
                value={
                  CustomersData.filter(
                    (Customers) =>
                      getStatus(
                        Customers.lastPurchaseDate,
                        Customers.recentPurchase
                      ) === "Dormant"
                  ).length
                }
              />
            </div>

            <div
              className={`w-full bg-red-50 p-4 rounded-lg cursor-pointer transition-transform transform hover:scale-95 hover:shadow-sm ease-in duration-300 ${
                activeFilter === "Archived" ? "ring-1 ring-red-500" : ""
              }`}
              onClick={() => setActiveFilter("Archived")}
            >
              <Statistic
                title="Archived Customers"
                value={
                  CustomersData.filter(
                    (Customers) =>
                      getStatus(
                        Customers.lastPurchaseDate,
                        Customers.recentPurchase
                      ) === "Archived"
                  ).length
                }
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <Input
              placeholder="Search Customers..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
             <hr />

            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={pagination}
              onChange={(p) => setPagination(p)}
            />
          </div>

          <Modal
            title="Customers Profile"
            open={profileModalOpen}
            onCancel={() => setProfileModalOpen(false)}
            footer={null}
          >
            {currentCustomers && (
              <div>
                <p>
                  <strong>Name:</strong> {currentCustomers.CustomersName}
                </p>
                <p>
                  <strong>Phone:</strong> {currentCustomers.phoneNo}
                </p>
                <p>
                  <strong>Email:</strong> {currentCustomers.email}
                </p>
                <p>
                  <strong>Address:</strong> {currentCustomers.address}
                </p>
                <p>
                  <strong>Current Balance:</strong> KES{" "}
                  {currentCustomers.curBalance.toLocaleString()}
                </p>
                <p>
                  <strong>Branch:</strong> {currentCustomers.branch}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {getStatus(
                    currentCustomers.lastPurchaseDate,
                    currentCustomers.recentPurchase
                  )}
                </p>
              </div>
            )}
          </Modal>
        </Content>

        <Footer />
      </Layout>
    </div>
  );
};

export default Archive_Customer_list;
