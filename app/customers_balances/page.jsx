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
  Select,
  Input,
  Pagination,
} from "antd";
import {
  FilterOutlined,
  FilePdfOutlined,
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  UserOutlined,
  PhoneOutlined,
  BankOutlined,
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

// Mock data for customer account balances
const mockData = [
  {
    id: "0001",
    branch: "Nairobi",
    customerName: "John Doe",
    phoneNumber: "0712345678",
    currentBalance: 30000,
  },
  {
    id: "0002",
    branch: "Mombasa",
    customerName: "Jane Smith",
    phoneNumber: "0723456789",
    currentBalance: 20000,
  },
  {
    id: "0003",
    branch: "Kisumu",
    customerName: "Alice Johnson",
    phoneNumber: "0734567890",
    currentBalance: 15000,
  },
  {
    id: "0004",
    branch: "Nairobi",
    customerName: "Michael Brown",
    phoneNumber: "0745678901",
    currentBalance: 25000,
  },
  {
    id: "0005",
    branch: "Mombasa",
    customerName: "Emily Davis",
    phoneNumber: "0756789012",
    currentBalance: 18000,
  },
];

const CustomersAccountBalances = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    asOfDate: dayjs().endOf("month"),
    branch: "all",
    customerName: "",
  });
  const [reportData, setReportData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleFilterChange = (changedValues, allValues) => {
    setFilters({
      ...filters,
      ...changedValues,
    });
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const generateReport = () => {
    const { asOfDate, branch, customerName } = form.getFieldsValue();

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
      // Filter mock data based on selected branch and customer name
      let filteredData = mockData;

      if (branch !== "all") {
        filteredData = filteredData.filter((item) => item.branch === branch);
      }

      if (customerName) {
        filteredData = filteredData.filter((item) =>
          item.customerName.toLowerCase().includes(customerName.toLowerCase())
        );
      }

      setReportData(filteredData);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      setLoading(false);

      notificationApi.success({
        message: "Report Generated",
        description: "Customers Account Balances generated successfully.",
        placement: "topRight",
        className: "bg-green-50",
      });
    }, 1000); // Simulate a 1-second delay for API call
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
    doc.text("Customers Account Balances", 70, 30);

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
    doc.text(" Report Information", margin.left + 5, 60);
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
      head: [["Branch", "Customer Name", "Phone Number", "Current Balance (KES)"]],
      body: reportData.map((item) => [
        item.branch,
        item.customerName,
        item.phoneNumber,
        item.currentBalance.toLocaleString(),
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
        0: { cellWidth: 50 },
        1: { cellWidth: 70 },
        2: { cellWidth: 60 },
        3: { halign: "right", cellWidth: 50 },
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
    doc.save(`customers_account_balances_${dayjs().format("DD-MM-YYYY")}.pdf`);

    notificationApi.success({
      message: "PDF Export Complete",
      description: "Your report has been successfully exported.",
      placement: "topRight",
      className: "bg-green-50",
    });
  };

  const columns = [
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (text, record) => (
        <Link href={`/ledger/${record.id}`}>
          <span style={{ color: "#1890ff", cursor: "pointer" }}>{text}</span>
        </Link>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Current Balance",
      dataIndex: "currentBalance",
      key: "currentBalance",
      render: (amount) => <span>KES {amount.toLocaleString()}</span>,
      align: "right",
    },
  ];

  const collapseItems = [
    {
      key: "1",
      label: "Customers Account Balances",
      children: (
        <>
          <Table
            dataSource={reportData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={reportData.length}
            onChange={(page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            }}
            className="mt-4 text-right"
          />
           <hr className="mt-4" />

          <div className="mt-4 text-gray-500 font-bold text-lg">
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
                { title: "Customers Account Balances" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Customers Account Balances
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
                  branch: filters.branch,
                  customerName: filters.customerName,
                }}
              >
                <Form.Item name="asOfDate" label="As of Date">
                  <DatePicker format="DD-MM-YYYY" disabledDate={disabledDate} />
                </Form.Item>
                <Form.Item name="branch" label="Branch">
                  <Select style={{ width: 230 }}>
                    <Option value="all">All Branches</Option>
                    <Option value="Nairobi">Nairobi</Option>
                    <Option value="Mombasa">Mombasa</Option>
                    <Option value="Kisumu">Kisumu</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="customerName" label="Customer Name">
                  <Input placeholder="Search customer" />
                </Form.Item>
              </Form>
              <div className="flex space-x-4">
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  onClick={generateReport}
                >
                  Generate Customers Balances
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

export default CustomersAccountBalances;