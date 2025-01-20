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
  Select,
  Input,
} from "antd";
import {
  FilterOutlined,
  FilePdfOutlined,
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  SearchOutlined,
  SmileOutlined, // Added SmileOutlined icon
} from "@ant-design/icons";

import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

import Link from "next/link";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const SalesSummary = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs().startOf("month"), // Default to start of current month
    toDate: dayjs().endOf("month"), // Default to end of current month
    customerName: null,
  });
  const [salesData, setSalesData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const toggleCollapsed = () => setCollapsed(!collapsed);

  // List of all customers
  const allCustomers = [
    "ALENDO SEC SCHOOL",
    "BROOKHOUSE SCHOOL",
    "ST. AUSTINS ACADEMY",
    "RIARA INTERNATIONAL SCHOOL",
    "PARKLANDS ARYA SCHOOL",
  ];

  // Handle filter changes
  const handleFilterChange = (changedValues, allValues) => {
    const { fromDate, toDate, customerName } = allValues;

    // Validate date range
    if (fromDate && toDate && fromDate.isAfter(toDate)) {
      notificationApi.error({
        message: "Invalid Date Range",
        description: "From Date cannot be after To Date.",
        placement: "topRight",
      });
      return;
    }

    // Handle "Select All" option
    if (customerName && customerName.includes("Select All")) {
      form.setFieldsValue({ customerName: [] }); // Clear the field
      setFilters({
        fromDate: fromDate || dayjs().startOf("month"),
        toDate: toDate || dayjs().endOf("month"),
        customerName: null, // Null indicates "Select All"
      });
    } else {
      setFilters({
        fromDate: fromDate || dayjs().startOf("month"),
        toDate: toDate || dayjs().endOf("month"),
        customerName,
      });
    }
  };

  // Format numbers to two decimal places
  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Generate the sales report
  const generateReport = () => {
    const { fromDate, toDate, customerName } = form.getFieldsValue();

    // Validate date selection
    if (!fromDate || !toDate) {
      notificationApi.error({
        message: "Date Selection Required",
        description: "Please select both 'From Date' and 'To Date' to generate the report.",
        placement: "topRight",
        className: "bg-red-50",
      });
      return;
    }

    // Validate date range
    if (fromDate.isAfter(toDate)) {
      notificationApi.error({
        message: "Invalid Date Range",
        description: "From Date cannot be after To Date.",
        placement: "topRight",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Mock data with realistic figures
      const mockData = [
        {
          id: "1",
          invoiceNo: "0001",
          salesDate: "17-01-2025",
          customerName: "ALENDO SEC SCHOOL",
          orderNo: "ORD001",
          discountPercent: 0,
          totalPrice: 142600.0,
          totalDiscount: 0.0,
          totalVAT: 19668.97,
          grandTotal: 162268.97,
        },
        {
          id: "2",
          invoiceNo: "0002",
          salesDate: "18-01-2025",
          customerName: "BROOKHOUSE SCHOOL",
          orderNo: "ORD002",
          discountPercent: 5,
          totalPrice: 200000.0,
          totalDiscount: 10000.0,
          totalVAT: 27600.0,
          grandTotal: 217600.0,
        },
        {
          id: "3",
          invoiceNo: "0003",
          salesDate: "19-01-2025",
          customerName: "ST. AUSTINS ACADEMY",
          orderNo: "ORD003",
          discountPercent: 10,
          totalPrice: 150000.0,
          totalDiscount: 15000.0,
          totalVAT: 20700.0,
          grandTotal: 155700.0,
        },
        {
          id: "4",
          invoiceNo: "0004",
          salesDate: "20-01-2025",
          customerName: "RIARA INTERNATIONAL SCHOOL",
          orderNo: "ORD004",
          discountPercent: 2,
          totalPrice: 300000.0,
          totalDiscount: 6000.0,
          totalVAT: 41400.0,
          grandTotal: 335400.0,
        },
        {
          id: "5",
          invoiceNo: "0005",
          salesDate: "21-01-2025",
          customerName: "PARKLANDS ARYA SCHOOL",
          orderNo: "ORD005",
          discountPercent: 0,
          totalPrice: 120000.0,
          totalDiscount: 0.0,
          totalVAT: 16560.0,
          grandTotal: 136560.0,
        },
      ];

      // Filter data based on selected date range
      const filteredByDate = mockData.filter((item) => {
        const salesDate = dayjs(item.salesDate, "DD-MM-YYYY");
        return salesDate.isAfter(fromDate.subtract(1, "day")) && salesDate.isBefore(toDate.add(1, "day"));
      });

      // Check if there is any data within the selected date range
      if (filteredByDate.length === 0) {
        notificationApi.error({
          message: "No Data Found",
          description: "No sales data found within the selected date range.",
          placement: "topRight",
          className: "bg-red-50",
        });
        setSalesData([]); // Clear the sales data
        setIsReportVisible(true); // Show the report section with "No Data" message
        setLoading(false);
        return;
      }

      // Filter data based on selected customer(s)
      let filteredData = filteredByDate;
      if (customerName && customerName.length > 0) {
        filteredData = filteredByDate.filter((item) =>
          customerName.includes(item.customerName)
        );
      }

      setSalesData(filteredData);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Sales Summary generated successfully.",
        placement: "topRight",
        className: "bg-green-50",
      });
    }, 1000);
  };

  // Export the report to PDF
  const exportToPDF = () => {
    if (salesData.length === 0) {
      notificationApi.error({
        message: "No Data to Export",
        description: "There is no data to export to PDF.",
        placement: "topRight",
        className: "bg-red-50",
      });
      return;
    }

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
    doc.text("Sales Summary", 70, 30);

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
    doc.text(" Sales Summary Information", margin.left + 5, 60);
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
      head: [["#", "INVOICE NO", "SALES DATE", "CUSTOMER NAME", "ORDER NO", "DISC. %", "TOTAL PRICE", "TOTAL DISC.", "TOTAL VAT", "GRAND TOTAL"]],
      body: salesData.map((item, index) => [
        index + 1,
        item.invoiceNo,
        item.salesDate,
        item.customerName,
        item.orderNo,
        item.discountPercent,
        formatNumber(item.totalPrice),
        formatNumber(item.totalDiscount),
        formatNumber(item.totalVAT),
        formatNumber(item.grandTotal),
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
        0: { cellWidth: 10 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 30 },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
        6: { halign: "right", cellWidth: 20 },
        7: { halign: "right", cellWidth: 20 },
        8: { halign: "right", cellWidth: 20 },
        9: { halign: "right", cellWidth: 20 },
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
    doc.save(`sales_summary_${dayjs().format("DD-MM-YYYY")}.pdf`);

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
    setPagination({ ...pagination, current: 1 }); // Reset to the first page when searching
  };

  // Filter data based on search text
  const filteredData = salesData.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // Columns for the sales table
  const salesColumns = [
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
      title: "ORDER NO",
      dataIndex: "orderNo",
      key: "orderNo",
    },
    {
      title: "DISC. %",
      dataIndex: "discountPercent",
      key: "discountPercent",
    },
    {
      title: "TOTAL PRICE",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => <span>{formatNumber(totalPrice)}</span>,
      align: "right",
    },
    {
      title: "TOTAL DISC.",
      dataIndex: "totalDiscount",
      key: "totalDiscount",
      render: (totalDiscount) => <span>{formatNumber(totalDiscount)}</span>,
      align: "right",
    },
    {
      title: "TOTAL VAT",
      dataIndex: "totalVAT",
      key: "totalVAT",
      render: (totalVAT) => <span>{formatNumber(totalVAT)}</span>,
      align: "right",
    },
    {
      title: "GRAND TOTAL",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (grandTotal) => <span>{formatNumber(grandTotal)}</span>,
      align: "right",
    },
  ];

  // Collapse items for the report section
  const collapseItems = [
    {
      key: "1",
      label: "Sales Summary",
      children: (
        <>
          <div className="mb-4">
            <Search
              placeholder="Search by invoice, customer, etc."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
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
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
            }}
            locale={{
              emptyText: (
                <div className="flex flex-col items-center justify-center p-4">
                  <SmileOutlined className="text-4xl text-gray-400 mb-2" /> {/* Icon */}
                  <span className="text-gray-500">No Data Available</span> {/* Text */}
                </div>
              ),
            }}
          />
          <hr />
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
                { title: "Sales Summary Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Sales Summary Report
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
                  customerName: filters.customerName,
                }}
              >
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="customerName" label="Customer Name">
                  <Select
                    mode="multiple"
                    showSearch
                    style={{ width: 300 }}
                    placeholder="Select Customer"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option key="Select All" value="Select All">
                      Select All
                    </Option>
                    {allCustomers.map((customer) => (
                      <Option key={customer} value={customer}>
                        {customer}
                      </Option>
                    ))}
                  </Select>
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

export default SalesSummary;