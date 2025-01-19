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
  Skeleton,
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

const SummaryDailyReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs().startOf("month"),
    toDate: dayjs().endOf("month"),
  });
  const [reportData, setReportData] = useState(null);
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
      const data = {
        salesSummary: {
          totalSales: 162268.97,
          paidSales: 160000.0,
          dueSales: 2268.97,
        },
        paymentModes: [
          { id: "1", accountName: "Cash", accountNo: "", payments: 0.0, expense: 0.0, net: 0.0 },
          { id: "2", accountName: "GOLDURBAN EQUITY Bank", accountNo: "029076454", payments: 160000.0, expense: 0.0, net: 160000.0 },
          { id: "3", accountName: "Credit Card", accountNo: "123456789", payments: 5000.0, expense: 0.0, net: 5000.0 },
        ],
        receivables: [
          { id: "1", invoiceNo: "INV001", salesDate: "01-10-2023", customerName: "John Doe", description: "Product A", amountPaid: 1000.0 },
          { id: "2", invoiceNo: "INV002", salesDate: "02-10-2023", customerName: "Jane Smith", description: "Product B", amountPaid: 2000.0 },
        ],
        paymentsToSuppliers: [
          { id: "1", purchaseNo: "PUR001", purchaseDate: "01-10-2023", supplierName: "Supplier A", description: "Raw Material", amountPaid: 3000.0 },
          { id: "2", purchaseNo: "PUR002", purchaseDate: "02-10-2023", supplierName: "Supplier B", description: "Equipment", amountPaid: 4000.0 },
        ],
        otherExpenses: [
          { id: "1", paymentCode: "EXP001", expenseCategory: "Utilities", description: "Electricity Bill", amountPaid: 500.0 },
          { id: "2", paymentCode: "EXP002", expenseCategory: "Maintenance", description: "Office Repair", amountPaid: 1500.0 },
        ],
      };

      setReportData(data);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Summary Daily Report generated successfully.",
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
    doc.text("Summary Daily Report", 70, 30);

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
    doc.text(" Summary Daily Report Information", margin.left + 5, 60);
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

    // Sales Summary Table
    doc.autoTable({
      startY: 100,
      head: [["#", "TOTAL SALES", "PAID SALES", "DUE SALES"]],
      body: [
        [
          "#",
          formatNumber(reportData.salesSummary.totalSales),
          formatNumber(reportData.salesSummary.paidSales),
          formatNumber(reportData.salesSummary.dueSales),
        ],
      ],
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
        0: { cellWidth: 20 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 },
      },
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    });

    // Payment Modes Table
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["#", "ACCOUNT NAME", "ACCOUNT NO", "PAYMENTS", "EXPENSE", "NET"]],
      body: reportData.paymentModes.map((item) => [
        item.id,
        item.accountName,
        item.accountNo,
        formatNumber(item.payments),
        formatNumber(item.expense),
        formatNumber(item.net),
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
        0: { cellWidth: 20 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        5: { cellWidth: 40 },
      },
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    });

    // Receivables Table
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["#", "INVOICE NO", "SALES DATE", "CUSTOMER NAME", "DESCRIPTION", "AMOUNT PAID"]],
      body: reportData.receivables.length > 0
        ? reportData.receivables.map((item) => [
            item.id,
            item.invoiceNo,
            item.salesDate,
            item.customerName,
            item.description,
            formatNumber(item.amountPaid),
          ])
        : [["No record found!!", "", "", "", "", "0.00"]],
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
        0: { cellWidth: 20 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 },
        4: { cellWidth: 50 },
        5: { cellWidth: 50 },
      },
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    });

    // Payments Made to Suppliers Table
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["#", "PURCHASE NO", "PURCHASE DATE", "SUPPLIER NAME", "DESCRIPTION", "AMOUNT PAID"]],
      body: reportData.paymentsToSuppliers.length > 0
        ? reportData.paymentsToSuppliers.map((item) => [
            item.id,
            item.purchaseNo,
            item.purchaseDate,
            item.supplierName,
            item.description,
            formatNumber(item.amountPaid),
          ])
        : [["No record found!!", "", "", "", "", "0.00"]],
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
        0: { cellWidth: 20 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 },
        4: { cellWidth: 50 },
        5: { cellWidth: 50 },
      },
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    });

    // Other Expenses Table
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["#", "PAYMENT CODE", "EXPENSE CATEGORY", "DESCRIPTION", "AMOUNT PAID"]],
      body: reportData.otherExpenses.length > 0
        ? reportData.otherExpenses.map((item) => [
            item.id,
            item.paymentCode,
            item.expenseCategory,
            item.description,
            formatNumber(item.amountPaid),
          ])
        : [["No record found!!", "", "", "", "0.00"]],
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
        0: { cellWidth: 20 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 },
        4: { cellWidth: 50 },
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
    doc.save(`summary_daily_report_${dayjs().format("DD-MM-YYYY")}.pdf`);

    notificationApi.success({
      message: "PDF Export Complete",
      description: "Your report has been successfully exported.",
      placement: "topRight",
    });
  };

  const salesSummaryColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "TOTAL SALES",
      dataIndex: "totalSales",
      key: "totalSales",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
    {
      title: "PAID SALES",
      dataIndex: "paidSales",
      key: "paidSales",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
    {
      title: "DUE SALES",
      dataIndex: "dueSales",
      key: "dueSales",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
  ];

  const paymentModesColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "ACCOUNT NO",
      dataIndex: "accountNo",
      key: "accountNo",
    },
    {
      title: "PAYMENTS",
      dataIndex: "payments",
      key: "payments",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
    {
      title: "EXPENSE",
      dataIndex: "expense",
      key: "expense",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
    {
      title: "NET",
      dataIndex: "net",
      key: "net",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
  ];

  const receivablesColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "INVOICE NO",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
    },
    {
      title: "SALES DATE",
      dataIndex: "salesDate",
      key: "salesDate",
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "AMOUNT PAID",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
  ];

  const paymentsToSuppliersColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "PURCHASE NO",
      dataIndex: "purchaseNo",
      key: "purchaseNo",
    },
    {
      title: "PURCHASE DATE",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
    },
    {
      title: "SUPPLIER NAME",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "AMOUNT PAID",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
  ];

  const otherExpensesColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "PAYMENT CODE",
      dataIndex: "paymentCode",
      key: "paymentCode",
    },
    {
      title: "EXPENSE CATEGORY",
      dataIndex: "expenseCategory",
      key: "expenseCategory",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "AMOUNT PAID",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
  ];

  const calculateTotal = (data, key) => {
    return data.reduce((acc, item) => acc + (item[key] || 0), 0);
  };

  const collapseItems = [
    {
      key: "1",
      label: "Summary Daily Report",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card className="bg-blue-50">
                <div className="flex items-center mb-4">
                  <DollarOutlined className="text-blue-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Sales Summary
                  </Text>
                </div>
                <Table
                  dataSource={[
                    {
                      id: "#",
                      totalSales: reportData && reportData.salesSummary ? reportData.salesSummary.totalSales : 0,
                      paidSales: reportData && reportData.salesSummary ? reportData.salesSummary.paidSales : 0,
                      dueSales: reportData && reportData.salesSummary ? reportData.salesSummary.dueSales : 0,
                    },
                  ]}
                  columns={salesSummaryColumns}
                  pagination={false}
                  rowKey="id"
                  footer={() => (
                    <div className="text-right font-bold text-lg text-gray-500">
                    Total Sales : KES {formatNumber(reportData?.salesSummary?.totalSales || 0)}
                  </div>
                  
                  )}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card className="bg-green-50">
                <div className="flex items-center mb-4">
                  <DollarOutlined className="text-green-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Payment Modes
                  </Text>
                </div>
                <Table
                  dataSource={reportData ? reportData.paymentModes : []}
                  columns={paymentModesColumns}
                  pagination={false}
                  rowKey="id"
                  footer={() => (
                    <div className="text-right font-bold text-lg text-gray-500">
                      Total Payments : KES {formatNumber(calculateTotal(reportData?.paymentModes || [], 'payments'))}
                    </div>
                  )}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card className="bg-yellow-50">
                <div className="flex items-center mb-4">
                  <DollarOutlined className="text-yellow-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Receivables
                  </Text>
                </div>
                <Table
                  dataSource={reportData ? reportData.receivables : []}
                  columns={receivablesColumns}
                  pagination={false}
                  rowKey="id"
                  footer={() => (
                    <div className="text-right font-bold text-lg text-gray-500">
                      Total Amount Paid : KES {formatNumber(calculateTotal(reportData?.receivables || [], 'amountPaid'))}
                    </div>
                  )}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card className="bg-red-50">
                <div className="flex items-center mb-4">
                  <DollarOutlined className="text-red-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Payments Made to Suppliers
                  </Text>
                </div>
                <Table
                  dataSource={reportData ? reportData.paymentsToSuppliers : []}
                  columns={paymentsToSuppliersColumns}
                  pagination={false}
                  rowKey="id"
                  footer={() => (
                    <div className="text-right font-bold text-lg text-gray-500">
                      Total Amount Paid : KES {formatNumber(calculateTotal(reportData?.paymentsToSuppliers || [], 'amountPaid'))}
                    </div>
                  )}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card className="bg-purple-50">
                <div className="flex items-center">
                  <DollarOutlined className="text-purple-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Other Expenses
                  </Text>                  
                </div>

                <hr  className="mt-2"/>

                <Table
                  dataSource={reportData ? reportData.otherExpenses : []}
                  columns={otherExpensesColumns}
                  pagination={false}
                  rowKey="id"
                  footer={() => (
                    <div className="text-right font-bold text-lg text-gray-500">
                      Total Amount Paid : KES {formatNumber(calculateTotal(reportData?.otherExpenses || [], 'amountPaid'))}
                    </div>
                  )}
                />
              </Card>
            </Col>
          </Row>

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
                { title: "Summary Daily Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Summary Daily Report
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
                }}
              >
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format="DD-MM-YYYY" />
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
                <Button type="primary" icon={<FilePdfOutlined />} onClick={exportToPDF}>
                  Export to PDF
                </Button>
              </div>
            </div>

            <hr />

            <Spin spinning={loading} indicator={<Skeleton active />}>
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

export default SummaryDailyReport;