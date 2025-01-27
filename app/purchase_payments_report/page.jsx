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
  Input,
  Select,
} from "antd";
import {
  DollarOutlined,
  FilterOutlined,
  FilePdfOutlined,
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  UserOutlined,
  SearchOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
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

const PurchasePaymentsReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs().startOf("month"),
    toDate: dayjs().endOf("month"),
    supplierName: "",
    paymentStatus: "",
  });
  const [paymentData, setPaymentData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [supplierNames, setSupplierNames] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  // Mock Data
  const mockPaymentData = [
    {
      id: 1,
      supplierName: "Supplier A",
      supplierId: "SUP001",
      branch: "Nairobi",
      purchaseDate: "10-12-2024",
      invoiceNumber: "PUR_001",
      paymentNote: "Payment for Q4 supplies",
      paymentTerms: "Net 30",
      invoiceTotal: 50000,
      lateFees: 500,
      adjustments: 200,
      writeOffs: 100,
      followUpNotes: "Follow up on payment",
      followUpPerson: "John Doe",
      followUpRole: "Account Manager",
      paymentHistory: [
        {
          paymentDate: "15-12-2024",
          transactionId: "TX001",
          modeOfPayment: "Bank Transfer",
          amount: 20000,
          paymentStatus: "Partial",
          paidBy: "John Doe", // Added Paid By field
        },
        {
          paymentDate: "20-12-2024",
          transactionId: "TX002",
          modeOfPayment: "Cheque",
          amount: 30000,
          paymentStatus: "Partial",
          paidBy: "Jane Doe", // Added Paid By field
        },
        
      ],
    },
    {
      id: 2,
      supplierName: "Supplier B",
      supplierId: "SUP002",
      branch: "Mombasa",
      purchaseDate: "05-12-2024",
      invoiceNumber: "PUR_002",
      paymentNote: "Payment for Q3 supplies",
      paymentTerms: "Net 60",
      invoiceTotal: 45000,
      lateFees: 700,
      adjustments: 300,
      writeOffs: 150,
      followUpNotes: "Follow up on pending items",
      followUpPerson: "Jane Doe",
      followUpRole: "Account Manager",
      paymentHistory: [
        {
          paymentDate: "25-12-2024",
          transactionId: "TX003",
          modeOfPayment: "Cash",
          amount: 15000,
          paymentStatus: "Partial",
          paidBy: "Jane Doe", // Added Paid By field
        },
      ],
    },
  ];

  useEffect(() => {
    const names = mockPaymentData.map((supplier) => supplier.supplierName);
    setSupplierNames([...new Set(names)]);
    setExpandedRows(mockPaymentData.map((item) => item.id)); // Expand all rows by default
  }, []);

  const handleFilterChange = (changedValues, allValues) => {
    const { fromDate, toDate, supplierName, paymentStatus } = allValues;
    setFilters({
      fromDate: fromDate ? dayjs(fromDate) : dayjs().startOf("month"),
      toDate: toDate ? dayjs(toDate) : dayjs().endOf("month"),
      supplierName,
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

  const calculateOutstandingBalance = (paymentHistory, invoiceTotal) => {
    const totalPayments = paymentHistory.reduce((sum, payment) => {
      if (payment.paymentStatus === "Paid" || payment.paymentStatus === "Partial") {
        return sum + payment.amount;
      }
      return sum;
    }, 0);
    return invoiceTotal - totalPayments;
  };

  const generateReport = () => {
    const { fromDate, toDate, supplierName, paymentStatus } = form.getFieldsValue();

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
      const filteredByDate = mockPaymentData.filter((supplier) => {
        return supplier.paymentHistory.some((payment) => {
          const paymentDate = dayjs(payment.paymentDate, "DD-MM-YYYY");
          return paymentDate.isAfter(fromDate) && paymentDate.isBefore(toDate);
        });
      });

      if (filteredByDate.length === 0) {
        notificationApi.warning({
          message: "No Data Found",
          description: "No data found within the selected date range.",
          placement: "topRight",
          className: "bg-yellow-50",
        });
        setLoading(false);
        return;
      }

      const updatedPaymentData = filteredByDate.map((supplier) => {
        const filteredPaymentHistory = supplier.paymentHistory.filter(
          (payment) => payment.paymentStatus === "Paid" || payment.paymentStatus === "Partial"
        );

        const outstandingBalance = calculateOutstandingBalance(filteredPaymentHistory, supplier.invoiceTotal);

        return {
          ...supplier,
          paymentHistory: filteredPaymentHistory,
          outstandingBalance,
        };
      });

      setPaymentData(updatedPaymentData);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Purchase Payments Report generated successfully.",
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
    doc.text("Purchase Payments Report", 70, 30);

    doc.setTextColor(brandColors.primary);
    doc.setFontSize(12);
    doc.roundedRect(margin.left, 50, doc.internal.pageSize.width - 40, 35, 3, 3, "S");

    doc.setFont("helvetica", "bold");
    doc.text(" Purchase Payments Report Information", margin.left + 5, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(brandColors.gray);
    doc.text(`From: ${filters.fromDate.format("DD-MM-YYYY")} To: ${filters.toDate.format("DD-MM-YYYY")}`, margin.left + 5, 70);
    doc.text(`Generated : ${reportGeneratedTime}`, margin.left + 5, 80);
    doc.text(`Generated by : ${generatedBy}`, doc.internal.pageSize.width - 80, 80);

    doc.autoTable({
      startY: 100,
      head: [["SUPPLIER NAME", "BRANCH", "PURCHASE DATE", "BALANCE", "SUPPLIER ID", "INVOICE NUMBER", "PAYMENT NOTE"]],
      body: paymentData.map((item) => [
        item.supplierName,
        item.branch,
        item.purchaseDate,
        formatNumber(item.outstandingBalance),
        item.supplierId,
        item.invoiceNumber,
        item.paymentNote,
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
        2: { cellWidth: 40 },
        3: { halign: "right", cellWidth: 50 },
        4: { cellWidth: 40 },
        5: { cellWidth: 50 },
        6: { cellWidth: 60 },
      },
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Payment Date", "Transaction ID", "Mode of Payment", "Amount", "Payment Status", "Paid By"]],
      body: paymentData.flatMap((supplier) =>
        supplier.paymentHistory.map((payment) => [
          payment.paymentDate,
          payment.transactionId,
          payment.modeOfPayment,
          formatNumber(payment.amount),
          payment.paymentStatus,
          payment.paidBy, // Added Paid By field
        ])
      ),
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
        1: { cellWidth: 50 },
        2: { cellWidth: 40 },
        3: { halign: "right", cellWidth: 30 },
        4: { cellWidth: 40 },
        5: { cellWidth: 40 }, // Added Paid By column
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
        doc.rect(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, 20, "F");
        doc.setTextColor("#FFFFFF");
        doc.setFontSize(8);
        doc.text("© 2025 Snave Webhub Africa. All rights reserved.", margin.left, doc.internal.pageSize.height - 10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10);
      }
    };

    addFooter();
    doc.save(`purchase_payments_report_${dayjs().format("DD-MM-YYYY")}.pdf`);

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

  const filteredData = paymentData.filter((item) => {
    const matchesSearchText =
      item.supplierName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.supplierId.toLowerCase().includes(searchText.toLowerCase());

    const matchesSupplierName = !filters.supplierName || item.supplierName === filters.supplierName;

    const matchesPaymentStatus = !filters.paymentStatus || item.paymentHistory.some((payment) => payment.paymentStatus === filters.paymentStatus);

    return matchesSearchText && matchesSupplierName && matchesPaymentStatus;
  });

  const paymentColumns = [
    {
      title: "SUPPLIER NAME",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "BRANCH",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "PURCHASE DATE",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
    },
    {
      title: "INVOICE NUMBER",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      // align: "right",
      render: (invoiceNumber) => (
        <Link href={`/purchase-details/${invoiceNumber}`} className="text-blue-500 hover:underline">
          {invoiceNumber}
        </Link>
      ),
    },
    {
      title: "SUPPLIER ID",
      dataIndex: "supplierId",
      key: "supplierId",
    },
    {
      title: "BALANCE (KES)",
      dataIndex: "outstandingBalance",
      key: "outstandingBalance",
      render: (outstandingBalance) => <span>{formatNumber(outstandingBalance)}</span>,
      align: "right",
    },
   
    {
      title: "PAYMENT NOTE",
      dataIndex: "paymentNote",
      key: "paymentNote",
      align : "right",
    },
  ];

  const paymentHistoryColumns = [
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
      title: "Amount Paid (KES)",
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
            : status === "Partial"
              ? "orange"
              : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Paid By",
      dataIndex: "paidBy",
      key: "paidBy",
      align: "right",
    },
  ];

  const totalOutstanding = paymentData.reduce((sum, item) => sum + (item.outstandingBalance || 0), 0);

  const collapseItems = [
    {
      key: "1",
      label: " Purchase Payments Report",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={8} key="total-outstanding">
              <Card className="bg-green-50">
                <div className="flex items-center">
                  <UserOutlined className="text-green-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Outstanding
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalOutstanding)}</Title>
              </Card>
            </Col>
          </Row>

          <div className="mb-4">
            <Input
              placeholder="Search by Supplier Name or Supplier ID"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </div>

          <Table
            dataSource={filteredData}
            columns={paymentColumns}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: filteredData.length,
              onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            expandable={{
              expandedRowRender: (record) => {
                if (!expandedRows.includes(record.id)) return null;

                const partialPayments = record.paymentHistory?.filter(
                  (payment) => payment.paymentStatus === "Partial"
                ) || [];

                return (
                  <div key={`expanded-${record.id}`}>
                    {/* Payment Details Section */}
                    <Card className=" mb-4">
                      <div className="flex items-center mb-0">
                        <FileTextOutlined className="text-blue-600 text-2xl mr-2 mb-2" />
                        <Title level={4} className="text-blue-800">
                          Payment Details
                        </Title>
                      </div>
                      <hr className="mb-4" />
                      <Table
                        dataSource={record.paymentHistory || []}
                        columns={paymentHistoryColumns}
                        pagination={false}
                        rowKey="transactionId"
                        summary={() => (
                          <Table.Summary fixed>
                            <Table.Summary.Row>
                              <Table.Summary.Cell index={0} colSpan={4}>
                                <Text strong>Total</Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={1} align="right">
                                <Text strong>
                                  {formatNumber(
                                    (record.paymentHistory || []).reduce((sum, payment) => sum + payment.amount, 0)
                                  )}
                                </Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            </Table.Summary.Row>
                          </Table.Summary>
                        )}
                      />
                    </Card>

                    {/* Invoice Fully Paid Section */}
                    {record.outstandingBalance === 0 && (
                      <Card className="mb-4">
                        <div className="flex items-center mb-0">
                          <CheckCircleOutlined className="text-green-600 text-2xl mr-2 mb-2" />
                          <Title level={4} className="text-green-800">
                            Invoice Fully Paid
                          </Title>
                        </div>
                        <hr className="mb-4" />
                        <Row gutter={16}>
                          <Col span={8}>
                            <Text strong>Invoice Total :</Text>
                            <Text> KES {formatNumber(record.invoiceTotal)}</Text>
                          </Col>
                          <Col span={8}>
                            <Text strong>Total Paid :</Text>
                            <Text> KES {formatNumber(record.invoiceTotal)}</Text>
                          </Col>
                          <Col span={8}>
                            <Text strong>Balance:</Text>
                            <Text> KES 0.00</Text>
                          </Col>
                        </Row>
                      </Card>
                    )}

                    {/* Partial Payment Breakdown Section */}
                    {partialPayments.length > 0 && (
                      <Card className="mb-2">
                        <div className="flex items-center mb-0">
                          <DollarOutlined className="text-orange-600 text-2xl mr-2 mb-2" />
                          <Title level={4} className="text-orange-800">
                            Partial Payment Breakdown
                          </Title>
                        </div>
                        <hr className="mb-4" />
                        <Table
                          dataSource={partialPayments}
                          columns={[
                            {
                              title: "Payment Date",
                              dataIndex: "paymentDate",
                              key: "paymentDate",
                            },
                            {
                              title: "Amount Paid (KES)",
                              dataIndex: "amount",
                              key: "amount",
                              render: (amount) => formatNumber(amount),
                              align: "right",
                            },
                            {
                              title: "Remaining Balance (KES)",
                              key: "remainingBalance",
                              render: (_, record, index) => {
                                const previousPayments = (record.paymentHistory || [])
                                  .slice(0, index)
                                  .filter((p) => p.paymentStatus === "Partial" || p.paymentStatus === "Paid")
                                  .reduce((sum, p) => sum + p.amount, 0);
                                const remainingBalanceAfterPayment = record.invoiceTotal - (previousPayments + record.amount);
                                return formatNumber(remainingBalanceAfterPayment);
                              },
                              align: "right",
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
                              title: "Payment Status",
                              dataIndex: "paymentStatus",
                              key: "paymentStatus",
                              render: (status) => (
                                <Tag color={status === "Partial" ? "orange" : "green"}>
                                  {status}
                                </Tag>
                              ),
                              align: "right",
                            },
                            {
                              title: "Paid By",
                              dataIndex: "paidBy",
                              key: "paidBy",
                              align: "right",
                            },
                            {
                              title: "Cumulative Payments (KES)",
                              key: "cumulativePayments",
                              render: (_, record, index) => {
                                const previousPayments = (record.paymentHistory || [])
                                  .slice(0, index)
                                  .filter((p) => p.paymentStatus === "Partial" || p.paymentStatus === "Paid")
                                  .reduce((sum, p) => sum + p.amount, 0);
                                return formatNumber(previousPayments + record.amount);
                              },
                              align: "right",
                            },
                          ]}
                          pagination={false}
                          rowKey="transactionId"
                        />
                        {/* Total Cumulative Section */}
                        <div className="mt-4">
                          <Text strong>Total Cumulative Payments :</Text>
                          <Text className="ml-2">
                            KES{" "}
                            {formatNumber(
                              partialPayments.reduce((sum, payment) => sum + payment.amount, 0)
                            )}
                          </Text>
                        </div>
                      </Card>
                    )}
                  </div>
                );
              },
            }}
          />
          <div className="mt-4 text-gray-500 font-bold text-lg border-t pt-4" key="report-footer">
            <p className="text-sm flex justify-between items-center">
              <span className="text-left">Report Generated on : {reportGeneratedTime}</span>
              <span className="text-center flex-1">
                From : {filters.fromDate.format("DD-MM-YYYY")} &nbsp; To : {filters.toDate.format("DD-MM-YYYY")}
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
                { title: " Purchase Payments Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Purchase Payments Report
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
                  supplierName: filters.supplierName,
                  paymentStatus: filters.paymentStatus,
                }}
              >
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="supplierName" label="Supplier Name">
                  <Select
                    showSearch
                    placeholder="Select Supplier"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    style={{ width: 280 }}
                  >
                    <Option key="all" value="">
                      Select All Suppliers
                    </Option>
                    {supplierNames.map((name) => (
                      <Option key={name} value={name}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
              <div className="flex space-x-4">
                <Button type="primary" icon={<FilterOutlined />} onClick={generateReport}>
                  Generate Report
                </Button>
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

export default PurchasePaymentsReport;