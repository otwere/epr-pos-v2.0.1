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
  DollarOutlined,
  UserOutlined,
  BankOutlined,
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

// Employee to Branch mapping
const employeeBranchMap = {
  "John Doe": "Nairobi",
  "Jane Smith": "Mombasa",
};

const SalesReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs("2025-01-20"), // Updated to 20-01-2025
    toDate: dayjs("2025-01-31"),   // Updated to 31-01-2025
    customerName: "",
    paymentStatus: "Paid",         // Default to "Paid"
    employeeName: "John Doe",      // Default to "John Doe"
    branch: "Nairobi",             // Default to "Nairobi" based on employee
  });
  const [salesData, setSalesData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleFilterChange = (changedValues, allValues) => {
    if (changedValues.employeeName) {
      const branch = employeeBranchMap[changedValues.employeeName] || "";
      form.setFieldsValue({ branch });
      setFilters({
        ...filters,
        ...allValues,
        branch,
      });
    } else {
      setFilters({
        ...filters,
        ...allValues,
      });
    }
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
      salesDate: "2025-01-21",
      customerId: "cust_001",
      customerName: "WALKIN",
      kraPin: "A001234567890",
      invoiceTotal: 25000.0,
      paidAmount: 25000.0,
      dueAmount: 0.0,
      paymentStatus: "Paid",
      employeeName: "John Doe",
      branch: "Nairobi",
      paymentModes: {
        cash: 10000.0,
        mpesa: 15000.0,
        bank: 0.0,
        pdqCheque: 0.0,
      },
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
      salesDate: "2025-01-25",
      customerId: "cust_002",
      customerName: "Customer B",
      kraPin: "B001234567890",
      invoiceTotal: 15000.0,
      paidAmount: 15000.0,
      dueAmount: 0.0,
      paymentStatus: "Paid",
      employeeName: "Jane Smith",
      branch: "Mombasa",
      paymentModes: {
        cash: 5000.0,
        mpesa: 10000.0,
        bank: 0.0,
        pdqCheque: 0.0,
      },
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
      salesDate: "2025-01-30",
      customerId: "cust_003",
      customerName: "Customer C",
      kraPin: "C001234567890",
      invoiceTotal: 30000.0,
      paidAmount: 20000.0,
      dueAmount: 10000.0,
      paymentStatus: "Partial",
      employeeName: "John Doe",
      branch: "Kisumu",
      paymentModes: {
        cash: 0.0,
        mpesa: 20000.0,
        bank: 0.0,
        pdqCheque: 0.0,
      },
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
      salesDate: "2025-01-22",
      customerId: "cust_004",
      customerName: "Customer D",
      kraPin: "D001234567890",
      invoiceTotal: 18000.0,
      paidAmount: 18000.0,
      dueAmount: 0.0,
      paymentStatus: "Paid",
      employeeName: "Jane Smith",
      branch: "Nakuru",
      paymentModes: {
        cash: 8000.0,
        mpesa: 10000.0,
        bank: 0.0,
        pdqCheque: 0.0,
      },
      itemsSold: [
        {
          itemName: "Mara Sugar 1kg",
          quantity: 8,
          price: 100.0,
          tax: 0.0,
          total: 800.0,
        },
        {
          itemName: "Mara Flour 2kg",
          quantity: 4,
          price: 150.0,
          tax: 0.0,
          total: 600.0,
        },
      ],
    },
    {
      id: "S005",
      invoiceNumber: "INV005",
      salesDate: "2025-01-28",
      customerId: "cust_005",
      customerName: "Customer E",
      kraPin: "E001234567890",
      invoiceTotal: 22000.0,
      paidAmount: 15000.0,
      dueAmount: 7000.0,
      paymentStatus: "Partial",
      employeeName: "John Doe",
      branch: "Eldoret",
      paymentModes: {
        cash: 5000.0,
        mpesa: 10000.0,
        bank: 0.0,
        pdqCheque: 0.0,
      },
      itemsSold: [
        {
          itemName: "Mara Sugar 1kg",
          quantity: 12,
          price: 100.0,
          tax: 0.0,
          total: 1200.0,
        },
        {
          itemName: "Mara Tea 500g",
          quantity: 6,
          price: 200.0,
          tax: 0.0,
          total: 1200.0,
        },
      ],
    },
    {
      id: "S006",
      invoiceNumber: "INV006",
      salesDate: "2025-01-29",
      customerId: "cust_006",
      customerName: "Customer F",
      kraPin: "F001234567890",
      invoiceTotal: 50000.0,
      paidAmount: 0.0,
      dueAmount: 50000.0,
      paymentStatus: "Unpaid",
      employeeName: "Jane Smith",
      branch: "Nairobi",
      paymentModes: {
        cash: 0.0,
        mpesa: 0.0,
        bank: 0.0,
        pdqCheque: 0.0,
      },
      itemsSold: [
        {
          itemName: "Mara Sugar 1kg",
          quantity: 50,
          price: 100.0,
          tax: 0.0,
          total: 5000.0,
        },
        {
          itemName: "Mara Tea 500g",
          quantity: 25,
          price: 200.0,
          tax: 0.0,
          total: 5000.0,
        },
      ],
    },
  ];

  const generateReport = () => {
    const { fromDate, toDate, paymentStatus, employeeName, branch } =
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
        const itemPaymentStatus = item.paymentStatus || "";
        const itemEmployeeName = item.employeeName || "";
        const itemBranch = item.branch || "";

        // Check if the sales date is within the selected range
        const isDateInRange =
          salesDate.isAfter(fromDate) && salesDate.isBefore(toDate);

        // Check if the payment status matches the filter
        const isPaymentStatusMatch =
          !paymentStatus ||
          (paymentStatus === "Paid"
            ? itemPaymentStatus === "Paid" && item.dueAmount === 0
            : paymentStatus === "Partial"
            ? itemPaymentStatus === "Partial" && item.dueAmount > 0
            : paymentStatus === "Unpaid"
            ? itemPaymentStatus === "Unpaid" && item.dueAmount > 0
            : itemPaymentStatus.toLowerCase() === paymentStatus.toLowerCase());

        // Check if the employee name matches the filter
        const isEmployeeNameMatch =
          !employeeName || itemEmployeeName.toLowerCase().includes(employeeName.toLowerCase());

        // Check if the branch matches the filter
        const isBranchMatch =
          !branch || itemBranch.toLowerCase().includes(branch.toLowerCase());

        return isDateInRange && isPaymentStatusMatch && isEmployeeNameMatch && isBranchMatch;
      });

      if (filteredData.length === 0) {
        notificationApi.warning({
          message: "No Data Found",
          description: "No sales data found for the selected filters.",
          placement: "topRight",
          className: "bg-yellow-50",
        });
      }

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
          "Invoice No",
          "Sales Date",
          "Customer ID",
          "Customer Name",
          "KRA PIN",
          "Employee Name",
          "Branch",
          "Invoice Total (KES)",
          "Paid Amt (KES)",
          "Due Amt (KES)",
        ],
      ],
      body: salesData.map((item) => [
        item.invoiceNumber,
        item.salesDate,
        item.customerId,
        item.customerName,
        item.kraPin,
        item.employeeName,
        item.branch,
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
        5: { cellWidth: 40 },
        6: { cellWidth: 40 },
        7: { halign: "right", cellWidth: 30 },
        8: { halign: "right", cellWidth: 30 },
        9: { halign: "right", cellWidth: 30 },
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
      item.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      item.employeeName.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const salesColumns = [
    {
      title: "Inv No",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      className: "whitespace-nowrap", 
    },
    {
      title: "Sales Date",
      dataIndex: "salesDate",
      key: "salesDate",
      className: "whitespace-nowrap", 
    },
    {
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
      className: "whitespace-nowrap", 
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      className: "whitespace-nowrap", 
    },
    {
      title: "KRA PIN",
      dataIndex: "kraPin",
      key: "kraPin",
       
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      className: "whitespace-nowrap", 
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      // className: "whitespace-nowrap", 
    },
    {
      title: "Invoice Total (KES)",
      dataIndex: "invoiceTotal",
      key: "invoiceTotal",
      render: (invoiceTotal) => <span>{formatNumber(invoiceTotal)}</span>,
      align: "right",
      className: "whitespace-nowrap", 
    },
    {
      title: "Paid Amt (KES)",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (paidAmount) => <span>{formatNumber(paidAmount)}</span>,
      align: "right",
      className: "whitespace-nowrap", 
    },
    {
      title: "Due Amt (KES)",
      dataIndex: "dueAmount",
      key: "dueAmount",
      render: (dueAmount) => <span>{formatNumber(dueAmount)}</span>,
      align: "right",
      className: "whitespace-nowrap", 
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",  
      align: 'right', 
      className: "whitespace-nowrap",   
      render: (paymentStatus) => {
        let color = "";
        if (paymentStatus === "Paid") {
          color = "green";
        } else if (paymentStatus === "Partial") {
          color = "orange";
        } else if (paymentStatus === "Unpaid") {
          color = "red";
        }
        return <Tag color={color}>{paymentStatus}</Tag>;
        
      },
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
              placeholder="Search by Customer Name, Invoice No., or Employee Name"
              prefix={<SearchOutlined className="text-blue-500" />}
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
                return (
                  <div key={`expanded-${record.id}`}>
                    {/* Payment Summary Section */}
                    <Card className="bg-blue-50 mb-4">
                      <div className="flex items-center">
                        <DollarOutlined className="text-blue-600 text-2xl mr-2 mb-5" />
                        <Title level={4} style={{ marginTop: "-10px" }}>Payment Summary</Title>
                      </div>
                      <hr />
                      <Table
                        dataSource={[record]}
                        columns={[
                          {
                            title: "Invoice No.",
                            dataIndex: "invoiceNumber",
                            key: "invoiceNumber",
                          },
                          {
                            title: "Payment Date",
                            dataIndex: "salesDate",
                            key: "salesDate",
                          },
                          {
                            title: "Payment Status",
                            dataIndex: "paymentStatus",
                            key: "paymentStatus",
                            render: (paymentStatus) => {
                              let color = "";
                              if (paymentStatus === "Paid") {
                                color = "green";
                              } else if (paymentStatus === "Partial") {
                                color = "orange";
                              } else if (paymentStatus === "Unpaid") {
                                color = "red";
                              }
                              return (
                                <Tag color={color} style={{ textAlign: "right" }}>
                                  {paymentStatus}
                                </Tag>
                              );
                            },
                            align: "right",
                          },
                          {
                            title: "Paid Amount (KES)",
                            dataIndex: "paidAmount",
                            key: "paidAmount",
                            render: (paidAmount) => <span>{formatNumber(paidAmount)}</span>,
                            align: "right",
                          },
                          {
                            title: "Due Amount (KES)",
                            dataIndex: "dueAmount",
                            key: "dueAmount",
                            render: (dueAmount) => <span>{formatNumber(dueAmount)}</span>,
                            align: "right",
                          },
                          {
                            title: "Cash (KES)",
                            dataIndex: ["paymentModes", "cash"],
                            key: "cash",
                            render: (cash) => <span>{formatNumber(cash)}</span>,
                            align: "right",
                          },
                          {
                            title: "Mpesa (KES)",
                            dataIndex: ["paymentModes", "mpesa"],
                            key: "mpesa",
                            render: (mpesa) => <span>{formatNumber(mpesa)}</span>,
                            align: "right",
                          },
                          {
                            title: "Bank (KES)",
                            dataIndex: ["paymentModes", "bank"],
                            key: "bank",
                            render: (bank) => <span>{formatNumber(bank)}</span>,
                            align: "right",
                          },
                          {
                            title: "PDQ | CHEQUE (KES)",
                            dataIndex: ["paymentModes", "pdqCheque"],
                            key: "pdqCheque",
                            render: (pdqCheque) => <span>{formatNumber(pdqCheque)}</span>,
                            align: "right",
                          },
                        ]}
                        pagination={false}
                        rowKey="invoiceNumber"
                      />
                    </Card>

                    {/* Employees Sales Summary Section */}
                    <Card className="bg-green-50">
                      <div className="flex items-center">
                        <UserOutlined className="text-green-600 text-2xl mr-2 mb-6" />
                        <Title level={4} style={{ marginTop: "-10px" }}>
                         Sales Person Summary
                        </Title>
                      </div>
                      <hr />
                      <Table
                        dataSource={[record]}
                        columns={[
                          {
                            title: "Employee Name",
                            dataIndex: "employeeName",
                            key: "employeeName",
                          },
                          {
                            title: "Branch",
                            dataIndex: "branch",
                            key: "branch",
                          },
                          {
                            title: "Total Sales (KES)",
                            dataIndex: "invoiceTotal",
                            key: "invoiceTotal",
                            render: (invoiceTotal) => <span>{formatNumber(invoiceTotal)}</span>,
                            align: "right",
                          },
                          {
                            title: "Due Amt (KES)",
                            dataIndex: "dueAmount",
                            key: "dueAmount",
                            render: (dueAmount) => <span>{formatNumber(dueAmount)}</span>,
                            align: "right",
                          },
                        ]}
                        pagination={false}
                        rowKey="employeeName"
                      />
                    </Card>
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
                    <Link href="/Dashboard">
                      <HomeOutlined className="text-blue-500" /> Home
                    </Link>
                  ),
                },
                { title: "Employees & Branches  Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Sales Employees Report
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
                  paymentStatus: filters.paymentStatus,
                  employeeName: filters.employeeName,
                  branch: filters.branch,
                }}
              >
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item 
                  name="paymentStatus" 
                  label="Payment" 
                  style={{ width: '150px' }} // Adjust width as needed
                >
                  <Select>
                    <Option value="">All</Option>
                    <Option value="Paid">Paid</Option>
                    <Option value="Partial">Partial</Option>
                    <Option value="Unpaid">Unpaid</Option>
                  </Select>
                </Form.Item>
                <Form.Item 
                  name="employeeName" 
                  label="Employee" 
                  style={{ width: '200px' }} // Adjust width as needed
                >
                  <Select
                    showSearch
                    placeholder="Select Employee"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option value="">All Employees</Option>
                    <Option value="John Doe">John Doe</Option>
                    <Option value="Jane Smith">Jane Smith</Option>
                  </Select>
                </Form.Item>
                <Form.Item 
                  name="branch" 
                  label="Branch" 
                  style={{ width: '200px' }} 
                >
                  <Select
                    showSearch
                    placeholder="Select Branch"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option value="">All Branches</Option>
                    <Option value="Nairobi">Nairobi</Option>
                    <Option value="Mombasa">Mombasa</Option>
                    <Option value="Kisumu">Kisumu</Option>
                    <Option value="Nakuru">Nakuru</Option>
                    <Option value="Eldoret">Eldoret</Option>
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
                  icon={<FilePdfOutlined className="text-white" />}
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
                    isActive ? <CaretUpOutlined className="text-blue-500" /> : <CaretDownOutlined className="text-blue-500" />
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