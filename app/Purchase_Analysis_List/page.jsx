'use client';
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
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  HomeOutlined,
  SearchOutlined,
  EyeOutlined,
  PrinterOutlined,
  DownloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const PurchaseHistory = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Sample data - replace with actual data from your backend
  const purchaseData = [
    {
      key: '1',
      date: '2024-01-20',
      invoiceNo: 'INV-001',
      supplier: 'Supplier 1',
      items: 5,
      total: 25000,
      status: 'Completed',
      paymentStatus: 'Paid',
    },
    {
      key: '2',
      date: '2024-01-19',
      invoiceNo: 'INV-002',
      supplier: 'Supplier 2',
      items: 3,
      total: 15000,
      status: 'Pending',
      paymentStatus: 'Unpaid',
    },
    // Add more sample data as needed
  ];

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
      filters: [
        { text: 'Supplier 1', value: 'Supplier 1' },
        { text: 'Supplier 2', value: 'Supplier 2' },
      ],
      onFilter: (value, record) => record.supplier.indexOf(value) === 0,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      sorter: (a, b) => a.items - b.items,
    },
    {
      title: 'Total (KES)',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
      render: (total) => `KES ${total.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Completed' ? 'green' : 'gold'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (paymentStatus) => (
        <Tag color={paymentStatus === 'Paid' ? 'green' : 'red'}>
          {paymentStatus}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              icon={<EyeOutlined />} 
              onClick={() => console.log('View details:', record)}
              className="text-blue-600 hover:text-blue-700"
            />
          </Tooltip>
          <Tooltip title="Print Invoice">
            <Button 
              icon={<PrinterOutlined />} 
              onClick={() => console.log('Print invoice:', record)}
              className="text-gray-600 hover:text-gray-700"
            />
          </Tooltip>
          <Tooltip title="Download PDF">
            <Button 
              icon={<DownloadOutlined />} 
              onClick={() => console.log('Download PDF:', record)}
              className="text-green-600 hover:text-green-700"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

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
      (val) => typeof val === 'string' && val.toLowerCase().includes(searchText.toLowerCase())
    );
    const matchesSupplier = !selectedSupplier || item.supplier === selectedSupplier;
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    // Add date range filter logic here when implementing with real data
    return matchesSearch && matchesSupplier && matchesStatus;
  });

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
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
              { title: "Purchase Analysis" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          <Card className="bg-gray-50 rounded-sm">
            <div className="mb-6">
              <Title level={4}>Purchase Analysis</Title>
              <Text type="secondary">View and manage your purchase orders</Text>
            </div>

            <div className="mb-6">
              <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} md={6}>
                  <RangePicker
                    onChange={handleDateRangeChange}
                    className="w-full"
                    placeholder={['Start Date', 'End Date']}
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
                    <Tooltip title="Total value of all purchases">
                      <Title level={5}>Total Purchase Value</Title>
                      <Text className="text-2xl font-semibold">
                        KES {purchaseData.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}
                      </Text>
                    </Tooltip>
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card className="bg-green-50">
                    <Tooltip title="Number of purchase orders">
                      <Title level={5}>Total Orders</Title>
                      <Text className="text-2xl font-semibold">
                        {purchaseData.length}
                      </Text>
                    </Tooltip>
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
              className="shadow-sm"
            />
          </Card>
        </Content>
        <Footer />
      </Layout>
    </div>
  );
};

export default PurchaseHistory;

