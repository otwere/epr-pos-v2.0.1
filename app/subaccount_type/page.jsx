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
  Divider,
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

const AddSubAccountType = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [items, setItems] = useState([
    {
      id: "0001",
      subAccountCode: "SAC-001",
      subAccountName: "Sub Account 1",
      accountType: "Type A",
      description: "This is a sample sub-account.",
      status: "Active",
      createdBy: "Admin",
      createDate: "2023-10-01",
      expiryDate: "2023-12-31",
      file: "document.pdf",
    },
    {
      id: "0002",
      subAccountCode: "SAC-002",
      subAccountName: "Sub Account 2",
      accountType: "Type B",
      description: "This is another sample sub-account.",
      status: "Inactive",
      createdBy: "User",
      createDate: "2023-10-02",
      expiryDate: "2024-01-15",
      file: "image.png",
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

  const generateSubAccountCode = () => {
    const lastCode = items.length > 0 ? items[items.length - 1].subAccountCode : "SAC-000";
    const lastNumber = parseInt(lastCode.split("-")[1], 10);
    const nextNumber = lastNumber + 1;
    return `SAC-${String(nextNumber).padStart(3, "0")}`;
  };

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

  const handleSave = async (values) => {
    setLoading(true);

    // Validate file upload
    if (fileList.length === 0) {
      notificationApi.error({
        message: "File Upload Required",
        description: "Please upload a file before saving.",
        placement: "topRight",
        className: "bg-red-50",
      });
      setLoading(false);
      return;
    }

    try {
      // Simulate an API call or file upload process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newItem = {
        ...values,
        id: String(items.length + 1).padStart(4, "0"),
        subAccountCode: generateSubAccountCode(), // Auto-generate Sub Account Code
        subAccountName: values.subAccountName,
        accountType: values.accountType,
        description: values.description,
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
    } catch (error) {
      notificationApi.error({
        message: "Error",
        description: "An error occurred while saving the file. Please try again.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, checked) => {
    setLoading(true);
    setTimeout(() => {
      const updatedItems = items.map((item) =>
        item.id === id
          ? { ...item, status: checked ? "Active" : "Inactive" }
          : item
      );
      setItems(updatedItems);
      notificationApi.success({
        message: "Status Updated",
        description: "Status updated successfully.",
        placement: "topRight",
        className: "bg-green-100",
      });
      setLoading(false);
    }, 1000);
  };

  const handleViewDocument = (record) => {
    setSelectedDocument(record);
    setIsViewerOpen(true);
  };

  const handleAddCategory = (newCategory) => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      notificationApi.success({
        message: "Category Added",
        description: `Category "${newCategory}" added successfully.`,
        placement: "topRight",
      });
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      setFileList((prevList) => prevList.filter((f) => f.uid !== file.uid));
    },
    beforeUpload: (file) => {
      const isFileValid = file.type === "application/pdf" || file.type.startsWith("image/");
      if (!isFileValid) {
        notificationApi.error({
          message: "Invalid File Type",
          description: "Please upload a PDF or image file.",
          placement: "topRight",
        });
        return false;
      }
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

  const menuItems = (record) => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "View",
      onClick: () => handleViewDocument(record),
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit",
      onClick: () => handleEdit(record),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete",
      onClick: () => handleDelete(record.id),
    },
    {
      key: "download",
      icon: <DownloadOutlined />,
      label: "Download",
      onClick: () => handleDownload(record),
    },
  ];

  const columns = [
    {
      title: "Sub Account Code",
      dataIndex: "subAccountCode",
      key: "subAccountCode",
      sorter: (a, b) => (a.subAccountCode || "").localeCompare(b.subAccountCode || ""),
    },
    {
      title: "Sub Account Name",
      dataIndex: "subAccountName",
      key: "subAccountName",
      sorter: (a, b) => (a.subAccountName || "").localeCompare(b.subAccountName || ""),
    },
    {
      title: "Account Type",
      dataIndex: "accountType",
      key: "accountType",
      sorter: (a, b) => (a.accountType || "").localeCompare(b.accountType || ""),
    },
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
          <span style={{ color: status === "Active" ? "green" : "red" }}>
            {status}
          </span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_text, record) => (
        <div className="flex space-x-2">
          <Dropdown overlay={<Menu items={menuItems(record)} />} trigger={["click"]}>
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
                {
                  title: (
                    <Link href="/">
                      <HomeOutlined /> Home
                    </Link>
                  ),
                },
                { title: "Add Sub Account Type" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Add Sub Account Type
              </Title>
              <Text type="secondary">Manage and View your Documents</Text>
            </div>
          </div>

          <hr className="mb-4" />

          <Card className="shadow-sm rounded-lg bg-gray-50">
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
                  Add Sub Account Type
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
              Add Sub Account Type
            </Title>
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item
                name="accountType"
                label="Account Type"
                rules={[
                  { required: true, message: "Please select the account type" },
                ]}
              >
                <Select placeholder="Select account type">
                  <Option value="Type A">Type A</Option>
                  <Option value="Type B">Type B</Option>
                  <Option value="Type C">Type C</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="subAccountName"
                label="Sub Account Name"
                rules={[
                  {
                    required: true,
                    message: "Please input the sub-account name",
                  },
                ]}
              >
                <Input placeholder="Enter sub-account name" />
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

              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Please select or add a category" }]}
              >
                <Select
                  placeholder="Select or add a category"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <div style={{ padding: "0 8px" }}>
                        <Input
                          placeholder="Add new category"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onPressEnter={() => {
                            if (newCategory.trim()) {
                              handleAddCategory(newCategory);
                              setNewCategory("");
                            }
                          }}
                        />
                      </div>
                    </>
                  )}
                >
                  {categories.map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="expiryDate"
                label="Expiry Date"
                rules={[
                  { required: true, message: "Please select the expiry date" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
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
                  <p className="ant-upload-hint">
                    Support for a single file upload (PDF or Image).
                  </p>
                </Dragger>
              </Form.Item>

              <div className="flex justify-end space-x-4">
                <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
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
            <Button
              key="download"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(selectedDocument)}
            >
              Download
            </Button>,
          ]}
          width={800}
        >
          {selectedDocument && (
            <div>
              <Title level={5}>{selectedDocument.subAccountName}</Title>
              <Text strong>Category:</Text> {selectedDocument.category}
              <br />
              <Text strong>Created By:</Text> {selectedDocument.createdBy}
              <br />
              <Text strong>Create Date:</Text> {selectedDocument.createDate}
              <br />
              <Text strong>Expire Date:</Text> {selectedDocument.expiryDate}
              <br />
              <Text strong>Description:</Text> {selectedDocument.description}
              <br />
              <Text strong>File:</Text>
              {selectedDocument.file.endsWith(".pdf") ? (
                <iframe
                  src={`/path/to/uploaded/files/${selectedDocument.file}`}
                  width="100%"
                  height="500px"
                  style={{ border: "none" }}
                  title="Document Viewer"
                />
              ) : (
                <img
                  src={`/path/to/uploaded/files/${selectedDocument.file}`}
                  alt="Document"
                  style={{ maxWidth: "100%", maxHeight: "500px" }}
                />
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default AddSubAccountType;