"use client";
import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  Table,
  Breadcrumb,
  Layout,
  Typography,
  message,
  Modal,
  notification,
  Spin,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import Link from "next/link";

const { Content } = Layout;
const { Title, Text } = Typography;

const AccountList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [items, setItems] = useState([
    {
      id: "0001",
      accountCode: "ACC-001",
      accountType: "Assets",
      reportType: "Balance Sheet",
      description: "Assets.",
    },
    {
      id: "0002",
      accountCode: "ACC-002",
      accountType: "Expenses",
      reportType: "Profit & Loss ( P & L )",
      description: "Expense",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );


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

  const columns = [
    { title: "Account Code", dataIndex: "accountCode", key: "accountCode", sorter: (a, b) => a.accountCode.localeCompare(b.accountCode) },
    { title: "Account Type", dataIndex: "accountType", key: "accountType", sorter: (a, b) => a.accountType.localeCompare(b.accountType) },
    { title: "Report Type", dataIndex: "reportType", key: "reportType", sorter: (a, b) => a.reportType.localeCompare(b.reportType) },
    { title: "Description", dataIndex: "description", key: "description" },
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
                { title: <Link href="/"><HomeOutlined /> Home</Link> },
                { title: "Account  Type List" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Account Type List
              </Title>
              <Text type="secondary">View your Accounts Types</Text>
            </div>
          </div>

          <hr className="mb-4" />

          <Card className="rounded-lg bg-gray-50">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search Account by code | type..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: 750 }}
                />
              </div>
              <div className="flex space-x-4">
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
    </div>
  );
};

export default AccountList;