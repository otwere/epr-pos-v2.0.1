"use client";
import React, { useState } from "react";
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
  InputNumber,
  Select,
} from "antd";
import {
  HomeOutlined,
  MoreOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
  BarChartOutlined,
  SplitCellsOutlined,
  FileSyncOutlined,
  DeleteOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import { POSProvider } from '../Components/POSContextComponent/POSContext';
import PaymentModal from "../Components/PaymentModelComponent/PaymentModel";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const SalesList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [salesData, setSalesData] = useState([
    {
      key: "1",
      salesDate: "2024-01-20",
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

  const columns = [
    {
      title: "SN",
      dataIndex: "key",
      key: "key",
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: "Sales Date",
      dataIndex: "salesDate",
      key: "salesDate",
      sorter: (a, b) => new Date(a.salesDate) - new Date(b.salesDate),
    },
    {
      title: "Invoice No.",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
      sorter: (a, b) => a.invoiceNo.localeCompare(b.invoiceNo),
    },
    {
      title: "Sales Status",
      dataIndex: "salesStatus",
      key: "salesStatus",
      render: (status) => (
        <Tag color={status === "Completed" ? "green" : "gold"}>{status}</Tag>
      ),
      sorter: (a, b) => a.salesStatus.localeCompare(b.salesStatus),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      sorter: (a, b) => a.createdBy.localeCompare(b.createdBy),
    },
    {
      title: "Total",
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
              { key: "1", icon: <EyeOutlined />, label: "View Sales" },
              { key: "2", icon: <DollarOutlined />, label: "View Payments" },
              record.payStatus === "Unpaid" || record.payStatus === "Partial"
                ? { key: "3", icon: <ShoppingCartOutlined />, label: "Pay Now" }
                : null,
              { key: "4", icon: <FileSyncOutlined />, label: "POS Invoice" },
            ].filter(Boolean),
          }}
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />}></Button>
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
    const uniqueCustomers = new Set(selectedInvoices.map((item) => item.customerName));
    return uniqueCustomers.size === 1;
  };

  const handleBulkPayment = () => {
    if (validateBulkPayment()) {
      setPaymentModalOpen(true);
    } else {
      alert("Bulk payment can only be made for invoices from the same customer.");
    }
  };

  const handlePaymentComplete = () => {
    setPaymentModalOpen(false);
    setSelectedRows([]);
    setPaymentAmount(0);
    setPaymentMode("Cash");
  }

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
          payStatus: item.balance - paymentForInvoice === 0 ? "Paid" : "Partial",
        };
      }
      return item;
    });

    setSalesData(updatedData);
    setPaymentModalOpen(false);
    setSelectedRows([]);
    setPaymentAmount(0);
    setPaymentMode("Cash");
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
                  <span>
                    <HomeOutlined /> Home
                  </span>
                ),
                href: "/",
              },
              { title: "Sales List" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          <Card className="bg-gray-50 rounded-sm">
            <div className="mb-4 flex justify-between items-center">
              <Title level={4}>Sales List</Title>
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
                    Add Sale
                  </Button>
                </Link>
              </div>
            </div>
            <hr className="mb-4" />

            <Table
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              columns={columns}
              dataSource={salesData}
              pagination={{
                pageSize: 5,
              }}
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
          selectedInvoices={salesData.filter((item) => selectedRows.includes(item.key))}
        />
      </Layout>      
    </div>
     </POSProvider>
   
  );
};

export default SalesList;

