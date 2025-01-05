"use client";
import React, { useState } from "react";
import {
  Layout,
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
  message,
  Statistic, 
} from "antd";
import {
  HomeOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined // Add this line
} from "@ant-design/icons";
import Link from "next/link";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";


const { Content } = Layout;
const { Title, Text } = Typography; // Add Text here

const Customers_List = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentCustomers, setCurrentCustomers] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false); // Add this line

  const [CustomersData, setCustomersData] = useState([
    {
      key: "1",
      CustomersName: "Customers 1",
      phoneNo: "123456789",
      altPhone: "987654321", // Add this line
      email: "Customers1@example.com",
      address: "Address 1",
      curBalance: 5000,
      creditLimit: 10000, // Add this line
      creditAmount: 5000, // Add this line
      estate: "Estate A", // Add this line
      branch: "Branch A",
      lastSupplyDate: "2023-01-20",
      recentSupply: true,
    },
    {
      key: "2",
      CustomersName: "Customers 2",
      phoneNo: "987654321",
      email: "Customers2@example.com",
      address: "Address 2",
      curBalance: 10000,
      branch: "Branch B",
      lastSupplyDate: "2022-01-19",
      recentSupply: false,
    },
    {
      key: "3",
      CustomersName: "Customers 3",
      phoneNo: "456789123",
      email: "Customers3@example.com",
      address: "Address 3",
      curBalance: 15000,
      branch: "Branch C",
      lastSupplyDate: "2023-01-18",
      recentSupply: false,
    },
  ]);

  const getStatus = (lastSupplyDate, recentSupply) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    if (recentSupply) return "Active";
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return new Date(lastSupplyDate) < oneYearAgo ? "Dormant" : "Active";
  };

  const handleViewProfile = (Customers) => {
    setCurrentCustomers(Customers);
    setProfileModalOpen(true);
  };

  const handleEditDetails = (Customers) => {
    setCurrentCustomers(Customers);
    form.setFieldsValue(Customers);
    setEditModalOpen(true);
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

  const handleEditSubmit = (values) => {
    const updatedData = CustomersData.map((item) =>
      item.key === currentCustomers.key ? { ...item, ...values } : item
    );
    setCustomersData(updatedData);
    setEditModalOpen(false);
    message.success("Customers details updated successfully.");
  };

  const handleAddSubmit = (values) => {
    const newCustomers = {
      key: (CustomersData.length + 1).toString(),
      ...values,
      curBalance: parseFloat(values.curBalance),
      lastSupplyDate: new Date().toISOString().split("T")[0],
      recentSupply: true,
    };
    setCustomersData([...CustomersData, newCustomers]);
    setAddModalOpen(false);
    message.success("Customers added successfully.");
  };

  const filteredData = CustomersData.filter((Customers) => {
    if (
      activeFilter !== "all" &&
      getStatus(Customers.lastSupplyDate, Customers.recentSupply) !== activeFilter
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
      getStatus(Customers.lastSupplyDate, Customers.recentSupply),
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
      dataIndex: "altPhone",
      key: "altPhone",
      sorter: (a, b) => a.altPhone.localeCompare(b.altPhone),
    },
    {
      title: "Credit Limit",
      dataIndex: "creditLimit",
      key: "creditLimit",
      render: (creditLimit) => creditLimit ? `KES ${creditLimit.toLocaleString()}` : 'N/A',
      sorter: (a, b) => a.creditLimit - b.creditLimit,
    },
    {
      title: "Credit Amount",
      dataIndex: "creditAmount",
      key: "creditAmount",
      render: (creditAmount) => creditAmount ? `KES ${creditAmount.toLocaleString()}` : 'N/A',
      sorter: (a, b) => a.creditAmount - b.creditAmount,
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
      dataIndex: "lastSupplyDate",
      key: "status",
      render: (text, record) => {
        const status = getStatus(record.lastSupplyDate, record.recentSupply);
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
                    icon={<EditOutlined />}
                    block
                    className="mb-2"
                    onClick={() => handleEditDetails(record)}
                  >
                    Edit Details
                  </Button>
                ),
              },
              {
                key: "3",
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
              { title: "Customers List" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          <div className="mb-4 flex justify-between items-center">
            <Title level={4}>Customers List</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
            >
              <Link href="/Register_New_Customer_Client">
                Add Customers
              </Link>
            </Button>
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
                        Customers.lastSupplyDate,
                        Customers.recentSupply
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
                        Customers.lastSupplyDate,
                        Customers.recentSupply
                      ) === "Dormant"
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
                    currentCustomers.lastSupplyDate,
                    currentCustomers.recentSupply
                  )}
                </p>
              </div>
            )}
          </Modal>

          <Modal
            title="Edit Customers"
            open={editModalOpen}
            onCancel={() => setEditModalOpen(false)}
            footer={null}
          >
            <Form form={form} onFinish={handleEditSubmit} layout="vertical">
              <Form.Item name="CustomersName" label="Customers Name">
                <Input />
              </Form.Item>
              <Form.Item name="phoneNo" label="Phone No.">
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email Address">
                <Input />
              </Form.Item>
              <Form.Item name="address" label="Address">
                <Input />
              </Form.Item>
              <Form.Item name="curBalance" label="Cur. Balance">
                <InputNumber
                  formatter={(value) =>
                    `KES ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/KES\s?|\(,*\)/g, "")}
                />
              </Form.Item>
              <Form.Item name="branch" label="Branch">
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Customers
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Add Customers"
            open={addModalOpen}
            onCancel={() => setAddModalOpen(false)}
            footer={null}
          >
            
          </Modal>
        </Content>

        <Footer />
      </Layout>
    </div>
  );
};

export default Customers_List;
