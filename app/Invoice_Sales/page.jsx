"use client";
import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import {
  Layout,
  Card,
  Table,
  Typography,
  Breadcrumb,
  Button,
  Tag,
  Dropdown,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  HomeOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  PrinterOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import { POSProvider } from "../Components/POSContextComponent/POSContext";
import PaymentModal from "../Components/PaymentModelComponent/PaymentModel";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const SalesInvoiceList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [invoiceStats, setInvoiceStats] = useState({
    total: { count: 0, amount: 0 },
    paid: { count: 0, amount: 0 },
    unpaid: { count: 0, amount: 0 },
    partial: { count: 0, amount: 0 },
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [salesData, setSalesData] = useState([
    {
      key: "1",
      salesDate: "2024-01-20",
      createdAt: "2024-01-20T10:30:00Z",
      invoiceNo: "INV-001",
      salesStatus: "Completed",
      createdBy: "John Doe",
      total: 25000,
      paidAmt: 25000,
      balance: 0,
      payStatus: "Paid",
      customerName: "Customer 1",
      branch: "Branch A",
    },
    {
      key: "2",
      salesDate: "2024-01-19",
      createdAt: "2024-01-19T14:45:00Z",
      invoiceNo: "INV-002",
      salesStatus: "Pending",
      createdBy: "Jane Smith",
      total: 15000,
      paidAmt: 5000,
      balance: 10000,
      payStatus: "Partial",
      customerName: "Customer 2",
      branch: "Branch B",
    },
    {
      key: "3",
      salesDate: "2024-01-18",
      createdAt: "2024-01-18T09:15:00Z",
      invoiceNo: "INV-003",
      salesStatus: "Pending",
      createdBy: "Mike Johnson",
      total: 30000,
      paidAmt: 0,
      balance: 30000,
      payStatus: "Unpaid",
      customerName: "Customer 3",
      branch: "Branch C",
    },
  ]);

  const [filteredData, setFilteredData] = useState(salesData);

  useEffect(() => {
    updateInvoiceStats();
    updatePagination();
  }, [salesData]);

  useEffect(() => {
    filterData();
  }, [activeFilter, searchTerm, salesData]);

  const updateInvoiceStats = () => {
    const stats = salesData.reduce(
      (acc, invoice) => {
        acc.total.count++;
        acc.total.amount += invoice.total;

        if (invoice.payStatus === "Paid") {
          acc.paid.count++;
          acc.paid.amount += invoice.total;
        } else if (invoice.payStatus === "Partial") {
          acc.partial.count++;
          acc.partial.amount += invoice.balance;
        } else {
          acc.unpaid.count++;
          acc.unpaid.amount += invoice.balance;
        }

        return acc;
      },
      {
        total: { count: 0, amount: 0 },
        paid: { count: 0, amount: 0 },
        unpaid: { count: 0, amount: 0 },
        partial: { count: 0, amount: 0 },
      }
    );

    setInvoiceStats(stats);
  };

  const updatePagination = () => {
    setPagination((prev) => ({
      ...prev,
      total: filteredData.length,
    }));
  };

  const filterData = () => {
    let filtered = salesData;

    // Apply status filter
    if (activeFilter === "paid") {
      filtered = filtered.filter((invoice) => invoice.payStatus === "Paid");
    } else if (activeFilter === "unpaid") {
      filtered = filtered.filter((invoice) => invoice.payStatus === "Unpaid");
    } else if (activeFilter === "partial") {
      filtered = filtered.filter((invoice) => invoice.payStatus === "Partial");
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.total.toString().includes(searchTerm)
      );
    }

    setFilteredData(filtered);
    updatePagination();
  };

  const columns = [
    {
      title: "SN",
      dataIndex: "key",
      key: "key",
      sorter: (a, b) => a.key - b.key,
    },
    // {
    //   title: "Invoice Date",
    //   dataIndex: "salesDate",
    //   key: "salesDate",
    //   sorter: (a, b) => new Date(a.salesDate) - new Date(b.salesDate),
    // },
    {
      title: "Invoice Date",
      dataIndex: "salesDate",
      key: "salesDate",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Invoice No.",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
      sorter: (a, b) => a.invoiceNo.localeCompare(b.invoiceNo),
    },
    {
      title: "Created by",
      dataIndex: "createdBy",
      key: "createdBy",
      sorter: (a, b) => a.createdBy.localeCompare(b.createdBy),
    },
    {
      title: "Invoice Amt",
      dataIndex: "total",
      key: "total",
      render: (total) => `KES ${total.toLocaleString()}`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Paid Amt",
      dataIndex: "paidAmt",
      key: "paidAmt",
      render: (paidAmt) => `KES ${paidAmt.toLocaleString()}`,
      sorter: (a, b) => a.paidAmt - b.paidAmt,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (balance) => `KES ${balance.toLocaleString()}`,
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: "Pay Status",
      dataIndex: "payStatus",
      key: "payStatus",
      render: (status) => (
        <Tag
          color={
            status === "Paid" ? "green" : status === "Unpaid" ? "red" : "orange"
          }
        >
          {status}
        </Tag>
      ),
      sorter: (a, b) => a.payStatus.localeCompare(b.payStatus),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      sorter: (a, b) => a.branch.localeCompare(b.branch),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                icon: <EyeOutlined />,
                label: "View Invoice",
                onClick: () => handleViewInvoice(record),
              },
              {
                key: "2",
                icon: <EditOutlined />,
                label: "Edit Invoice",
                onClick: () => handleEditInvoice(record),
              },
              {
                key: "3",
                icon: <DeleteOutlined />,
                label: "Delete Invoice",
                onClick: () => handleDeleteInvoice(record),
              },
              {
                key: "4",
                icon: <DollarOutlined />,
                label: "View Payments",
                onClick: () => handleViewPayments(record),
              },
              record.payStatus === "Unpaid" || record.payStatus === "Partial"
                ? {
                    key: "5",
                    icon: <ShoppingCartOutlined />,
                    label: "Pay Now",
                    onClick: () => handlePayNow(record),
                  }
                : null,
              {
                key: "6",
                icon: <PrinterOutlined />,
                label: "Print A4 Size",
                onClick: () => handlePrintInvoice(record),
              },
            ].filter(Boolean),
          }}
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRows(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.payStatus === "Paid", // Disable selection for paid rows
    }),
  };

  const validateBulkPayment = () => {
    const selectedInvoices = salesData.filter((item) =>
      selectedRows.includes(item.key)
    );
    const uniqueCustomers = new Set(
      selectedInvoices.map((item) => item.customerName)
    );
    return uniqueCustomers.size === 1;
  };

  const handleBulkPayment = () => {
    if (validateBulkPayment()) {
      setPaymentModalOpen(true);
    } else {
      message.error(
        "Bulk payment can only be made for invoices from the same customer."
      );
    }
  };

  const handlePaymentComplete = () => {
    setPaymentModalOpen(false);
    setSelectedRows([]);
    setPaymentAmount(0);
    setPaymentMode("Cash");
    message.success("Payment processed successfully");
  };

  const processBulkPayment = () => {
    const selectedInvoices = salesData.filter((item) =>
      selectedRows.includes(item.key)
    );
    let remainingAmount = paymentAmount;

    const updatedData = salesData.map((item) => {
      if (selectedRows.includes(item.key)) {
        const paymentForInvoice = Math.min(remainingAmount, item.balance);
        remainingAmount -= paymentForInvoice;
        return {
          ...item,
          paidAmt: item.paidAmt + paymentForInvoice,
          balance: item.balance - paymentForInvoice,
          payStatus:
            item.balance - paymentForInvoice === 0 ? "Paid" : "Partial",
        };
      }
      return item;
    });

    setSalesData(updatedData);
    setPaymentModalOpen(false);
    setSelectedRows([]);
    setPaymentAmount(0);
    setPaymentMode("Cash");
    message.success("Bulk payment processed successfully");
  };

  const handleViewInvoice = (record) => {
    Modal.info({
      title: `Invoice Details - ${record.invoiceNo}`,
      content: (
        <div>
          <p>Customer: {record.customerName}</p>
          <p>Date: {record.salesDate}</p>
          <p>Created At: {new Date(record.createdAt).toLocaleString()}</p>
          <p>Total Amount: KES {record.total.toLocaleString()}</p>
          <p>Paid Amount: KES {record.paidAmt.toLocaleString()}</p>
          <p>Balance: KES {record.balance.toLocaleString()}</p>
          <p>Status: {record.payStatus}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const handleEditInvoice = (record) => {
    setCurrentInvoice(record);
    form.setFieldsValue(record);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (values) => {
    const updatedData = salesData.map((item) =>
      item.key === currentInvoice.key ? { ...item, ...values } : item
    );
    setSalesData(updatedData);
    setEditModalOpen(false);
    message.success("Invoice updated successfully");
  };

  const handleDeleteInvoice = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this invoice?",
      content: "This action cannot be undone.",
      onOk() {
        const updatedData = salesData.filter((item) => item.key !== record.key);
        setSalesData(updatedData);
        message.success("Invoice deleted successfully");
      },
      onCancel() {},
    });
  };

  const handleViewPayments = (record) => {
    Modal.info({
      title: `Payment History - ${record.invoiceNo}`,
      content: (
        <div>
          <p>Total Amount: KES {record.total.toLocaleString()}</p>
          <p>Paid Amount: KES {record.paidAmt.toLocaleString()}</p>
          <p>Balance: KES {record.balance.toLocaleString()}</p>
          <p>Status: {record.payStatus}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const handlePayNow = (record) => {
    if (record.payStatus === "Unpaid" || record.payStatus === "Partial") {
      setCurrentInvoice(record);
      setPaymentAmount(record.balance);
      setPaymentModalOpen(true);
    } else {
      message.info("This invoice is already fully paid.");
    }
  };

  const handlePrintInvoice = (record) => {
    message.info(`Printing invoice ${record.invoiceNo} in A4 size`);
    // Implement actual printing logic here
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <POSProvider>
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
                    <Link href="/Dashboard">
                      <HomeOutlined /> Home
                    </Link>
                  ),
                },
                { title: "Invoices List" },
              ]}
              className="mb-3"
            />
            <hr className="mb-4" />

            <Card className="bg-gray-50 rounded-sm">
              <div className="mb-4 flex justify-between items-center">
                <Title level={4}>Invoices Sales List</Title>
                <div className="flex gap-4">
                  <Button
                    type="primary"
                    onClick={handleBulkPayment}
                    disabled={!selectedRows.length}
                  >
                    Make Bulk Payment
                  </Button>
                  <Link href="/pos">
                    <Button type="primary" icon={<PlusCircleOutlined />}>
                      Add New Invoice
                    </Button>
                  </Link>
                </div>
              </div>
              <hr className="mb-4" />

              <Row gutter={16} className="mb-4 font-bold">
                <Col span={6}>
                  <Card
                    className={`bg-blue-50  cursor-pointer transform transition-transform duration-300 hover:scale-95 ${
                      activeFilter === "all" ? "border-blue-500 border-2" : ""
                    }`}
                    onClick={() => handleFilterChange("all")}
                  >
                    <Statistic
                      title=" Invoices | Total Invoices Amount"
                      value={invoiceStats.total.count}
                      suffix={` | KES : ${invoiceStats.total.amount.toLocaleString()}`}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card
                    className={`bg-green-50  cursor-pointer transform transition-transform duration-300 hover:scale-95 ${
                      activeFilter === "paid" ? "border-green-500 border-2" : ""
                    }`}
                    onClick={() => handleFilterChange("paid")}
                  >
                    <Statistic
                      title=" Fully Paid Invoices | Amount Paid"
                      value={invoiceStats.paid.count}
                      suffix={` | KES : ${invoiceStats.paid.amount.toLocaleString()}`}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card
                    className={`bg-orange-50  cursor-pointer transform transition-transform duration-300 hover:scale-95 ${
                      activeFilter === "partial" ? "border-orange-500 border-2" : ""
                    }`}
                    onClick={() => handleFilterChange("partial")}
                  >
                    <Statistic
                      title="Partially Paid Invoices | Balance Due"
                      value={invoiceStats.partial.count}
                      suffix={` | KES : ${invoiceStats.partial.amount.toLocaleString()}`}
                      valueStyle={{ color: "#faad14" }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card
                    className={`bg-red-50  cursor-pointer transform transition-transform duration-300 hover:scale-95 ${
                      activeFilter === "unpaid" ? "border-red-500 border-2" : ""
                    }`}
                    onClick={() => handleFilterChange("unpaid")}
                  >
                    <Statistic
                      title="Unpaid Invoices | Balance Due"
                      value={invoiceStats.unpaid.count}
                      suffix={` | KES : ${invoiceStats.unpaid.amount.toLocaleString()}`}
                      valueStyle={{ color: "#ff4d4f" }}
                    />
                  </Card>
                </Col>
              </Row>

              <Input
                placeholder="Search by customer name, invoice number, or total amount"
                prefix={<SearchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ marginBottom: 16 }}
              />

              <hr />

              <Table
                rowSelection={{
                  type: "checkbox",
                  ...rowSelection,
                }}
                columns={columns}
                dataSource={filteredData}
                pagination={pagination}
                onChange={handleTableChange}
              />
            </Card>
          </Content>
          <Footer />
          <PaymentModal
            open={paymentModalOpen}
            onClose={() => setPaymentModalOpen(false)}
            isProcessing={isProcessingPayment}
            setIsProcessing={setIsProcessingPayment}
            onPaymentComplete={handlePaymentComplete}
            selectedInvoices={salesData.filter((item) =>
              selectedRows.includes(item.key)
            )}
          />
          <Modal
            title="Edit Invoice"
            open={editModalOpen}
            onCancel={() => setEditModalOpen(false)}
            footer={null}
          >
            <Form form={form} onFinish={handleEditSubmit} layout="vertical">
              <Form.Item name="customerName" label="Customer Name">
                <Input />
              </Form.Item>
              <Form.Item name="total" label="Invoice Amount">
                <InputNumber
                  formatter={(value) =>
                    `KES ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/KES\s?|(,*)/g, "")}
                />
              </Form.Item>
              <Form.Item name="paidAmt" label="Paid Amount">
                <InputNumber
                  formatter={(value) =>
                    `KES ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/KES\s?|(,*)/g, "")}
                />
              </Form.Item>
              <Form.Item name="payStatus" label="Payment Status">
                <Select>
                  <Option value="Paid">Paid</Option>
                  <Option value="Partial">Partial</Option>
                  <Option value="Unpaid">Unpaid</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Invoice
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Layout>
      </div>
    </POSProvider>
  );
};

export default SalesInvoiceList;
