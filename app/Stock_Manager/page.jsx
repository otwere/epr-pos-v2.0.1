"use client";
import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Form,
  Input,
  Button,
  Table,
  Select,
  Modal,
  message,
  Row,
  Col,
  Layout,
  Breadcrumb,
  Typography,
  Dropdown,
  Space,
  Card,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Option } = Select;
const { Text, Title } = Typography;

// Constants for categories and other options
const CATEGORIES = {
  groceries: ["Dairy", "Bakery", "Produce", "Frozen Foods"],
  electronics: ["Smartphones", "Laptops", "Accessories", "Audio"],
  clothing: ["Men", "Women", "Children", "Accessories"],
};

const UNIT_TYPES = ["Piece", "Kilogram", "Liter", "Meter", "Box", "Pack"];

const StockManagement = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Test Product",
      category: "groceries",
      subcategory: "Dairy",
      unit: "Piece",
      stock: 50,
      reorderPoint: 10,
      costPrice: 500.0,
      salesPrice: 600.0,
      tax: "VAT",
      expiry: "2024-12-31",
    },
    {
      id: 2,
      name: "Test Electronics",
      category: "electronics",
      subcategory: "Smartphones",
      unit: "Piece",
      stock: 20,
      reorderPoint: 5,
      costPrice: 200.0,
      salesPrice: 300.0,
      tax: "Sales Tax",
      expiry: "2025-06-30",
    },
  ]);

  // Search state
  const [searchText, setSearchText] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const searchInputRef = useRef(null);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: `Are you sure you want to delete ${record.name}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        const updatedItems = items.filter((item) => item.id !== record.id);
        setItems(updatedItems);
        message.success(`${record.name} has been deleted`);
      },
    });
  };

  const handleView = (record) => {
    Modal.info({
      title: "Item Details",
      content: (
        <div>
          <p>
            <strong>Name:</strong> {record.name}
          </p>
          <p>
            <strong>Category:</strong> {record.category}
          </p>
          <p>
            <strong>Subcategory:</strong> {record.subcategory}
          </p>
          <p>
            <strong>Stock:</strong> {record.stock}
          </p>
          <p>
            <strong>Cost Price:</strong> KES {record.costPrice}
          </p>
          <p>
            <strong>Sales Price:</strong> KES {record.salesPrice}
          </p>
        </div>
      ),
    });
  };

  // Filtered and Searched Data
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchText ||
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase()) ||
        item.subcategory.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory =
        !searchCategory || item.category === searchCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchText, searchCategory]);

  const actionColumn = {
    title: "Actions",
    key: "actions",
    render: (text, record) => (
      <Dropdown
        menu={{
          items: [
            {
              key: "view",
              label: "View Details",
              icon: <EyeOutlined />,
              onClick: () => handleView(record),
            },
            {
              key: "edit",
              label: "Edit",
              icon: <EditOutlined />,
              onClick: () => {
                // Construct edit URL with item details
                const editItemPath = `/additems?id=${record.id}&action=edit`;
                window.location.href = editItemPath;
              },
            },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleDelete(record),
            },
          ],
        }}
      >
        <Button>
          <Space>
            Actions
            <MoreOutlined />
          </Space>
        </Button>
      </Dropdown>
    ),
  };

  const columns = [
    { title: "Item Name", dataIndex: "name", key: "name" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Subcategory", dataIndex: "subcategory", key: "subcategory" },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (text) => (
        <Text type={text < 10 ? "danger" : "success"}>{text}</Text>
      ),
    },
    { title: "Reorder Point", dataIndex: "reorderPoint", key: "reorderPoint" },
    {
      title: "Cost Price",
      dataIndex: "costPrice",
      key: "costPrice",
      render: (text) => `KES ${text.toFixed(2)}`,
    },
    {
      title: "Sales Price",
      dataIndex: "salesPrice",
      key: "salesPrice",
      render: (text) => `KES ${text.toFixed(2)}`,
    },
    actionColumn,
  ];

  const focusSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />

      <Layout className="flex-1 bg-gray-50 ">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content
          className={`transition-all duration-300 p-6 ${
            collapsed ? "ml-0 w-full" : "ml-0 w-full"
          }`}
        >
          <div className="mt-0">
            <Breadcrumb
              className="mb-4"
              items={[
                { title: <Link href="/">Home</Link> },
                { title: "Stock Management" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center mt-4">
              <Title level={4} className="!mb-0 text-blue-800">
                Stock Management
              </Title>
              <Link href="/additems">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="mt-0" // Ensures the button has no additional top margin
                >
                  Add New Item
                </Button>
              </Link>
            </div>
          </div>

          <Card className=" rounded-lg bg-gray-100 max-w-full mb-4">
            <Row gutter={16} className="mb-4">
              <Col xs={24} md={10}>
                <Input
                  ref={searchInputRef}
                  prefix={<SearchOutlined />}
                  placeholder="Search by name, category, or subcategory"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} md={8}>
                <Select
                  placeholder="Filter by Category"
                  style={{ width: "100%" }}
                  value={searchCategory}
                  onChange={(value) => setSearchCategory(value)}
                  allowClear
                >
                  {Object.keys(CATEGORIES).map((category) => (
                    <Option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={6} className="text-right">
                <Button
                  type="default"
                  onClick={() => {
                    setSearchText("");
                    setSearchCategory("");
                    focusSearchInput();
                  }}
                >
                  Reset Filters
                </Button>
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={filteredItems}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                total: filteredItems.length,
              }}
            />
          </Card>
        </Content>

        <Footer />
      </Layout>
    </div>
  );
};

export default StockManagement;

