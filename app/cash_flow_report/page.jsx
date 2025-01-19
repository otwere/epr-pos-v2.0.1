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

const CashFlowStatement = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs().startOf("month"), // Start of the month
    toDate: dayjs().endOf("month"), // End of the month
  });
  const [cashFlowData, setCashFlowData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");

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

  const generateReport = () => {
    const { fromDate, toDate } = form.getFieldsValue();

    if (!fromDate || !toDate) {
      notificationApi.error({
        message: "Date Selection Required",
        description: "Please select both 'From Date' and 'To Date' to generate the report.",
        placement: "topRight",
        className: "bg-red-50",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Mock data with realistic figures
      const data = [
        // Operating Activities
        { id: "0001", accountCode: "1001", accountName: "Cash Receipts from Customers", description: "Sales Revenue", moneyOut: null, moneyIn: 500000.0 },
        { id: "0002", accountCode: "1002", accountName: "Cash Paid to Suppliers", description: "Cost of Goods Sold", moneyOut: 300000.0, moneyIn: null },
        { id: "0003", accountCode: "1003", accountName: "Cash Paid for Operating Expenses", description: "Rent, Utilities, Salaries", moneyOut: 150000.0, moneyIn: null },

        // Investing Activities
        { id: "0004", accountCode: "2001", accountName: "Purchase of Equipment", description: "Capital Expenditure", moneyOut: 100000.0, moneyIn: null },
        { id: "0005", accountCode: "2002", accountName: "Sale of Investments", description: "Investment Income", moneyOut: null, moneyIn: 50000.0 },

        // Financing Activities
        { id: "0006", accountCode: "3001", accountName: "Proceeds from Bank Loan", description: "Loan Received", moneyOut: null, moneyIn: 200000.0 },
        { id: "0007", accountCode: "3002", accountName: "Repayment of Bank Loan", description: "Loan Repayment", moneyOut: 50000.0, moneyIn: null },
        { id: "0008", accountCode: "3003", accountName: "Dividends Paid", description: "Dividends", moneyOut: 30000.0, moneyIn: null },

        // Totals
        { id: "0009", accountCode: null, accountName: "Net Cash from Operating Activities", description: null, moneyOut: null, moneyIn: 50000.0 },
        { id: "0010", accountCode: null, accountName: "Net Cash from Investing Activities", description: null, moneyOut: 50000.0, moneyIn: null },
        { id: "0011", accountCode: null, accountName: "Net Cash from Financing Activities", description: null, moneyOut: 80000.0, moneyIn: null },
        { id: "0012", accountCode: null, accountName: "Net Increase in Cash", description: null, moneyOut: null, moneyIn: 20000.0 },
      ];

      setCashFlowData(data);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Cash Flow Statement generated successfully.",
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
    doc.text("Cash Flow Statement", 70, 30);

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
    doc.text(" Cash Flow Statement Information", margin.left + 5, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(brandColors.gray);
    doc.text(
      `From: ${filters.fromDate.format("DD-MM-YYYY")} To: ${filters.toDate.format("DD-MM-YYYY")}`,
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
      head: [["ACCOUNT CODE", "ACCOUNT NAME", "DESCRIPTION", "MONEY OUT", "MONEY IN"]],
      body: cashFlowData.map((item) => [
        item.accountCode,
        item.accountName,
        item.description,
        formatNumber(item.moneyOut),
        formatNumber(item.moneyIn),
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
        0: { cellWidth: 40 },
        1: { cellWidth: 80 },
        2: { cellWidth: 80 },
        3: { halign: "right", cellWidth: 50 },
        4: { halign: "right", cellWidth: 50 },
      },
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      didDrawCell: (data) => {
        // Make Net Cash rows bold
        if (data.row.index === cashFlowData.length - 4 || data.row.index === cashFlowData.length - 3 || data.row.index === cashFlowData.length - 2 || data.row.index === cashFlowData.length - 1) {
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
    doc.save(`cash_flow_statement_${dayjs().format("DD-MM-YYYY")}.pdf`);

    notificationApi.success({
      message: "PDF Export Complete",
      description: "Your report has been successfully exported.",
      placement: "topRight",
      className: "bg-green-50",
    });
  };

  const cashFlowColumns = [
    {
      title: "ACCOUNT CODE",
      dataIndex: "accountCode",
      key: "accountCode",
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "MONEY OUT",
      dataIndex: "moneyOut",
      key: "moneyOut",
      render: (moneyOut, record) => {
        if (record.accountName && record.accountName.startsWith("Net Cash")) {
          return <Text strong>{formatNumber(moneyOut)}</Text>;
        }
        return <span>{formatNumber(moneyOut)}</span>;
      },
      align: "right",
    },
    {
      title: "MONEY IN",
      dataIndex: "moneyIn",
      key: "moneyIn",
      render: (moneyIn, record) => {
        if (record.accountName && record.accountName.startsWith("Net Cash")) {
          return <Text strong>{formatNumber(moneyIn)}</Text>;
        }
        return <span>{formatNumber(moneyIn)}</span>;
      },
      align: "right",
    },
  ];

  const totalMoneyOut = cashFlowData.reduce((sum, item) => sum + (item.moneyOut || 0), 0);
  const totalMoneyIn = cashFlowData.reduce((sum, item) => sum + (item.moneyIn || 0), 0);

  // Remove the "Total" row
  const tableDataWithTotal = [
    ...cashFlowData,
  ];

  const collapseItems = [
    {
      key: "1",
      label: "Cash Flow Statement",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={12}>
              <Card className="bg-blue-50">
                <div className="flex items-center">
                  <DollarOutlined className="text-blue-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Money Out
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalMoneyOut)}</Title>
              </Card>
            </Col>
            <Col span={12}>
              <Card className="bg-red-50">
                <div className="flex items-center">
                  <DollarOutlined className="text-red-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Money In
                  </Text>
                </div>
                <Title level={4}> KES : {formatNumber(totalMoneyIn)}</Title>
              </Card>
            </Col>
          </Row>
          <Table
            dataSource={tableDataWithTotal}
            columns={cashFlowColumns}
            rowKey="id"
            pagination={false}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <Text strong className="text-lg">Total</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong className="text-lg">{formatNumber(totalMoneyOut)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  <Text strong className="text-lg">{formatNumber(totalMoneyIn)}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
          <div className="mt-4 text-gray-500 font-bold text-lg">
            <p className="text-sm flex justify-between items-center">
              <span className="text-left">
                Report Generated on : {reportGeneratedTime}
              </span>
              <span className="text-center flex-1">
                From : {filters.fromDate.format("DD-MM-YYYY")} To : {filters.toDate.format("DD-MM-YYYY")}
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
                { title: "Cash Flow Statement" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Cash Flow Statement
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

export default CashFlowStatement;