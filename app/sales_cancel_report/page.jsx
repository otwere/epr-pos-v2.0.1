"use client";
import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Table,
  Breadcrumb,
  Layout,
  Typography,
  DatePicker,
  Spin,
  Collapse,
  notification,
  Row,
  Col,
  Input,
  Select,
  Statistic,
  Dropdown,
  Menu,
  Tag,
  Modal,
} from "antd";
import {
  FilterOutlined,
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  SearchOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

import Link from "next/link";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

// Modern corporate color palette
const colors = {
  primary: "#1890ff", // Blue
  secondary: "#f0f2f5", // Light gray
  accent: "#13c2c2", // Teal
  background: "#ffffff", // White
  text: "#262626", // Dark gray
  success: "#52c41a", // Green
  warning: "#faad14", // Yellow
  error: "#ff4d4f", // Red
};

// Mock data for Sales Cancelled Report
const mockSalesCancelledData = [
  {
    id: "C001",
    branch: "Nairobi",
    invoiceNumber: "INV-001",
    itemName: "Product A",
    salesDate: "2025-01-25 14:30:00",
    cancellationDate: "2025-01-26 10:00:00", // New field for cancellation date
    customerName: "John Doe",
    qty: 10,
    price: 1500.0,
    total: 15000.0,
    status: "Pending", // New field for approval status
    rejectReason: "", // New field for rejection reason
    salesPerson: "Alice Johnson", // New field for sales person
  },
  {
    id: "C002",
    branch: "Mombasa",
    invoiceNumber: "INV-002",
    itemName: "Product B",
    salesDate: "2025-01-26 10:15:00",
    cancellationDate: "2025-01-27 09:30:00", // New field for cancellation date
    customerName: "Jane Smith",
    qty: 5,
    price: 2000.0,
    total: 10000.0,
    status: "Pending", // New field for approval status
    rejectReason: "", // New field for rejection reason
    salesPerson: "Bob Williams", // New field for sales person
  },
  {
    id: "C003",
    branch: "Kisumu",
    invoiceNumber: "INV-003",
    itemName: "Product C",
    salesDate: "2025-01-27 16:45:00",
    cancellationDate: "2025-01-28 14:00:00", // New field for cancellation date
    customerName: "Peter Parker",
    qty: 8,
    price: 2500.0,
    total: 20000.0,
    status: "Pending", // New field for approval status
    rejectReason: "", // New field for rejection reason
    salesPerson: "Charlie Brown", // New field for sales person
  },
  {
    id: "C004",
    branch: "Nakuru",
    invoiceNumber: "INV-004",
    itemName: "Product D",
    salesDate: "2025-01-28 09:00:00",
    cancellationDate: "2025-01-29 11:00:00", // New field for cancellation date
    customerName: "Clark Kent",
    qty: 12,
    price: 3000.0,
    total: 36000.0,
    status: "Pending", // New field for approval status
    rejectReason: "", // New field for rejection reason
    salesPerson: "Diana Prince", // New field for sales person
  },
  {
    id: "C005",
    branch: "Eldoret",
    invoiceNumber: "INV-005",
    itemName: "Product E",
    salesDate: "2025-01-29 12:00:00",
    cancellationDate: "2025-01-30 13:00:00", // New field for cancellation date
    customerName: "Bruce Wayne",
    qty: 15,
    price: 3500.0,
    total: 52500.0,
    status: "Pending", // New field for approval status
    rejectReason: "", // New field for rejection reason
    salesPerson: "Eve Adams", // New field for sales person
  },
];

const SalesCancelled = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs("2025-01-20"),
    toDate: dayjs("2025-01-31"),
    itemName: null,
    customerName: null,
    salesPerson: null, // New filter for Sales Person
  });
  const [salesCancelledData, setSalesCancelledData] = useState(mockSalesCancelledData);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleFilterChange = (_changedValues, allValues) => {
    const { fromDate, toDate } = allValues;

    if (fromDate && toDate && fromDate.isAfter(toDate)) {
      notificationApi.error({
        message: "Invalid Date Range",
        description: "The 'From Date' cannot be after the 'To Date'.",
        placement: "topRight",
        className: "bg-red-50",
      });
      return;
    }

    setFilters({
      ...filters,
      ...allValues,
    });
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const generateReport = () => {
    const { fromDate, toDate, itemName, customerName, salesPerson } = form.getFieldsValue();

    if (!fromDate || !toDate) {
      notificationApi.error({
        message: "Date Selection Required",
        description:
          "Please select both 'From Date' and 'To Date' to generate the report.",
        placement: "topRight",
        className: "bg-red-50",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const filteredData = mockSalesCancelledData.filter((item) => {
        const itemDate = dayjs(item.salesDate);
        const matchesItemName = !itemName || itemName === "All" || item.itemName === itemName;
        const matchesCustomerName = !customerName || customerName === "All" || item.customerName === customerName;
        const matchesSalesPerson = !salesPerson || salesPerson === "All" || item.salesPerson === salesPerson; // New filter condition
        return (
          itemDate.isAfter(fromDate.subtract(1, "day")) &&
          itemDate.isBefore(toDate.add(1, "day")) &&
          matchesItemName &&
          matchesCustomerName &&
          matchesSalesPerson // Include Sales Person filter
        );
      });

      if (filteredData.length === 0) {
        notificationApi.warning({
          message: "No Data Found",
          description: "No sales cancelled data found for the selected filters.",
          placement: "topRight",
          className: "bg-yellow-50",
        });
      }

      setSalesCancelledData(filteredData);
      setLoading(false);
      setIsReportOpen(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Sales Cancelled Report generated successfully.",
        placement: "topRight",
        className: "bg-green-50",
      });
    }, 1000);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ format: "a4" });

    const brandColors = {
      primary: "#1a237e",
      secondary: "#303f9f",
      accent: "#3949ab",
      gray: "#757575",
      lightGray: "#f5f5f5",
    };

    const margin = { top: 20, left: 20, right: 20 };

    doc.setFillColor(brandColors.primary);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");

    doc.setTextColor("#FFFFFF");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Snave Webhub Africa", 70, 20);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Sales Cancelled Report", 70, 30);

    doc.setTextColor(brandColors.primary);
    doc.setFontSize(12);
    doc.roundedRect(
      margin.left,
      50,
      doc.internal.pageSize.width - 40,
      35,
      3,
      3,
      "S"
    );

    doc.setFont("helvetica", "bold");
    doc.text(" Sales Cancelled Report Information", margin.left + 5, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(brandColors.gray);
    doc.text(
      `From: ${filters.fromDate.format(
        "DD-MM-YYYY"
      )} To: ${filters.toDate.format("DD-MM-YYYY")}`,
      margin.left + 5,
      70
    );
    doc.text(`Generated : ${reportGeneratedTime}`, margin.left + 5, 80);
    doc.text(
      `Generated by : ${generatedBy}`,
      doc.internal.pageSize.width - 80,
      80
    );

    // Add Sales Cancelled Table to PDF
    doc.autoTable({
      startY: 100,
      head: [
        [
          "#",
          "Branch",
          "Invoice Number",
          "Item Name",
          "Sales Date",
          "Cancellation Date", // New column
          "Customer Name",
          "Sales Person", // New column
          "Qty",
          "Price",
          "Total",
          "Status",
          "Reason for Reject", // New column
        ],
      ],
      body: salesCancelledData.map((item, index) => [
        index + 1,
        item.branch,
        item.invoiceNumber,
        item.itemName,
        dayjs(item.salesDate).format("DD-MM-YYYY HH:mm:ss"),
        dayjs(item.cancellationDate).format("DD-MM-YYYY HH:mm:ss"), // New field
        item.customerName,
        item.salesPerson, // New field
        item.qty,
        formatNumber(item.price),
        formatNumber(item.total),
        item.status,
        item.rejectReason || "N/A", // New field
      ]),
      headStyles: {
        fillColor: brandColors.secondary,
        textColor: "#FFFFFF",
        fontStyle: "bold",
        halign: "left",
      },
      bodyStyles: {
        fontSize: 10,
        lineColor: brandColors.lightGray,
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 }, // New column
        6: { cellWidth: 25 },
        7: { cellWidth: 25 }, // New column
        8: { halign: "right", cellWidth: 25 },
        9: { halign: "right", cellWidth: 25 },
        10: { halign: "right", cellWidth: 25 },
        11: { cellWidth: 25 },
        12: { cellWidth: 50 }, // New column
      },
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    });

    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(brandColors.primary);
        doc.rect(
          0,
          doc.internal.pageSize.height - 20,
          doc.internal.pageSize.width,
          20,
          "F"
        );
        doc.setTextColor("#FFFFFF");
        doc.setFontSize(8);
        doc.text(
          "© 2025 Snave Webhub Africa. All rights reserved.",
          margin.left,
          doc.internal.pageSize.height - 10
        );
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 40,
          doc.internal.pageSize.height - 10
        );
      }
    };

    addFooter();
    doc.save(`sales_cancelled_report_${dayjs().format("DD-MM-YYYY")}.pdf`);

    notificationApi.success({
      message: "PDF Export Complete",
      description: "Your report has been successfully exported.",
      placement: "topRight",
      className: "bg-green-50",
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleStatusChange = (record, status) => {
    if (status === "Rejected") {
      setSelectedRecord(record);
      setIsRejectModalOpen(true);
    } else {
      const updatedData = salesCancelledData.map((item) =>
        item.id === record.id ? { ...item, status } : item
      );
      setSalesCancelledData(updatedData);

      notificationApi.success({
        message: "Approval Successful",
        description: `Invoice ${record.invoiceNumber} has been Approved.`,
        placement: "topRight",
        className: "bg-green-50",
      });
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectReason) {
      notificationApi.error({
        message: "Reason Required",
        description: "Please provide a reason for rejection.",
        placement: "topRight",
        className: "bg-red-50",
      });
      return;
    }

    const updatedData = salesCancelledData.map((item) =>
      item.id === selectedRecord.id ? { ...item, status: "Rejected", rejectReason } : item
    );
    setSalesCancelledData(updatedData);

    setIsRejectModalOpen(false);
    setRejectReason("");

    notificationApi.error({
      message: "Rejected",
      description: `Invoice ${selectedRecord.invoiceNumber} has been Rejected. Reason: ${rejectReason}`,
      placement: "topRight",
      className: "bg-red-50",
    });
  };

  const filteredData = salesCancelledData.filter((item) => {
    return (
      item.branch.toLowerCase().includes(searchText.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.salesPerson.toLowerCase().includes(searchText.toLowerCase()) // Include sales person in search
    );
  });

  const totalQty = filteredData.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = filteredData.reduce((sum, item) => sum + item.total, 0);

  const salesCancelledColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (_text, _record, index) => index + 1,
      className: "whitespace-nowrap",
      width: 20,
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      className: "whitespace-nowrap",
      width: 250,
    },
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      render: (text, record) => (
        <Link href={`/invoices/${record.invoiceNumber}`} target="_blank">
          {text}
        </Link>
      ),
      className: "whitespace-nowrap",
      width: 100,
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      className: "whitespace-nowrap",
      width: 200,
    },
    {
      title: "Sales Date",
      dataIndex: "salesDate",
      key: "salesDate",
      align : 'left',
      render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm:ss"),
      className: "whitespace-nowrap",
      width: 120,
    },
    {
      title: "Cancellation Date", // New column
      dataIndex: "cancellationDate",
      key: "cancellationDate",
      align : 'left',
      render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm:ss"),
      className: "whitespace-nowrap",
      width: 150,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      className: "whitespace-nowrap",
      width: 200,
    },
    {
      title: "Sales Person", // New column
      dataIndex: "salesPerson",
      key: "salesPerson",
      className: "whitespace-nowrap",
      width: 150,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      align: "right",
      className: "whitespace-nowrap",
      width: 50,
    },
    {
      title: "Price (KES)",
      dataIndex: "price",
      key: "price",
      render: (price) => formatNumber(price),
      align: "right",
      className: "whitespace-nowrap",
      width: 80,
    },
    {
      title: "Total (KES)",
      dataIndex: "total",
      key: "total",
      render: (total) => formatNumber(total),
      align: "right",
      className: "whitespace-nowrap",
      width: 80,
    },
    {
        title: "Reason for Reject",
        dataIndex: "rejectReason",
        key: "rejectReason",
        render: (text) => text || "N/A", // Display "N/A" if no reason is provided
        className: "whitespace-nowrap",
        width: 150,
      },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "right",
      render: (status, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "approve",
                label: "Approve",
                icon: <CheckCircleOutlined className="text-green-500" />,
                onClick: () => handleStatusChange(record, "Approved"),
              },
              {
                key: "reject",
                label: "Reject",
                icon: <CloseCircleOutlined className="text-red-500" />,
                onClick: () => handleStatusChange(record, "Rejected"),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" style={{ textAlign: "right" }}>
            <Tag
              style={{ textAlign: "right" }}
              color={
                status === "Approved"
                  ? "green"
                  : status === "Rejected"
                  ? "red"
                  : "default"
              }
            >
              {status}
            </Tag>
          </Button>
        </Dropdown>
      ),
      className: "whitespace-nowrap text-right",
      width: 50,
    },
    
  ];

  const collapseItems = [
    {
      key: "1",
      label: "Sales Cancelled Report",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Input
                placeholder="Search by Branch, Invoice Number, Item Name, Customer Name, or Sales Person"
                prefix={<SearchOutlined className="text-blue-500" />}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </Col>
          </Row>

          <Table
            dataSource={filteredData}
            columns={salesCancelledColumns}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: filteredData.length,
              onChange: (page, pageSize) =>
                setPagination({ current: page, pageSize }),
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            scroll={{ x: 1000 }} // Adjusted scroll width
            footer={() => (
              <div style={{ textAlign: "right", fontWeight: "bold" }}>
                <div className="flex justify-between gap-x-4">
                  <div>Total Qty : {totalQty}</div>
                  <div>Total Amount : KES : {formatNumber(totalAmount)}</div>
                </div>
              </div>
            )}
          />

          <div
            className="mt-4 text-gray-500 font-bold text-lg border-t pt-4"
            key="report-footer"
          >
            <p className="text-sm flex justify-between items-center">
              <span className="text-left">
                Report Generated on : {reportGeneratedTime}
              </span>
              <span className="text-center flex-1">
                From : {filters.fromDate ? filters.fromDate.format("DD-MM-YYYY") : "N/A"} &nbsp; To :{" "}
                {filters.toDate ? filters.toDate.format("DD-MM-YYYY") : "N/A"}
              </span>
              <span className="text-right">Generated by : {generatedBy}</span>
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex">
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
                    <Link href="/Dashboard">
                      <HomeOutlined className="text-blue-500" /> Home
                    </Link>
                  ),
                },
                { title: "Sales Cancelled Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Sales Cancelled Report
              </Title>
            </div>
          </div>

          <hr className="mb-4" />

          <Card className="rounded-lg bg-gray-50">
            <div className="mb-4 flex justify-between items-center">
              <Form
                form={form}
                layout="inline"
                onValuesChange={handleFilterChange}
                initialValues={{
                  fromDate: filters.fromDate,
                  toDate: filters.toDate,
                  itemName: "All",
                  customerName: "All",
                  salesPerson: "All", // Initialize Sales Person filter
                }}
              >
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="itemName" label="Item">
                  <Select 
                    placeholder="Select Item Name" 
                    allowClear
                    showSearch
                    style={{ width: 150 }}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="All">All Items</Option>
                    <Option value="Product A">Product A</Option>
                    <Option value="Product B">Product B</Option>
                    <Option value="Product C">Product C</Option>
                    <Option value="Product D">Product D</Option>
                    <Option value="Product E">Product E</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="customerName" label="Customer">
                  <Select 
                    placeholder="Select Customer" 
                    allowClear
                    showSearch
                    style={{ width: 150 }}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="All">All Customers</Option>
                    <Option value="John Doe">John Doe</Option>
                    <Option value="Jane Smith">Jane Smith</Option>
                    <Option value="Peter Parker">Peter Parker</Option>
                    <Option value="Clark Kent">Clark Kent</Option>
                    <Option value="Bruce Wayne">Bruce Wayne</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="salesPerson" label="Sales by">
                  <Select 
                    placeholder="Select Sales Person" 
                    allowClear
                    showSearch
                    style={{ width: 150 }}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="All">All Sales Persons</Option>
                    <Option value="Alice Johnson">Alice Johnson</Option>
                    <Option value="Bob Williams">Bob Williams</Option>
                    <Option value="Charlie Brown">Charlie Brown</Option>
                    <Option value="Diana Prince">Diana Prince</Option>
                    <Option value="Eve Adams">Eve Adams</Option>
                  </Select>
                </Form.Item>
              </Form>
              <div className="flex space-x-4">
                <Button
                  type="primary"
                  icon={<FilterOutlined className="text-white" />}
                  onClick={generateReport}
                >
                  Report
                </Button>
                <Button
                  type="primary"
                  icon={<PrinterOutlined className="text-white" />}
                  onClick={exportToPDF}
                >
                  Print
                </Button>
              </div>
            </div>

            <hr />

            <Spin spinning={loading}>
              {isReportOpen && (
                <Collapse
                  defaultActiveKey={["1"]}
                  expandIcon={({ isActive }) =>
                    isActive ? (
                      <CaretUpOutlined className="text-blue-500" />
                    ) : (
                      <CaretDownOutlined className="text-blue-500" />
                    )
                  }
                  className="mt-4"
                  items={collapseItems}
                />
              )}
            </Spin>
          </Card>
        </Content>

        <Footer />
      </Layout>

      <Modal
        title="Reject Invoice"
        open={isRejectModalOpen}
        onOk={handleRejectSubmit}
        onCancel={() => setIsRejectModalOpen(false)}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Reason for Rejection">
            <Input.TextArea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter the reason for rejection"
              required
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesCancelled;