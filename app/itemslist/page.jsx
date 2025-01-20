"use client";
import React, { useState } from "react";
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
} from "@ant-design/icons";

import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import Link from "next/link";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const ItemsList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [items, setItems] = useState([
    {
      id: "0001",
      code: "0001",
      name: "Test",
      brand: "Brand A",
      category: "Category 1",
      unit: "10",
      reorder: "300.00",
      rPrice: "600.00",
      wPrice: "500.00",
      tax: "16%",
      status: true,
    },
    {
      id: "0002",
      code: "0002",
      name: "Test Product",
      brand: "Brand B",
      category: "Category 2",
      unit: "20",
      reorder: "200.00",
      rPrice: "300.00",
      wPrice: "250.00",
      tax: "16%",
      status: true,
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);

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

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this item?",
      content: "This action cannot be undone.",
      onOk() {
        setItems(items.filter((item) => item.id !== id));
        messageApi.success("Item deleted successfully");
      },
    });
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingItem) {
          setItems(
            items.map((item) =>
              item.id === editingItem.id ? { ...editingItem, ...values } : item
            )
          );
          messageApi.success("Item updated successfully");
        } else {
          const newItem = {
            ...values,
            id: String(items.length + 1).padStart(4, "0"),
            status: true,
          };
          setItems([...items, newItem]);
          messageApi.success("New item added successfully");
        }
        setIsDialogOpen(false);
        form.resetFields();
        setEditingItem(null);
      })
      .catch((errorInfo) => console.log("Validation Failed:", errorInfo));
  };

  const columns = [
    { title: "Item Code", dataIndex: "code", key: "code" },
    { title: "Item Name", dataIndex: "name", key: "name" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    { title: "Reorder Level", dataIndex: "reorder", key: "reorder" },
    { title: "Retail Price", dataIndex: "rPrice", key: "rPrice" },
    { title: "Wholesale Price", dataIndex: "wPrice", key: "wPrice" },
    { title: "Tax Rate", dataIndex: "tax", key: "tax" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="flex space-x-2">
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
                { title: "Items List" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Items List
              </Title>
              <Text type="secondary">Manage your inventory items</Text>
            </div>
          </div>

          <Card className="rounded-lg bg-white">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: 300 }}
                />
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => setSearchTerm("")}
                >
                  Reset
                </Button>
              </div>
              <Button type="primary" icon={<PlusOutlined />}>
                <Link href="/additems">Add New Item</Link>
              </Button>
            </div>

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
              code: "",
              name: "",
              brand: "",
              category: "",
              unit: "",
              reorder: "",
              rPrice: "",
              wPrice: "",
              tax: "",
            }
          }
        >
          <Form.Item
            name="code"
            label="Item Code"
            rules={[{ required: true, message: "Please input the item code" }]}
          >
            <Input placeholder="Enter item code" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Item Name"
            rules={[{ required: true, message: "Please input the item name" }]}
          >
            <Input placeholder="Enter item name" />
          </Form.Item>
          <Form.Item name="brand" label="Brand">
            <Input placeholder="Enter brand" />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Select placeholder="Select category">
              <Option value="Category 1">Category 1</Option>
              <Option value="Category 2">Category 2</Option>
            </Select>
          </Form.Item>
          <Form.Item name="unit" label="Unit">
            <Select placeholder="Select unit">
              <Option value="unit1">Unit 1</Option>
              <Option value="unit2">Unit 2</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="reorder"
            label="Reorder Level"
            rules={[{ required: true, message: "Please input reorder level" }]}
          >
            <Input type="number" placeholder="Enter reorder level" />
          </Form.Item>
          <Form.Item
            name="rPrice"
            label="Retail Price"
            rules={[{ required: true, message: "Please input retail price" }]}
          >
            <Input type="number" prefix="$" placeholder="Enter retail price" />
          </Form.Item>
          <Form.Item
            name="wPrice"
            label="Wholesale Price"
            rules={[{ required: true, message: "Please input wholesale price" }]}
          >
            <Input
              type="number"
              prefix="$"
              placeholder="Enter wholesale price"
            />
          </Form.Item>
          <Form.Item name="tax" label="Tax Rate">
            <Input type="number" suffix="%" placeholder="Enter tax rate" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ItemsList;
