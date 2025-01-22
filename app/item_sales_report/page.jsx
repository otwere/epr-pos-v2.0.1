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
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  BarChartOutlined,
  SearchOutlined,
  ProductOutlined,
  UserOutlined,
  PrinterOutlined,
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
  "Alice Johnson": "Kisumu",
  "Bob Brown": "Nakuru",
  "Charlie Davis": "Eldoret",
};

// List of item names for the select option
const itemNames = [
  "Mara Sugar 1kg",
  "Mara Tea 500g",
  "Mara Rice 5kg",
  "Mara Flour 2kg",
  "Mara Cooking Oil 1L",
  "Mara Biscuits 200g",
  "Mara Spaghetti 500g",
  "Mara Salt 1kg",
];

const SalesReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs("2025-01-20"), // Updated to 20-01-2025
    toDate: dayjs("2025-01-31"),   // Updated to 31-01-2025
    itemName: "",                  // Changed from customerName to itemName
    category: "",                  // Changed from paymentStatus to category
    branch: "Nairobi",             // Default to "Nairobi"
  });
  const [salesData, setSalesData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleFilterChange = (changedValues, allValues) => {
    setFilters({
      ...filters,
      ...allValues,
    });
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
          category: "Grocery",
        },
        {
          itemName: "Mara Tea 500g",
          quantity: 5,
          price: 200.0,
          tax: 0.0,
          total: 1000.0,
          category: "Beverages",
        },
        {
          itemName: "Mara Rice 5kg",
          quantity: 2,
          price: 500.0,
          tax: 0.0,
          total: 1000.0,
          category: "Grocery",
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
          category: "Grocery",
        },
        {
          itemName: "Mara Flour 2kg",
          quantity: 3,
          price: 150.0,
          tax: 0.0,
          total: 450.0,
          category: "Grocery",
        },
      ],
    },
    {
      id: "S003",
      invoiceNumber: "INV003",
      salesDate: "2025-01-22",
      customerId: "cust_003",
      customerName: "Customer C",
      kraPin: "C001234567890",
      invoiceTotal: 30000.0,
      paidAmount: 30000.0,
      dueAmount: 0.0,
      paymentStatus: "Paid",
      employeeName: "Alice Johnson",
      branch: "Kisumu",
      paymentModes: {
        cash: 10000.0,
        mpesa: 20000.0,
        bank: 0.0,
        pdqCheque: 0.0,
      },
      itemsSold: [
        {
          itemName: "Mara Cooking Oil 1L",
          quantity: 10,
          price: 300.0,
          tax: 0.0,
          total: 3000.0,
          category: "Grocery",
        },
        {
          itemName: "Mara Biscuits 200g",
          quantity: 20,
          price: 50.0,
          tax: 0.0,
          total: 1000.0,
          category: "Snacks",
        },
      ],
    },
    {
      id: "S004",
      invoiceNumber: "INV004",
      salesDate: "2025-01-23",
      customerId: "cust_004",
      customerName: "Customer D",
      kraPin: "D001234567890",
      invoiceTotal: 20000.0,
      paidAmount: 20000.0,
      dueAmount: 0.0,
      paymentStatus: "Paid",
      employeeName: "Bob Brown",
      branch: "Nakuru",
      paymentModes: {
        cash: 5000.0,
        mpesa: 15000.0,
        bank: 0.0,
        pdqCheque: 0.0,
      },
      itemsSold: [
        {
          itemName: "Mara Spaghetti 500g",
          quantity: 15,
          price: 100.0,
          tax: 0.0,
          total: 1500.0,
          category: "Grocery",
        },
        {
          itemName: "Mara Salt 1kg",
          quantity: 10,
          price: 50.0,
          tax: 0.0,
          total: 500.0,
          category: "Grocery",
        },
      ],
    },
    {
      id: "S005",
      invoiceNumber: "INV005",
      salesDate: "2025-01-24",
      customerId: "cust_005",
      customerName: "Customer E",
      kraPin: "E001234567890",
      invoiceTotal: 18000.0,
      paidAmount: 18000.0,
      dueAmount: 0.0,
      paymentStatus: "Paid",
      employeeName: "Charlie Davis",
      branch: "Eldoret",
      paymentModes: {
        cash: 8000.0,
        mpesa: 10000.0,
        bank: 0.0,
        pdqCheque: 0.0,
      },
      itemsSold: [
        {
          itemName: "Mara Tea 500g",
          quantity: 10,
          price: 200.0,
          tax: 0.0,
          total: 2000.0,
          category: "Beverages",
        },
        {
          itemName: "Mara Biscuits 200g",
          quantity: 30,
          price: 50.0,
          tax: 0.0,
          total: 1500.0,
          category: "Snacks",
        },
      ],
    },
    // Additional mock data
    {
      id: "S006",
      invoiceNumber: "INV006",
      salesDate: "2025-01-26",
      customerId: "cust_006",
      customerName: "Customer F",
      kraPin: "F001234567890",
      invoiceTotal: 22000.0,
      paidAmount: 22000.0,
      dueAmount: 0.0,
      paymentStatus: "Paid",
      employeeName: "John Doe",
      branch: "Nairobi",
      paymentModes: {
        cash: 12000.0,
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
          category: "Grocery",
        },
        {
          itemName: "Mara Rice 5kg",
          quantity: 4,
          price: 500.0,
          tax: 0.0,
          total: 2000.0,
          category: "Grocery",
        },
      ],
    },
    {
      id: "S007",
      invoiceNumber: "INV007",
      salesDate: "2025-01-27",
      customerId: "cust_007",
      customerName: "Customer G",
      kraPin: "G001234567890",
      invoiceTotal: 17000.0,
      paidAmount: 17000.0,
      dueAmount: 0.0,
      paymentStatus: "Paid",
      employeeName: "Jane Smith",
      branch: "Mombasa",
      paymentModes: {
        cash: 7000.0,
        mpesa: 10000.0,
        bank: 0.0,
        pdqCheque: 0.0,
      },
      itemsSold: [
        {
          itemName: "Mara Flour 2kg",
          quantity: 5,
          price: 150.0,
          tax: 0.0,
          total: 750.0,
          category: "Grocery",
        },
        {
          itemName: "Mara Cooking Oil 1L",
          quantity: 5,
          price: 300.0,
          tax: 0.0,
          total: 1500.0,
          category: "Grocery",
        },
      ],
    },
    {
      id: "S008",
      invoiceNumber: "INV008",
      salesDate: "2025-01-28",
      customerId: "cust_008",
      customerName: "Customer H",
      kraPin: "H001234567890",
      invoiceTotal: 19000.0,
      paidAmount: 19000.0,
      dueAmount: 0.0,
      paymentStatus: "Paid",
      employeeName: "Alice Johnson",
      branch: "Kisumu",
      paymentModes: {
        cash: 9000.0,
        mpesa: 10000.0,
        bank: 0.0,
        pdqCheque: 0.0,
      },
      itemsSold: [
        {
          itemName: "Mara Biscuits 200g",
          quantity: 25,
          price: 50.0,
          tax: 0.0,
          total: 1250.0,
          category: "Snacks",
        },
        {
          itemName: "Mara Spaghetti 500g",
          quantity: 10,
          price: 100.0,
          tax: 0.0,
          total: 1000.0,
          category: "Grocery",
        },
      ],
    },
    {
      id: "S009",
      invoiceNumber: "INV009",
      salesDate: "2025-01-29",
      customerId: "cust_009",
      customerName: "Customer I",
      kraPin: "I001234567890",
      invoiceTotal: 21000.0,
      paidAmount: 21000.0,
      dueAmount: 0.0,
      paymentStatus: "Paid",
      employeeName: "Bob Brown",
      branch: "Nakuru",
      paymentModes: {
        cash: 11000.0,
        mpesa: 10000.0,
        bank: 0.0,
        pdqCheque: 0.0,
      },
      itemsSold: [
        {
          itemName: "Mara Salt 1kg",
          quantity: 15,
          price: 50.0,
          tax: 0.0,
          total: 750.0,
          category: "Grocery",
        },
        {
          itemName: "Mara Tea 500g",
          quantity: 10,
          price: 200.0,
          tax: 0.0,
          total: 2000.0,
          category: "Beverages",
        },
      ],
    },
    {
      id: "S010",
      invoiceNumber: "INV010",
      salesDate: "2025-01-30",
      customerId: "cust_010",
      customerName: "Customer J",
      kraPin: "J001234567890",
      invoiceTotal: 23000.0,
      paidAmount: 23000.0,
      dueAmount: 0.0,
      paymentStatus: "Paid",
      employeeName: "Charlie Davis",
      branch: "Eldoret",
      paymentModes: {
        cash: 13000.0,
        mpesa: 10000.0,
        bank: 0.0,
        pdqCheque: 0.0,
      },
      itemsSold: [
        {
          itemName: "Mara Rice 5kg",
          quantity: 6,
          price: 500.0,
          tax: 0.0,
          total: 3000.0,
          category: "Grocery",
        },
        {
          itemName: "Mara Cooking Oil 1L",
          quantity: 5,
          price: 300.0,
          tax: 0.0,
          total: 1500.0,
          category: "Grocery",
        },
      ],
    },
  ];

  const generateReport = () => {
    const { fromDate, toDate, itemName, category, branch } =
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
        const itemNameMatch = item.itemsSold.some((soldItem) =>
          soldItem.itemName.toLowerCase().includes(itemName.toLowerCase())
        );
        const categoryMatch = item.itemsSold.some((soldItem) =>
          soldItem.category.toLowerCase().includes(category.toLowerCase())
        );
        const branchMatch = item.branch.toLowerCase().includes(branch.toLowerCase());

        // Check if the sales date is within the selected range
        const isDateInRange =
          salesDate.isAfter(fromDate) && salesDate.isBefore(toDate);

        return isDateInRange && itemNameMatch && categoryMatch && branchMatch;
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
          "Item Name",
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
        item.itemsSold.map((soldItem) => soldItem.itemName).join(", "),
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

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.id]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter(key => key !== record.id));
    }
  };

  const salesColumns = [
    {
      title: "Invoice Number",
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
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      className: "whitespace-nowrap",
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      align: "right",
      className: "whitespace-nowrap",
    },
    {
      title: "Item Sales Count",
      dataIndex: "itemsSold",
      key: "itemSalesCount",
      align: "right",
      render: (itemsSold) => itemsSold.reduce((sum, item) => sum + item.quantity, 0),
      className: "whitespace-nowrap",
      onCell: (record) => ({
        onClick: () => handleExpand(!expandedRowKeys.includes(record.id), record),
        style: { cursor: "pointer" }, // Add cursor pointer style
      }),
    },
    {
      title: "Invoice Total (Ksh)",
      dataIndex: "invoiceTotal",
      key: "invoiceTotal",
      render: (invoiceTotal) => <span>{formatNumber(invoiceTotal)}</span>,
      align: "right",
      className: "whitespace-nowrap",
    },
    {
      title: "Sold By",
      dataIndex: "employeeName",
      key: "employeeName",
      align: "right",
      className: "whitespace-nowrap",
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
                const totalQty = record.itemsSold.reduce((sum, item) => sum + item.quantity, 0);
                const totalSales = record.itemsSold.reduce((sum, item) => sum + item.total, 0);

                return (
                  <div key={`expanded-${record.id}`}>
                    {/* Items Sold Details Section */}
                    <Card className="bg-green-50">
                      <div className="flex items-center">
                        <ProductOutlined className="text-green-600 text-2xl mr-2 mb-6" />
                        <Title level={4} style={{ marginTop: "-10px" }}>
                          Items Sold Details
                        </Title>
                      </div>
                      <hr />
                      <Table
                        dataSource={record.itemsSold}
                        columns={[
                          {
                            title: "Item Name",
                            dataIndex: "itemName",
                            key: "itemName",
                          },
                          {
                            title: "Qty Sold",
                            dataIndex: "quantity",
                            key: "quantity",
                            align: "right",
                          },
                          {
                            title: "Price (KES)",
                            dataIndex: "price",
                            key: "price",
                            render: (price) => <span>{formatNumber(price)}</span>,
                            align: "right",
                          },
                          {
                            title: "Total (KES)",
                            dataIndex: "total",
                            key: "total",
                            render: (total) => <span>{formatNumber(total)}</span>,
                            align: "right",
                          },
                          {
                            title: "Branch",
                            dataIndex: "branch",
                            key: "branch",
                            align: "right",
                            render: () => record.branch,
                          },
                        ]}
                        pagination={false}
                        rowKey="itemName"
                        footer={() => (
                          <div className="flex justify-between">
                            <Text strong>Total Qty of Items Sold : {totalQty}</Text>
                            <Text strong>Total Sales : {formatNumber(totalSales)}</Text>
                          </div>
                        )}
                      />
                    </Card>

                    {/* Employees Sales Section */}
                    <Card className="bg-blue-50 mt-4">
                      <div className="flex items-center">
                        <UserOutlined className="text-blue-600 text-2xl mr-2 mb-6" />
                        <Title level={4} style={{ marginTop: "-10px" }}>
                          Employees Sales
                        </Title>
                      </div>
                      <hr />
                      <Table
                        dataSource={record.itemsSold}
                        columns={[
                          {
                            title: "Employee Name",
                            dataIndex: "employeeName",
                            key: "employeeName",
                            render: () => record.employeeName,
                          },
                          {
                            title: "Item Name",
                            dataIndex: "itemName",
                            key: "itemName",
                          },
                          {
                            title: "Qty Sold",
                            dataIndex: "quantity",
                            key: "quantity",
                            align: "right",
                          },
                          {
                            title: "Total (KES)",
                            dataIndex: "total",
                            key: "total",
                            render: (total) => <span>{formatNumber(total)}</span>,
                            align: "right",
                          },
                          {
                            title: "Branch",
                            dataIndex: "branch",
                            key: "branch",
                            align: "right",
                            render: () => record.branch,
                          },
                        ]}
                        pagination={false}
                        rowKey="itemName"
                        footer={() => (
                          <div className="text-right">
                            <Text strong>Total Qty of Items Sold : </Text>
                            <Text strong>{totalQty}</Text>
                          </div>
                        )}
                      />
                      <div className="mt-4 text-right">
                        <Text strong>Total Sales : </Text>
                        <Text strong>{formatNumber(totalSales)}</Text>
                      </div>
                    </Card>
                  </div>
                );
              },
              expandedRowKeys: expandedRowKeys,
              onExpand: handleExpand,
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
                { title: "Items Sales Report" }, // Updated to "Items Sales Report"
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Items Sales Report
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
                  itemName: filters.itemName,
                  category: filters.category,
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
                  name="itemName" 
                  label="Item" 
                  style={{ width: '200px' }} // Adjust width as needed
                >
                  <Select
                    showSearch
                    placeholder="Select Item Name"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option value="">All Items</Option>
                    {itemNames.map((item) => (
                      <Option key={item} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item 
                  name="category" 
                  label="Category" 
                  style={{ width: '200px' }} // Adjust width as needed
                >
                  <Select
                    showSearch
                    placeholder="Select Category"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option value="">All Categories</Option>
                    <Option value="Grocery">Grocery</Option>
                    <Option value="Beverages">Beverages</Option>
                    <Option value="Snacks">Snacks</Option>
                  </Select>
                </Form.Item>
                <Form.Item 
                  name="branch" 
                  label="Branch" 
                  style={{ width: '180px' }} 
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
                  icon={<PrinterOutlined  className="text-white" />}
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