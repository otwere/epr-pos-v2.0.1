"use client";
import React, { useState } from "react";
import {
  Layout,
  Card,
  Table,
  Typography,
  Breadcrumb,
  DatePicker,
  Select,
  Button,
  Input,
  Space,
  Tag,
  Row,
  Col,
  Dropdown,
} from "antd";
import {
  HomeOutlined,
  SearchOutlined,
  MoreOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const PurchaseList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const purchaseData = [
    {
      key: "1",
      purchaseDate: "2024-01-20",
      purchaseCode: "PO-001",
      purchaseStatus: "Completed",
      referenceNo: "REF001",
      supplierName: "Supplier 1",
      total: 25000,
      paidAmount: 25000,
      balance: 0,
      paymentStatus: "Paid",
      createdBy: "John Doe"
    },
    {
      key: "2",
      purchaseDate: "2024-01-19",
      purchaseCode: "PO-002",
      purchaseStatus: "Pending",
      referenceNo: "REF002",
      supplierName: "Supplier 2",
      total: 15000,
      paidAmount: 5000,
      balance: 10000,
      paymentStatus: "Partial",
      createdBy: "Jane Smith"
    },
    {
      key: "3",
      purchaseDate: "2024-01-18",
      purchaseCode: "PO-003",
      purchaseStatus: "Pending",
      referenceNo: "REF003",
      supplierName: "Supplier 3",
      total: 30000,
      paidAmount: 0,
      balance: 30000,
      paymentStatus: "Unpaid",
      createdBy: "Mike Johnson"
    },
  ];

  const columns = [
    {
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      sorter: (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate),
    },
    {
      title: "Purchase Code",
      dataIndex: "purchaseCode",
      key: "purchaseCode",
    },
    {
      title: "Purchase Status",
      dataIndex: "purchaseStatus",
      key: "purchaseStatus",
      render: (status) => (
        <Tag color={status === "Completed" ? "green" : "gold"}>{status}</Tag>
      ),
    },
    {
      title: "Reference No",
      dataIndex: "referenceNo",
      key: "referenceNo",
    },
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName",
      filters: [
        { text: "Supplier 1", value: "Supplier 1" },
        { text: "Supplier 2", value: "Supplier 2" },
        { text: "Supplier 3", value: "Supplier 3" },
      ],
      onFilter: (value, record) => record.supplierName.indexOf(value) === 0,
    },
    {
      title: "Total (KES)",
      dataIndex: "total",
      key: "total",
      sorter: (a, b) => a.total - b.total,
      render: (total) => `KES ${total.toLocaleString()}`,
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
      sorter: (a, b) => a.paidAmount - b.paidAmount,
      render: (amount) => `KES ${amount.toLocaleString()}`,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      sorter: (a, b) => a.balance - b.balance,
      render: (balance) => `KES ${balance.toLocaleString()}`,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => {
        const color = {
          Paid: "green",
          Unpaid: "red",
          Partial: "orange",
        }[status];
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const items = [
          {
            key: '1',
            icon: <EyeOutlined />,
            label: 'View Purchase',
            onClick: () => handleViewPurchase(record),
          },
          {
            key: '2',
            icon: <ShoppingCartOutlined />,
            label: 'Receive Purchase',
            onClick: () => handleReceivePurchase(record),
          },
          {
            key: '3',
            icon: <DollarOutlined />,
            label: 'View Payments',
            onClick: () => handleViewPayments(record),
          },
          {
            key: '4',
            icon: <FileTextOutlined />,
            label: 'Purchase Order',
            onClick: () => handlePurchaseOrder(record),
          },
          {
            key: '5',
            icon: <PlusCircleOutlined />,
            label: 'Add Expense',
            onClick: () => handleAddExpense(record),
          },
          {
            key: '6',
            icon: <BarChartOutlined />,
            label: 'View Expense',
            onClick: () => handleViewExpense(record),
          },
        ];

        return (
          <Dropdown
            menu={{ 
              items,
              className: "w-40"
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button 
              icon={<MoreOutlined />} 
              className="border-none hover:bg-gray-100"
            />
          </Dropdown>
        );
      },
    },
  ];

  const handleViewPurchase = (record) => {
    console.log('View purchase:', record);
  };

  const handleReceivePurchase = (record) => {
    console.log('Receive purchase:', record);
  };

  const handleViewPayments = (record) => {
    console.log('View payments:', record);
  };

  const handlePurchaseOrder = (record) => {
    console.log('Purchase order:', record);
  };

  const handleAddExpense = (record) => {
    console.log('Add expense:', record);
  };

  const handleViewExpense = (record) => {
    console.log('View expense:', record);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleSupplierChange = (value) => {
    setSelectedSupplier(value);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const filteredData = purchaseData.filter((item) => {
    const matchesSearch = Object.values(item).some(
      (val) =>
        typeof val === "string" &&
        val.toLowerCase().includes(searchText.toLowerCase())
    );
    const matchesSupplier =
      !selectedSupplier || item.supplierName === selectedSupplier;
    const matchesStatus = !selectedStatus || item.purchaseStatus === selectedStatus;

    if (dateRange) {
      const purchaseDate = new Date(item.purchaseDate);
      const startDate = dateRange[0]?.toDate();
      const endDate = dateRange[1]?.toDate();
      const matchesDate = (!startDate || purchaseDate >= startDate) && 
                         (!endDate || purchaseDate <= endDate);
      return matchesSearch && matchesSupplier && matchesStatus && matchesDate;
    }

    return matchesSearch && matchesSupplier && matchesStatus;
  });

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const getTotalPurchaseValue = () => {
    return filteredData.reduce((acc, curr) => acc + curr.total, 0);
  };

  const getTotalOrders = () => {
    return filteredData.length;
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />

      <Layout className="flex-1 bg-gray-50">
        <Header collapsed={collapsed} onCollapse={toggleCollapsed} />

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
              { title: "Purchase List" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          <Card className="bg-gray-50 rounded-sm">
            <div className="mb-4 flex justify-between items-center">
              <Title level={4}>Purchase List</Title>
              <Text type="secondary" className="ml-auto">
                View your Purchase List
              </Text>             
            </div>
            <hr className="mb-4" />

            <div className="mb-6">
              <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} md={6}>
                  <RangePicker
                    onChange={handleDateRangeChange}
                    className="w-full"
                    placeholder={["Start Date", "End Date"]}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Select
                    placeholder="Select Supplier"
                    onChange={handleSupplierChange}
                    allowClear
                    className="w-full"
                  >
                    <Option value="Supplier 1">Supplier 1</Option>
                    <Option value="Supplier 2">Supplier 2</Option>
                    <Option value="Supplier 3">Supplier 3</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Select
                    placeholder="Status"
                    onChange={handleStatusChange}
                    allowClear
                    className="w-full"
                  >
                    <Option value="Completed">Completed</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Partial">Partial</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Input
                    placeholder="Search purchases..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full"
                  />
                </Col>
              </Row>

              <Row gutter={16} className="mb-4">
                <Col xs={24} sm={12}>
                  <Card className="bg-blue-50">
                    <Title level={5}>Total Purchase Value</Title>
                    <Text className="text-2xl font-semibold">
                      KES {getTotalPurchaseValue().toLocaleString()}
                    </Text>
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card className="bg-green-50">
                    <Title level={5}>Total Orders</Title>
                    <Text className="text-2xl font-semibold">
                      {getTotalOrders()}
                    </Text>
                  </Card>
                </Col>
              </Row>
            </div>

            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{
                total: filteredData.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              className=""
            />
          </Card>
        </Content>
        <Footer />
      </Layout>
    </div>
  );
};

export default PurchaseList;
