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

const ZReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs().startOf("day"), // Start of the day
    toDate: dayjs().endOf("day"), // End of the day
  });
  const [zReportData, setZReportData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleFilterChange = (changedValues, allValues) => {
    const { fromDate, toDate } = allValues;
    setFilters({
      fromDate: fromDate ? dayjs(fromDate) : dayjs().startOf("day"),
      toDate: toDate ? dayjs(toDate) : dayjs().endOf("day"),
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
        { id: "0001", transactionId: "TXN001", description: "Sales Revenue", amount: 150000.0, tax: 15000.0, total: 165000.0 },
        { id: "0002", transactionId: "TXN002", description: "Service Revenue", amount: 50000.0, tax: 5000.0, total: 55000.0 },
        { id: "0003", transactionId: "TXN003", description: "Refund", amount: -10000.0, tax: -1000.0, total: -11000.0 },
        { id: "0004", transactionId: "TXN004", description: "Discount", amount: -5000.0, tax: -500.0, total: -5500.0 },
      ];

      setZReportData(data);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Z-Report generated successfully.",
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
    doc.text("Z-Report", 70, 30);

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
    doc.text(" Z-Report Information", margin.left + 5, 60);
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
      head: [["TRANSACTION ID", "DESCRIPTION", "AMOUNT", "TAX", "TOTAL"]],
      body: zReportData.map((item) => [
        item.transactionId,
        item.description,
        formatNumber(item.amount),
        formatNumber(item.tax),
        formatNumber(item.total),
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
        2: { halign: "right", cellWidth: 50 },
        3: { halign: "right", cellWidth: 50 },
        4: { halign: "right", cellWidth: 50 },
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
    doc.save(`z_report_${dayjs().format("DD-MM-YYYY")}.pdf`);

    notificationApi.success({
      message: "PDF Export Complete",
      description: "Your report has been successfully exported.",
      placement: "topRight",
      className: "bg-green-50",
    });
  };

  const zReportColumns = [
    {
      title: "TRANSACTION ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <span>{formatNumber(amount)}</span>,
      align: "right",
    },
    {
      title: "TAX",
      dataIndex: "tax",
      key: "tax",
      render: (tax) => <span>{formatNumber(tax)}</span>,
      align: "right",
    },
    {
      title: "TOTAL",
      dataIndex: "total",
      key: "total",
      render: (total) => <span>{formatNumber(total)}</span>,
      align: "right",
    },
  ];

  const totalAmount = zReportData.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalTax = zReportData.reduce((sum, item) => sum + (item.tax || 0), 0);
  const totalTotal = zReportData.reduce((sum, item) => sum + (item.total || 0), 0);

  const collapseItems = [
    {
      key: "1",
      label: "Z-Report",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={8}>
              <Card className="bg-blue-50">
                <div className="flex items-center">
                  <DollarOutlined className="text-blue-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Amount
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalAmount)}</Title>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="bg-red-50">
                <div className="flex items-center">
                  <DollarOutlined className="text-red-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Tax
                  </Text>
                </div>
                <Title level={4}> KES : {formatNumber(totalTax)}</Title>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="bg-green-50">
                <div className="flex items-center">
                  <DollarOutlined className="text-green-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total
                  </Text>
                </div>
                <Title level={4}> KES : {formatNumber(totalTotal)}</Title>
              </Card>
            </Col>
          </Row>
          <Table
            dataSource={zReportData}
            columns={zReportColumns}
            rowKey="id"
            pagination={false}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <Text strong className="text-lg">Total</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong className="text-lg">{formatNumber(totalAmount)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  <Text strong className="text-lg">{formatNumber(totalTax)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  <Text strong className="text-lg">{formatNumber(totalTotal)}</Text>
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
                { title: "Z-Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Z-Report
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

export default ZReport;