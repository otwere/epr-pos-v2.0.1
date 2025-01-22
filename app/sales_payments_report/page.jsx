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
} from "antd";
import {
  FilterOutlined,
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  SearchOutlined,
  PrinterOutlined,
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

// Mock data for Sales Payments Report
const mockSalesPaymentsData = [
  {
    id: "P001",
    branch: "Nairobi",
    employee: "John Doe",
    invoiceNumber: "INV-001",
    paymentDate: "2025-01-25 14:30:00",
    customerName: "Alice Johnson",
    paymentType: "Cash",
    paymentNote: "Full payment",
    paidAmount: 15000.0,
  },
  {
    id: "P002",
    branch: "Mombasa",
    employee: "Jane Smith",
    invoiceNumber: "INV-002",
    paymentDate: "2025-01-26 10:15:00",
    customerName: "Bob Williams",
    paymentType: "Credit Card",
    paymentNote: "Partial payment",
    paidAmount: 7500.0,
  },
  {
    id: "P003",
    branch: "Kisumu",
    employee: "Peter Parker",
    invoiceNumber: "INV-003",
    paymentDate: "2025-01-27 16:45:00",
    customerName: "Mary Brown",
    paymentType: "M-Pesa",
    paymentNote: "Full payment",
    paidAmount: 20000.0,
  },
  {
    id: "P004",
    branch: "Nakuru",
    employee: "Clark Kent",
    invoiceNumber: "INV-004",
    paymentDate: "2025-01-28 09:00:00",
    customerName: "Diana Prince",
    paymentType: "Bank Transfer",
    paymentNote: "Full payment",
    paidAmount: 30000.0,
  },
  {
    id: "P005",
    branch: "Eldoret",
    employee: "Bruce Wayne",
    invoiceNumber: "INV-005",
    paymentDate: "2025-01-29 12:00:00",
    customerName: "Tony Stark",
    paymentType: "Cash",
    paymentNote: "Partial payment",
    paidAmount: 10000.0,
  },
];

const SalesPaymentsReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs("2025-01-20"),
    toDate: dayjs("2025-01-31"),
    paymentType: null,
    employee: null,
  });
  const [salesPaymentsData, setSalesPaymentsData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleFilterChange = (changedValues, allValues) => {
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
    const { fromDate, toDate, paymentType, employee } = form.getFieldsValue();

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
      const filteredData = mockSalesPaymentsData.filter((item) => {
        const itemDate = dayjs(item.paymentDate);
        const matchesPaymentType = paymentType
          ? item.paymentType === paymentType
          : true;
        const matchesEmployee = employee ? item.employee === employee : true;
        return (
          itemDate.isAfter(fromDate.subtract(1, "day")) &&
          itemDate.isBefore(toDate.add(1, "day")) &&
          matchesPaymentType &&
          matchesEmployee
        );
      });

      if (filteredData.length === 0) {
        notificationApi.warning({
          message: "No Data Found",
          description: "No sales payments data found for the selected filters.",
          placement: "topRight",
          className: "bg-yellow-50",
        });
      }

      setSalesPaymentsData(filteredData);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Sales Payments Report generated successfully.",
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
    doc.text("Sales Payments Report", 70, 30);

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
    doc.text(" Sales Payments Report Information", margin.left + 5, 60);
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

    // Add Sales Payments Table to PDF
    doc.autoTable({
      startY: 100,
      head: [
        [
          "#",
          "Branch",
          "Employee",
          "Invoice Number",
          "Payment Date",
          "Customer Name",
          "Payment Type",
          "Payment Note",
          "Paid Amt (KES)",
        ],
      ],
      body: salesPaymentsData.map((item, index) => [
        index + 1,
        item.branch,
        item.employee,
        item.invoiceNumber,
        dayjs(item.paymentDate).format("DD-MM-YYYY HH:mm:ss"),
        item.customerName,
        item.paymentType,
        item.paymentNote,
        formatNumber(item.paidAmount),
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
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
        7: { cellWidth: 25 },
        8: { halign: "right", cellWidth: 25 },
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
    doc.save(`sales_payments_report_${dayjs().format("DD-MM-YYYY")}.pdf`);

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

  const filteredData = salesPaymentsData.filter((item) => {
    return (
      item.branch.toLowerCase().includes(searchText.toLowerCase()) ||
      item.employee.toLowerCase().includes(searchText.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      item.paymentType.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const totalPaidAmount = filteredData.reduce(
    (sum, item) => sum + item.paidAmount,
    0
  );

  const salesPaymentsColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
      className: "whitespace-nowrap",
      width: 50,
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      className: "whitespace-nowrap",
      width: 100,
    },
    {
      title: "Employee",
      dataIndex: "employee",
      key: "employee",
      className: "whitespace-nowrap",
      width: 120,
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
      width: 120,
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm:ss"),
      className: "whitespace-nowrap",
      width: 150,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      className: "whitespace-nowrap",
      width: 150,
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      align : "right",
      className: "whitespace-nowrap",
      width: 120,
    },
    {
      title: "Payment Note",
      dataIndex: "paymentNote",
      key: "paymentNote",
      align : "right",
      render: (text) => {
        let color = colors.text;
        if (text === "Full payment") color = colors.success;
        else if (text === "Partial payment") color = colors.warning;
        return <span style={{ color }}>{text}</span>;
      },
      className: "whitespace-nowrap",
      width: 150,
    },
    {
      title: "Paid Amt (KES)",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (paidAmount) => formatNumber(paidAmount),
      align: "right",
      className: "whitespace-nowrap",
      width: 120,
    },
  ];

  const collapseItems = [
    {
      key: "1",
      label: "Sales Payments Report",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Input
                placeholder="Search by Branch, Employee, Customer Name, Invoice Number, or Payment Type"
                prefix={<SearchOutlined className="text-blue-500" />}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </Col>
          </Row>

          <Table
            dataSource={filteredData}
            columns={salesPaymentsColumns}
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
            scroll={{ x: 1200 }} // Enable horizontal scrolling for the table
            footer={() => (
              <div style={{ textAlign: "right", fontWeight: "bold" }}>
                Total Paid Amount : KES : {formatNumber(totalPaidAmount)} 
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
                { title: "Sales Payments Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Sales Payments Report
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
                  paymentType: filters.paymentType,
                  employee: filters.employee,
                }}
              >
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="paymentType" label="Payment Type">
                  <Select placeholder="Select Payment Type" allowClear>
                    <Option value="Cash">Cash</Option>
                    <Option value="Credit Card">Credit Card</Option>
                    <Option value="M-Pesa">M-Pesa</Option>
                    <Option value="Bank Transfer">Bank Transfer</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="employee" label="Employee">
                  <Select placeholder="Select Employee" allowClear>
                    <Option value="John Doe">John Doe</Option>
                    <Option value="Jane Smith">Jane Smith</Option>
                    <Option value="Peter Parker">Peter Parker</Option>
                    <Option value="Clark Kent">Clark Kent</Option>
                    <Option value="Bruce Wayne">Bruce Wayne</Option>
                  </Select>
                </Form.Item>
              </Form>
              <div className="flex space-x-4">
                <Button
                  type="primary"
                  icon={<FilterOutlined className="text-white" />}
                  onClick={generateReport}
                >
                  Generate Report
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
              {isReportVisible && (
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
    </div>
  );
};

export default SalesPaymentsReport;