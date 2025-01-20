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
const { Option } = Select;

const SalesShiftClearanceReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs().startOf("month"), // Start of the month
    toDate: dayjs().endOf("month"), // End of the month
    shiftTime: null,
    user: null,
  });
  const [clearanceData, setClearanceData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [shiftOptions, setShiftOptions] = useState([]);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  useEffect(() => {
    // Fetch or generate shift options based on the selected date range
    const generateShiftOptions = () => {
      const { fromDate, toDate } = filters;
      const daysDiff = toDate.diff(fromDate, "day");
      const shifts = ["Morning Shift", "Afternoon Shift", "Evening Shift"];
      const branches = ["Branch 1", "Branch 2", "Branch 3"];

      const options = [];
      for (let i = 0; i <= daysDiff; i++) {
        const currentDate = fromDate.add(i, "day");
        shifts.forEach((shift) => {
          branches.forEach((branch) => {
            options.push({
              label: `${shift} - ${branch} (${currentDate.format("DD-MM-YYYY")})`,
              value: `${shift} - ${branch} - ${currentDate.format("DD-MM-YYYY")}`,
            });
          });
        });
      }

      setShiftOptions(options);
    };

    generateShiftOptions();
  }, [filters.fromDate, filters.toDate]);

  const handleFilterChange = (changedValues, allValues) => {
    const { fromDate, toDate, shiftTime, user } = allValues;
    setFilters({
      fromDate: fromDate ? dayjs(fromDate) : dayjs().startOf("month"),
      toDate: toDate ? dayjs(toDate) : dayjs().endOf("month"),
      shiftTime,
      user,
    });
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const generateRandomDifference = (expectedAmount, availableAmount) => {
    const difference = expectedAmount - availableAmount;
    return difference;
  };

  const generateReport = () => {
    const { fromDate, toDate, shiftTime, user } = form.getFieldsValue();

    if (!fromDate || !toDate || !shiftTime || !user) {
      notificationApi.error({
        message: "Selection Required",
        description: "Please select all fields to generate the report.",
        placement: "topRight",
        className: "bg-red-50",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const allBranchesData = [
        {
          id: "0001",
          salesPerson: "John Doe",
          clearanceDate: dayjs().format("DD-MM-YYYY"),
          clearedBy: "Jane Smith",
          expectedAmount: 50000.0,
          availableAmount: 48000.0,
          difference: generateRandomDifference(50000.0, 48000.0),
          cash: 30000.0,
          mpesa: 15000.0,
          pdqBankCheque: 5000.0,
          branch: "Branch 1",
        },
        {
          id: "0002",
          salesPerson: "Alice Johnson",
          clearanceDate: dayjs().format("DD-MM-YYYY"),
          clearedBy: "Jane Smith",
          expectedAmount: 45000.0,
          availableAmount: 44000.0,
          difference: generateRandomDifference(45000.0, 44000.0),
          cash: 25000.0,
          mpesa: 15000.0,
          pdqBankCheque: 5000.0,
          branch: "Branch 2",
        },
        {
          id: "0003",
          salesPerson: "Bob Brown",
          clearanceDate: dayjs().format("DD-MM-YYYY"),
          clearedBy: "Jane Smith",
          expectedAmount: 60000.0,
          availableAmount: 59000.0,
          difference: generateRandomDifference(60000.0, 59000.0),
          cash: 40000.0,
          mpesa: 15000.0,
          pdqBankCheque: 5000.0,
          branch: "Branch 3",
        },
      ];

      let data = [];
      if (shiftTime === "All Branches") {
        data = allBranchesData;
      } else {
        const [selectedShift, selectedBranch, selectedDate] = shiftTime.split(" - ");
        data = allBranchesData.filter((item) => item.branch === selectedBranch);
      }

      setClearanceData(data);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Sales Shift Clearance Report generated successfully.",
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
    doc.text("Sales Shift Clearance Report", 70, 30);

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
    doc.text(" Sales Shift Clearance Report Information", margin.left + 5, 60);
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

    doc.autoTable({
      startY: 100,
      head: [
        [
          "#",
          "Sales Person",
          "Clearance Date",
          "Cleared By",
          "Branch",
          "Expected Amount",
          "Available Amount",
          "Difference",
          "Cash",
          "Mpesa",
          "Pdq/Bank Cheque",
        ],
      ],
      body: clearanceData.map((item, index) => [
        index + 1,
        item.salesPerson,
        item.clearanceDate,
        item.clearedBy,
        item.branch,
        formatNumber(item.expectedAmount),
        formatNumber(item.availableAmount),
        formatNumber(item.difference),
        formatNumber(item.cash),
        formatNumber(item.mpesa),
        formatNumber(item.pdqBankCheque),
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
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { halign: "right", cellWidth: 30 },
        6: { halign: "right", cellWidth: 30 },
        7: { halign: "right", cellWidth: 30 },
        8: { halign: "right", cellWidth: 30 },
        9: { halign: "right", cellWidth: 30 },
        10: { halign: "right", cellWidth: 30 },
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
    doc.save(
      `sales_shift_clearance_report_${dayjs().format("DD-MM-YYYY")}.pdf`
    );

    notificationApi.success({
      message: "PDF Export Complete",
      description: "Your report has been successfully exported.",
      placement: "topRight",
      className: "bg-green-50",
    });
  };

  const clearanceColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Sales Person",
      dataIndex: "salesPerson",
      key: "salesPerson",
    },
    {
      title: "Clearance Date",
      dataIndex: "clearanceDate",
      key: "clearanceDate",
    },
    {
      title: "Cleared By",
      dataIndex: "clearedBy",
      key: "clearedBy",
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Expected Amount",
      dataIndex: "expectedAmount",
      key: "expectedAmount",
      render: (expectedAmount) => <span>{formatNumber(expectedAmount)}</span>,
      align: "right",
    },
    {
      title: "Available Amount",
      dataIndex: "availableAmount",
      key: "availableAmount",
      render: (availableAmount) => <span>{formatNumber(availableAmount)}</span>,
      align: "right",
    },
    {
      title: "Difference",
      dataIndex: "difference",
      key: "difference",
      render: (difference) => <span>{formatNumber(difference)}</span>,
      align: "right",
    },
    {
      title: "Cash",
      dataIndex: "cash",
      key: "cash",
      render: (cash) => <span>{formatNumber(cash)}</span>,
      align: "right",
    },
    {
      title: "Mpesa",
      dataIndex: "mpesa",
      key: "mpesa",
      render: (mpesa) => <span>{formatNumber(mpesa)}</span>,
      align: "right",
    },
    {
      title: "Pdq/Bank Cheque",
      dataIndex: "pdqBankCheque",
      key: "pdqBankCheque",
      render: (pdqBankCheque) => <span>{formatNumber(pdqBankCheque)}</span>,
      align: "right",
    },
  ];

  const totalExpectedAmount = clearanceData.reduce(
    (sum, item) => sum + (item.expectedAmount || 0),
    0
  );
  const totalAvailableAmount = clearanceData.reduce(
    (sum, item) => sum + (item.availableAmount || 0),
    0
  );
  const totalDifference = clearanceData.reduce(
    (sum, item) => sum + (item.difference || 0),
    0
  );
  const totalCash = clearanceData.reduce(
    (sum, item) => sum + (item.cash || 0),
    0
  );
  const totalMpesa = clearanceData.reduce(
    (sum, item) => sum + (item.mpesa || 0),
    0
  );
  const totalPdqBankCheque = clearanceData.reduce(
    (sum, item) => sum + (item.pdqBankCheque || 0),
    0
  );

  const tableDataWithTotal = [...clearanceData];

  const collapseItems = [
    {
      key: "1",
      label: "Sales Shift Clearance Report",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={8}>
              <Card className="bg-blue-50">
                <div className="flex items-center">
                  <DollarOutlined className="text-blue-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Expected Amount
                  </Text>
                </div>
                <Title level={4}>
                  KES : {formatNumber(totalExpectedAmount)}
                </Title>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="bg-green-50">
                <div className="flex items-center">
                  <DollarOutlined className="text-green-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Available Amount
                  </Text>
                </div>
                <Title level={4}>
                  KES : {formatNumber(totalAvailableAmount)}
                </Title>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="bg-red-50">
                <div className="flex items-center">
                  <DollarOutlined className="text-red-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Difference
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalDifference)}</Title>
              </Card>
            </Col>
          </Row>
          <Table
            dataSource={tableDataWithTotal}
            columns={clearanceColumns}
            rowKey="id"
            pagination={false}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5}>
                  <Text strong className="text-lg">
                    Total
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong className="text-lg">
                    {formatNumber(totalExpectedAmount)}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  <Text strong className="text-lg">
                    {formatNumber(totalAvailableAmount)}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  <Text strong className="text-lg">
                    {formatNumber(totalDifference)}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="right">
                  <Text strong className="text-lg">
                    {formatNumber(totalCash)}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="right">
                  <Text strong className="text-lg">
                    {formatNumber(totalMpesa)}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="right">
                  <Text strong className="text-lg">
                    {formatNumber(totalPdqBankCheque)}
                  </Text>
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
                From : {filters.fromDate.format("DD-MM-YYYY")} To :{" "}
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
                { title: "Clearance Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Shift Clearance Report
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
                <Form.Item name="shiftTime" label="Shift Time">
                  <Select
                    placeholder="Select Shift Time and Branch"
                    style={{ width: "280px" }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option value="All Branches">All Branches</Option>
                    {shiftOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="user" label="User">
                  <Select
                    placeholder="Select User"
                    style={{ width: "150px" }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option value="user1">User 1</Option>
                    <Option value="user2">User 2</Option>
                    <Option value="user3">User 3</Option>
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

export default SalesShiftClearanceReport;