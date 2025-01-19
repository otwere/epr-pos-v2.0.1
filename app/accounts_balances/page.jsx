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
  Menu,
  Modal,
  notification,
  Spin,
  DatePicker,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  HomeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For adding tables to the PDF

import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import Link from "next/link";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const AccountBalances = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [items, setItems] = useState([
    {
      id: "0001",
      accountName: "Account 1",
      glCode: "GL0036",
      accountType: "Type 1",
      subAccType: "Sub Type 1",
      accountNumber: "12345",
      isPaymentMethod: false,
      description: "This is a sample account.",
      createdDate: "12-01-2024",
      status: "Active",
      currentBalance: 1000,
    },
    {
      id: "0002",
      accountName: "Account 2",
      glCode: "GL0037",
      accountType: "Type 2",
      subAccType: "Sub Type 2",
      accountNumber: "67890",
      isPaymentMethod: true,
      description: "This is another sample account.",
      createdDate: "11-02-2025",
      status: "Inactive",
      currentBalance: "KES 2,000",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [statementDateRange, setStatementDateRange] = useState({
    fromDate: null,
    toDate: null,
  });

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this account?",
      content: "This action cannot be undone.",
      onOk() {
        setLoading(true);
        setTimeout(() => {
          setItems(items.filter((item) => item.id !== id));
          setLoading(false);
          notificationApi.success({
            message: "Account Deleted",
            description: "Account deleted successfully.",
            placement: "topRight",
          });
        }, 1000);
      },
    });
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete these accounts?",
      content: "This action cannot be undone.",
      onOk() {
        setLoading(true);
        setTimeout(() => {
          setItems(items.filter((item) => !selectedRowKeys.includes(item.id)));
          setSelectedRowKeys([]);
          setLoading(false);
          notificationApi.success({
            message: "Accounts Deleted",
            description: "Selected accounts deleted successfully.",
            placement: "topRight",
          });
        }, 1000);
      },
    });
  };

  const generateGLCode = () => {
    const lastItem = items[items.length - 1];
    const lastGLCode = lastItem
      ? parseInt(lastItem.glCode.replace("GL", ""), 10)
      : 36;
    const newGLCode = `GL${String(lastGLCode + 1).padStart(4, "0")}`;
    return newGLCode;
  };

  const handleSave = (values) => {
    setLoading(true);
    setTimeout(() => {
      const newItem = {
        ...values,
        id: String(items.length + 1).padStart(4, "0"),
        glCode: generateGLCode(),
        createdDate: dayjs().format("DD-MM-YYYY"),
        status: "Active",
      };
      setItems([...items, newItem]);
      notificationApi.success({
        message: "Account Added",
        description: "New account added successfully.",
        placement: "topRight",
        className: "bg-green-50",
      });
      setIsFormOpen(false);
      form.resetFields();
      setLoading(false);
    }, 1000);
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
        className: "bg-green-50",
      });
      setLoading(false);
    }, 1000);
  };

  const handleViewDocument = (record) => {
    setSelectedDocument(record);
    setIsViewerOpen(true);
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

  const handleGenerateStatements = (values) => {
    setLoading(true);
    setTimeout(() => {
      const { fromDate, toDate } = values;
      const selectedItems = items.filter((item) =>
        selectedAccounts.includes(item.id)
      );

      const statements = selectedItems.map((item) => ({
        ...item,
        fromDate: fromDate.format("DD-MMM-YYYY"),
        toDate: toDate.format("DD-MMM-YYYY"),
      }));

      // Export the statements as a PDF
      exportStatements(statements);

      notificationApi.success({
        message: "Statements Generated",
        description: "Statements generated and exported successfully.",
        placement: "topRight",
      });

      setIsFormOpen(false);
      setLoading(false);
    }, 1000);
  };

  const exportStatements = (statements) => {
    // Create a new PDF instance
    const doc = new jsPDF();

    // Add a title to the PDF
    doc.setFontSize(18);
    doc.text("Account Statements", 15, 15);

    // Define columns for the table
    const columns = [
      { header: "Account Name", dataKey: "accountName" },
      { header: "GL Code", dataKey: "glCode" },
      { header: "Account Type", dataKey: "accountType" },
      { header: "Current Balance (KES)", dataKey: "currentBalance" },
      { header: "From Date", dataKey: "fromDate" },
      { header: "To Date", dataKey: "toDate" },
    ];

    // Map statements to the required format for the table
    const rows = statements.map((statement) => ({
      accountName: statement.accountName,
      glCode: statement.glCode,
      accountType: statement.accountType,
      currentBalance: statement.currentBalance,
      fromDate: statement.fromDate,
      toDate: statement.toDate,
    }));

    // Add the table to the PDF
    doc.autoTable({
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => columns.map((col) => row[col.dataKey])),
      startY: 20, // Start the table below the title
    });

    // Save the PDF and trigger download
    doc.save("account_statements.pdf");
  };

  const menu = (record) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<EyeOutlined />}
        onClick={() => handleViewDocument(record)}
      >
        View
      </Menu.Item>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => handleEdit(record)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={() => handleDelete(record.id)}
      >
        Delete
      </Menu.Item>
      <Menu.Item
        key="download"
        icon={<DownloadOutlined />}
        onClick={() => handleDownload(record)}
      >
        Download
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Account Name",
      dataIndex: "accountName",
      key: "accountName",
      sorter: (a, b) => a.accountName.localeCompare(b.accountName),
    },
    {
      title: "Type",
      dataIndex: "accountType",
      key: "accountType",
      sorter: (a, b) => a.accountType.localeCompare(b.accountType),
    },
    {
      title: "Current Balance ( KES )",
      dataIndex: "currentBalance",
      key: "currentBalance",
      sorter: (a, b) => a.currentBalance - b.currentBalance,
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
                { title: "Account Balances" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Account Balances
              </Title>
              <Text type="secondary">List of Charts of Accounts</Text>
            </div>
          </div>

          <hr className="mb-4" />

          <Card className="shadow-sm rounded-lg bg-gray-50">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search Account by name | code..."
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
                  Generate Statements
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

      {/* Add New Account Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <Card className="w-1/2 max-w-3xl">
            <Title level={4} className="mb-4">
              Generate Account Statements
            </Title>

            <hr className="mb-4" />

            <Form form={form} layout="vertical" onFinish={handleGenerateStatements}>
              <Row gutter={16}>
                {/* From Date */}
                <Col span={12}>
                  <Form.Item
                    name="fromDate"
                    label="From Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select the from date",
                      },
                    ]}
                  >
                    <DatePicker
                      format="DD-MMM-YYYY"
                      style={{ width: "100%" }}
                      onChange={(date) =>
                        setStatementDateRange((prev) => ({
                          ...prev,
                          fromDate: date,
                        }))
                      }
                    />
                  </Form.Item>
                </Col>
                {/* To Date */}
                <Col span={12}>
                  <Form.Item
                    name="toDate"
                    label="To Date"
                    rules={[
                      { required: true, message: "Please select the to date" },
                    ]}
                  >
                    <DatePicker
                      format="DD-MMM-YYYY"
                      style={{ width: "100%" }}
                      onChange={(date) =>
                        setStatementDateRange((prev) => ({
                          ...prev,
                          toDate: date,
                        }))
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                {/* Accounts */}
                <Col span={24}>
                  <Form.Item
                    name="accounts"
                    label="Accounts"
                    rules={[
                      { required: true, message: "Please select the accounts" },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select accounts"
                      onChange={(values) => setSelectedAccounts(values)}
                    >
                      {items.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.accountName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <div className="flex justify-end space-x-4">
                <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Generate Statements
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      )}

      {/* Document Viewer Modal */}
      {isViewerOpen && (
        <Modal
          title="View Account"
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
              <Title level={5}>{selectedDocument.accountName}</Title>
              <Text strong>Account Code:</Text> {selectedDocument.glCode}
              <br />
              <Text strong>Account Type:</Text> {selectedDocument.accountType}
              <br />
              <Text strong>Sub Account Type:</Text>{" "}
              {selectedDocument.subAccType}
              <br />
              <Text strong>Account Number:</Text>{" "}
              {selectedDocument.accountNumber}
              <br />
              <Text strong>Is Payment Method?:</Text>{" "}
              {selectedDocument.isPaymentMethod ? "Yes" : "No"}
              <br />
              <Text strong>Description:</Text> {selectedDocument.description}
              <br />
              <Text strong>Created Date:</Text> {selectedDocument.createdDate}
              <br />
              <Text strong>Status:</Text> {selectedDocument.status}
              <br />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default AccountBalances;