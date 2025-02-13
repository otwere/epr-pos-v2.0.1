"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Table,
  Breadcrumb,
  Layout,
  Typography,
  message,
  DatePicker,
  Upload,
  Switch,
  Dropdown,
  Menu,
  Modal,
  notification,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  MoreOutlined,
  EyeOutlined,
  HomeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import Link from "next/link";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

const AddNewDocuments = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [items, setItems] = useState([
    {
      id: "0001",
      documentNumber: "DOC-001",
      category: "Document",
      title: "Test Document",
      createdBy: "Admin",
      status: "Active",
      createDate: "01-02-2025",
      expiryDate: "01-02-2026",
      file: "document.pdf",
      description: "This is a sample document.",
    },
    {
      id: "0002",
      documentNumber: "DOC-002",
      category: "Image",
      title: "Test Image",
      createdBy: "User",
      status: "Inactive",
      createDate: "20-12-2025",
      expiryDate: "20-12-2026",
      file: "image.png",
      description: "This is a sample image.",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [categories, setCategories] = useState(["Document", "Image", "Other"]);
  const [newCategory, setNewCategory] = useState("");
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this file?",
      content: "This action cannot be undone.",
      onOk() {
        setLoading(true);
        setTimeout(() => {
          setItems(items.filter((item) => item.id !== id));
          setLoading(false);
          notificationApi.success({
            message: "File Deleted",
            description: "File deleted successfully.",
            placement: "topRight",
          });
        }, 1000);
      },
    });
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete these files?",
      content: "This action cannot be undone.",
      onOk() {
        setLoading(true);
        setTimeout(() => {
          setItems(items.filter((item) => !selectedRowKeys.includes(item.id)));
          setSelectedRowKeys([]);
          setLoading(false);
          notificationApi.success({
            message: "Files Deleted",
            description: "Selected files deleted successfully.",
            placement: "topRight",
          });
        }, 1000);
      },
    });
  };

  const handleSave = (values) => {
    setLoading(true);
    setTimeout(() => {
      const newItem = {
        ...values,
        id: String(items.length + 1).padStart(4, "0"),
        documentNumber: `DOC-${String(items.length + 1).padStart(3, "0")}`,
        createDate: dayjs().format("DD-MM-YYYY"),
        expiryDate: values.expiryDate.format("DD-MM-YYYY"),
        status: "Active",
        createdBy: "Admin",
        file: fileList[0]?.name || "No file uploaded",
      };
      setItems([...items, newItem]);
      notificationApi.success({
        message: "File Added",
        description: "New file added successfully.",
        placement: "topRight",
        className: "bg-green-50",
      });
      setIsFormOpen(false);
      form.resetFields();
      setFileList([]);
      setLoading(false);
    }, 1000);
  };

  const handleStatusChange = (id, checked) => {
    setLoading(true);
    setTimeout(() => {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, status: checked ? "Active" : "Inactive" } : item
      );
      setItems(updatedItems);
      notificationApi.success({
        message: "Status Updated",
        description: "Status updated successfully.",
        placement: "topRight",
        className: "bg-green-50",
      });
      setLoading(false);
    }, 1000);
  };

  const handleViewDocument = (record) => {
    setSelectedDocument(record);
    setIsViewerOpen(true);
  };

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
    notificationApi.success({
      message: "Category Added",
      description: `Category "${newCategory}" added successfully.`,
      placement: "topRight",
      className: "bg-green-50",
    });
  };

  const uploadProps = {
    onRemove: (file) => {
      setFileList((prevList) => prevList.filter((f) => f.uid !== file.uid));
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  const handleEdit = (record) => {
    console.log("Edit record:", record);
  };

  const handleDownload = (record) => {
    const fileUrl = `/path/to/uploaded/files/${record.file}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = record.file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const menu = (record) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleViewDocument(record)}>
        View
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
        Delete
      </Menu.Item>
      <Menu.Item key="download" icon={<DownloadOutlined />} onClick={() => handleDownload(record)}>
        Download
      </Menu.Item>
    </Menu>
  );

  const columns = [
    { title: "Document Number", dataIndex: "documentNumber", key: "documentNumber", sorter: (a, b) => a.documentNumber.localeCompare(b.documentNumber) },
    { title: "File Title", dataIndex: "title", key: "title", sorter: (a, b) => a.title.localeCompare(b.title) },
    { title: "Category", dataIndex: "category", key: "category", sorter: (a, b) => a.category.localeCompare(b.category) },
    { title: "Created By", dataIndex: "createdBy", key: "createdBy", sorter: (a, b) => a.createdBy.localeCompare(b.createdBy) },
    { title: "Create Date", dataIndex: "createDate", key: "createDate", sorter: (a, b) => a.createDate.localeCompare(b.createDate) },
    { title: "Expire Date", dataIndex: "expiryDate", key: "expiryDate", sorter: (a, b) => a.expiryDate.localeCompare(b.expiryDate) },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div className="flex items-center space-x-2">
          <Switch
            checked={status === "Active"}
            onChange={(checked) => handleStatusChange(record.id, checked)}
          />
          <span style={{ color: status === "Active" ? "green" : "red" }}>{status}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_text, record) => (
        <div className="flex space-x-2">
          <Dropdown overlay={menu(record)} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
  };

  useEffect(() => {
    return () => {
      setItems([]);
    };
  }, []);

  return (
    <div className="min-h-screen flex">
      {contextHolder}
      {notificationContextHolder}
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />

      <Layout className="flex-1 bg-gray-100">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="transition-all duration-300 p-6">
          <div className="mt-0">
            <Breadcrumb
              className="mb-4"
              items={[
                { title: <Link href="/Dashboard"><HomeOutlined /> Home</Link> },
                { title: "Add New Document" },
              ]}
            />
            <hr />
            
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Documents List
              </Title>
              <Text type="secondary">Manage and View your Documents</Text>
            </div>
          </div>

          <hr className="mb-4" />

          <Card className="rounded-lg bg-gray-50">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search Document by name | number..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: 750 }}
                />
              </div>
              <div className="flex space-x-4">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsFormOpen(true)}
                >
                  Add New File
                </Button>
                {selectedRowKeys.length > 0 && (
                  <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={handleBulkDelete}
                  >
                    Delete Selected
                  </Button>
                )}
              </div>
            </div>

            <hr />

            <Spin spinning={loading}>
              <Table
                rowSelection={rowSelection}
                dataSource={filteredItems}
                columns={columns}
                rowKey="id"
                pagination={{
                  total: filteredItems.length,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
              />
            </Spin>
          </Card>
        </Content>

        <Footer />
      </Layout>

      {/* Add New File Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <Card className="w-1/2 max-w-3xl">
            <Title level={4} className="mb-4">
              Add New File
            </Title>
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item
                name="title"
                label="File Title"
                rules={[
                  { required: true, message: "Please input the file title" },
                ]}
              >
                <Input placeholder="Enter file title" />
              </Form.Item>
              <Form.Item
                name="category"
                label="Category"
                rules={[
                  { required: true, message: "Please select the category" },
                ]}
              >
                <Select
                  placeholder="Select category"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                        <Input
                          style={{ flex: 'auto' }}
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <Button
                          type="link"
                          onClick={() => {
                            handleAddCategory(newCategory);
                            setNewCategory('');
                          }}>
                          Add Category
                        </Button>
                      </div>
                    </>
                  )}>
                  {categories.map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="expiryDate"
                label="Expire Date"
                rules={[
                  { required: true, message: "Please select the expiry date" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="file"
                label="Upload File"
                rules={[{ required: true, message: "Please upload a file" }]}
              >
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                </Dragger>
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please input the description" },
                ]}
              >
                <Input.TextArea placeholder="Enter description" />
              </Form.Item>
              <div className="flex justify-end space-x-4">
                <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      )}

      {/* Document Viewer Modal */}
      {isViewerOpen && (
        <Modal
          title="View Document"
          open={isViewerOpen}
          onCancel={() => setIsViewerOpen(false)}
          footer={[
            <Button key="close" onClick={() => setIsViewerOpen(false)}>
              Close
            </Button>,
          ]}
          width={800}
        >
          {selectedDocument && (
            <div>
              <Title level={5}>{selectedDocument.title}</Title>
              <Text strong>Category:</Text> {selectedDocument.category}<br />
              <Text strong>Created By:</Text> {selectedDocument.createdBy}<br />
              <Text strong>Create Date:</Text> {selectedDocument.createDate}<br />
              <Text strong>Expire Date:</Text> {selectedDocument.expiryDate}<br />
              <Text strong>Description:</Text> {selectedDocument.description}<br />
              <Text strong>File:</Text> 
              <iframe
                src={`/path/to/uploaded/files/${selectedDocument.file}`}
                width="100%"
                height="500px"
                style={{ border: 'none' }}
                title="Document Viewer"
              />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default AddNewDocuments;