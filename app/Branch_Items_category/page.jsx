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
  Input,
  Select,
  Progress,
  Statistic,
} from "antd";
import {
  FilterOutlined,
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  BarChartOutlined,
  SearchOutlined,
  PrinterOutlined,
  PieChartOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";

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

// Modern corporate color palette
const colors = {
  primary: "#1890ff", // Blue
  secondary: "#f0f2f5", // Light gray
  accent: "#13c2c2", // Teal
  background: "#ffffff", // White
  text: "#262626", // Dark gray
  success: "#52c41a", // Green
  warning: "#faad14", // Yellow
  error: "#ff4d4f", // Red
};

// Mock data for Items Category Sales
const mockCategorySalesData = [
  {
    id: "C001",
    category: "Sugar",
    itemCode: "0003 HA0A 5,UL0AB 1,2/NG",
    itemName: "SUGAR",
    itemQty: 40,
    totalSales: 110400.0,
    profitMargin: 25,
    salesChannel: "Online",
    region: "Nairobi",
    customerAgeGroup: "25-34",
    returnRate: 2,
    discount: 10,
    date: "2025-01-25",
    branch: "Nairobi Branch", // Added branch field
  },
  {
    id: "C002",
    category: "Sugar Bags",
    itemCode: "0007 story 25 legs",
    itemName: "SUGAR BAGS",
    itemQty: 10,
    totalSales: 32200.0,
    profitMargin: 20,
    salesChannel: "In-Store",
    region: "Mombasa",
    customerAgeGroup: "35-44",
    returnRate: 5,
    discount: 5,
    date: "2025-01-28",
    branch: "Mombasa Branch", // Added branch field
  },
  {
    id: "C003",
    category: "Sugar",
    itemCode: "0006 mara sugar 1kg",
    itemName: "mara sugar",
    itemQty: 10,
    totalSales: 0.0,
    profitMargin: 15,
    salesChannel: "Online",
    region: "Kisumu",
    customerAgeGroup: "18-24",
    returnRate: 1,
    discount: 0,
    date: "2025-01-30",
    branch: "Kisumu Branch", // Added branch field
  },
  {
    id: "C004",
    category: "Soup",
    itemCode: "0003 Menengui 1kg",
    itemName: "Soup",
    itemQty: 2,
    totalSales: 300.0,
    profitMargin: 30,
    salesChannel: "In-Store",
    region: "Nakuru",
    customerAgeGroup: "45+",
    returnRate: 3,
    discount: 15,
    date: "2025-01-22",
    branch: "Nakuru Branch", // Added branch field
  },
  {
    id: "C005",
    category: "Test",
    itemCode: "0001 TEST PRODUCT",
    itemName: "TEST",
    itemQty: 5,
    totalSales: 1000.0,
    profitMargin: 10,
    salesChannel: "Online",
    region: "Eldoret",
    customerAgeGroup: "25-34",
    returnRate: 0,
    discount: 0,
    date: "2025-01-29",
    branch: "Eldoret Branch", // Added branch field
  },
];

const ItemsCategorySalesReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs("2025-01-20"),
    toDate: dayjs("2025-01-31"),
    branch: null, // Added branch filter
  });
  const [categorySalesData, setCategorySalesData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // List of branches for the filter
  const branches = [
    "Nairobi Branch",
    "Mombasa Branch",
    "Kisumu Branch",
    "Nakuru Branch",
    "Eldoret Branch",
  ];

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleFilterChange = (changedValues, allValues) => {
    const { fromDate, toDate } = allValues;

    if (fromDate && toDate && fromDate.isAfter(toDate)) {
      notificationApi.error({
        message: "Invalid Date Range",
        description: "The 'From Date' cannot be after the 'To Date'.",
        placement: "topRight",
        className: "bg-red-50",
      });
      return;
    }

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

  const generateReport = () => {
    const { fromDate, toDate, branch } = form.getFieldsValue();

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
      const filteredData = mockCategorySalesData.filter((item) => {
        const itemDate = dayjs(item.date);
        const isDateInRange =
          itemDate.isAfter(fromDate.subtract(1, "day")) &&
          itemDate.isBefore(toDate.add(1, "day"));
        const isBranchMatch = branch ? item.branch === branch : true; // Filter by branch if selected
        return isDateInRange && isBranchMatch;
      });

      if (filteredData.length === 0) {
        notificationApi.warning({
          message: "No Data Found",
          description: "No category sales data found for the selected date range and branch.",
          placement: "topRight",
          className: "bg-yellow-50",
        });
      }

      setCategorySalesData(filteredData);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Category Sales Report generated successfully.",
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
    doc.text("Branch Items Sale Category Report", 70, 30);

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
    doc.text(" Branch Items Sale Category Report Information", margin.left + 5, 60);
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

    // Add Category Sales Table to PDF
    doc.autoTable({
      startY: 100,
      head: [["Branch", "Category", "Item Code/Name", "Item Qty", "Total Sales (KES)"]],
      body: categorySalesData.map((item) => [
        item.branch,
        item.category,
        `${item.itemCode} - ${item.itemName}`,
        item.itemQty,
        formatNumber(item.totalSales),
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
        1: { cellWidth: 40 },
        2: { cellWidth: 60 },
        3: { cellWidth: 30 },
        4: { halign: "right", cellWidth: 40 },
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
    doc.save(`branch_items_sale_category_report_${dayjs().format("DD-MM-YYYY")}.pdf`);

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

  const filteredData = categorySalesData.filter((item) => {
    return (
      item.category.toLowerCase().includes(searchText.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchText.toLowerCase()) ||
      item.branch.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // Group data by branch and category
  const groupedData = filteredData.reduce((acc, item) => {
    const key = `${item.branch}-${item.category}`;
    if (!acc[key]) {
      acc[key] = {
        branch: item.branch,
        category: item.category,
        items: [],
        totalQty: 0,
        totalSales: 0,
        profitMargin: 0,
        returnRate: 0,
        discount: 0,
      };
    }
    acc[key].items.push(item);
    acc[key].totalQty += item.itemQty;
    acc[key].totalSales += item.totalSales;
    acc[key].profitMargin += item.profitMargin;
    acc[key].returnRate += item.returnRate;
    acc[key].discount += item.discount;
    return acc;
  }, {});

  // Flatten the grouped data for the table
  const tableData = Object.keys(groupedData).flatMap((key) => {
    const categoryData = groupedData[key];
    return [
      ...categoryData.items,
      {
        id: `total-${key}`,
        branch: `Subtotal for ${categoryData.branch} - ${categoryData.category}`,
        category: "",
        itemCode: "",
        itemName: "",
        itemQty: categoryData.totalQty,
        totalSales: categoryData.totalSales,
        profitMargin: categoryData.profitMargin / categoryData.items.length,
        returnRate: categoryData.returnRate / categoryData.items.length,
        discount: categoryData.discount / categoryData.items.length,
        isTotal: true,
      },
    ];
  });

  // Calculate Grand Total
  const grandTotalQty = Object.values(groupedData).reduce(
    (sum, category) => sum + category.totalQty,
    0
  );
  const grandTotalSales = Object.values(groupedData).reduce(
    (sum, category) => sum + category.totalSales,
    0
  );

  // Data for charts
  const categorySalesChartData = {
    labels: Object.keys(groupedData).map((key) => `${groupedData[key].branch} - ${groupedData[key].category}`),
    datasets: [
      {
        label: "Total Sales (KES)",
        data: Object.values(groupedData).map((category) => category.totalSales),
        backgroundColor: [
          "#1890ff",
          "#13c2c2",
          "#52c41a",
          "#faad14",
          "#ff4d4f",
        ],
      },
    ],
  };

  const categoryProfitChartData = {
    labels: Object.keys(groupedData).map((key) => `${groupedData[key].branch} - ${groupedData[key].category}`),
    datasets: [
      {
        label: "Profit Margin (%)",
        data: Object.values(groupedData).map(
          (category) => category.profitMargin / category.items.length
        ),
        backgroundColor: [
          "#1890ff",
          "#13c2c2",
          "#52c41a",
          "#faad14",
          "#ff4d4f",
        ],
      },
    ],
  };

  const categorySalesColumns = [
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      className: "whitespace-nowrap",
      render: (text, record) => (
        <span style={{ fontWeight: record.isTotal ? "600" : "bold" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      className: "whitespace-nowrap",
      render: (text, record) => (
        <span style={{ fontWeight: record.isTotal ? "600" : "normal" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Item Code/Name",
      dataIndex: "itemName",
      key: "itemName",
      render: (text, record) =>
        record.isTotal ? "" : `${record.itemCode} - ${record.itemName}`,
      className: "whitespace-nowrap",
    },
    {
      title: "Item Qty",
      dataIndex: "itemQty",
      key: "itemQty",
      align: "right",
      className: "whitespace-nowrap",
      render: (text, record) => (
        <span style={{ fontWeight: record.isTotal ? "600" : "normal" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Total Sales (KES)",
      dataIndex: "totalSales",
      key: "totalSales",
      render: (totalSales, record) => (
        <span style={{ fontWeight: record.isTotal ? "600" : "normal" }}>
          {formatNumber(totalSales)}
        </span>
      ),
      align: "right",
      className: "whitespace-nowrap",
    },
    {
      title: "Profit Margin (%)",
      dataIndex: "profitMargin",
      key: "profitMargin",
      render: (profitMargin, record) => (
        <span style={{ fontWeight: record.isTotal ? "600" : "normal" }}>
          {profitMargin.toFixed(2)}%
        </span>
      ),
      align: "right",
      className: "whitespace-nowrap",
    },
    {
      title: "Return Rate (%)",
      dataIndex: "returnRate",
      key: "returnRate",
      render: (returnRate, record) => (
        <span style={{ fontWeight: record.isTotal ? "600" : "normal" }}>
          {returnRate.toFixed(2)}%
        </span>
      ),
      align: "right",
      className: "whitespace-nowrap",
    },
    {
      title: "Discount (%)",
      dataIndex: "discount",
      key: "discount",
      render: (discount, record) => (
        <span style={{ fontWeight: record.isTotal ? "600" : "normal" }}>
          {discount.toFixed(2)}%
        </span>
      ),
      align: "right",
      className: "whitespace-nowrap",
    },
  ];

  const collapseItems = [
    {
      key: "1",
      label: "Branch Items Sale Category Report",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={24} key="total-sales">
              <Card className="bg-green-50">
                <div className="flex items-center">
                  <BarChartOutlined className="text-blue-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Sales
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(grandTotalSales)}</Title>
              </Card>
            </Col>
          </Row>

          <div className="mb-4">
            <Input
              placeholder="Search by Branch, Category, Item Code, or Item Name"
              prefix={<SearchOutlined className="text-blue-500" />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </div>

          <Table
            dataSource={tableData}
            columns={categorySalesColumns}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: tableData.length,
              onChange: (page, pageSize) =>
                setPagination({ current: page, pageSize }),
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={2} colSpan={2}>
                    <Text strong>Grand Total</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    <Text strong>{grandTotalQty}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5} align="right">
                    <Text strong>{formatNumber(grandTotalSales)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />

          <Row gutter={16} className="mt-4">
            <Col span={12}>
              <Card title="Total Sales by Branch and Category" className="shadow-sm">
                <Bar data={categorySalesChartData} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Profit Margin by Branch and Category" className="shadow-sm">
                <Pie data={categoryProfitChartData} />
              </Card>
            </Col>
          </Row>

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
                { title: "Branch Items Sale Category " },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Branch Items Sales  Category Report
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
                  branch: filters.branch,
                }}
              >
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="branch" label="Branch">
                  <Select
                    placeholder="Select Branch"
                    allowClear
                    showSearch
                    style={{ width: 200 }} // Increased width of the branch filter
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {branches.map((branch) => (
                      <Option key={branch} value={branch}>
                        {branch}
                      </Option>
                    ))}
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
                  icon={<PrinterOutlined className="text-white" />}
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
                    isActive ? (
                      <CaretUpOutlined className="text-blue-500" />
                    ) : (
                      <CaretDownOutlined className="text-blue-500" />
                    )
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

export default ItemsCategorySalesReport;