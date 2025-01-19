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
  ShoppingOutlined,
  LineChartOutlined,
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

const BalanceSheet = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    asOfDate: dayjs().endOf("month"), // Specific date for the balance sheet
  });
  const [reportData, setReportData] = useState([]);
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
      const data = [
        // Current Assets
        { id: "0001", category: "Cash and Cash Equivalents", amount: 30000 },
        { id: "0002", category: "Accounts Receivable", amount: 20000 },
        { id: "0003", category: "Inventory", amount: 30000 },
        { id: "0004", category: "Total Current Assets", amount: 80000, isTotal: true },

        // Non-Current Assets
        { id: "0005", category: "Property, Plant, and Equipment", amount: 70000 },
        { id: "0006", category: "Intangible Assets", amount: 10000 },
        { id: "0007", category: "Total Non-Current Assets", amount: 80000, isTotal: true },

        // Total Assets
        { id: "0008", category: "Total Assets", amount: 160000, isTotal: true },

        // Current Liabilities
        { id: "0009", category: "Accounts Payable", amount: -15000 },
        { id: "0010", category: "Short-Term Debt", amount: -15000 },
        { id: "0011", category: "Total Current Liabilities", amount: -30000, isTotal: true },

        // Non-Current Liabilities
        { id: "0012", category: "Long-Term Debt", amount: -20000 },
        { id: "0013", category: "Deferred Tax Liabilities", amount: -10000 },
        { id: "0014", category: "Total Non-Current Liabilities", amount: -30000, isTotal: true },

        // Total Liabilities
        { id: "0015", category: "Total Liabilities", amount: -60000, isTotal: true },

        // Equity
        { id: "0016", category: "Common Stock", amount: 50000 },
        { id: "0017", category: "Retained Earnings", amount: 50000 },
        { id: "0018", category: "Total Equity", amount: 100000, isTotal: true },
      ];
      setReportData(data);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Balance Sheet generated successfully.",
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
    doc.text("Balance Sheet", 70, 30);

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
    doc.text(" Balance Sheet Information", margin.left + 5, 60);
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

    const summaryY = 100;
    const cardWidth = (doc.internal.pageSize.width - 50) / 3;
    const cardHeight = 30;
    const metrics = [
      { title: "Total Assets", value: totalAssets, color: "#4caf50" },
      { title: "Total Liabilities", value: totalLiabilities, color: "#f44336" },
      { title: "Total Equity", value: totalEquity, color: "#2196f3" },
    ];

    metrics.forEach((metric, index) => {
      const x = margin.left + cardWidth * index + 5 * index;
      doc.setFillColor(metric.color);
      doc.roundedRect(x, summaryY, cardWidth, cardHeight, 2, 2, "F");
      doc.setTextColor("#FFFFFF");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(metric.title, x + 5, summaryY + 10);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`KES :  ${metric.value.toLocaleString()}`, x + 5, summaryY + 20);
    });

    doc.autoTable({
      startY: summaryY + cardHeight + 20,
      head: [["Category", "Amount (KES)"]],
      body: reportData.map((item) => [
        item.category,
        item.amount.toLocaleString(),
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
        0: { cellWidth: 120 },
        1: { halign: "right", cellWidth: 80 },
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
    doc.save(`balance_sheet_${dayjs().format("DD-MM-YYYY")}.pdf`);

    notificationApi.success({
      message: "PDF Export Complete",
      description: "Your report has been successfully exported.",
      placement: "topRight",
      className: "bg-green-50",
    });
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text, record) => (
        <span style={{ fontWeight: record.isTotal ? "bold" : "normal" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => (
        <span style={{ fontWeight: record.isTotal ? "bold" : "normal" }}>
          KES {amount.toLocaleString()}
        </span>
      ),
      align: "right",
    },
  ];

  const totalAssets =
    reportData.find((item) => item.category === "Total Assets")?.amount || 0;
  const totalLiabilities =
    reportData.find((item) => item.category === "Total Liabilities")?.amount || 0;
  const totalEquity =
    reportData.find((item) => item.category === "Total Equity")?.amount || 0;

  const collapseItems = [
    {
      key: "1",
      label: "Balance Sheet",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={8}>
              <Card className="bg-blue-50">
                <div className="flex items-center">
                  <DollarOutlined className="text-blue-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Assets
                  </Text>
                </div>
                <Title level={4}>KES : {totalAssets.toLocaleString()}</Title>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="bg-red-50">
                <div className="flex items-center">
                  <ShoppingOutlined className="text-red-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Liabilities
                  </Text>
                </div>
                <Title level={4}> KES : {totalLiabilities.toLocaleString()}</Title>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="bg-green-50">
                <div className="flex items-center">
                  <LineChartOutlined className="text-green-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Equity
                  </Text>
                </div>
                <Title level={4} className="font-bold">
                  KES : {totalEquity.toLocaleString()}
                </Title>
              </Card>
            </Col>
          </Row>
          <Table
            dataSource={reportData}
            columns={columns}
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
                { title: "Balance Sheet" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Balance Sheet
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

export default BalanceSheet;