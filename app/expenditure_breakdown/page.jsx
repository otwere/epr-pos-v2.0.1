"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Modal,
  Card,
  Table,
  Breadcrumb,
  Layout,
  Typography,
  message,
  Tooltip,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  SaveOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";

import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import Link from "next/link";
import axios from "axios";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const ExpenditureList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("/api/expenses"); // Updated endpoint
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const toggleFormVisibility = () => setIsFormOpen(!isFormOpen);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      setItems(items.filter((item) => item.id !== id));
      messageApi.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        const response = await axios.put(`/api/expenses/${editingItem.id}`, values); // Updated endpoint
        setItems(items.map((item) => (item.id === editingItem.id ? response.data : item)));
        messageApi.success("Item updated successfully");
      } else {
        const response = await axios.post("/api/expenses", values); // Updated endpoint
        setItems([...items, response.data]);
        messageApi.success("New item added successfully");
      }
      setIsDialogOpen(false);
      form.resetFields();
      setEditingItem(null);
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  const columns = [
    { title: "Date", dataIndex: "date", key: "date", sorter: (a, b) => new Date(a.date) - new Date(b.date) },
    { title: "Category", dataIndex: "category", key: "category", sorter: (a, b) => a.category.localeCompare(b.category) },
    { title: "Reference No.", dataIndex: "referenceNo", key: "referenceNo", sorter: (a, b) => a.referenceNo.localeCompare(b.referenceNo) },
    { title: "Amount", dataIndex: "amount", key: "amount", sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount) },
    { title: "Note", dataIndex: "note", key: "note" },
    { title: "Created by", dataIndex: "createdBy", key: "createdBy", sorter: (a, b) => a.createdBy.localeCompare(b.createdBy) },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        let color;
        switch (status) {
          case "Approved":
            color = "green";
            break;
          case "Pending":
            color = "orange";
            break;
          case "Declined":
            color = "red";
            break;
          default:
            color = "gray";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Pay Status",
      dataIndex: "payStatus",
      key: "payStatus",
      sorter: (a, b) => a.payStatus - b.payStatus,
      render: (payStatus) => (
        <Tag color={payStatus ? "blue" : "orange"}>
          {payStatus ? "Paid" : "Unpaid"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="flex space-x-4">
          <Tooltip title="Edit Item">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Item">
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex">
      {contextHolder}
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />

      <Layout className="flex-1 bg-gray-50">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="transition-all duration-300 p-6">
          <div className="mt-0">
            <Breadcrumb
              className="mb-4"
              items={[
                { title: <Link href="/">Home</Link> },
                { title: <Link href="/expense">Add Expense</Link> },
                { title: "Expense Breakdown" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-gray-700 mt-4">
                Expense Breakdown List
              </Title>
              <Text type="secondary">View and manage your expenditures</Text>
            </div>
          </div>

          <hr className="mb-4" />

          <Card className="rounded-lg bg-gray-50 p-0">
            <div className="mb-4 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              {/* Search Section */}
              <div className="flex items-center space-x-4">
                <div className="relative w-[300px]">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <SearchOutlined />
                  </span>
                  <input
                    type="text"
                    placeholder="Search items by category, reference no."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Link href="/expense">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <PlusOutlined /> New Direct Expense
                  </button>
                </Link>
                <button
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onClick={toggleFormVisibility}
                >
                  {isFormOpen ? (
                    <UpOutlined className="mr-2" />
                  ) : (
                    <DownOutlined className="mr-2" />
                  )}
                  Add Expense | Approval
                </button>
              </div>
            </div>

           

            {isFormOpen && (
              <Form
                form={form}
                layout="vertical"
                className="mb-4 flex flex-wrap gap-4"
                initialValues={{
                  branch: "",
                  expenseDate: "",
                  expenseCategory: "",
                  accountsPayable: "",
                  amount: "",
                  expenseStatus: "",
                  vat: "",
                  uploadFile: null,
                  note: "",
                }}
              >
                <Form.Item
                  name="branch"
                  label="Branch | Station"
                  rules={[
                    {
                      required: true,
                      message: "Please select the branch/station",
                    },
                  ]}
                  className="flex-1 min-w-[200px]"
                >
                  <Select placeholder="Select branch/station">
                    <Option value="Branch1">Branch1 Eldoret CDB</Option>
                    <Option value="Branch2">Branch2</Option>
                    <Option value="Branch3">Branch3</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="expenseDate"
                  label="Expense Date"
                  rules={[
                    {
                      required: true,
                      message: "Please input the expense date",
                    },
                  ]}
                  className="flex-1 min-w-[200px]"
                >
                  <Input type="date" placeholder="Enter expense date" />
                </Form.Item>
                <Form.Item
                  name="expenseCategory"
                  label="Expense Category"
                  rules={[
                    {
                      required: true,
                      message: "Please select the expense category",
                    },
                  ]}
                  className="flex-1 min-w-[200px]"
                >
                  <Select placeholder="Select expense category">
                    <Option value="Office Supplies">Office Supplies</Option>
                    <Option value="Utilities">Utilities</Option>
                    <Option value="Travel">Travel</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="accountsPayable"
                  label="Accounts Payable"
                  rules={[
                    {
                      required: true,
                      message: "Please select the accounts payable",
                    },
                  ]}
                  className="flex-1 min-w-[200px]"
                >
                  <Select placeholder="Select accounts payable">
                    <Option value="Account1">Account1</Option>
                    <Option value="Account2">Account2</Option>
                    <Option value="Account3">Account3</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="amount"
                  label="Amount"
                  rules={[
                    { required: true, message: "Please input the amount" },
                  ]}
                  className="flex-1 min-w-[200px]"
                >
                  <Input type="number" prefix="$" placeholder="Enter amount" />
                </Form.Item>
                <Form.Item
                  name="expenseStatus"
                  label="Expense Status"
                  rules={[
                    {
                      required: true,
                      message: "Please select the expense status",
                    },
                  ]}
                  className="flex-1 min-w-[200px]"
                >
                  <Select placeholder="Select expense status">
                    <Option value="Approved">Approved</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Declined">Declined</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="vat"
                  label="VAT"
                  rules={[
                    { required: true, message: "Please select VAT rate" },
                  ]}
                  className="flex-1 min-w-[200px]"
                >
                  <Select placeholder="Select VAT">
                    <Option value="zeroRated">Zero Rated (0)</Option>
                    <Option value="taxExempted">Tax Exempted</Option>
                    <Option value="8%">8%</Option>
                    <Option value="16%">16%</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="note"
                  label="Note"
                  rules={[{ required: true, message: "Please input the note" }]}
                  className="flex-1 min-w-[200px]"
                >
                  <Input placeholder="Enter note" />
                </Form.Item>
                <Form.Item
                  name="uploadFile"
                  label="Upload File"
                  className="flex-1 min-w-[200px]"
                >
                  <Input type="file" />
                </Form.Item>

                <Form.Item className="w-full flex justify-end">
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                  >
                    Submit Added Expense | Approval
                  </Button>
                </Form.Item>
              </Form>
            )}

            <hr />

            <Table
              dataSource={filteredItems}
              columns={columns}
              rowKey="id"
              pagination={{
                total: filteredItems.length,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </Card>
        </Content>

        <Footer />
      </Layout>

      <Modal
        title={editingItem ? "Edit Item" : "Add New Item"}
        open={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
          >
            Save
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={
            editingItem || {
              date: "",
              category: "",
              referenceNo: "",
              amount: "",
              note: "",
              createdBy: "",
              status: true,
              payStatus: false,
            }
          }
        >
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please input the date" }]}
          >
            <Input type="date" placeholder="Enter date" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please input the category" }]}
          >
            <Input placeholder="Enter category" />
          </Form.Item>
          <Form.Item
            name="referenceNo"
            label="Reference No."
            rules={[
              { required: true, message: "Please input the reference number" },
            ]}
          >
            <Input placeholder="Enter reference number" />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please input the amount" }]}
          >
            <Input type="number" prefix="$" placeholder="Enter amount" />
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input placeholder="Enter note" />
          </Form.Item>
          <Form.Item
            name="createdBy"
            label="Created by"
            rules={[
              { required: true, message: "Please input the creator's name" },
            ]}
          >
            <Input placeholder="Enter creator's name" />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select placeholder="Select status">
              <Option value="Approved">Approved</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Declined">Declined</Option>
            </Select>
          </Form.Item>
          <Form.Item name="payStatus" label="Pay Status">
            <Select placeholder="Select pay status">
              <Option value={true}>Paid</Option>
              <Option value={false}>Unpaid</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExpenditureList;
