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
  Statistic,
  Input,
  Select,
} from "antd";
import {
  BarChartOutlined,
  FilterOutlined,
  FilePdfOutlined,
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
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

const VATReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs().startOf("month"), // Start of the month
    toDate: dayjs().endOf("month"), // End of the month
    taxPeriod: "monthly", // Default tax period
    whtRate: 3, // Default WHT rate
  });
  const [vatData, setVatData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [searchText, setSearchText] = useState(""); // State for search text
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleFilterChange = (changedValues, allValues) => {
    const { fromDate, toDate, taxPeriod, whtRate } = allValues;
    setFilters({
      fromDate: fromDate ? dayjs(fromDate) : dayjs().startOf("month"),
      toDate: toDate ? dayjs(toDate) : dayjs().endOf("month"),
      taxPeriod: taxPeriod || "monthly",
      whtRate: whtRate || 3,
    });
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const mockVatData = [
    {
      id: "V001",
      invoiceNumber: "INV001",
      invoiceDate: "2024-01-15",
      customerName: "Customer A",
      taxableAmount: 10000.0,
      vatRate: 16,
      vatAmount: 1600.0,
      totalAmount: 11600.0,
      transactionType: "Sale",
      vatType: "Output VAT",
      whtAmount: 300.0, // WHT amount
      netPayment: 11300.0, // Net payment after WHT
    },
    {
      id: "V002",
      invoiceNumber: "INV002",
      invoiceDate: "2024-01-20",
      customerName: "Customer B",
      taxableAmount: 5000.0,
      vatRate: 16,
      vatAmount: 800.0,
      totalAmount: 5800.0,
      transactionType: "Sale",
      vatType: "Output VAT",
      whtAmount: 150.0, // WHT amount
      netPayment: 5650.0, // Net payment after WHT
    },
    {
      id: "V003",
      invoiceNumber: "INV003",
      invoiceDate: "2024-01-25",
      customerName: "Supplier X",
      taxableAmount: 2000.0,
      vatRate: 16,
      vatAmount: 320.0,
      totalAmount: 2320.0,
      transactionType: "Purchase",
      vatType: "Input VAT",
      whtAmount: 60.0, // WHT amount
      netPayment: 2260.0, // Net payment after WHT
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
      setVatData(mockVatData);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "VAT Report Generated",
        description: "VAT Report generated successfully.",
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
    doc.text("VAT and WHT Report", 70, 30);

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
    doc.text(" VAT and WHT Report Information", margin.left + 5, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(brandColors.gray);
    doc.text(
      `From: ${filters.fromDate.format("DD-MM-YYYY")} To: ${filters.toDate.format(
        "DD-MM-YYYY"
      )}`,
      margin.left + 5,
      70
    );
    doc.text(`Generated : ${reportGeneratedTime}`, margin.left + 5, 80);
    doc.text(
      `Generated by : ${generatedBy}`,
      doc.internal.pageSize.width - 80,
      80
    );

    // Add VAT and WHT Table to PDF
    doc.autoTable({
      startY: 100,
      head: [
        [
          "Invoice No.",
          "Invoice Date",
          "Customer | Supplier",
          "Taxable Amount",
          "VAT Rate (%)",
          "VAT Amount",
          "WHT Amount",
          "Net Payment",
          "Total Amount",
          "Transaction Type",
          "VAT Type",
        ],
      ],
      body: vatData.map((item) => [
        item.invoiceNumber,
        item.invoiceDate,
        item.customerName,
        formatNumber(item.taxableAmount),
        item.vatRate,
        formatNumber(item.vatAmount),
        formatNumber(item.whtAmount),
        formatNumber(item.netPayment),
        formatNumber(item.totalAmount),
        item.transactionType,
        item.vatType,
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
        2: { cellWidth: 40 },
        3: { halign: "right", cellWidth: 30 },
        4: { halign: "right", cellWidth: 20 },
        5: { halign: "right", cellWidth: 30 },
        6: { halign: "right", cellWidth: 30 },
        7: { halign: "right", cellWidth: 30 },
        8: { halign: "right", cellWidth: 30 },
        9: { cellWidth: 30 },
        10: { cellWidth: 30 },
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
    doc.save(`vat_wht_report_${dayjs().format("DD-MM-YYYY")}.pdf`);

    notificationApi.success({
      message: "PDF Export Complete",
      description: "Your VAT and WHT report has been successfully exported.",
      placement: "topRight",
      className: "bg-green-50",
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 }); // Reset to the first page on search
  };

  const filteredData = vatData.filter((item) => {
    return (
      item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const vatColumns = [
    {
      title: "Invoice No",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
    },
    {
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
    },
    {
      title: "Customer | Supplier",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Taxable Amount",
      dataIndex: "taxableAmount",
      key: "taxableAmount",
      render: (taxableAmount) => <span>{formatNumber(taxableAmount)}</span>,
      align: "right",
    },
    {
      title: "VAT Rate (%)",
      dataIndex: "vatRate",
      key: "vatRate",
      align: "right",
    },
    {
      title: "VAT Amount",
      dataIndex: "vatAmount",
      key: "vatAmount",
      render: (vatAmount) => <span>{formatNumber(vatAmount)}</span>,
      align: "right",
    },
    {
      title: "WHT Amount",
      dataIndex: "whtAmount",
      key: "whtAmount",
      render: (whtAmount) => <span>{formatNumber(whtAmount)}</span>,
      align: "right",
    },
    {
      title: "Net Payment",
      dataIndex: "netPayment",
      key: "netPayment",
      render: (netPayment) => <span>{formatNumber(netPayment)}</span>,
      align: "right",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount) => <span>{formatNumber(totalAmount)}</span>,
      align: "right",
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      key: "transactionType",
    },
    {
      title: "VAT Type",
      dataIndex: "vatType",
      key: "vatType",
      render: (vatType) => {
        let color = vatType === "Output VAT" ? "blue" : "green";
        return <Tag color={color}>{vatType}</Tag>;
      },
    },
  ];

  const totalOutputVAT = vatData
    .filter((item) => item.vatType === "Output VAT")
    .reduce((sum, item) => sum + (item.vatAmount || 0), 0);

  const totalInputVAT = vatData
    .filter((item) => item.vatType === "Input VAT")
    .reduce((sum, item) => sum + (item.vatAmount || 0), 0);

  const totalWHT = vatData.reduce((sum, item) => sum + (item.whtAmount || 0), 0);

  const netVAT = totalOutputVAT - totalInputVAT;

  const collapseItems = [
    {
      key: "1",
      label: "VAT and WHT Report",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={6} key="total-output-vat">
              <Card className="bg-blue-50">
                <div className="flex items-center">
                  <BarChartOutlined className="text-blue-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Output VAT
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalOutputVAT)}</Title>
              </Card>
            </Col>
            <Col span={6} key="total-input-vat">
              <Card className="bg-green-50">
                <div className="flex items-center">
                  <BarChartOutlined className="text-green-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Input VAT
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalInputVAT)}</Title>
              </Card>
            </Col>
            <Col span={6} key="total-wht">
              <Card className="bg-orange-50">
                <div className="flex items-center">
                  <BarChartOutlined className="text-orange-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total WHT
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalWHT)}</Title>
              </Card>
            </Col>
            <Col span={6} key="net-vat">
              <Card className="bg-purple-50">
                <div className="flex items-center">
                  <BarChartOutlined className="text-purple-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Net VAT
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(netVAT)}</Title>
              </Card>
            </Col>
          </Row>

          {/* Search Input */}
          <div className="mb-4">
            <Input
              placeholder="Search by Customer/Supplier or Invoice Number"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </div>

          <Table
            dataSource={filteredData}
            columns={vatColumns}
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
                From : {filters.fromDate.format("DD-MM-YYYY")} &nbsp; To :{" "}
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
                { title: "WHT Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                WithHolding Tax (WHT) Report
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
                  taxPeriod: filters.taxPeriod,
                  whtRate: filters.whtRate,
                }}
              >
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="taxPeriod" label="Tax Period">
                  <Select style={{ width: 120 }}>
                    <Option value="monthly">Monthly</Option>
                    <Option value="quarterly">Quarterly</Option>
                    <Option value="yearly">Yearly</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="whtRate" label="WHT Rate (%)">
                  <Input type="number" min={0} max={100} />
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

export default VATReport;