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
  Tag,
  message,
  Dropdown,
  Space,  
} from "antd";
import {
  HomeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  SaveOutlined,
  MoreOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Header from "../Components/HeaderComponent/Header";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const CategoryList = () => {
  const [categories, setCategories] = useState([
    {
      id: "1",
      mainCategory: "Shule Kenya Limited",
      categoryCode: "CT0001",
      subCategoryName: "Test Subcategory",
      description: "",
      status: true,
    },
    {
      id: "2",
      mainCategory: "Example Co",
      categoryCode: "CT0002",
      subCategoryName: "Another Test",
      description: "Sample description",
      status: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const filteredCategories = categories.filter((category) =>
    Object.values(category).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleEdit = (category) => {
    setEditingCategory({ ...category });
    setIsModalOpen(true);
    form.setFieldsValue(category);
  };

  const handleDelete = (record) => {
    setDeletingCategory(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setCategories(categories.filter((category) => category.id !== deletingCategory.id));
    messageApi.success("Category deleted successfully");
    setIsDeleteModalOpen(false);
    setDeletingCategory(null);
  };

  const handleView = (record) => {
    message.info(`Viewing details for ${record.mainCategory}`);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingCategory) {
          setCategories(
            categories.map((category) =>
              category.id === editingCategory.id
                ? { ...editingCategory, ...values }
                : category
            )
          );
          messageApi.success("Category updated successfully");
        } else {
          const newCategory = {
            ...values,
            id: String(categories.length + 1),
            status: true,
          };
          setCategories([...categories, newCategory]);
          messageApi.success("New category added successfully");
        }
        setIsModalOpen(false);
        form.resetFields();
        setEditingCategory(null);
      })
      .catch((error) => console.log("Validation Failed:", error));
  };

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
              onClick: () => handleEdit(record),
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
    { title: "Category ID", dataIndex: "id", key: "id" },
    { title: "Main Category", dataIndex: "mainCategory", key: "mainCategory" },
    { title: "Category Code", dataIndex: "categoryCode", key: "categoryCode" },
    { title: "Sub Category Name", dataIndex: "subCategoryName", key: "subCategoryName" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "green" : "red"}>{status ? "Active" : "Inactive"}</Tag>
      ),
    },
    actionColumn,
  ];

  return (
    <div className="min-h-screen flex">
      {contextHolder}
      <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />

      <Layout className="flex-1 bg-gray-50">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="transition-all duration-300 p-6">
          <div className="mt-0">
          <Breadcrumb
            className="mb-3"
            items={[
              {
                title: (
                  <>
                    <HomeOutlined /> Home
                  </>
                ),
                href: "/",
              },
              { title: "Categories List" },
            ]}
          />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-600 mt-2">
                Categories List
              </Title>
              <Text type="secondary">Manage your categories</Text>
            </div>
          </div>

          <Card className="shadow-sm rounded-lg bg-gray-50">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search categories..."
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
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
              >
                Add Category
              </Button>
            </div>
            <Table
              dataSource={filteredCategories}
              columns={columns}
              rowKey="id"
              pagination={{
                total: filteredCategories.length,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </Card>
        </Content>

        <Footer />
      </Layout>

      <Modal
        title={editingCategory ? "Edit Category" : "Add New Category"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingCategory(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsModalOpen(false);
              form.resetFields();
              setEditingCategory(null);
            }}
          >
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
          initialValues={{
            mainCategory: "",
            categoryCode: "",
            subCategoryName: "",
            description: "",
          }}
        >
          <Form.Item
            name="mainCategory"
            label="Main Category"
            rules={[{ required: true, message: "Please input the main category!" }]}
          >
            <Input placeholder="Enter main category" />
          </Form.Item>
          <Form.Item
            name="categoryCode"
            label="Category Code"
            rules={[{ required: true, message: "Please input the category code!" }]}
          >
            <Input placeholder="Enter category code" />
          </Form.Item>
          <Form.Item
            name="subCategoryName"
            label="Sub Category Name"
            rules={[{ required: true, message: "Please input the subcategory name!" }]}
          >
            <Input placeholder="Enter subcategory name" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Enter description" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingCategory(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setDeletingCategory(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={confirmDelete}
          >
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this category?</p>
      </Modal>
    </div>
  );
};

export default CategoryList;
