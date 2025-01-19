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
} from "antd";
import {
  FilterOutlined,
  FilePdfOutlined,
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  DollarOutlined,
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

const TrialBalance = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    asOfDate: dayjs().endOf("month"), // Specific date for the trial balance
  });
  const [trialBalanceData, setTrialBalanceData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleFilterChange = (changedValues, allValues) => {
    const { asOfDate } = allValues;
    setFilters({
      asOfDate: asOfDate ? dayjs(asOfDate) : dayjs().endOf("month"),
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
    const { asOfDate } = form.getFieldsValue();

    if (!asOfDate) {
      notificationApi.error({
        message: "Date Selection Required",
        description: "Please select the 'As of Date' to generate the report.",
        placement: "topRight",
        className: "bg-red-50",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Mock data with realistic figures
      const data = [
        // Assets
        { id: "0001", accountType: "ASSETS", subAccountType: "Banks", account: "Cash", debit: 150000.0, credit: null },
        { id: "0002", accountType: "ASSETS", subAccountType: "Banks", account: "GOLDURBAN EQUITY Bank", debit: 500000.0, credit: null },
        { id: "0003", accountType: "ASSETS", subAccountType: "Receivables", account: "Accounts Receivable", debit: 200000.0, credit: null },

        // Liabilities
        { id: "0004", accountType: "LIABILITIES", subAccountType: "Current Liability", account: "Accounts Payable", debit: null, credit: 300000.0 },
        { id: "0005", accountType: "LIABILITIES", subAccountType: "Loans", account: "Bank Loan", debit: null, credit: 400000.0 },

        // Equity Capital
        { id: "0006", accountType: "EQUITY CAPITAL", subAccountType: "Equity Accounts", account: "Share Capital", debit: null, credit: 1000000.0 },
        { id: "0007", accountType: "EQUITY CAPITAL", subAccountType: "Retained Earnings", account: "Retained Earnings", debit: null, credit: 150000.0 },

        // Expenses
        { id: "0008", accountType: "EXPENSES", subAccountType: "Operating Expenses", account: "Rent Expense", debit: 50000.0, credit: null },
        { id: "0009", accountType: "EXPENSES", subAccountType: "Operating Expenses", account: "Utilities Expense", debit: 20000.0, credit: null },
        { id: "0010", accountType: "EXPENSES", subAccountType: "Operating Expenses", account: "Salaries Expense", debit: 300000.0, credit: null },

        // Totals
        { id: "0011", accountType: null, subAccountType: null, account: "TT DR", debit: 1220000.0, credit: null },
        { id: "0012", accountType: null, subAccountType: null, account: "TT CR", debit: null, credit: 1220000.0 },
      ];

      setTrialBalanceData(data);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Trial Balance generated successfully.",
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
    doc.text("Trial Balance", 70, 30);

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
    doc.text(" Trial Balance Information", margin.left + 5, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(brandColors.gray);
    doc.text(
      `As of: ${filters.asOfDate.format("DD-MM-YYYY")}`,
      margin.left + 5,
      70
    );
    doc.text(`Generated : ${reportGeneratedTime}`, margin.left + 5, 80);
    doc.text(
      `Generated by : ${generatedBy}`,
      doc.internal.pageSize.width - 80,
      80
    );

    doc.autoTable({
      startY: 100,
      head: [["ACCOUNTS TYPE", "SUB-ACCOUNTS TYPE", "ACCOUNTS", "TOTAL DEBIT", "TOTAL CREDIT"]],
      body: trialBalanceData.map((item) => [
        item.accountType,
        item.subAccountType,
        item.account,
        formatNumber(item.debit),
        formatNumber(item.credit),
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
        1: { cellWidth: 80 },
        2: { cellWidth: 80 },
        3: { halign: "right", cellWidth: 50 },
        4: { halign: "right", cellWidth: 50 },
      },
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      didDrawCell: (data) => {
        // Make TT DR and TT CR rows bold
        if (data.row.index === trialBalanceData.length - 2 || data.row.index === trialBalanceData.length - 1) {
          doc.setFont("helvetica", "bold");
        } else {
          doc.setFont("helvetica", "normal");
        }
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
    doc.save(`trial_balance_${dayjs().format("DD-MM-YYYY")}.pdf`);

    notificationApi.success({
      message: "PDF Export Complete",
      description: "Your report has been successfully exported.",
      placement: "topRight",
      className: "bg-green-50",
    });
  };

  const trialBalanceColumns = [
    {
      title: "ACCOUNTS TYPE",
      dataIndex: "accountType",
      key: "accountType",
    },
    {
      title: "SUB-ACCOUNTS TYPE",
      dataIndex: "subAccountType",
      key: "subAccountType",
    },
    {
      title: "ACCOUNTS",
      dataIndex: "account",
      key: "account",
      render: (text, record) => {
        if (record.account === "TT DR" || record.account === "TT CR") {
          return <Text strong>{text}</Text>;
        }
        return text;
      },
    },
    {
      title: "TOTAL DEBIT",
      dataIndex: "debit",
      key: "debit",
      render: (debit, record) => {
        if (record.account === "TT DR" || record.account === "TT CR") {
          return <Text strong>{formatNumber(debit)}</Text>;
        }
        return <span>{formatNumber(debit)}</span>;
      },
      align: "right",
    },
    {
      title: "TOTAL CREDIT",
      dataIndex: "credit",
      key: "credit",
      render: (credit, record) => {
        if (record.account === "TT DR" || record.account === "TT CR") {
          return <Text strong>{formatNumber(credit)}</Text>;
        }
        return <span>{formatNumber(credit)}</span>;
      },
      align: "right",
    },
  ];

  const totalDebits = trialBalanceData.reduce((sum, item) => sum + (item.debit || 0), 0);
  const totalCredits = trialBalanceData.reduce((sum, item) => sum + (item.credit || 0), 0);

  const collapseItems = [
    {
      key: "1",
      label: "Trial Balance",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={12}>
              <Card className="bg-blue-50">
                <div className="flex items-center">
                  <DollarOutlined className="text-blue-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Debits
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalDebits)}</Title>
              </Card>
            </Col>
            <Col span={12}>
              <Card className="bg-red-50">
                <div className="flex items-center">
                  <DollarOutlined className="text-red-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Credits
                  </Text>
                </div>
                <Title level={4}> KES : {formatNumber(totalCredits)}</Title>
              </Card>
            </Col>
          </Row>
          <Table
            dataSource={trialBalanceData}
            columns={trialBalanceColumns}
            rowKey="id"
            pagination={false}
          />
          <div className="mt-4 text-gray-800 font-semibold text-lg">
            <p className="text-sm flex justify-between items-center">
              <span className="text-left">
                Report Generated on : {reportGeneratedTime}
              </span>
              <span className="text-center flex-1">
                As of :{" "}
                {filters.asOfDate
                  ? filters.asOfDate.format("DD-MM-YYYY")
                  : "N/A"}
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
                { title: "Trial Balance" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Trial Balance
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
                  asOfDate: filters.asOfDate,
                }}
              >
                <Form.Item name="asOfDate" label="As of Date">
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
                <Button type="primary" icon={<FilePdfOutlined />} onClick={exportToPDF}>
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

export default TrialBalance;