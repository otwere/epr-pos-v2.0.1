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
  Progress,
  Statistic,
  Input,
  Select,
} from "antd";
import {
  FilterOutlined,
  FilePdfOutlined,
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  UserOutlined,
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

const CreditSalesAgingReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs().startOf("month"), // Start of the month
    toDate: dayjs().endOf("month"), // End of the month
    paymentStatus: null, // Payment status filter
  });
  const [creditSalesData, setCreditSalesData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [searchText, setSearchText] = useState(""); // State for search text
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 }); // Pagination state
  const [selectedAgeRange, setSelectedAgeRange] = useState(null); // State for selected age range filter
  const [selectedCreditSalesAgeRange, setSelectedCreditSalesAgeRange] =
    useState(null); // State for selected age range filter in Credit Sales Details

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleFilterChange = (changedValues, allValues) => {
    const { fromDate, toDate, paymentStatus } = allValues;
    setFilters({
      fromDate: fromDate ? dayjs(fromDate) : dayjs().startOf("month"),
      toDate: toDate ? dayjs(toDate) : dayjs().endOf("month"),
      paymentStatus,
    });
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Function to calculate aging analysis dynamically
  const calculateAgingAnalysis = (sales) => {
    const today = dayjs();
    const agingAnalysis = { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 };

    sales.forEach((sale) => {
      const saleDate = dayjs(sale.saleDate);
      const daysDiff = today.diff(saleDate, "day");

      if (daysDiff >= 0 && daysDiff <= 30) {
        agingAnalysis["0-30"] += sale.amount;
      } else if (daysDiff > 30 && daysDiff <= 60) {
        agingAnalysis["31-60"] += sale.amount;
      } else if (daysDiff > 60 && daysDiff <= 90) {
        agingAnalysis["61-90"] += sale.amount;
      } else if (daysDiff > 90) {
        agingAnalysis["90+"] += sale.amount;
      }
    });

    return agingAnalysis;
  };

  // Function to calculate RISK LEVEL based on the oldest overdue payment
  const calculateRiskLevel = (sales) => {
    const today = dayjs();
    let maxOverdueDays = 0;

    sales.forEach((sale) => {
      const dueDate = dayjs(sale.dueDate);
      const overdueDays = today.diff(dueDate, "day");
      if (overdueDays > maxOverdueDays) {
        maxOverdueDays = overdueDays;
      }
    });

    if (maxOverdueDays <= 30) return "Low";
    if (maxOverdueDays <= 60) return "Medium";
    if (maxOverdueDays <= 90) return "High";
    return "Critical";
  };

  // Function to calculate outstanding balance dynamically
  const calculateOutstandingBalance = (creditSales, paymentHistory) => {
    const totalSales = creditSales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalPayments = paymentHistory.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    return totalSales - totalPayments;
  };

  // Function to calculate totals for unpaid and partial payments
  const calculateUnpaidAndPartialTotals = (creditSales) => {
    let unpaidTotal = 0;
    let partialTotal = 0;

    creditSales.forEach((sale) => {
      if (sale.paymentStatus === "Unpaid") {
        unpaidTotal += sale.amount;
      } else if (sale.paymentStatus === "Partial") {
        partialTotal += sale.amount;
      }
    });

    return { unpaidTotal, partialTotal };
  };

  const mockCreditSalesData = [
    {
      id: 1,
      customerName: "John Doe",
      branch: "Nairobi",
      contactDetails: "john.doe@example.com",
      accountNumber: "ACC123456",
      creditLimit: 100000,
      creditSales: [
        {
          saleNumber: "INV001",
          saleDate: "2023-09-01",
          dueDate: "2023-10-01",
          amount: 50000,
          paymentStatus: "Unpaid",
        },
        {
          saleNumber: "INV002",
          saleDate: "2025-01-01",
          dueDate: "2025-01-15",
          amount: 30000,
          paymentStatus: "Partial",
        },
      ],
      paymentHistory: [
        {
          paymentDate: "2023-09-10",
          transactionId: "TXN001",
          modeOfPayment: "Bank Transfer",
          amount: 20000,
        },
      ],
      paymentTerms: "Net 30",
      lateFees: 500,
      adjustments: 0,
      writeOffs: 0,
      followUpNotes: "Customer to be contacted for payment.",
      followUpPerson: "Jane Smith",
      followUpRole: "Account Manager",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      branch: "Mombasa",
      contactDetails: "jane.smith@example.com",
      accountNumber: "ACC654321",
      creditLimit: 150000,
      creditSales: [
        {
          saleNumber: "INV003",
          saleDate: "2023-07-01",
          dueDate: "2023-08-01",
          amount: 75000,
          paymentStatus: "Unpaid",
        },
        {
          saleNumber: "INV004",
          saleDate: "2023-06-15",
          dueDate: "2023-07-15",
          amount: 45000,
          paymentStatus: "Paid",
        },
      ],
      paymentHistory: [
        {
          paymentDate: "2023-07-10",
          transactionId: "TXN002",
          modeOfPayment: "Cheque",
          amount: 45000,
        },
      ],
      paymentTerms: "Net 45",
      lateFees: 1000,
      adjustments: 0,
      writeOffs: 0,
      followUpNotes: "Payment received for INV004.",
      followUpPerson: "John Doe",
      followUpRole: "Account Manager",
    },
    {
      id: 3,
      customerName: "Alice Johnson",
      branch: "Kisumu",
      contactDetails: "alice.johnson@example.com",
      accountNumber: "ACC789012",
      creditLimit: 200000,
      creditSales: [
        {
          saleNumber: "INV005",
          saleDate: "2023-08-01",
          dueDate: "2023-09-01",
          amount: 100000,
          paymentStatus: "Partial",
        },
        {
          saleNumber: "INV006",
          saleDate: "2023-07-15",
          dueDate: "2023-08-15",
          amount: 50000,
          paymentStatus: "Unpaid",
        },
      ],
      paymentHistory: [
        {
          paymentDate: "2023-08-10",
          transactionId: "TXN003",
          modeOfPayment: "Bank Transfer",
          amount: 50000,
        },
      ],
      paymentTerms: "Net 60",
      lateFees: 1500,
      adjustments: 0,
      writeOffs: 0,
      followUpNotes: "Follow up on partial payment.",
      followUpPerson: "Jane Smith",
      followUpRole: "Account Manager",
    },
    {
      id: 4,
      customerName: "Bob Brown",
      branch: "Eldoret",
      contactDetails: "bob.brown@example.com",
      accountNumber: "ACC345678",
      creditLimit: 120000,
      creditSales: [
        {
          saleNumber: "INV007",
          saleDate: "2023-09-15",
          dueDate: "2023-10-15",
          amount: 60000,
          paymentStatus: "Unpaid",
        },
        {
          saleNumber: "INV008",
          saleDate: "2023-08-01",
          dueDate: "2023-09-01",
          amount: 40000,
          paymentStatus: "Paid",
        },
      ],
      paymentHistory: [
        {
          paymentDate: "2023-09-05",
          transactionId: "TXN004",
          modeOfPayment: "Cheque",
          amount: 40000,
        },
      ],
      paymentTerms: "Net 30",
      lateFees: 500,
      adjustments: 0,
      writeOffs: 0,
      followUpNotes: "Payment received for INV008.",
      followUpPerson: "John Doe",
      followUpRole: "Account Manager",
    },
    {
      id: 5,
      customerName: "Charlie Davis",
      branch: "Nakuru",
      contactDetails: "charlie.davis@example.com",
      accountNumber: "ACC901234",
      creditLimit: 180000,
      creditSales: [
        {
          saleNumber: "INV009",
          saleDate: "2023-07-01",
          dueDate: "2023-08-01",
          amount: 90000,
          paymentStatus: "Unpaid",
        },
        {
          saleNumber: "INV010",
          saleDate: "2023-06-15",
          dueDate: "2023-07-15",
          amount: 60000,
          paymentStatus: "Partial",
        },
      ],
      paymentHistory: [
        {
          paymentDate: "2023-07-10",
          transactionId: "TXN005",
          modeOfPayment: "Bank Transfer",
          amount: 30000,
        },
      ],
      paymentTerms: "Net 45",
      lateFees: 1000,
      adjustments: 0,
      writeOffs: 0,
      followUpNotes: "Follow up on partial payment.",
      followUpPerson: "Jane Smith",
      followUpRole: "Account Manager",
    },
  ];

  // Generate report with updated RISK LEVEL logic
  const generateReport = () => {
    const { fromDate, toDate, paymentStatus } = form.getFieldsValue();

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
      // Calculate aging analysis, RISK LEVEL, and outstanding balance dynamically for each customer
      const updatedCreditSalesData = mockCreditSalesData.map((customer) => {
        const outstandingBalance = calculateOutstandingBalance(
          customer.creditSales,
          customer.paymentHistory
        );
        const { unpaidTotal, partialTotal } = calculateUnpaidAndPartialTotals(
          customer.creditSales
        );

        return {
          ...customer,
          agingAnalysis: calculateAgingAnalysis(customer.creditSales),
          riskLevel: calculateRiskLevel(customer.creditSales),
          outstandingBalance,
          unpaidTotal,
          partialTotal,
        };
      });

      setCreditSalesData(updatedCreditSalesData);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Credit Sales Aging Report generated successfully.",
        placement: "topRight",
        className: "bg-green-50",
      });
    }, 1000);
  };

  // Export to PDF functionality
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
    doc.text("Credit Sales Aging Report", 70, 30);

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
    doc.text(" Credit Sales Aging Report Information", margin.left + 5, 60);
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

    // Add Credit Sales Table to PDF
    doc.autoTable({
      startY: 100,
      head: [
        [
          "CUSTOMER NAME",
          "BRANCH",
          "OUTSTANDING BALANCE",
          "RISK LEVEL",
          "CREDIT LIMIT",
          "UTILIZATION",
        ],
      ],
      body: creditSalesData.map((item) => [
        item.customerName,
        item.branch,
        formatNumber(item.outstandingBalance),
        item.riskLevel,
        formatNumber(item.creditLimit),
        `${((item.outstandingBalance / item.creditLimit) * 100).toFixed(2)}%`,
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
        0: { cellWidth: 60 },
        1: { cellWidth: 40 },
        2: { halign: "right", cellWidth: 50 },
        3: { cellWidth: 40 },
        4: { halign: "right", cellWidth: 50 },
        5: { halign: "right", cellWidth: 50 },
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
    doc.save(`credit_sales_aging_report_${dayjs().format("DD-MM-YYYY")}.pdf`);

    notificationApi.success({
      message: "PDF Export Complete",
      description: "Your report has been successfully exported.",
      placement: "topRight",
      className: "bg-green-50",
    });
  };

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 }); // Reset to the first page on search
  };

  // Filter data based on search text, selected age range, and payment status
  const filteredData = creditSalesData.filter((item) => {
    const matchesSearchText =
      item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.contactDetails.toLowerCase().includes(searchText.toLowerCase());

    const matchesAgeRange = !selectedAgeRange || item.agingAnalysis[selectedAgeRange] > 0;

    const matchesPaymentStatus = !filters.paymentStatus || item.creditSales.some(
      (sale) => sale.paymentStatus === filters.paymentStatus
    );

    return matchesSearchText && matchesAgeRange && matchesPaymentStatus;
  });

  // Function to filter credit sales by age range and payment status
  const filterCreditSalesByAgeRange = (creditSales, ageRange) => {
    const today = dayjs();
    return creditSales.filter((sale) => {
      const saleDate = dayjs(sale.saleDate);
      const daysDiff = today.diff(saleDate, "day");

      const matchesAgeRange =
        (ageRange === "0-30" && daysDiff >= 0 && daysDiff <= 30) ||
        (ageRange === "31-60" && daysDiff > 30 && daysDiff <= 60) ||
        (ageRange === "61-90" && daysDiff > 60 && daysDiff <= 90) ||
        (ageRange === "90+" && daysDiff > 90);

      const matchesPaymentStatus =
        sale.paymentStatus === "Unpaid" || sale.paymentStatus === "Partial";

      return matchesAgeRange && matchesPaymentStatus;
    });
  };

  const creditSalesColumns = [
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "BRANCH",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "CONTACT DETAILS",
      dataIndex: "contactDetails",
      key: "contactDetails",
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "OUTSTANDING BALANCE",
      dataIndex: "outstandingBalance",
      key: "outstandingBalance",
      render: (outstandingBalance) => (
        <span>{formatNumber(outstandingBalance)}</span>
      ),
      align: "right",
    },
    {
      title: "RISK LEVEL",
      dataIndex: "riskLevel",
      key: "riskLevel",
      align: "right",
      render: (riskLevel) => {
        let color =
          riskLevel === "Low"
            ? "green"
            : riskLevel === "Medium"
              ? "orange"
              : riskLevel === "High"
                ? "red"
                : "darkred";
        return <Tag color={color}>{riskLevel}</Tag>;
      },
    },
    {
      title: "CREDIT LIMIT",
      dataIndex: "creditLimit",
      key: "creditLimit",
      render: (creditLimit) => <span>{formatNumber(creditLimit)}</span>,
      align: "right",
    },
    {
      title: "UTILIZATION",
      key: "utilization",
      render: (_, record) => {
        const utilization =
          (record.outstandingBalance / record.creditLimit) * 100;
        return (
          <Progress
            percent={utilization.toFixed(2)}
            status={utilization > 100 ? "exception" : "normal"}
          />
        );
      },
    },
  ];

  const totalReceivables = creditSalesData.reduce(
    (sum, item) => sum + (item.outstandingBalance || 0),
    0
  );

  const totalUnpaid = creditSalesData.reduce(
    (sum, item) => sum + (item.unpaidTotal || 0),
    0
  );

  const totalPartial = creditSalesData.reduce(
    (sum, item) => sum + (item.partialTotal || 0),
    0
  );

  const collapseItems = [
    {
      key: "1",
      label: "Credit Sales Aging Report",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={8} key="total-receivables">
              <Card className="bg-green-50">
                <div className="flex items-center">
                  <UserOutlined className="text-green-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Receivables
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalReceivables)}</Title>
              </Card>
            </Col>
            <Col span={8} key="total-unpaid">
              <Card className="bg-red-50">
                <div className="flex items-center">
                  <UserOutlined className="text-red-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Unpaid
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalUnpaid)}</Title>
              </Card>
            </Col>
            <Col span={8} key="total-partial">
              <Card className="bg-orange-50">
                <div className="flex items-center">
                  <UserOutlined className="text-orange-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Partial
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalPartial)}</Title>
              </Card>
            </Col>
          </Row>

          {/* Search Input */}
          <div className="mb-4">
            <Input
              placeholder="Search by Customer Name or Contact Details"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </div>

          <Table
            dataSource={filteredData}
            columns={creditSalesColumns}
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
              expandedRowRender: (record) => (
                <div key={`expanded-${record.id}`}>
                  <Title level={4}>Aging Analysis</Title>
                  <hr className="mb-4" />
                  <Row gutter={16}>
                    <Col span={6} key={`aging-0-30-${record.id}`}>
                      <Card
                        className="bg-blue-50 cursor-pointer"
                        onClick={() => setSelectedCreditSalesAgeRange("0-30")}
                      >
                        <Statistic
                          title="0-30 Days"
                          value={formatNumber(
                            filterCreditSalesByAgeRange(
                              record.creditSales,
                              "0-30"
                            ).reduce((sum, sale) => sum + sale.amount, 0)
                          )}
                        />
                      </Card>
                    </Col>
                    <Col span={6} key={`aging-31-60-${record.id}`}>
                      <Card
                        className="bg-green-50 cursor-pointer"
                        onClick={() => setSelectedCreditSalesAgeRange("31-60")}
                      >
                        <Statistic
                          title="31-60 Days"
                          value={formatNumber(
                            filterCreditSalesByAgeRange(
                              record.creditSales,
                              "31-60"
                            ).reduce((sum, sale) => sum + sale.amount, 0)
                          )}
                        />
                      </Card>
                    </Col>
                    <Col span={6} key={`aging-61-90-${record.id}`}>
                      <Card
                        className="bg-orange-50 cursor-pointer"
                        onClick={() => setSelectedCreditSalesAgeRange("61-90")}
                      >
                        <Statistic
                          title="61-90 Days"
                          value={formatNumber(
                            filterCreditSalesByAgeRange(
                              record.creditSales,
                              "61-90"
                            ).reduce((sum, sale) => sum + sale.amount, 0)
                          )}
                        />
                      </Card>
                    </Col>
                    <Col span={6} key={`aging-90+-${record.id}`}>
                      <Card
                        className="bg-red-50 cursor-pointer"
                        onClick={() => setSelectedCreditSalesAgeRange("90+")}
                      >
                        <Statistic
                          title="90+ Days"
                          value={formatNumber(
                            filterCreditSalesByAgeRange(
                              record.creditSales,
                              "90+"
                            ).reduce((sum, sale) => sum + sale.amount, 0)
                          )}
                        />
                      </Card>
                    </Col>
                  </Row>
                  <Title level={4} className="mt-4">
                    Credit Sales Details
                  </Title>
                  <hr />
                  <Table
                    dataSource={
                      selectedCreditSalesAgeRange
                        ? filterCreditSalesByAgeRange(
                          record.creditSales,
                          selectedCreditSalesAgeRange
                        )
                        : record.creditSales
                    }
                    columns={[
                      {
                        title: "Invoice Number",
                        dataIndex: "saleNumber",
                        key: "saleNumber",
                      },
                      {
                        title: "Sale Date",
                        dataIndex: "saleDate",
                        key: "saleDate",
                      },
                      {
                        title: "Due Date",
                        dataIndex: "dueDate",
                        key: "dueDate",
                      },
                      {
                        title: "Age (Days)",
                        key: "age",
                        render: (_, sale) => {
                          const dueDate = dayjs(sale.dueDate);
                          const today = dayjs();
                          const ageInDays = today.diff(dueDate, "day");
                          return <span>{ageInDays}</span>;
                        },
                      },
                      {
                        title: "Amount",
                        dataIndex: "amount",
                        key: "amount",
                        render: (amount) => formatNumber(amount),
                        align: "right",
                      },
                      {
                        title: "Payment Status",
                        dataIndex: "paymentStatus",
                        key: "paymentStatus",
                        align: "right",
                        render: (status) => {
                          let color =
                            status === "Paid"
                              ? "green"
                              : status === "Unpaid"
                                ? "red"
                                : "orange";
                          return <Tag color={color}>{status}</Tag>;
                        },
                      },
                    ]}
                    pagination={false}
                    rowKey="saleNumber"
                  />
                  {/* Improved Total row for Credit Sales Details */}
                  <Row justify="end" className="mt-4">
                    <Col span={24}>
                      <Card
                         className="bg-gray-50 border border-gray-200"
                         styles={{ body: { padding: "16px" } }}
                      >
                        <Row justify="space-between" align="middle">
                          <Col>
                            <Text strong className="text-lg">
                              Total Credit Sales Amount :
                            </Text>
                          </Col>
                          <Col>
                            <Text strong className="text-lg text-blue-600">
                              {formatNumber(
                                (selectedCreditSalesAgeRange
                                  ? filterCreditSalesByAgeRange(
                                      record.creditSales,
                                      selectedCreditSalesAgeRange
                                    )
                                  : record.creditSales
                                ).reduce((sum, sale) => sum + sale.amount, 0)
                              )}
                            </Text>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                  <Title level={4} className="mt-6">
                    Payment History
                  </Title>
                  <hr />
                  <Table
                    dataSource={record.paymentHistory}
                    columns={[
                      {
                        title: "Payment Date",
                        dataIndex: "paymentDate",
                        key: "paymentDate",
                      },
                      {
                        title: "Transaction ID",
                        dataIndex: "transactionId",
                        key: "transactionId",
                      },
                      {
                        title: "Mode of Payment",
                        dataIndex: "modeOfPayment",
                        key: "modeOfPayment",
                      },
                      {
                        title: "Amount",
                        dataIndex: "amount",
                        key: "amount",
                        render: (amount) => formatNumber(amount),
                        align: "right",
                      },
                    ]}
                    pagination={false}
                    rowKey="transactionId"
                  />
                  {/* Improved Total row for Payment History */}
                  <Row justify="end" className="mt-4">
                    <Col span={24}>
                      <Card
                        className="bg-gray-50 border border-gray-200"
                        bodyStyle={{ padding: "16px" }}
                      >
                        <Row justify="space-between" align="middle">
                          <Col>
                            <Text strong className="text-lg">
                              Total Payments Amount :
                            </Text>
                          </Col>
                          <Col>
                            <Text strong className="text-lg text-green-600">
                              {formatNumber(
                                record.paymentHistory.reduce(
                                  (sum, payment) => sum + payment.amount,
                                  0
                                )
                              )}
                            </Text>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                  <Title level={5} className="mt-6 text-gray-400">
                    Terms and Conditions
                  </Title>
                  
                  <hr  className="mb-4"/>

                  <Row gutter={[16, 16]} className="mt-2">
                    <Col span={12} key={`payment-terms-${record.id}`}>
                      <Card className="bg-white">
                        <Text strong>Payment Terms:</Text>
                        <Text className="ml-2">{record.paymentTerms}</Text>
                      </Card>
                    </Col>
                    <Col span={12} key={`late-fees-${record.id}`}>
                      <Card className="bg-white">
                        <Text strong>Late Fees :</Text>
                        <Text className="ml-2">
                          {formatNumber(record.lateFees)}
                        </Text>
                      </Card>
                    </Col>
                    <Col span={12} key={`adjustments-${record.id}`}>
                      <Card className="bg-white">
                        <Text strong>Adjustments :</Text>
                        <Text className="ml-2">
                          {formatNumber(record.adjustments)}
                        </Text>
                      </Card>
                    </Col>
                    <Col span={12} key={`write-offs-${record.id}`}>
                      <Card className="bg-white">
                        <Text strong>Write-Offs :</Text>
                        <Text className="ml-2">
                          {formatNumber(record.writeOffs)}
                        </Text>
                      </Card>
                    </Col>
                    <Col span={24} key={`follow-up-notes-${record.id}`}>
                      <Card className="bg-green-50 flex flex-col">
                        <div className="flex justify-between items-center">
                          <Text strong>Follow-Up Notes :</Text>
                          <Text className="ml-1">{record.followUpNotes}</Text>
                          <Text strong className="ml-4">
                            Person :
                          </Text>
                          <Text className="ml-0">{record.followUpPerson}</Text>
                          <Text strong className="ml-4">
                            Role :
                          </Text>
                          <Text className="ml-1">{record.followUpRole}</Text>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
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
                From : {filters.fromDate.format("DD-MM-YYYY")} &nbsp; To : {" "}
                {filters.toDate.format("DD-MM-YYYY")}
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
                { title: "Credit Sales Aging Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Credit Sales Aging Report
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
                }}
              >
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="paymentStatus" label="Payment Status">
                  <Select style={{ width: 120 }} allowClear>
                    <Option value="Paid">Paid</Option>
                    <Option value="Unpaid">Unpaid</Option>
                    <Option value="Partial">Partial</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    icon={<FilterOutlined />}
                    onClick={generateReport}
                  >
                    Generate Report
                  </Button>
                </Form.Item>
              </Form>
              <div className="flex space-x-4">
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

export default CreditSalesAgingReport;