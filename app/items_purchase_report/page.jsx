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
  Progress,
  Statistic,
  Input,
  Select,
} from "antd";
import {
  FilterOutlined,
  FilePdfOutlined,
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  UserOutlined,
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

const PurchaseReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: dayjs().startOf("month"),
    toDate: dayjs().endOf("month"),
    itemName: "",
    status: "",
  });
  const [purchaseData, setPurchaseData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [selectedAgeRange, setSelectedAgeRange] = useState(null);
  const [selectedPurchaseAgeRange, setSelectedPurchaseAgeRange] = useState(null);
  const [itemNames, setItemNames] = useState([]);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  // Mock Data
  const mockPurchaseData = [
    {
      id: 1,
      supplierName: "Supplier A",
      branch: "Nairobi",
      contactDetails: "supplierA@example.com",
      creditLimit: 100000,
      paymentTerms: "Net 30",
      lateFees: 500,
      adjustments: 200,
      writeOffs: 100,
      followUpNotes: "Follow up on payment",
      followUpPerson: "John Doe",
      followUpRole: "Account Manager",
      purchases: [
        {
          purchaseNumber: "PO001",
          purchaseDate: "01-12-2024",
          receivedDate: "05-12-2024",
          amount: 50000,
          paymentStatus: "Unpaid",
          status: "Received",
          items: [
            {
              itemName: "Item 1",
              itemCode: "ITM001",
              itemCategory: "Category A",
              unitOfMeasure: "Pieces",
              quantityPurchased: 100,
              quantityReceived: 90,
              unitPrice: 500,
              totalCost: 50000,
              stockLevelBeforePurchase: 200,
              stockLevelAfterPurchase: 300,
              expense: 450,
            },
          ],
        },
        {
          purchaseNumber: "PO002",
          purchaseDate: "05-01-2025",
          receivedDate: "10-01-2025",
          amount: 30000,
          paymentStatus: "Partial",
          status: "Ordered",
          items: [
            {
              itemName: "Item 2",
              itemCode: "ITM002",
              itemCategory: "Category B",
              unitOfMeasure: "Pieces",
              quantityPurchased: 50,
              quantityReceived: 45,
              unitPrice: 600,
              totalCost: 30000,
              stockLevelBeforePurchase: 150,
              stockLevelAfterPurchase: 200,
              expense: 270,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "15-12-2024",
          transactionId: "TX001",
          modeOfPayment: "Bank Transfer",
          amount: 20000,
        },
      ],
    },
    {
      id: 2,
      supplierName: "Supplier B",
      branch: "Mombasa",
      contactDetails: "supplierB@example.com",
      creditLimit: 150000,
      paymentTerms: "Net 60",
      lateFees: 700,
      adjustments: 300,
      writeOffs: 150,
      followUpNotes: "Follow up on pending items",
      followUpPerson: "Jane Doe",
      followUpRole: "Account Manager",
      purchases: [
        {
          purchaseNumber: "PO003",
          purchaseDate: "10-12-2024",
          receivedDate: "15-12-2024",
          amount: 75000,
          paymentStatus: "Partial",
          status: "Received",
          items: [
            {
              itemName: "Item 3",
              itemCode: "ITM003",
              itemCategory: "Category C",
              unitOfMeasure: "Pieces",
              quantityPurchased: 120,
              quantityReceived: 110,
              unitPrice: 700,
              totalCost: 84000,
              stockLevelBeforePurchase: 300,
              stockLevelAfterPurchase: 410,
              expense: 630,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "20-12-2024",
          transactionId: "TX002",
          modeOfPayment: "Cheque",
          amount: 30000,
        },
      ],
    },
  ];

  useEffect(() => {
    const names = mockPurchaseData.flatMap((supplier) =>
      supplier.purchases.flatMap((purchase) =>
        purchase.items.map((item) => item.itemName)
      )
    );
    setItemNames([...new Set(names)]);
  }, []);

  const handleFilterChange = (changedValues, allValues) => {
    const { fromDate, toDate, itemName, status } = allValues;
    setFilters({
      fromDate: fromDate ? dayjs(fromDate) : dayjs().startOf("month"),
      toDate: toDate ? dayjs(toDate) : dayjs().endOf("month"),
      itemName,
      status,
    });
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const calculateAgingAnalysis = (purchases) => {
    const today = dayjs();
    const agingAnalysis = { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 };

    purchases.forEach((purchase) => {
      const purchaseDate = dayjs(purchase.purchaseDate, "DD-MM-YYYY");
      const daysDiff = today.diff(purchaseDate, "day");

      if (daysDiff >= 0 && daysDiff <= 30) {
        agingAnalysis["0-30"] += purchase.amount;
      } else if (daysDiff > 30 && daysDiff <= 60) {
        agingAnalysis["31-60"] += purchase.amount;
      } else if (daysDiff > 60 && daysDiff <= 90) {
        agingAnalysis["61-90"] += purchase.amount;
      } else if (daysDiff > 90) {
        agingAnalysis["90+"] += purchase.amount;
      }
    });

    return agingAnalysis;
  };

  const calculateRiskLevel = (purchases) => {
    const today = dayjs();
    let maxOverdueDays = 0;

    purchases.forEach((purchase) => {
      const dueDate = dayjs(purchase.dueDate, "DD-MM-YYYY");
      const overdueDays = today.diff(dueDate, "day");
      if (overdueDays > maxOverdueDays) {
        maxOverdueDays = overdueDays;
      }
    });

    if (maxOverdueDays <= 30) return "Low";
    if (maxOverdueDays <= 60) return "Medium";
    if (maxOverdueDays <= 90) return "High";
    return "Critical";
  };

  const calculateOutstandingBalance = (purchases, paymentHistory) => {
    const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const totalPayments = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
    return totalPurchases - totalPayments;
  };

  const calculateUnpaidAndPartialTotals = (purchases) => {
    let unpaidTotal = 0;
    let partialTotal = 0;

    purchases.forEach((purchase) => {
      if (purchase.paymentStatus === "Unpaid") {
        unpaidTotal += purchase.amount;
      } else if (purchase.paymentStatus === "Partial") {
        partialTotal += purchase.amount;
      }
    });

    return { unpaidTotal, partialTotal };
  };

  const generateReport = () => {
    const { fromDate, toDate, itemName, status } = form.getFieldsValue();

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
      const filteredByDate = mockPurchaseData.filter((supplier) => {
        return supplier.purchases.some((purchase) => {
          const purchaseDate = dayjs(purchase.purchaseDate, "DD-MM-YYYY");
          return purchaseDate.isAfter(fromDate) && purchaseDate.isBefore(toDate);
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

      const updatedPurchaseData = filteredByDate.map((supplier) => {
        const outstandingBalance = calculateOutstandingBalance(supplier.purchases, supplier.paymentHistory);
        const { unpaidTotal, partialTotal } = calculateUnpaidAndPartialTotals(supplier.purchases);

        return {
          ...supplier,
          agingAnalysis: calculateAgingAnalysis(supplier.purchases),
          riskLevel: calculateRiskLevel(supplier.purchases),
          outstandingBalance,
          unpaidTotal,
          partialTotal,
        };
      });

      setPurchaseData(updatedPurchaseData);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Items Purchase Report generated successfully.",
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
    doc.text("Items Purchase Report", 70, 30);

    doc.setTextColor(brandColors.primary);
    doc.setFontSize(12);
    doc.roundedRect(margin.left, 50, doc.internal.pageSize.width - 40, 35, 3, 3, "S");

    doc.setFont("helvetica", "bold");
    doc.text(" Items Purchase Report Information", margin.left + 5, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(brandColors.gray);
    doc.text(`From: ${filters.fromDate.format("DD-MM-YYYY")} To: ${filters.toDate.format("DD-MM-YYYY")}`, margin.left + 5, 70);
    doc.text(`Generated : ${reportGeneratedTime}`, margin.left + 5, 80);
    doc.text(`Generated by : ${generatedBy}`, doc.internal.pageSize.width - 80, 80);

    doc.autoTable({
      startY: 100,
      head: [["SUPPLIER NAME", "BRANCH", "OUTSTANDING BALANCE", "RISK LEVEL", "CREDIT LIMIT", "UTILIZATION"]],
      body: purchaseData.map((item) => [
        item.supplierName,
        item.branch,
        formatNumber(item.outstandingBalance),
        item.riskLevel,
        formatNumber(item.creditLimit),
        `${((item.outstandingBalance / item.creditLimit) * 100).toFixed(2)}%`,
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
        2: { halign: "right", cellWidth: 50 },
        3: { cellWidth: 40 },
        4: { halign: "right", cellWidth: 50 },
        5: { halign: "right", cellWidth: 50 },
      },
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Item Name", "Item Code", "Category", "Unit of Measure", "Quantity", "Unit Price", "Total Cost", "Stock Before", "Stock After"]],
      body: purchaseData.flatMap((supplier) =>
        supplier.purchases.flatMap((purchase) =>
          purchase.items.map((item) => [
            item.itemName,
            item.itemCode,
            item.itemCategory,
            item.unitOfMeasure,
            item.quantityPurchased,
            formatNumber(item.unitPrice),
            formatNumber(item.totalCost),
            item.stockLevelBeforePurchase,
            item.stockLevelAfterPurchase,
          ])
        )
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
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { halign: "right", cellWidth: 20 },
        5: { halign: "right", cellWidth: 30 },
        6: { halign: "right", cellWidth: 30 },
        7: { halign: "right", cellWidth: 30 },
        8: { halign: "right", cellWidth: 30 },
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
    doc.save(`purchase_report_${dayjs().format("DD-MM-YYYY")}.pdf`);

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

  const filteredData = purchaseData.filter((item) => {
    const matchesSearchText =
      item.supplierName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.contactDetails.toLowerCase().includes(searchText.toLowerCase());

    const matchesAgeRange = !selectedAgeRange || item.agingAnalysis[selectedAgeRange] > 0;

    const matchesItemName = !filters.itemName || item.purchases.some((purchase) =>
      purchase.items.some((item) => item.itemName === filters.itemName)
    );

    const matchesStatus = !filters.status || item.purchases.some((purchase) => purchase.status === filters.status);

    return matchesSearchText && matchesAgeRange && matchesItemName && matchesStatus;
  });

  const filterPurchasesByAgeRange = (purchases, ageRange) => {
    const today = dayjs();
    return purchases.filter((purchase) => {
      const purchaseDate = dayjs(purchase.purchaseDate, "DD-MM-YYYY");
      const daysDiff = today.diff(purchaseDate, "day");

      const matchesAgeRange =
        (ageRange === "0-30" && daysDiff >= 0 && daysDiff <= 30) ||
        (ageRange === "31-60" && daysDiff > 30 && daysDiff <= 60) ||
        (ageRange === "61-90" && daysDiff > 60 && daysDiff <= 90) ||
        (ageRange === "90+" && daysDiff > 90);

      const matchesStatus = !filters.status || purchase.status === filters.status;

      return matchesAgeRange && matchesStatus;
    });
  };

  const purchaseColumns = [
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
      title: "CONTACT DETAILS",
      dataIndex: "contactDetails",
      key: "contactDetails",
    },
    {
      title: "Item Name",
      key: "itemName",
      render: (_, record) => {
        const firstPurchase = record.purchases[0];
        if (firstPurchase && firstPurchase.items && firstPurchase.items.length > 0) {
          return firstPurchase.items[0].itemName;
        }
        return "N/A";
      },
    },
    {
      title: "OUTSTANDING BALANCE",
      dataIndex: "outstandingBalance",
      key: "outstandingBalance",
      render: (outstandingBalance) => <span>{formatNumber(outstandingBalance)}</span>,
      align: "right",
    },
    {
      title: "RISK LEVEL",
      dataIndex: "riskLevel",
      key: "riskLevel",
      align: "right",
      render: (riskLevel) => {
        let color =
          riskLevel === "Low"
            ? "green"
            : riskLevel === "Medium"
              ? "orange"
              : riskLevel === "High"
                ? "red"
                : "darkred";
        return <Tag color={color}>{riskLevel}</Tag>;
      },
    },
    {
      title: "CREDIT LIMIT",
      dataIndex: "creditLimit",
      key: "creditLimit",
      render: (creditLimit) => <span>{formatNumber(creditLimit)}</span>,
      align: "right",
    },
    {
      title: "UTILIZATION",
      key: "utilization",
      render: (_, record) => {
        const utilization = (record.outstandingBalance / record.creditLimit) * 100;
        return (
          <Progress
            percent={utilization.toFixed(2)}
            status={utilization > 100 ? "exception" : "normal"}
          />
        );
      },
    },
  ];

  const itemColumns = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "Item Code",
      dataIndex: "itemCode",
      key: "itemCode",
    },
    {
      title: "Category",
      dataIndex: "itemCategory",
      key: "itemCategory",
    },
    {
      title: "Unit of Measure",
      dataIndex: "unitOfMeasure",
      key: "unitOfMeasure",
    },
    {
      title: "Quantity Purchased",
      dataIndex: "quantityPurchased",
      key: "quantityPurchased",
      align: "right",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (unitPrice) => formatNumber(unitPrice),
      align: "right",
    },
    {
      title: "Total Cost",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (totalCost) => formatNumber(totalCost),
      align: "right",
    },
    {
      title: "Stock Before",
      dataIndex: "stockLevelBeforePurchase",
      key: "stockLevelBeforePurchase",
      align: "right",
    },
    {
      title: "Stock After",
      dataIndex: "stockLevelAfterPurchase",
      key: "stockLevelAfterPurchase",
      align: "right",
    },
  ];

  const totalPayables = purchaseData.reduce((sum, item) => sum + (item.outstandingBalance || 0), 0);
  const totalUnpaid = purchaseData.reduce((sum, item) => sum + (item.unpaidTotal || 0), 0);
  const totalPartial = purchaseData.reduce((sum, item) => sum + (item.partialTotal || 0), 0);

  const collapseItems = [
    {
      key: "1",
      label: " Items Purchase Report",
      children: (
        <>
          <Row gutter={16} className="mb-4">
            <Col span={8} key="total-payables">
              <Card className="bg-green-50">
                <div className="flex items-center">
                  <UserOutlined className="text-green-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Payables
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalPayables)}</Title>
              </Card>
            </Col>
            <Col span={8} key="total-unpaid">
              <Card className="bg-red-50">
                <div className="flex items-center">
                  <UserOutlined className="text-red-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Unpaid
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalUnpaid)}</Title>
              </Card>
            </Col>
            <Col span={8} key="total-partial">
              <Card className="bg-orange-50">
                <div className="flex items-center">
                  <UserOutlined className="text-orange-600 text-2xl mr-2" />
                  <Text strong className="text-lg mb-1">
                    Total Partial
                  </Text>
                </div>
                <Title level={4}>KES : {formatNumber(totalPartial)}</Title>
              </Card>
            </Col>
          </Row>

          <div className="mb-4">
            <Input
              placeholder="Search by Supplier Name or Contact Details"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </div>

          <Table
            dataSource={filteredData}
            columns={purchaseColumns}
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
                const selectedPurchases = selectedPurchaseAgeRange
                  ? filterPurchasesByAgeRange(record.purchases, selectedPurchaseAgeRange)
                  : record.purchases;

                // Calculate totals for the selected purchases
                const totalReceivedQty = selectedPurchases.reduce((sum, purchase) => {
                  return sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantityReceived, 0);
                }, 0);

                const totalExpense = selectedPurchases.reduce((sum, purchase) => {
                  return sum + purchase.items.reduce((itemSum, item) => itemSum + item.expense, 0);
                }, 0);

                const subtotal = selectedPurchases.reduce((sum, purchase) => {
                  return sum + purchase.items.reduce((itemSum, item) => itemSum + (item.quantityReceived * item.unitPrice), 0);
                }, 0);

                const grandTotal = subtotal + totalExpense;

                return (
                  <div key={`expanded-${record.id}`}>
                    <Title level={4}> Purchase Aging Analysis</Title>
                    <hr className="mb-4" />
                    <Row gutter={16}>
                      <Col span={6} key={`aging-0-30-${record.id}`}>
                        <Card
                          className="bg-blue-50 cursor-pointer"
                          onClick={() => setSelectedPurchaseAgeRange("0-30")}
                        >
                          <Statistic
                            title="0-30 Days"
                            value={formatNumber(
                              filterPurchasesByAgeRange(record.purchases, "0-30").reduce(
                                (sum, purchase) => sum + purchase.amount,
                                0
                              )
                            )}
                          />
                        </Card>
                      </Col>
                      <Col span={6} key={`aging-31-60-${record.id}`}>
                        <Card
                          className="bg-green-50 cursor-pointer"
                          onClick={() => setSelectedPurchaseAgeRange("31-60")}
                        >
                          <Statistic
                            title="31-60 Days"
                            value={formatNumber(
                              filterPurchasesByAgeRange(record.purchases, "31-60").reduce(
                                (sum, purchase) => sum + purchase.amount,
                                0
                              )
                            )}
                          />
                        </Card>
                      </Col>
                      <Col span={6} key={`aging-61-90-${record.id}`}>
                        <Card
                          className="bg-orange-50 cursor-pointer"
                          onClick={() => setSelectedPurchaseAgeRange("61-90")}
                        >
                          <Statistic
                            title="61-90 Days"
                            value={formatNumber(
                              filterPurchasesByAgeRange(record.purchases, "61-90").reduce(
                                (sum, purchase) => sum + purchase.amount,
                                0
                              )
                            )}
                          />
                        </Card>
                      </Col>
                      <Col span={6} key={`aging-90+-${record.id}`}>
                        <Card
                          className="bg-red-50 cursor-pointer"
                          onClick={() => setSelectedPurchaseAgeRange("90+")}
                        >
                          <Statistic
                            title="90+ Days"
                            value={formatNumber(
                              filterPurchasesByAgeRange(record.purchases, "90+").reduce(
                                (sum, purchase) => sum + purchase.amount,
                                0
                              )
                            )}
                          />
                        </Card>
                      </Col>
                    </Row>
                    <Title level={4} className="mt-4">
                      Items Purchased Details
                    </Title>
                    <hr />
                    <Table
                      dataSource={selectedPurchases}
                      columns={[
                        {
                          title: "Purchase No.",
                          dataIndex: "purchaseNumber",
                          key: "purchaseNumber",
                        },
                        {
                          title: "Purchase Date",
                          dataIndex: "purchaseDate",
                          key: "purchaseDate",
                        },
                        {
                          title: "Received Date",
                          dataIndex: "receivedDate",
                          key: "receivedDate",
                        },
                        {
                          title: "Age (Days)",
                          key: "age",
                          render: (_, purchase) => {
                            const purchaseDate = dayjs(purchase.purchaseDate, "DD-MM-YYYY");
                            const today = dayjs();
                            const ageInDays = today.diff(purchaseDate, "day");
                            return <span>{ageInDays}</span>;
                          },
                          align: "right",
                        },
                        {
                          title: "Qty Difference",
                          key: "qtyDifference",
                          render: (_, purchase) => {
                            const qtyDifference = purchase.items.reduce(
                              (sum, item) => sum + (item.quantityPurchased - item.quantityReceived),
                              0
                            );
                            return <span>{qtyDifference}</span>;
                          },
                          align: "right",
                        },
                        {
                          title: "Ordered Qty",
                          key: "orderedQty",
                          render: (_, purchase) => {
                            const orderedQty = purchase.items.reduce(
                              (sum, item) => sum + item.quantityPurchased,
                              0
                            );
                            return <span>{orderedQty}</span>;
                          },
                          align: "right",
                        },
                        {
                          title: "Received Qty",
                          key: "receivedQty",
                          render: (_, purchase) => {
                            const receivedQty = purchase.items.reduce(
                              (sum, item) => sum + item.quantityReceived,
                              0
                            );
                            return <span>{receivedQty}</span>;
                          },
                          align: "right",
                        },
                        {
                          title: "Unit Price(KES)",
                          key: "unitPrice",
                          render: (_, purchase) => {
                            const unitPrice = purchase.items.reduce(
                              (sum, item) => sum + item.unitPrice,
                              0
                            );
                            return <span>{formatNumber(unitPrice)}</span>;
                          },
                          align: "right",
                        },
                        {
                          title: "Expense(KES)",
                          key: "expense",
                          render: (_, purchase) => {
                            const expense = purchase.items.reduce(
                              (sum, item) => sum + item.expense,
                              0
                            );
                            return <span>{formatNumber(expense)}</span>;
                          },
                          align: "right",
                        },
                        {
                          title: "Total(KES)",
                          key: "total",
                          render: (_, purchase) => {
                            const total = purchase.items.reduce(
                              (sum, item) => sum + (item.quantityReceived * item.unitPrice),
                              0
                            );
                            return <span>{formatNumber(total)}</span>;
                          },
                          align: "right",
                        },
                        {
                          title: "Status",
                          dataIndex: "status",
                          key: "status",
                          align: "right",
                          render: (status) => {
                            let color =
                              status === "Received"
                                ? "green"
                                : status === "Ordered"
                                  ? "blue"
                                  : "gray";
                            return <Tag color={color}>{status}</Tag>;
                          },
                        },
                      ]}
                      pagination={false}
                      rowKey="purchaseNumber"
                      footer={() => (
                        <div className="flex justify-end space-x-36">
                          <Text strong className="text-lg text-gray-500">Received Qty : {totalReceivedQty}</Text>
                          <Text strong className="text-lg text-blue-500">Subtotal : KES :  {formatNumber(subtotal)}</Text>
                          <Text strong className="text-lg text-red-500">Expense : KES : {formatNumber(totalExpense)}</Text>
                          <Text strong className="text-lg text-green-500">Grand Total : KES : {formatNumber(grandTotal)}</Text>
                        </div>
                        
                      )}
                    />
                    <hr />
                   
                    <Title level={4} className="mt-6">
                      Items Purchased Payment 
                    </Title>
                    <hr />
                    <Table
                      dataSource={record.paymentHistory}
                      columns={[
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
                          title: "Amount",
                          dataIndex: "amount",
                          key: "amount",
                          render: (amount) => formatNumber(amount),
                          align: "right",
                        },
                      ]}
                      pagination={false}
                      rowKey="transactionId"
                    />
                    <Row justify="end" className="mt-4">
                      <Col span={24}>
                        <Card
                          className="bg-gray-50 border border-gray-200"
                          styles={{ body: { padding: "16px" } }}
                        >
                          <Row justify="space-between" align="middle">
                            <Col>
                              <Text strong className="text-lg">
                                Total Payments Amount :
                              </Text>
                            </Col>
                            <Col>
                              <Text strong className="text-lg text-green-600">
                                {formatNumber(
                                  record.paymentHistory.reduce(
                                    (sum, payment) => sum + payment.amount,
                                    0
                                  )
                                )}
                              </Text>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    </Row>
                    <Title level={5} className="mt-6 text-gray-400">
                      Terms and Conditions
                    </Title>
                    <hr className="mb-4" />
                    <Row gutter={[16, 16]} className="mt-2">
                      <Col span={12} key={`payment-terms-${record.id}`}>
                        <Card className="bg-white">
                          <Text strong>Payment Terms:</Text>
                          <Text className="ml-2">{record.paymentTerms}</Text>
                        </Card>
                      </Col>
                      <Col span={12} key={`late-fees-${record.id}`}>
                        <Card className="bg-white">
                          <Text strong>Late Fees :</Text>
                          <Text className="ml-2">{formatNumber(record.lateFees)}</Text>
                        </Card>
                      </Col>
                      <Col span={12} key={`adjustments-${record.id}`}>
                        <Card className="bg-white">
                          <Text strong>Adjustments :</Text>
                          <Text className="ml-2">{formatNumber(record.adjustments)}</Text>
                        </Card>
                      </Col>
                      <Col span={12} key={`write-offs-${record.id}`}>
                        <Card className="bg-white">
                          <Text strong>Write-Offs :</Text>
                          <Text className="ml-2">{formatNumber(record.writeOffs)}</Text>
                        </Card>
                      </Col>
                      <Col span={24} key={`follow-up-notes-${record.id}`}>
                        <Card className="bg-green-50 flex flex-col">
                          <div className="flex justify-between items-center">
                            <Text strong>Follow-Up Notes :</Text>
                            <Text className="ml-1">{record.followUpNotes}</Text>
                            <Text strong className="ml-4">
                              Person :
                            </Text>
                            <Text className="ml-0">{record.followUpPerson}</Text>
                            <Text strong className="ml-4">
                              Role :
                            </Text>
                            <Text className="ml-1">{record.followUpRole}</Text>
                          </div>
                        </Card>
                      </Col>
                    </Row>
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
                { title: " Items Purchase Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Items Purchase Report
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
                  itemName: filters.itemName,
                  status: filters.status,
                }}
              >
                <Form.Item name="fromDate" label="From Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="toDate" label="To Date">
                  <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item name="itemName" label="Item Name">
                  <Select
                    showSearch
                    placeholder="Select Item"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    style={{ width: 280 }}
                  >
                    <Option key="all" value="">
                      Select All Items Purchased
                    </Option>
                    {itemNames.map((name) => (
                      <Option key={name} value={name}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="status" label="Status">
                  <Select style={{ width: 100 }} allowClear>
                    <Option key="all" value="">
                      All Status
                    </Option>
                    <Option value="Received">Received</Option>
                    <Option value="Ordered">Ordered</Option>
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

export default PurchaseReport;