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
  Row,
  Col,
  Statistic,
  div, // Add this line
} from "antd";
import {
  HomeOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  PlusOutlined // Add this line
} from "@ant-design/icons";
import Link from "next/link";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";


const { Content } = Layout;
const { Title, Text } = Typography; // Add Text here

const Supplier_List = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
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

  const [supplierData, setSupplierData] = useState([
    {
      key: "1",
      supplierName: "Supplier 1",
      phoneNo: "123456789",
      email: "supplier1@example.com",
      address: "Address 1",
      curBalance: 5000,
      branch: "Branch A",
      lastSupplyDate: "2023-01-20",
      recentSupply: true,
    },
    {
      key: "2",
      supplierName: "Supplier 2",
      phoneNo: "987654321",
      email: "supplier2@example.com",
      address: "Address 2",
      curBalance: 10000,
      branch: "Branch B",
      lastSupplyDate: "2022-01-19",
      recentSupply: false,
    },
    {
      key: "3",
      supplierName: "Supplier 3",
      phoneNo: "456789123",
      email: "supplier3@example.com",
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

  const handleViewProfile = (supplier) => {
    setCurrentSupplier(supplier);
    setProfileModalOpen(true);
  };

  const handleEditDetails = (supplier) => {
    setCurrentSupplier(supplier);
    form.setFieldsValue(supplier);
    setEditModalOpen(true);
  };

  const handleDeleteSupplier = (supplier) => {
    Modal.confirm({
      title: `Are you sure you want to delete ${supplier.supplierName}?`,
      content: "This action cannot be undone.",
      onOk: () => {
        setSupplierData((prev) =>
          prev.filter((item) => item.key !== supplier.key)
        );
        message.success("Supplier deleted successfully.");
      },
    });
  };

  const handleEditSubmit = (values) => {
    const updatedData = supplierData.map((item) =>
      item.key === currentSupplier.key ? { ...item, ...values } : item
    );
    setSupplierData(updatedData);
    setEditModalOpen(false);
    message.success("Supplier details updated successfully.");
  };

  const handleAddSubmit = (values) => {
    const newSupplier = {
      key: (supplierData.length + 1).toString(),
      ...values,
      curBalance: parseFloat(values.curBalance),
      lastSupplyDate: new Date().toISOString().split("T")[0],
      recentSupply: true,
    };
    setSupplierData([...supplierData, newSupplier]);
    setAddModalOpen(false);
    message.success("Supplier added successfully.");
  };

  const filteredData = supplierData.filter((supplier) => {
    if (
      activeFilter !== "all" &&
      getStatus(supplier.lastSupplyDate, supplier.recentSupply) !== activeFilter
    ) {
      return false;
    }
    const searchFields = [
      supplier.supplierName,
      supplier.phoneNo,
      supplier.email,
      supplier.address,
      supplier.curBalance.toString(),
      supplier.branch,
      getStatus(supplier.lastSupplyDate, supplier.recentSupply),
    ];
    return searchFields.some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const columns = [
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName",
      sorter: (a, b) => a.supplierName.localeCompare(b.supplierName),
    },
    {
      title: "Phone No.",
      dataIndex: "phoneNo",
      key: "phoneNo",
      sorter: (a, b) => a.phoneNo.localeCompare(b.phoneNo),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "Current Balance",
      dataIndex: "curBalance",
      key: "curBalance",
      render: (curBalance) => `KES ${curBalance.toLocaleString()}`,
      sorter: (a, b) => a.curBalance - b.curBalance,
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
                    Supplier Profile
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
                    onClick={() => handleDeleteSupplier(record)}
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
              { title: "Suppliers List" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          <div className="mb-4 flex justify-between items-center">
            <Title level={4}>Suppliers List</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddModalOpen(true)}
            >
              Add Supplier
            </Button>
          </div>
          
          <hr className="mb-4" />

          <div className="flex flex-row gap-4 mb-6">
            <div
              className={`w-full bg-blue-100 p-4 rounded-lg cursor-pointer transition-transform transform hover:scale-95 ease-in duration-300 ${
                activeFilter === "all" ? "ring-1 ring-blue-500" : ""
              }`}
              onClick={() => setActiveFilter("all")}
            >
              <Statistic title="All Suppliers" value={supplierData.length} />
            </div>

            <div
              className={`w-full bg-green-50 p-4 rounded-lg cursor-pointer transition-transform transform hover:scale-95 ease-in duration-300 ${
                activeFilter === "Active" ? "ring-1 ring-green-500" : ""
              }`}
              onClick={() => setActiveFilter("Active")}
            >
              <Statistic
                title="Active Suppliers"
                value={
                  supplierData.filter(
                    (supplier) =>
                      getStatus(
                        supplier.lastSupplyDate,
                        supplier.recentSupply
                      ) === "Active"
                  ).length
                }
              />
            </div>

            <div
              className={`w-full bg-red-50 p-4 rounded-lg cursor-pointer transition-transform transform hover:scale-95 ease-in duration-300 ${
                activeFilter === "Dormant" ? "ring-1 ring-red-500" : ""
              }`}
              onClick={() => setActiveFilter("Dormant")}
            >
              <Statistic
                title="Dormant Suppliers"
                value={
                  supplierData.filter(
                    (supplier) =>
                      getStatus(
                        supplier.lastSupplyDate,
                        supplier.recentSupply
                      ) === "Dormant"
                  ).length
                }
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <Input
              placeholder="Search suppliers..."
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
            title="Supplier Profile"
            open={profileModalOpen}
            onCancel={() => setProfileModalOpen(false)}
            footer={null}
          >
            {currentSupplier && (
              <div>
                <p>
                  <strong>Name:</strong> {currentSupplier.supplierName}
                </p>
                <p>
                  <strong>Phone:</strong> {currentSupplier.phoneNo}
                </p>
                <p>
                  <strong>Email:</strong> {currentSupplier.email}
                </p>
                <p>
                  <strong>Address:</strong> {currentSupplier.address}
                </p>
                <p>
                  <strong>Current Balance:</strong> KES{" "}
                  {currentSupplier.curBalance.toLocaleString()}
                </p>
                <p>
                  <strong>Branch:</strong> {currentSupplier.branch}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {getStatus(
                    currentSupplier.lastSupplyDate,
                    currentSupplier.recentSupply
                  )}
                </p>
              </div>
            )}
          </Modal>

          <Modal
            title="Edit Supplier"
            open={editModalOpen}
            onCancel={() => setEditModalOpen(false)}
            footer={null}
          >
            <Form form={form} onFinish={handleEditSubmit} layout="vertical">
              <Form.Item name="supplierName" label="Supplier Name">
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
                  Update Supplier
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Add Supplier"
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

export default Supplier_List;
