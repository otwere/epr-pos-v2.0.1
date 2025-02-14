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
  Spin,
  Collapse,
  notification,
  Row,
  Col,
  Tag,
  Input,
  Select,
  Statistic,
} from "antd";
import {
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

const PriceList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [purchaseData, setPurchaseData] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null);
  const [generatedBy, setGeneratedBy] = useState("Admin");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [selectedAgeRange, setSelectedAgeRange] = useState(null);
  const [selectedPurchaseAgeRange, setSelectedPurchaseAgeRange] = useState(null);
  const [itemCategories, setItemCategories] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const mockPurchaseData = [
    {
      id: 1,
      supplierName: "Supplier A",
      branch: "Nairobi",
      contactDetails: "supplierA@example.com",
      purchases: [
        {
          purchaseDate: "01-01-2023",
          items: [
            {
              itemName: "LED TV 55-inch",
              itemCode: "ELE001",
              category: "Electronics",
              quantityPurchased: 10,
              unitPrice: 45000,
              previousUnitPrice: 42000,
              salesPrice: 55000,
            },
            {
              itemName: "Smartphone X12",
              itemCode: "ELE002",
              category: "Electronics",
              quantityPurchased: 15,
              unitPrice: 25000,
              previousUnitPrice: 23000,
              salesPrice: 30000,
            },
            {
              itemName: "Wireless Earbuds Pro",
              itemCode: "ELE003",
              category: "Electronics",
              quantityPurchased: 30,
              unitPrice: 8000,
              previousUnitPrice: 7500,
              salesPrice: 12000,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "05-01-2023",
          transactionId: "TXN001",
          modeOfPayment: "Bank Transfer",
          amount: 500000,
        },
      ],
    },
    {
      id: 2,
      supplierName: "Supplier B",
      branch: "Mombasa",
      contactDetails: "supplierB@example.com",
      purchases: [
        {
          purchaseDate: "02-01-2023",
          items: [
            {
              itemName: "Executive Desk",
              itemCode: "FUR001",
              category: "Furniture",
              quantityPurchased: 5,
              unitPrice: 35000,
              previousUnitPrice: 32000,
              salesPrice: 45000,
            },
            {
              itemName: "Ergonomic Chair",
              itemCode: "FUR002",
              category: "Furniture",
              quantityPurchased: 10,
              unitPrice: 15000,
              previousUnitPrice: 14000,
              salesPrice: 20000,
            },
            {
              itemName: "Filing Cabinet",
              itemCode: "FUR003",
              category: "Furniture",
              quantityPurchased: 8,
              unitPrice: 12000,
              previousUnitPrice: 11000,
              salesPrice: 16000,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "06-01-2023",
          transactionId: "TXN002",
          modeOfPayment: "Bank Transfer",
          amount: 300000,
        },
      ],
    },
    {
      id: 3,
      supplierName: "Supplier C",
      branch: "Kisumu",
      contactDetails: "supplierC@example.com",
      purchases: [
        {
          purchaseDate: "03-01-2023",
          items: [
            {
              itemName: "Desktop Computer",
              itemCode: "ELE004",
              category: "Electronics",
              quantityPurchased: 8,
              unitPrice: 55000,
              previousUnitPrice: 52000,
              salesPrice: 65000,
            },
            {
              itemName: "Printer All-in-One",
              itemCode: "ELE005",
              category: "Electronics",
              quantityPurchased: 6,
              unitPrice: 28000,
              previousUnitPrice: 26000,
              salesPrice: 35000,
            },
            {
              itemName: "Security Camera Set",
              itemCode: "ELE006",
              category: "Electronics",
              quantityPurchased: 12,
              unitPrice: 18000,
              previousUnitPrice: 16500,
              salesPrice: 25000,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "07-01-2023",
          transactionId: "TXN003",
          modeOfPayment: "Bank Transfer",
          amount: 400000,
        },
      ],
    },
  ];
  useEffect(() => {
    const categories = mockPurchaseData.flatMap((supplier) =>
      supplier.purchases.flatMap((purchase) => purchase.items.map((item) => item.category)),
    );
    setItemCategories([...new Set(categories)]);

    const prices = mockPurchaseData.flatMap((supplier) =>
      supplier.purchases.flatMap((purchase) =>
        purchase.items.map((item) => ({
          supplierName: supplier.supplierName,
          productName: item.itemName,
          category: item.category,
          cost: item.unitPrice,
          salesPrice: item.salesPrice,
          previousUnitPrice: item.previousUnitPrice,
        })),
      ),
    );
    setPriceList(prices);
  }, []);

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

  const calculateOutstandingBalance = (purchases, paymentHistory) => {
    const totalPurchases = purchases.reduce((sum, purchase) => {
      const purchaseTotal = purchase.items.reduce((itemSum, item) => {
        return itemSum + item.quantityPurchased * item.unitPrice;
      }, 0);
      return sum + purchaseTotal;
    }, 0);

    const totalPayments = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);

    return totalPurchases - totalPayments;
  };

  const generateReport = () => {
    setLoading(true);
    setTimeout(() => {
      const updatedPurchaseData = mockPurchaseData.map((supplier) => {
        const outstandingBalance = calculateOutstandingBalance(supplier.purchases, supplier.paymentHistory);
        return {
          ...supplier,
          agingAnalysis: calculateAgingAnalysis(supplier.purchases),
          outstandingBalance,
        };
      });

      setPurchaseData(updatedPurchaseData);
      setLoading(false);
      setIsReportVisible(true);
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"));
      notificationApi.success({
        message: "Report Generated",
        description: "Price List generated successfully.",
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
    doc.text("Price List", 70, 30);

    doc.setTextColor(brandColors.primary);
    doc.setFontSize(12);
    doc.roundedRect(margin.left, 50, doc.internal.pageSize.width - 40, 35, 3, 3, "S");

    doc.setFont("helvetica", "bold");
    doc.text(" Price List Information", margin.left + 5, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(brandColors.gray);
    doc.text(`Generated : ${reportGeneratedTime}`, margin.left + 5, 70);
    doc.text(`Generated by : ${generatedBy}`, doc.internal.pageSize.width - 80, 70);

    doc.autoTable({
      startY: 100,
      head: [
        [
          "SUPPLIER NAME",
          "BRANCH",
          "OUTSTANDING BALANCE (KES)",
          "PRICE DIFFERENCE (KES)",
        ],
      ],
      body: purchaseData.map((item) => [
        item.supplierName,
        item.branch,
        formatNumber(item.outstandingBalance),
        formatNumber(
          item.purchases.reduce((sum, purchase) => {
            return (
              sum +
              purchase.items.reduce((itemSum, item) => {
                return itemSum + (item.quantityPurchased * item.unitPrice - item.quantityReceived * item.unitPrice);
              }, 0)
            );
          }, 0),
        ),
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
        3: { halign: "right", cellWidth: 50 },
      },
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    });

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [
        [
          "Supplier Name",
          "Product Name",
          "Category",
          "Cost",
          "Sales Price",
          "Profit or Loss",
        ],
      ],
      body: priceList.map((item) => [
        item.supplierName,
        item.productName,
        item.category,
        formatNumber(item.cost),
        formatNumber(item.salesPrice),
        item.salesPrice - item.cost > 0
          ? `Profit (${formatNumber(item.salesPrice - item.cost)})`
          : `Loss (${formatNumber(Math.abs(item.salesPrice - item.cost))})`,
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
        2: { cellWidth: 30 },
        3: { halign: "right", cellWidth: 30 },
        4: { halign: "right", cellWidth: 30 },
        5: { halign: "right", cellWidth: 40 },
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
    doc.save(`price_list_${dayjs().format("DD-MM-YYYY")}.pdf`);

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

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const filteredData = purchaseData.filter((item) => {
    const matchesSearchText =
      item.supplierName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.contactDetails.toLowerCase().includes(searchText.toLowerCase());

    const matchesAgeRange = !selectedAgeRange || item.agingAnalysis[selectedAgeRange] > 0;

    return matchesSearchText && matchesAgeRange;
  });

  const filteredPriceList = selectedCategory
    ? priceList.filter((item) => item.category === selectedCategory)
    : priceList;

  const filterPurchasesByAgeRange = (purchases, ageRange) => {
    const today = dayjs();
    return purchases.filter((purchase) => {
      const purchaseDate = dayjs(purchase.purchaseDate, "DD-MM-YYYY");
      const daysDiff = today.diff(purchaseDate, "day");

      return (
        (ageRange === "0-30" && daysDiff >= 0 && daysDiff <= 30) ||
        (ageRange === "31-60" && daysDiff > 30 && daysDiff <= 60) ||
        (ageRange === "61-90" && daysDiff > 60 && daysDiff <= 90) ||
        (ageRange === "90+" && daysDiff > 90)
      );
    });
  };

  const priceListColumns = [
    {
      title: "#",
      key: "index",
      width: 70,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      align: "center",
    },
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (cost) => formatNumber(cost),
      align: "right",
    },
    {
      title: "Sales Price",
      dataIndex: "salesPrice",
      key: "salesPrice",
      render: (salesPrice) => formatNumber(salesPrice),
      align: "right",
    },
    {
      title: "Profit or Loss",
      key: "priceDiffStatus",
      align: "right",
      render: (_, record) => {
        const priceDifference = record.salesPrice - record.cost;
        let status = "No Change in Price";
        let color = "gray";

        if (priceDifference > 0) {
          status = `Profit (${formatNumber(priceDifference)})`;
          color = "green";
        } else if (priceDifference < 0) {
          status = `Loss (${formatNumber(Math.abs(priceDifference))})`;
          color = "red";
        }

        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];
  const collapseItems = [
    {
      key: "2",
      label: "Price List",
      children: (
        <>
          <Table
            dataSource={filteredPriceList}
            columns={priceListColumns}
            rowKey={(record) => `${record.supplierName}-${record.productName}`}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: filteredPriceList.length,
              onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
          />
          <div className="mt-4 text-gray-500 font-bold text-lg border-t pt-4" key="report-footer">
            <p className="text-sm flex justify-between items-center">
              <span className="text-left">Report Generated on : {reportGeneratedTime}</span>
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
                { title: "Price List" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Price List
              </Title>
            </div>
          </div>

          <hr className="mb-4" />

          <Card className="rounded-lg bg-gray-50">
            <div className="mb-4 flex justify-between items-center">
              <Form
                form={form}
                layout="inline"
                initialValues={{
                  itemName: "",
                }}
              >
                <Form.Item name="itemName" label="Item Category">
                  <Select
                    showSearch
                    placeholder="Select Item Category"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    style={{ width: 280 }}
                    onChange={handleCategoryChange}
                  >
                    <Option key="all" value="">
                      Select All Category Price List
                    </Option>
                    {itemCategories.map((category) => (
                      <Option key={category} value={category}>{category}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
              <div className="flex space-x-4">
                <Button type="primary" icon={<FilterOutlined />} onClick={generateReport}>
                  Generate Price List
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
                  defaultActiveKey={["2"]}
                  expandIcon={({ isActive }) => (isActive ? <CaretUpOutlined /> : <CaretDownOutlined />)}
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

export default PriceList;