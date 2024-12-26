"use client";
import React, { useState } from "react";
import {
  Layout,
  Card,
  Table,
  Typography,
  Breadcrumb,
  Button,
  Dropdown,
  Select,
  Tag,
  Row,
  Col,  
} from "antd";

import {
  HomeOutlined,
  MoreOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const PurchaseReturn = () => {
  const [collapsed, setCollapsed] = useState(false);

  const purchaseData = [
    {
      key: "1",
      purchaseCode: "PC001",
      purchaseDate: "01-12-2024",
      itemName: "Item A",
      purchaseQty: 10,
      total: 25000,
      purchasedPerson: "John Doe",
      returnedBy: "Jane Smith",
      supplier: "Supplier 1",
      status: "Returned",
      resource: "Damaged",
    },
    {
      key: "2",
      purchaseCode: "PC002",
      purchaseDate: "10-12-2024",
      itemName: "Item B",
      purchaseQty: 5,
      total: 15000,
      purchasedPerson: "Alice Johnson",
      returnedBy: "Mark Spencer",
      supplier: "Supplier 2",
      status: "Pending",
      resource: "Excess",
    },
  ];

  const totalReturnedItems = purchaseData.filter(
    (item) => item.status === "Returned"
  ).length;

  const totalValueReturnedItems = purchaseData
    .filter((item) => item.status === "Returned")
    .reduce((sum, item) => sum + item.total, 0);

  const handleResourceChange = (key, newResource) => {
    console.log(`Updated resource for key ${key}: ${newResource}`);
  };

  const columns = [
    {
      title: "#Code",
      dataIndex: "purchaseCode",
      key: "purchaseCode",
    },
    {
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      className: "text-nowrap",
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      className: "text-nowrap",
    },
    {
      title: "Purchase Qty",
      dataIndex: "purchaseQty",
      key: "purchaseQty",
      align: "right",
     
    },
    {
      title: "Total KES",
      dataIndex: "total",
      key: "total",
      render: (price) => `${price.toLocaleString()}`,
      align: "right",
      className: "text-wrap",
    },
    {
      title: "Purchased Person",
      dataIndex: "purchasedPerson",
      key: "purchasedPerson",
      className: "text-nowrap",
    },
    {
      title: "Returned By",
      dataIndex: "returnedBy",
      key: "returnedBy",      
      align: "right",
    },
    
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      className: "text-nowrap",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) =>
        record.status === "Returned" ? (
          <Tag color="green">{record.status}</Tag>
        ) : record.status === "Pending" ? (
          <Tag color="orange">{record.status}</Tag>
        ) : (
          <Tag color="blue">{record.status}</Tag>
        ),
        align:"right",
        
    },
    {
      title: (
        <div style={{ textAlign: "right" }}>
          Reason
        </div>
      ),
      key: "reason",
      render: (_, record) => (
        <Select
          defaultValue={record.resource}
          style={{ width: 105 }}
          onChange={(value) => handleResourceChange(record.key, value)}
        >
          <Option value="Damaged">Damaged</Option>
          <Option value="Excess">Excess</Option>
          <Option value="Other">Other</Option>
        </Select>
      ),
      align: "left",
    },
    
    {
      title: "Action",
      key: "action",
      render: (_) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                icon: <EyeOutlined />,
                label: "View Details",
              },
              {
                key: "2",
                icon: <ReloadOutlined />,
                label: "Process Return",
              },
            ],
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            icon={<MoreOutlined />}
            className="border-none hover:bg-gray-100"
          />
        </Dropdown>
      ),
      align: "right",
    },
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
      />

      <Layout className="flex-1 bg-gray-50">
        <Header
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        />

        <Content className="transition-all duration-300 p-6">
          <Breadcrumb
            items={[
              {
                title: (
                  <span>
                    <HomeOutlined /> Home
                  </span>
                ),
                href: "/",
              },
              { title: "Purchase Return List" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          <div className="mb-2 flex justify-between items-center">
              <Title level={4}>Purchase Return List</Title>
              <Text type="secondary" className="ml-auto">
                View your Purchase Return List
              </Text>             
            </div>
            <hr className="mb-4" />
          <Row gutter={[16, 16]} className="mb-4">
            <Col span={12}>
            <Card className="bg-blue-50">
                <Title level={5}>Total Returned Items</Title>
                <p className="text-xl font-semibold">{totalReturnedItems}</p>
              </Card>
            </Col>
            <Col span={12}>
            <Card className="bg-green-50">
                <Title level={5}>Total Value of Returned Items</Title>
                <p className="text-xl font-semibold">
                  KES {totalValueReturnedItems.toLocaleString()}
                </p>
              </Card>
            </Col>
          </Row>

          <Card className="bg-gray-50 rounded-sm mb-2">            
            <Table
              columns={columns}
              dataSource={purchaseData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              className="shadow-sm"
            />
          </Card>
        </Content>
        <Footer />
      </Layout>
    </div>
  );
};

export default PurchaseReturn;
