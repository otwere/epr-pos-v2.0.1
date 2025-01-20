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
  Tag,
  Input,
  Select,
} from "antd";
import {
  FilterOutlined,
  FilePdfOutlined,
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  BarChartOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

import Link from "next/link";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const SalesReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs("2024-10-01"), // Ensure this is a valid dayjs object
    toDate: dayjs("2025-01-19"),   // Ensure this is a valid dayjs object
    customerName: "",
    paymentStatus: "",
  });
  const [salesData, setSalesData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleFilterChange = (changedValues, allValues) => {
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

  const mockSalesData = [
    {
      id: "S001",
      invoiceNumber: "INV001",
      salesDate: "2024-10-05",
      customerId: "cust_001",
      customerName: "WALKIN",
      kraPin: "A001234567890",
      invoiceTotal: 25000.0,
      paidAmount: 20000.0,
      dueAmount: 5000.0,
      paymentStatus: "Paid",
      itemsSold: [
        {
          itemName: "Mara Sugar 1kg",
          quantity: 10,
          price: 100.0,
          tax: 0.0,
          total: 1000.0,
        },
        {
          itemName: "Mara Tea 500g",
          quantity: 5,
          price: 200.0,
          tax: 0.0,
          total: 1000.0,
        },
        {
          itemName: "Mara Rice 5kg",
          quantity: 2,
          price: 500.0,
          tax: 0.0,
          total: 1000.0,
        },
      ],
    },
    {
      id: "S002",
      invoiceNumber: "INV002",
      salesDate: "2024-11-15",
      customerId: "cust_002",
      customerName: "Customer B",
      kraPin: "B001234567890",
      invoiceTotal: 15000.0,
      paidAmount: 15000.0,
      dueAmount: 0.0,
      paymentStatus: "Paid",
      itemsSold: [
        {
          itemName: "Mara Sugar 1kg",
          quantity: 5,
          price: 100.0,
          tax: 0.0,
          total: 500.0,
        },
        {
          itemName: "Mara Flour 2kg",
          quantity: 3,
          price: 150.0,
          tax: 0.0,
          total: 450.0,
        },
      ],
    },
    {
      id: "S003",
      invoiceNumber: "INV003",
      salesDate: "2024-12-20",
      customerId: "cust_003",
      customerName: "Customer C",
      kraPin: "C001234567890",
      invoiceTotal: 30000.0,
      paidAmount: 20000.0,
      dueAmount: 10000.0,
      paymentStatus: "Unpaid",
      itemsSold: [
        {
          itemName: "Mara Sugar 1kg",
          quantity: 20,
          price: 100.0,
          tax: 0.0,
          total: 2000.0,
        },
        {
          itemName: "Mara Tea 500g",
          quantity: 10,
          price: 200.0,
          tax: 0.0,
          total: 2000.0,
        },
      ],
    },
    {
      id: "S004",
      invoiceNumber: "INV004",
      salesDate: "2025-01-10",
      customerId: "cust_004",
      customerName: "Customer D",
      kraPin: "D001234567890",
      invoiceTotal: 50000.0,
      paidAmount: 30000.0,
      dueAmount: 20000.0,
      paymentStatus: "Paid",
      itemsSold: [
        {
          itemName: "Mara Sugar 1kg",
          quantity: 30,
          price: 100.0,
          tax: 0.0,
          total: 3000.0,
        },
        {
          itemName: "Mara Flour 2kg",
          quantity: 10,
          price: 150.0,
          tax: 0.0,
          total: 1500.0,
        },
        {
          itemName: "Mara Rice 5kg",
          quantity: 5,
          price: 500.0,
          tax: 0.0,
          total: 2500.0,
        },
      ],
    },
    {
      id: "S005",
      invoiceNumber: "INV005",
      salesDate: "2025-01-15",
      customerId: "cust_005",
      customerName: "Customer E",
      kraPin: "E001234567890",
      invoiceTotal: 45000.0,
      paidAmount: 30000.0,
      dueAmount: 15000.0,
      paymentStatus: "Unpaid",
      itemsSold: [
        {
          itemName: "Mara Sugar 1kg",
          quantity: 15,
          price: 100.0,
          tax: 0.0,
          total: 1500.0,
        },
        {
          itemName: "Mara Tea 500g",
          quantity: 8,
          price: 200.0,
          tax: 0.0,
          total: 1600.0,
        },
        {
          itemName: "Mara Rice 5kg",
          quantity: 3,
          price: 500.0,
          tax: 0.0,
          total: 1500.0,
        },
      ],
    },
  ];

  const generateReport = () => {
    const { fromDate, toDate, customerName, paymentStatus } =
      form.getFieldsValue();

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
      const filteredData = mockSalesData.filter((item) => {
        const salesDate = dayjs(item.salesDate);

        // Ensure properties are defined before calling .toLowerCase()
        const itemCustomerName = item.customerName || "";
        const itemPaymentStatus = item.paymentStatus || "";

        return (
          salesDate.isAfter(fromDate) &&
          salesDate.isBefore(toDate) &&
          itemCustomerName.toLowerCase().includes((customerName || "").toLowerCase()) &&
          itemPaymentStatus.toLowerCase().includes((paymentStatus || "").toLowerCase())
        );
      });

      setSalesData(filteredData);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Sales Report generated successfully.",
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
    doc.text("Sales Report", 70, 30);

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
    doc.text(" Sales Report Information", margin.left + 5, 60);
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

    // Add Sales Table to PDF
    doc.autoTable({
      startY: 100,
      head: [
        [
          "Invoice Number",
          "Sales Date",
          "Customer ID",
          "Customer Name",
          "KRA PIN",
          "Invoice Total (Ksh)",
          "Paid Amt (Ksh)",
          "Due Amt (Ksh)",
        ],
      ],
      body: salesData.map((item) => [
        item.invoiceNumber,
        item.salesDate,
        item.customerId,
        item.customerName,
        item.kraPin,
        formatNumber(item.invoiceTotal),
        formatNumber(item.paidAmount),
        formatNumber(item.dueAmount),
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
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        5: { halign: "right", cellWidth: 30 },
        6: { halign: "right", cellWidth: 30 },
        7: { halign: "right", cellWidth: 30 },
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
    doc.save(`sales_report_${dayjs().format("DD-MM-YYYY")}.pdf`);

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

  const filteredData = salesData.filter((item) => {
    return (
      item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const salesColumns = [
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
    },
    {
      title: "Sales Date",
      dataIndex: "salesDate",
      key: "salesDate",
    },
    {
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "KRA PIN",
      dataIndex: "kraPin",
      key: "kraPin",
    },
    {
      title: "Invoice Total (Ksh)",
      dataIndex: "invoiceTotal",
      key: "invoiceTotal",
      render: (invoiceTotal) => <span>{formatNumber(invoiceTotal)}</span>,
      align: "right",
    },
    {
      title: "Paid Amt (Ksh)",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (paidAmount) => <span>{formatNumber(paidAmount)}</span>,
      align: "right",
    },
    {
      title: "Due Amt (Ksh)",
      dataIndex: "dueAmount",
      key: "dueAmount",
      render: (dueAmount) => <span>{formatNumber(dueAmount)}</span>,
      align: "right",
    },
  ];

  const totalSales = salesData.reduce(
    (sum, item) => sum + (item.invoiceTotal || 0),
    0
  );

  const collapseItems = [
    {
      key: "1",
      label: "Sales Report",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={24} key="total-sales">
              <Card className="bg-green-50">
                <div className="flex items-center">
                  <BarChartOutlined className="text-green-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Sales
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalSales)}</Title>
              </Card>
            </Col>
          </Row>

          <div className="mb-4">
            <Input
              placeholder="Search by Customer Name or Invoice Number"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </div>

          <Table
            dataSource={filteredData}
            columns={salesColumns}
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
            expandable={{
              expandedRowRender: (record) => {
                // Calculate totals for items sold
                const itemsSoldTotals = record.itemsSold.reduce(
                  (totals, item) => {
                    totals.quantity += item.quantity || 0;
                    totals.price += (item.quantity || 0) * (item.price || 0);
                    totals.tax += item.tax || 0;
                    totals.total += item.total || 0;
                    return totals;
                  },
                  { quantity: 0, price: 0, tax: 0, total: 0 }
                );

                return (
                  <div key={`expanded-${record.id}`}>
                    <Title level={4}>Items Sold</Title>
                    <hr />
                    <Table
                      dataSource={record.itemsSold}
                      columns={[
                        {
                          title: "Item Name",
                          dataIndex: "itemName",
                          key: "itemName",
                        },
                        {
                          title: "Quantity",
                          dataIndex: "quantity",
                          key: "quantity",
                          align: "right",
                        },
                        {
                          title: "Price",
                          dataIndex: "price",
                          key: "price",
                          render: (price) => formatNumber(price),
                          align: "right",
                        },
                        {
                          title: "Tax",
                          dataIndex: "tax",
                          key: "tax",
                          render: (tax) => formatNumber(tax),
                          align: "right",
                        },
                        {
                          title: "Total",
                          dataIndex: "total",
                          key: "total",
                          render: (total) => formatNumber(total),
                          align: "right",
                        },
                      ]}
                      pagination={false}
                      rowKey="itemName"
                    />
                    {/* Modern and Professional Total Section */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "16px",
                        padding: "16px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "24px",
                          alignItems: "center",
                        }}
                      >
                        <Text strong style={{ fontSize: "14px" }}>
                          Total Quantity: {itemsSoldTotals.quantity}
                        </Text>
                        <Text strong style={{ fontSize: "14px" }}>
                          Total Price: {formatNumber(itemsSoldTotals.price)}
                        </Text>
                        <Text strong style={{ fontSize: "14px" }}>
                          Total Tax: {formatNumber(itemsSoldTotals.tax)}
                        </Text>
                        <Text strong style={{ fontSize: "14px" }}>
                          Grand Total: {formatNumber(itemsSoldTotals.total)}
                        </Text>
                      </div>
                    </div>
                  </div>
                );
              },
            }}
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
                    <Link href="/">
                      <HomeOutlined /> Home
                    </Link>
                  ),
                },
                { title: "Sales Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Sales Report
              </Title>
            </div>
          </div>

          <hr className="mb-4" />

          <Card className=" rounded-lg bg-gray-50">
            <div className="mb-4 flex justify-between items-center">
              <Form
                form={form}
                layout="inline"
                onValuesChange={handleFilterChange}
                initialValues={{
                  fromDate: filters.fromDate,
                  toDate: filters.toDate,
                  customerName: filters.customerName,
                  paymentStatus: filters.paymentStatus,
                }}
              >
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item 
                  name="customerName" 
                  label="Customer Name" 
                  style={{ width: '300px' }} // Adjust width as needed
                >
                  <Select>
                    <Option value="">All Customers</Option>
                    <Option value="client 1">Client 1</Option>
                    <Option value="client 2">Client 2</Option>
                  </Select>
                </Form.Item>
                <Form.Item 
                  name="paymentStatus" 
                  label="Payment Status" 
                  style={{ width: '250px' }} // Adjust width as needed
                >
                  <Select>
                    <Option value="">All</Option>
                    <Option value="Paid">Paid</Option>
                    <Option value="Unpaid">Unpaid</Option>
                  </Select>
                </Form.Item>
              </Form>
              <div className="flex space-x-4">
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  onClick={generateReport}
                >
                  Generate Report
                </Button>
                <Button
                  type="primary"
                  icon={<FilePdfOutlined />}
                  onClick={exportToPDF}
                >
                  Export to PDF
                </Button>
              </div>
            </div>

            <hr />

            <Spin spinning={loading}>
              {isReportVisible && (
                <Collapse
                  defaultActiveKey={["1"]}
                  expandIcon={({ isActive }) =>
                    isActive ? <CaretUpOutlined /> : <CaretDownOutlined />
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

export default SalesReport;