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

// Mock data for Sales Commission Report
const mockSalesPaymentsData = [
  {
    id: "P001",
    branch: "Nairobi",
    invoiceNumber: "INV-001",
    paymentDate: "2025-01-25 14:30:00",
    itemName: "Product A",
    qtySold: 10,
    salesPrice: 1500.0,
    discount: 100.0,
    commission: 50.0,
  },
  {
    id: "P002",
    branch: "Mombasa",
    invoiceNumber: "INV-002",
    paymentDate: "2025-01-26 10:15:00",
    itemName: "Product B",
    qtySold: 5,
    salesPrice: 2000.0,
    discount: 150.0,
    commission: 75.0,
  },
  {
    id: "P003",
    branch: "Kisumu",
    invoiceNumber: "INV-003",
    paymentDate: "2025-01-27 16:45:00",
    itemName: "Product C",
    qtySold: 8,
    salesPrice: 2500.0,
    discount: 200.0,
    commission: 100.0,
  },
  {
    id: "P004",
    branch: "Nakuru",
    invoiceNumber: "INV-004",
    paymentDate: "2025-01-28 09:00:00",
    itemName: "Product D",
    qtySold: 12,
    salesPrice: 3000.0,
    discount: 250.0,
    commission: 120.0,
  },
  {
    id: "P005",
    branch: "Eldoret",
    invoiceNumber: "INV-005",
    paymentDate: "2025-01-29 12:00:00",
    itemName: "Product E",
    qtySold: 15,
    salesPrice: 3500.0,
    discount: 300.0,
    commission: 150.0,
  },
];

const SaleCommission = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs("2025-01-20"),
    toDate: dayjs("2025-01-31"),
    itemName: null,
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
    const { fromDate, toDate, itemName, employee } = form.getFieldsValue();

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
        const matchesItemName = itemName
          ? item.itemName === itemName
          : true;
        const matchesEmployee = employee ? item.employee === employee : true;
        return (
          itemDate.isAfter(fromDate.subtract(1, "day")) &&
          itemDate.isBefore(toDate.add(1, "day")) &&
          matchesItemName &&
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
        description: "Sales Commission Report generated successfully.",
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
    doc.text("Sales Commission Report", 70, 30);

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
    doc.text(" Sales Commission Report Information", margin.left + 5, 60);
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
          "Invoice Number",
          "Sales Date",
          "Item Name",
          "Qty Sold",
          "Sales Price",
          "Discount",
          "Commission",
        ],
      ],
      body: salesPaymentsData.map((item, index) => [
        index + 1,
        item.branch,
        item.invoiceNumber,
        dayjs(item.paymentDate).format("DD-MM-YYYY HH:mm:ss"),
        item.itemName,
        item.qtySold,
        formatNumber(item.salesPrice),
        formatNumber(item.discount),
        formatNumber(item.commission),
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
        3: { cellWidth: 30 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { halign: "right", cellWidth: 25 },
        7: { halign: "right", cellWidth: 25 },
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
      item.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const totalSalesAmount = filteredData.reduce(
    (sum, item) => sum + item.salesPrice * item.qtySold,
    0
  );

  const totalDiscount = filteredData.reduce(
    (sum, item) => sum + item.discount,
    0
  );

  const totalCommission = filteredData.reduce(
    (sum, item) => sum + item.commission,
    0
  );

  const totalQtySold = filteredData.reduce(
    (sum, item) => sum + item.qtySold,
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
      title: "Sales Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm:ss"),
      className: "whitespace-nowrap",
      width: 150,
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      className: "whitespace-nowrap",
      width: 150,
    },
    {
      title: "Qty Sold",
      dataIndex: "qtySold",
      key: "qtySold",
      align: "right",
      className: "whitespace-nowrap",
      width: 100,
    },
    {
      title: "Sales Price",
      dataIndex: "salesPrice",
      key: "salesPrice",
      render: (salesPrice) => formatNumber(salesPrice),
      align: "right",
      className: "whitespace-nowrap",
      width: 120,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => formatNumber(discount),
      align: "right",
      className: "whitespace-nowrap",
      width: 100,
    },
    {
      title: "Commission",
      dataIndex: "commission",
      key: "commission",
      render: (commission) => formatNumber(commission),
      align: "right",
      className: "whitespace-nowrap",
      width: 120,
    },
  ];

  const collapseItems = [
    {
      key: "1",
      label: "Sales Commission Report",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Input
                placeholder="Search by Branch, Invoice Number, or Item Name"
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
            scroll={{ x: 1200 }} 
            footer={() => (
              <div style={{ textAlign: "right", fontWeight: "bold" }}>
                <div className="flex justify-between gap-x-4">
                  <div>Total Qty Sold : {totalQtySold}</div>
                  <div>Total Sales Amount : KES : {formatNumber(totalSalesAmount)}</div>
                  <div>Total Discount : KES : {formatNumber(totalDiscount)}</div>
                  <div>Total Commission : KES : {formatNumber(totalCommission)}</div>
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
                { title: "Sales Commission Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Sales Commission Report
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
                  itemName: filters.itemName,
                  employee: filters.employee,
                }}
              >
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="itemName" label="Item Name">
                  <Select placeholder="Select Item Name" allowClear>
                    <Option value="Product A">Product A</Option>
                    <Option value="Product B">Product B</Option>
                    <Option value="Product C">Product C</Option>
                    <Option value="Product D">Product D</Option>
                    <Option value="Product E">Product E</Option>
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

export default SaleCommission;