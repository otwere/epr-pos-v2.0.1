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
  Select,
  Progress,
  Statistic,
  Tooltip,
} from "antd";
import {
  FilterOutlined,
  FilePdfOutlined,
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  DollarOutlined,
  UserOutlined,
  BarChartOutlined,
  LineChartOutlined,
  HeatMapOutlined,
} from "@ant-design/icons";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import Link from "next/link";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

Chart.register(...registerables);

const { Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const EmployeeSalesSummaryReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs().startOf("month"),
    toDate: dayjs().endOf("month"),
    branchId: null,
    employeeId: null,
  });
  const [reportData, setReportData] = useState(null);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");

  const [branches] = useState([
    {
      id: "1",
      name: "Nairobi Branch",
      location: "Nairobi, Kenya",
      manager: "John Doe",
    },
    {
      id: "2",
      name: "Mombasa Branch",
      location: "Mombasa, Kenya",
      manager: "Jane Smith",
    },
  ]);

  const [employees] = useState([
    {
      id: "2",
      name: "Bob Williams",
      role: "Sales Manager",
      team: "Team B",
      branchId: "1",
      jobId: "EMP002",
    },
    {
      id: "1",
      name: "Alice Johnson",
      role: "Sales Associate",
      team: "Team A",
      branchId: "1",
      jobId: "EMP001",
    },
    {
      id: "3",
      name: "Charlie Brown",
      role: "Sales Associate",
      team: "Team A",
      branchId: "2",
      jobId: "EMP003",
    },
  ]);

  const [supervisors] = useState([
    {
      id: "1",
      name: "Michael Scott",
      branchId: "1",
    },
    {
      id: "2",
      name: "Dwight Schrute",
      branchId: "2",
    },
  ]);

  const [workSchedules] = useState([
    {
      employeeId: "1",
      shiftTimings: "9 AM - 5 PM",
      hoursPerWeek: 40,
    },
    {
      employeeId: "2",
      shiftTimings: "10 AM - 6 PM",
      hoursPerWeek: 40,
    },
    {
      employeeId: "3",
      shiftTimings: "11 AM - 7 PM",
      hoursPerWeek: 40,
    },
  ]);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleFilterChange = (changedValues, allValues) => {
    const { fromDate, toDate, branchId, employeeId } = allValues;
    setFilters({
      fromDate: fromDate ? dayjs(fromDate) : dayjs().startOf("month"),
      toDate: toDate ? dayjs(toDate) : dayjs().endOf("month"),
      branchId,
      employeeId,
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
    const { fromDate, toDate, branchId, employeeId } = form.getFieldsValue();

    if (!fromDate || !toDate || !branchId) {
      notificationApi.error({
        message: "Selection Required",
        description:
          "Please select 'From Date', 'To Date', and 'Branch' to generate the report.",
        placement: "topRight",
        className: "bg-red-50",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const branch = branches.find((b) => b.id === branchId);
      const employee = employees.find((emp) => emp.id === employeeId);
      const supervisor = supervisors.find((sup) => sup.branchId === branchId);
      const workSchedule = workSchedules.find(
        (ws) => ws.employeeId === employeeId
      );

      const data = {
        branchInfo: {
          name: branch?.name || "Unknown Branch",
          location: branch?.location || "Unknown Location",
          manager: branch?.manager || "Unknown Manager",
          supervisor: supervisor?.name || "Unknown Supervisor",
        },
        employeeInfo: {
          name: employee?.name || "All Employees",
          role: employee?.role || "All Roles",
          team: employee?.team || "All Teams",
        },
        workSchedule: {
          shiftTimings: workSchedule?.shiftTimings || "N/A",
          hoursPerWeek: workSchedule?.hoursPerWeek || "N/A",
        },
        salesMetrics: {
          totalSales: 162268.97,
          numberOfTransactions: 120,
          averageSaleValue: 1352.24,
          quotaAchievement: 85,
          productCategories: [
            { category: "Electronics", sales: 80000 },
            { category: "Clothing", sales: 50000 },
            { category: "Accessories", sales: 32268.97 },
          ],
        },
        comparativePerformance: {
          branchTotals: {
            totalSales: 500000,
            numberOfTransactions: 400,
          },
          employeeRankings: [
            { id: "1", name: "Alice Johnson", totalSales: 162268.97 },
            { id: "2", name: "Bob Williams", totalSales: 150000 },
            { id: "3", name: "Charlie Brown", totalSales: 120000 },
          ],
          branchRankings: [
            { id: "1", name: "Nairobi Branch", totalSales: 300000 },
            { id: "2", name: "Mombasa Branch", totalSales: 200000 },
          ],
        },
        timeFrame: {
          reportingPeriod: `${fromDate.format("DD-MM-YYYY")} to ${toDate.format(
            "DD-MM-YYYY"
          )}`,
          trendsOverTime: [
            { month: "Jan", sales: 100000 },
            { month: "Feb", sales: 120000 },
            { month: "Mar", sales: 150000 },
          ],
        },
        performanceIndicators: {
          conversionRate: 75,
          upsellingSuccess: 60,
          customerRetention: 80,
          salesPerHour: 500,
        },
        bounces: {
          employeeBounces: [
            { id: "1", name: "Alice Johnson", bounces: 5000 },
            { id: "2", name: "Bob Williams", bounces: 4500 },
            { id: "3", name: "Charlie Brown", bounces: 4000 },
          ],
          branchBounces: [
            { id: "1", name: "Nairobi Branch", totalBounces: 9500 },
            { id: "2", name: "Mombasa Branch", totalBounces: 8500 },
          ],
        },
      };

      setReportData(data);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Employee Sales Summary Report generated successfully.",
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
    doc.text("Employee Sales Summary Report", 70, 30);

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
    doc.text(" Employee Sales Summary Report Information", margin.left + 5, 60);
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

    // Branch Information
    doc.setFont("helvetica", "bold");
    doc.text("Branch Information", margin.left, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`Branch Name: ${reportData?.branchInfo?.name}`, margin.left, 100);
    doc.text(`Location: ${reportData?.branchInfo?.location}`, margin.left, 110);
    doc.text(
      `Branch Manager: ${reportData?.branchInfo?.manager}`,
      margin.left,
      120
    );

    // Employee Details
    doc.setFont("helvetica", "bold");
    doc.text("Employee Details", margin.left, 130);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Employee Name: ${reportData?.employeeInfo?.name}`,
      margin.left,
      140
    );
    doc.text(`Role: ${reportData?.employeeInfo?.role}`, margin.left, 150);
    doc.text(`Team: ${reportData?.employeeInfo?.team}`, margin.left, 160);

    // Sales Metrics
    doc.setFont("helvetica", "bold");
    doc.text("Sales Metrics", margin.left, 170);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Total Sales: KES ${formatNumber(reportData?.salesMetrics?.totalSales)}`,
      margin.left,
      180
    );
    doc.text(
      `Number of Transactions: ${reportData?.salesMetrics?.numberOfTransactions}`,
      margin.left,
      190
    );
    doc.text(
      `Average Sale Value: KES ${formatNumber(
        reportData?.salesMetrics?.averageSaleValue
      )}`,
      margin.left,
      200
    );
    doc.text(
      `Quota Achievement: ${reportData?.salesMetrics?.quotaAchievement}%`,
      margin.left,
      210
    );

    // Product Categories
    doc.autoTable({
      startY: 220,
      head: [["#", "Product Category", "Sales (KES)"]],
      body: reportData?.salesMetrics?.productCategories.map((item, index) => [
        index + 1,
        item.category,
        formatNumber(item.sales),
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
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    });

    // Comparative Performance
    doc.setFont("helvetica", "bold");
    doc.text(
      "Comparative Performance",
      margin.left,
      doc.lastAutoTable.finalY + 10
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      `Branch Totals: KES ${formatNumber(
        reportData?.comparativePerformance?.branchTotals?.totalSales
      )}`,
      margin.left,
      doc.lastAutoTable.finalY + 20
    );
    doc.text(
      `Number of Transactions: ${reportData?.comparativePerformance?.branchTotals?.numberOfTransactions}`,
      margin.left,
      doc.lastAutoTable.finalY + 30
    );

    // Employee Rankings
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 40,
      head: [["#", "Employee Name", "Total Sales (KES)"]],
      body: reportData?.comparativePerformance?.employeeRankings.map(
        (item, index) => [index + 1, item.name, formatNumber(item.totalSales)]
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
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    });

    // Branch Rankings
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["#", "Branch Name", "Total Sales (KES)"]],
      body: reportData?.comparativePerformance?.branchRankings.map(
        (item, index) => [index + 1, item.name, formatNumber(item.totalSales)]
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
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    });

    // Time Frame
    doc.setFont("helvetica", "bold");
    doc.text("Time Frame", margin.left, doc.lastAutoTable.finalY + 10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Reporting Period: ${reportData?.timeFrame?.reportingPeriod}`,
      margin.left,
      doc.lastAutoTable.finalY + 20
    );

    // Trends Over Time
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 30,
      head: [["#", "Month", "Sales (KES)"]],
      body: reportData?.timeFrame?.trendsOverTime.map((item, index) => [
        index + 1,
        item.month,
        formatNumber(item.sales),
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
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    });

    // Performance Indicators
    doc.setFont("helvetica", "bold");
    doc.text(
      "Performance Indicators",
      margin.left,
      doc.lastAutoTable.finalY + 10
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      `Conversion Rate: ${reportData?.performanceIndicators?.conversionRate}%`,
      margin.left,
      doc.lastAutoTable.finalY + 20
    );
    doc.text(
      `Upselling Success: ${reportData?.performanceIndicators?.upsellingSuccess}%`,
      margin.left,
      doc.lastAutoTable.finalY + 30
    );
    doc.text(
      `Customer Retention: ${reportData?.performanceIndicators?.customerRetention}%`,
      margin.left,
      doc.lastAutoTable.finalY + 40
    );
    doc.text(
      `Sales Per Hour: KES ${formatNumber(
        reportData?.performanceIndicators?.salesPerHour
      )}`,
      margin.left,
      doc.lastAutoTable.finalY + 50
    );

    // Bounces
    doc.setFont("helvetica", "bold");
    doc.text("Bounces", margin.left, doc.lastAutoTable.finalY + 60);
    doc.setFont("helvetica", "normal");

    // Employee Bounces
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 70,
      head: [["#", "Employee Name", "Bounces (KES)"]],
      body: reportData?.bounces?.employeeBounces.map((item, index) => [
        index + 1,
        item.name,
        formatNumber(item.bounces),
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
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    });

    // Branch Bounces
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [["#", "Branch Name", "Total Bounces (KES)"]],
      body: reportData?.bounces?.branchBounces.map((item, index) => [
        index + 1,
        item.name,
        formatNumber(item.totalBounces),
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
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    });

    // Footer
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
      `employee_sales_summary_report_${dayjs().format("DD-MM-YYYY")}.pdf`
    );

    notificationApi.success({
      message: "PDF Export Complete",
      description: "Your report has been successfully exported.",
      placement: "topRight",
    });
  };

  const salesMetricsColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value) => <Text strong>{value}</Text>,
      align: "right",
    },
  ];

  const productCategoriesColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Product Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Sales (KES)",
      dataIndex: "sales",
      key: "sales",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
  ];

  const employeeRankingsColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Employee Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total Sales (KES)",
      dataIndex: "totalSales",
      key: "totalSales",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
  ];

  const branchRankingsColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Branch Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total Sales (KES)",
      dataIndex: "totalSales",
      key: "totalSales",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
  ];

  const trendsOverTimeColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Sales (KES)",
      dataIndex: "sales",
      key: "sales",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
  ];

  const performanceIndicatorsColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Indicator",
      dataIndex: "indicator",
      key: "indicator",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value) => <Text strong>{value}</Text>,
      align: "right",
    },
  ];

  const bouncesColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Employee Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Bounces (KES)",
      dataIndex: "bounces",
      key: "bounces",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
  ];

  const branchBouncesColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Branch Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total Bounces (KES)",
      dataIndex: "totalBounces",
      key: "totalBounces",
      render: (value) => <Text strong>{formatNumber(value)}</Text>,
      align: "right",
    },
  ];

  const collapseItems = [
    {
      key: "1",
      label: "Employee Sales Summary Report",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card className="bg-blue-50 border-0">
                <div className="flex items-center mb-4">
                  <UserOutlined className="text-blue-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Employee Details & Branch Information
                  </Text>
                </div>
                <hr className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Employee Details at the Top */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Text strong className="text-gray-700 block mb-2">
                      Employee Name
                    </Text>
                    <Text className="text-gray-800 text-lg font-semibold">
                      {reportData?.employeeInfo?.name}
                    </Text>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Text strong className="text-gray-700 block mb-2">
                      Employee Job ID No
                    </Text>
                    <Text className="text-gray-800 text-lg font-semibold">
                      {employees.find(emp => emp.name === reportData?.employeeInfo?.name)?.jobId}
                    </Text>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Text strong className="text-gray-700 block mb-2">
                      Role
                    </Text>
                    <Text className="text-gray-800 text-lg font-semibold">
                      {reportData?.employeeInfo?.role}
                    </Text>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Text strong className="text-gray-700 block mb-2">
                      Team
                    </Text>
                    <Text className="text-gray-800 text-lg font-semibold">
                      {reportData?.employeeInfo?.team}
                    </Text>
                  </div>

                  {/* Branch Information Below */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Text strong className="text-gray-700 block mb-2">
                      Branch Name
                    </Text>
                    <Text className="text-gray-800 text-lg font-semibold">
                      {reportData?.branchInfo?.name}
                    </Text>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Text strong className="text-gray-700 block mb-2">
                      Location
                    </Text>
                    <Text className="text-gray-800 text-lg font-semibold">
                      {reportData?.branchInfo?.location}
                    </Text>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Text strong className="text-gray-700 block mb-2">
                      Supervisor
                    </Text>
                    <Text className="text-gray-800 text-lg font-semibold">
                      {reportData?.branchInfo?.supervisor}
                    </Text>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Text strong className="text-gray-700 block mb-2">
                      Branch Manager
                    </Text>
                    <Text className="text-gray-800 text-lg font-semibold">
                      {reportData?.branchInfo?.manager}
                    </Text>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Text strong className="text-gray-700 block mb-2">
                      Work Schedule
                    </Text>
                    <Text className="text-gray-800 text-lg font-semibold">
                      Shift Time : {reportData?.workSchedule?.shiftTimings}
                    </Text>
                    <Text className="text-gray-800 text-lg font-semibold">
                     -  : Hrs per Week : {reportData?.workSchedule?.hoursPerWeek}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card className="bg-yellow-50">
                <div className="flex items-center mb-4">
                  <DollarOutlined className="text-yellow-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Sales Metrics
                  </Text>
                </div>
                <hr />
                <Table
                  dataSource={[
                    {
                      id: "1",
                      metric: "Total Sales",
                      value: `KES ${formatNumber(
                        reportData?.salesMetrics?.totalSales
                      )}`,
                    },
                    {
                      id: "2",
                      metric: "Number of Transactions",
                      value: reportData?.salesMetrics?.numberOfTransactions,
                    },
                    {
                      id: "3",
                      metric: "Average Sale Value",
                      value: `KES ${formatNumber(
                        reportData?.salesMetrics?.averageSaleValue
                      )}`,
                    },
                    {
                      id: "4",
                      metric: "Quota Achievement",
                      value: `${reportData?.salesMetrics?.quotaAchievement}%`,
                    },
                  ]}
                  columns={salesMetricsColumns}
                  pagination={false}
                  rowKey="id"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card className="bg-purple-50">
                <div className="flex items-center mb-4">
                  <BarChartOutlined className="text-purple-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Product Categories
                  </Text>
                </div>
                <hr />
                <Table
                  dataSource={reportData?.salesMetrics?.productCategories.map(
                    (item, index) => ({
                      id: index + 1,
                      category: item.category,
                      sales: item.sales,
                    })
                  )}
                  columns={productCategoriesColumns}
                  pagination={false}
                  rowKey="id"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card className="bg-red-50">
                <div className="flex items-center mb-4">
                  <LineChartOutlined className="text-red-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Trends Over Time
                  </Text>
                </div>
                <Table
                  dataSource={reportData?.timeFrame?.trendsOverTime.map(
                    (item, index) => ({
                      id: index + 1,
                      month: item.month,
                      sales: item.sales,
                    })
                  )}
                  columns={trendsOverTimeColumns}
                  pagination={false}
                  rowKey="id"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card className="bg-blue-50">
                <div className="flex items-center mb-4">
                  <HeatMapOutlined className="text-blue-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Performance Indicators
                  </Text>
                </div>
                <Table
                  dataSource={[
                    {
                      id: "1",
                      indicator: "Conversion Rate",
                      value: `${reportData?.performanceIndicators?.conversionRate}%`,
                    },
                    {
                      id: "2",
                      indicator: "Upselling Success",
                      value: `${reportData?.performanceIndicators?.upsellingSuccess}%`,
                    },
                    {
                      id: "3",
                      indicator: "Customer Retention",
                      value: `${reportData?.performanceIndicators?.customerRetention}%`,
                    },
                    {
                      id: "4",
                      indicator: "Sales Per Hour",
                      value: `KES ${formatNumber(
                        reportData?.performanceIndicators?.salesPerHour
                      )}`,
                    },
                  ]}
                  columns={performanceIndicatorsColumns}
                  pagination={false}
                  rowKey="id"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card className="bg-green-50">
                <div className="flex items-center mb-4">
                  <BarChartOutlined className="text-green-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Employee Rankings
                  </Text>
                </div>
                <Table
                  dataSource={reportData?.comparativePerformance?.employeeRankings.map(
                    (item, index) => ({
                      id: index + 1,
                      name: item.name,
                      totalSales: item.totalSales,
                    })
                  )}
                  columns={employeeRankingsColumns}
                  pagination={false}
                  rowKey="id"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card className="bg-yellow-50">
                <div className="flex items-center mb-4">
                  <BarChartOutlined className="text-yellow-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Branch Rankings
                  </Text>
                </div>
                <hr />
                <Table
                  dataSource={reportData?.comparativePerformance?.branchRankings.map(
                    (item, index) => ({
                      id: index + 1,
                      name: item.name,
                      totalSales: item.totalSales,
                    })
                  )}
                  columns={branchRankingsColumns}
                  pagination={false}
                  rowKey="id"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card className="bg-orange-50">
                <div className="flex items-center mb-4">
                  <BarChartOutlined className="text-orange-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Bounces Earned
                  </Text>
                </div>
                <hr />
                <Table
                  dataSource={reportData?.bounces?.employeeBounces.map(
                    (item, index) => ({
                      id: index + 1,
                      name: item.name,
                      bounces: item.bounces,
                    })
                  )}
                  columns={bouncesColumns}
                  pagination={false}
                  rowKey="id"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card className="bg-pink-50">
                <div className="flex items-center mb-4">
                  <BarChartOutlined className="text-pink-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Branch Bounces
                  </Text>
                </div>
                <hr />
                <Table
                  dataSource={reportData?.bounces?.branchBounces.map(
                    (item, index) => ({
                      id: index + 1,
                      name: item.name,
                      totalBounces: item.totalBounces,
                    })
                  )}
                  columns={branchBouncesColumns}
                  pagination={false}
                  rowKey="id"
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
                { title: "Employee Sales Summary Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Employee Sales Summary Report
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
                  branchId: filters.branchId,
                  employeeId: filters.employeeId,
                }}
              >
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="branchId" label="Branch">
                  <Select
                    placeholder="Select Branch"
                    style={{ width: 200 }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {branches.map((branch) => (
                      <Option key={branch.id} value={branch.id}>
                        {branch.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="employeeId" label="Employee">
                  <Select
                    placeholder="Select Employee"
                    style={{ width: 200 }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {employees.map((employee) => (
                      <Option key={employee.id} value={employee.id}>
                        {employee.name}
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

export default EmployeeSalesSummaryReport;