"use client";
import React, { useState, useEffect } from "react";
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
} from "antd";
import {
  FilterOutlined,
  FilePdfOutlined,
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  UserOutlined,
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

const DebtorReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs().startOf("month"), // Start of the month
    toDate: dayjs().endOf("month"), // End of the month
  });
  const [debtorsData, setDebtorsData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [searchText, setSearchText] = useState(""); // State for search text
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 }); // Pagination state

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleFilterChange = (changedValues, allValues) => {
    const { fromDate, toDate } = allValues;
    setFilters({
      fromDate: fromDate ? dayjs(fromDate) : dayjs().startOf("month"),
      toDate: toDate ? dayjs(toDate) : dayjs().endOf("month"),
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
  const calculateAgingAnalysis = (invoices) => {
    const today = dayjs();
    const agingAnalysis = { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 };

    invoices.forEach((invoice) => {
      const invoiceDate = dayjs(invoice.invoiceDate);
      const daysDiff = today.diff(invoiceDate, "day");

      if (daysDiff >= 0 && daysDiff <= 30) {
        agingAnalysis["0-30"] += invoice.amount;
      } else if (daysDiff > 30 && daysDiff <= 60) {
        agingAnalysis["31-60"] += invoice.amount;
      } else if (daysDiff > 60 && daysDiff <= 90) {
        agingAnalysis["61-90"] += invoice.amount;
      } else if (daysDiff > 90) {
        agingAnalysis["90+"] += invoice.amount;
      }
    });

    return agingAnalysis;
  };

  const mockDebtorsData = [
    {
      id: "D001",
      debtorName: "Corporate Debtor A",
      contactDetails: "corporateA@example.com",
      accountNumber: "ACC001",
      branch: "Nairobi",
      outstandingBalance: 150000.0,
      invoices: [
        {
          invoiceNumber: "INV001",
          invoiceDate: "2024-10-01",
          dueDate: "2024-11-01",
          amount: 50000,
        },
        {
          invoiceNumber: "INV002",
          invoiceDate: "2023-09-15",
          dueDate: "2023-10-15",
          amount: 70000,
        },
        {
          invoiceNumber: "INV003",
          invoiceDate: "2023-08-20",
          dueDate: "2023-09-20",
          amount: 30000,
        },
      ],
      paymentHistory: [
        {
          paymentDate: "2023-09-01",
          amount: 20000,
          transactionId: "TXN001",
          modeOfPayment: "Bank Transfer",
        },
        {
          paymentDate: "2023-08-01",
          amount: 30000,
          transactionId: "TXN002",
          modeOfPayment: "Cheque",
        },
        {
          paymentDate: "2023-07-15",
          amount: 15000,
          transactionId: "TXN004",
          modeOfPayment: "Credit Card",
        },
        {
          paymentDate: "2023-06-20",
          amount: 25000,
          transactionId: "TXN005",
          modeOfPayment: "Cash",
        },
      ],
      creditLimit: 200000,
      riskLevel: "Medium",
      followUpNotes: "Follow-up email sent on 2023-10-15.",
      followUpPerson: "John Doe",
      followUpRole: "Account Manager",
      paymentTerms: "Net 30",
      lateFees: 500,
      adjustments: 0,
      writeOffs: 0,
    },
    {
      id: "D002",
      debtorName: "Professional Debtor B",
      contactDetails: "professionalB@example.com",
      accountNumber: "ACC002",
      branch: "Mombasa",
      outstandingBalance: 75000.0,
      invoices: [
        {
          invoiceNumber: "INV004",
          invoiceDate: "2023-10-10",
          dueDate: "2023-11-10",
          amount: 25000,
        },
        {
          invoiceNumber: "INV005",
          invoiceDate: "2023-09-20",
          dueDate: "2023-10-20",
          amount: 50000,
        },
      ],
      paymentHistory: [
        {
          paymentDate: "2023-09-15",
          amount: 10000,
          transactionId: "TXN003",
          modeOfPayment: "Cash",
        },
        {
          paymentDate: "2023-08-25",
          amount: 20000,
          transactionId: "TXN006",
          modeOfPayment: "Bank Transfer",
        },
        {
          paymentDate: "2023-07-30",
          amount: 15000,
          transactionId: "TXN007",
          modeOfPayment: "Credit Card",
        },
      ],
      creditLimit: 100000,
      riskLevel: "Low",
      followUpNotes: "No follow-up required.",
      followUpPerson: "Jane Smith",
      followUpRole: "Finance Officer",
      paymentTerms: "Net 60",
      lateFees: 0,
      adjustments: 0,
      writeOffs: 0,
    },
  ];

  const generateReport = () => {
    const { fromDate, toDate } = form.getFieldsValue();

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
      // Calculate aging analysis dynamically for each debtor
      const updatedDebtorsData = mockDebtorsData.map((debtor) => ({
        ...debtor,
        agingAnalysis: calculateAgingAnalysis(debtor.invoices),
      }));

      setDebtorsData(updatedDebtorsData);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Debtors Report generated successfully.",
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
    doc.text("Debtors Report", 70, 30);

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
    doc.text(" Debtors Report Information", margin.left + 5, 60);
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

    // Add Debtors Table to PDF
    doc.autoTable({
      startY: 100,
      head: [
        [
          "DEBTOR NAME",
          "BRANCH",
          "OUTSTANDING BALANCE",
          "RISK LEVEL",
          "CREDIT LIMIT",
          "UTILIZATION",
        ],
      ],
      body: debtorsData.map((item) => [
        item.debtorName,
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
    doc.save(`debtors_report_${dayjs().format("DD-MM-YYYY")}.pdf`);

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

  // Filter data based on search text
  const filteredData = debtorsData.filter((item) => {
    return (
      item.debtorName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.contactDetails.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const debtorsColumns = [
    {
      title: "DEBTOR NAME",
      dataIndex: "debtorName",
      key: "debtorName",
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
      render: (riskLevel) => {
        let color =
          riskLevel === "High"
            ? "red"
            : riskLevel === "Medium"
            ? "orange"
            : "green";
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

  const totalReceivables = debtorsData.reduce(
    (sum, item) => sum + (item.outstandingBalance || 0),
    0
  );

  const collapseItems = [
    {
      key: "1",
      label: "Debtors Report",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={24} key="total-receivables">
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
          </Row>

          {/* Search Input */}
          <div className="mb-4">
            <Input
              placeholder="Search by Debtor Name or Contact Details"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </div>

          <Table
            dataSource={filteredData}
            columns={debtorsColumns}
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
                  <Row gutter={16}>
                    <Col span={6} key={`aging-0-30-${record.id}`}>
                      <Statistic
                        title="0-30 Days"
                        value={formatNumber(record.agingAnalysis["0-30"])}
                      />
                    </Col>
                    <Col span={6} key={`aging-31-60-${record.id}`}>
                      <Statistic
                        title="31-60 Days"
                        value={formatNumber(record.agingAnalysis["31-60"])}
                      />
                    </Col>
                    <Col span={6} key={`aging-61-90-${record.id}`}>
                      <Statistic
                        title="61-90 Days"
                        value={formatNumber(record.agingAnalysis["61-90"])}
                      />
                    </Col>
                    <Col span={6} key={`aging-90+-${record.id}`}>
                      <Statistic
                        title="90+ Days"
                        value={formatNumber(record.agingAnalysis["90+"])}
                      />
                    </Col>
                  </Row>
                  <Title level={4} className="mt-4">
                    Invoice Details
                  </Title>
                  <hr />
                  <Table
                    dataSource={record.invoices}
                    columns={[
                      {
                        title: "Invoice Number",
                        dataIndex: "invoiceNumber",
                        key: "invoiceNumber",
                      },
                      {
                        title: "Invoice Date",
                        dataIndex: "invoiceDate",
                        key: "invoiceDate",
                      },
                      {
                        title: "Due Date",
                        dataIndex: "dueDate",
                        key: "dueDate",
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
                    rowKey="invoiceNumber"
                  />
                  <Title level={4} className="mt-4">
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
                  <Title level={5} className="mt-4">
                    Terms and Conditions
                  </Title>
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
                    <Link href="/">
                      <HomeOutlined /> Home
                    </Link>
                  ),
                },
                { title: "Debtors Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Debtors Report
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
                }}
              >
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format="DD-MM-YYYY" />
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

export default DebtorReport;
