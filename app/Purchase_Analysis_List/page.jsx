"use client"
import React, { useState, useEffect } from "react"
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
} from "antd"
import {
  FilterOutlined,
  FilePdfOutlined,
  HomeOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons"

import Header from "../Components/HeaderComponent/Header"
import Sidebar from "../Components/SidebarComponent/Sidebar"
import Footer from "../Components/FooterComponent/Footer"

import Link from "next/link"
import dayjs from "dayjs"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

const { Content } = Layout
const { Title, Text } = Typography
const { Panel } = Collapse
const { Option } = Select

const PurchaseReport = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [form] = Form.useForm()
  const [notificationApi, notificationContextHolder] = notification.useNotification()
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    fromDate: dayjs().startOf("month"),
    toDate: dayjs().endOf("month"),
    itemName: "",
    status: "",
  })
  const [purchaseData, setPurchaseData] = useState([])
  const [isReportVisible, setIsReportVisible] = useState(false)
  const [reportGeneratedTime, setReportGeneratedTime] = useState(null)
  const [generatedBy, setGeneratedBy] = useState("Admin")
  const [searchText, setSearchText] = useState("")
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [selectedAgeRange, setSelectedAgeRange] = useState(null)
  const [selectedPurchaseAgeRange, setSelectedPurchaseAgeRange] = useState(null)
  const [itemNames, setItemNames] = useState([])

  const toggleCollapsed = () => setCollapsed(!collapsed)

  const mockPurchaseData = [
    {
      id: 1,
      supplierName: "Supplier A",
      branch: "Nairobi",
      contactDetails: "supplierA@example.com",
      creditLimit: 100000,
      paymentTerms: "Net 30",
      lateFees: 100,
      adjustments: 20,
      writeOffs: 5,
      followUpNotes: "Check invoice discrepancies",
      followUpPerson: "John Doe",
      followUpRole: "Account Manager",
      purchases: [
        {
          purchaseNumber: "PUR_001",
          purchaseDate: "01-01-2025",
          receivedDate: "06-01-2025",
          amount: 50000,
          paymentStatus: "Paid",
          status: "Received",
          items: [
            {
              itemName: "Item 1",
              itemCode: "ITM001",
              category: "Office Supplies",
              purchaseDate: "01-01-2025",
              unitOfMeasure: "Pieces",
              quantityPurchased: 100,
              quantityReceived: 100,
              unitPrice: 500,
              previousUnitPrice: 480,
              totalCost: 50000,
              stockLevelBeforePurchase: 50,
              stockLevelAfterPurchase: 150,
              expense: 500,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "06-01-2025",
          transactionId: "TX001",
          modeOfPayment: "Bank Transfer",
          amount: 50000,
        },
      ],
    },
    {
      id: 2,
      supplierName: "Supplier B",
      branch: "Mombasa",
      contactDetails: "supplierB@example.com",
      creditLimit: 80000,
      paymentTerms: "Net 60",
      lateFees: 150,
      adjustments: 30,
      writeOffs: 10,
      followUpNotes: "Confirm order details",
      followUpPerson: "Jane Smith",
      followUpRole: "Sales Representative",
      purchases: [
        {
          purchaseNumber: "PUR_002",
          purchaseDate: "02-01-2025",
          receivedDate: "07-01-2025",
          amount: 60000,
          paymentStatus: "Paid",
          status: "Received",
          items: [
            {
              itemName: "Item 2",
              itemCode: "ITM002",
              category: "Furniture",
              purchaseDate: "02-01-2025",
              unitOfMeasure: "Pieces",
              quantityPurchased: 120,
              quantityReceived: 120,
              unitPrice: 500,
              previousUnitPrice: 450,
              totalCost: 60000,
              stockLevelBeforePurchase: 100,
              stockLevelAfterPurchase: 220,
              expense: 600,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "07-01-2025",
          transactionId: "TX002",
          modeOfPayment: "Cheque",
          amount: 60000,
        },
      ],
    },
    {
      id: 3,
      supplierName: "Supplier C",
      branch: "Kisumu",
      contactDetails: "supplierC@example.com",
      creditLimit: 70000,
      paymentTerms: "Net 45",
      lateFees: 120,
      adjustments: 25,
      writeOffs: 8,
      followUpNotes: "Resolve delivery issues",
      followUpPerson: "David Lee",
      followUpRole: "Logistics Manager",
      purchases: [
        {
          purchaseNumber: "PUR_003",
          purchaseDate: "03-01-2025",
          receivedDate: "08-01-2025",
          amount: 40000,
          paymentStatus: "Partial",
          status: "Received",
          items: [
            {
              itemName: "Item 3",
              itemCode: "ITM003",
              category: "Stationery",
              purchaseDate: "03-01-2025",
              unitOfMeasure: "Pieces",
              quantityPurchased: 80,
              quantityReceived: 80,
              unitPrice: 500,
              previousUnitPrice: 470,
              totalCost: 40000,
              stockLevelBeforePurchase: 60,
              stockLevelAfterPurchase: 140,
              expense: 400,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "08-01-2025",
          transactionId: "TX003",
          modeOfPayment: "Bank Transfer",
          amount: 20000,
        },
      ],
    },
    {
      id: 4,
      supplierName: "Supplier D",
      branch: "Nakuru",
      contactDetails: "supplierD@example.com",
      creditLimit: 90000,
      paymentTerms: "Net 30",
      lateFees: 110,
      adjustments: 35,
      writeOffs: 12,
      followUpNotes: "Update payment information",
      followUpPerson: "Sarah Jones",
      followUpRole: "Finance Officer",
      purchases: [
        {
          purchaseNumber: "PUR_004",
          purchaseDate: "04-01-2025",
          receivedDate: "09-01-2025",
          amount: 70000,
          paymentStatus: "Unpaid",
          status: "Received",
          items: [
            {
              itemName: "Item 4",
              itemCode: "ITM004",
              category: "Electronics",
              purchaseDate: "04-01-2025",
              unitOfMeasure: "Pieces",
              quantityPurchased: 140,
              quantityReceived: 140,
              unitPrice: 500,
              previousUnitPrice: 490,
              totalCost: 70000,
              stockLevelBeforePurchase: 120,
              stockLevelAfterPurchase: 260,
              expense: 700,
            },
          ],
        },
      ],
      paymentHistory: [],
    },
    {
      id: 5,
      supplierName: "Supplier E",
      branch: "Eldoret",
      contactDetails: "supplierE@example.com",
      creditLimit: 120000,
      paymentTerms: "Net 45",
      lateFees: 180,
      adjustments: 40,
      writeOffs: 15,
      followUpNotes: "Verify order status",
      followUpPerson: "Michael Brown",
      followUpRole: "Operations Manager",
      purchases: [
        {
          purchaseNumber: "PUR_005",
          purchaseDate: "05-01-2025",
          receivedDate: "10-01-2025",
          amount: 80000,
          paymentStatus: "Paid",
          status: "Received",
          items: [
            {
              itemName: "Item 5",
              itemCode: "ITM005",
              category: "Office Supplies",
              purchaseDate: "05-01-2025",
              unitOfMeasure: "Pieces",
              quantityPurchased: 160,
              quantityReceived: 160,
              unitPrice: 500,
              previousUnitPrice: 460,
              totalCost: 80000,
              stockLevelBeforePurchase: 150,
              stockLevelAfterPurchase: 310,
              expense: 800,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "10-01-2025",
          transactionId: "TX005",
          modeOfPayment: "Cash",
          amount: 80000,
        },
      ],
    },
    {
      id: 6,
      supplierName: "Supplier F",
      branch: "Thika",
      contactDetails: "supplierF@example.com",
      creditLimit: 110000,
      paymentTerms: "Net 60",
      lateFees: 160,
      adjustments: 50,
      writeOffs: 20,
      followUpNotes: "Check for damages",
      followUpPerson: "Emily Wilson",
      followUpRole: "Quality Control Manager",
      purchases: [
        {
          purchaseNumber: "PUR_006",
          purchaseDate: "06-01-2025",
          receivedDate: "11-01-2025",
          amount: 90000,
          paymentStatus: "Partial",
          status: "Received",
          items: [
            {
              itemName: "Item 6",
              itemCode: "ITM006",
              category: "Cleaning Supplies",
              purchaseDate: "06-01-2025",
              unitOfMeasure: "Liters",
              quantityPurchased: 180,
              quantityReceived: 180,
              unitPrice: 500,
              previousUnitPrice: 490,
              totalCost: 90000,
              stockLevelBeforePurchase: 180,
              stockLevelAfterPurchase: 360,
              expense: 900,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "11-01-2025",
          transactionId: "TX006",
          modeOfPayment: "Bank Transfer",
          amount: 45000,
        },
      ],
    },
    {
      id: 7,
      supplierName: "Supplier G",
      branch: "Nyeri",
      contactDetails: "supplierG@example.com",
      creditLimit: 130000,
      paymentTerms: "Net 30",
      lateFees: 200,
      adjustments: 60,
      writeOffs: 25,
      followUpNotes: "Confirm stock availability",
      followUpPerson: "Jessica Garcia",
      followUpRole: "Inventory Manager",
      purchases: [
        {
          purchaseNumber: "PUR_007",
          purchaseDate: "07-01-2025",
          receivedDate: "12-01-2025",
          amount: 100000,
          paymentStatus: "Unpaid",
          status: "Received",
          items: [
            {
              itemName: "Item 7",
              itemCode: "ITM007",
              category: "Electronics",
              purchaseDate: "07-01-2025",
              unitOfMeasure: "Pieces",
              quantityPurchased: 200,
              quantityReceived: 200,
              unitPrice: 500,
              previousUnitPrice: 475,
              totalCost: 100000,
              stockLevelBeforePurchase: 200,
              stockLevelAfterPurchase: 400,
              expense: 1000,
            },
          ],
        },
      ],
      paymentHistory: [],
    },
    {
      id: 8,
      supplierName: "Supplier H",
      branch: "Kisii",
      contactDetails: "supplierH@example.com",
      creditLimit: 150000,
      paymentTerms: "Net 45",
      lateFees: 220,
      adjustments: 70,
      writeOffs: 30,
      followUpNotes: "Review contract terms",
      followUpPerson: "Robert Rodriguez",
      followUpRole: "Legal Counsel",
      purchases: [
        {
          purchaseNumber: "PUR_008",
          purchaseDate: "08-01-2025",
          receivedDate: "13-01-2025",
          amount: 110000,
          paymentStatus: "Paid",
          status: "Received",
          items: [
            {
              itemName: "Item 8",
              itemCode: "ITM008",
              category: "Furniture",
              purchaseDate: "08-01-2025",
              unitOfMeasure: "Pieces",
              quantityPurchased: 220,
              quantityReceived: 220,
              unitPrice: 500,
              previousUnitPrice: 520,
              totalCost: 110000,
              stockLevelBeforePurchase: 220,
              stockLevelAfterPurchase: 440,
              expense: 1100,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "13-01-2025",
          transactionId: "TX008",
          modeOfPayment: "Cheque",
          amount: 110000,
        },
      ],
    },
    {
      id: 9,
      supplierName: "Supplier I",
      branch: "Kakamega",
      contactDetails: "supplierI@example.com",
      creditLimit: 140000,
      paymentTerms: "Net 60",
      lateFees: 190,
      adjustments: 80,
      writeOffs: 35,
      followUpNotes: "Address quality concerns",
      followUpPerson: "Ashley Williams",
      followUpRole: "Quality Assurance Manager",
      purchases: [
        {
          purchaseNumber: "PUR_009",
          purchaseDate: "09-01-2025",
          receivedDate: "14-01-2025",
          amount: 120000,
          paymentStatus: "Partial",
          status: "Received",
          items: [
            {
              itemName: "Item 9",
              itemCode: "ITM009",
              category: "Stationery",
              purchaseDate: "09-01-2025",
              unitOfMeasure: "Pieces",
              quantityPurchased: 240,
              quantityReceived: 240,
              unitPrice: 500,
              previousUnitPrice: 485,
              totalCost: 120000,
              stockLevelBeforePurchase: 240,
              stockLevelAfterPurchase: 480,
              expense: 1200,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "14-01-2025",
          transactionId: "TX009",
          modeOfPayment: "Cash",
          amount: 60000,
        },
      ],
    },
    {
      id: 10,
      supplierName: "Supplier J",
      branch: "Bungoma",
      contactDetails: "supplierJ@example.com",
      creditLimit: 160000,
      paymentTerms: "Net 30",
      lateFees: 210,
      adjustments: 90,
      writeOffs: 40,
      followUpNotes: "Expedite shipment",
      followUpPerson: "Brian Taylor",
      followUpRole: "Shipping Coordinator",
      purchases: [
        {
          purchaseNumber: "PUR_010",
          purchaseDate: "10-01-2025",
          receivedDate: "15-01-2025",
          amount: 130000,
          paymentStatus: "Unpaid",
          status: "Ordered",
          items: [
            {
              itemName: "Item 10",
              itemCode: "ITM010",
              category: "Cleaning Supplies",
              purchaseDate: "10-01-2025",
              unitOfMeasure: "Liters",
              quantityPurchased: 260,
              quantityReceived: 0,
              unitPrice: 500,
              previousUnitPrice: 495,
              totalCost: 130000,
              stockLevelBeforePurchase: 260,
              stockLevelAfterPurchase: 260,
              expense: 1300,
            },
          ],
        },
      ],
      paymentHistory: [],
    },
    {
      id: 11,
      supplierName: "Supplier K",
      branch: "Embu",
      contactDetails: "supplierK@example.com",
      creditLimit: 75000,
      paymentTerms: "Net 60",
      lateFees: 120,
      adjustments: 50,
      writeOffs: 10,
      followUpNotes: "Confirm order dispatch",
      followUpPerson: "Grace Adams",
      followUpRole: "Operations Manager",
      purchases: [
        {
          purchaseNumber: "PUR_011",
          purchaseDate: "04-01-2025",
          receivedDate: "09-01-2025",
          amount: 30000,
          paymentStatus: "Paid",
          status: "Received",
          items: [
            {
              itemName: "Item 11",
              itemCode: "ITM011",
              category: "Furniture",
              purchaseDate: "04-01-2025",
              unitOfMeasure: "Pieces",
              quantityPurchased: 30,
              quantityReceived: 30,
              unitPrice: 1000,
              previousUnitPrice: 950,
              totalCost: 30000,
              stockLevelBeforePurchase: 20,
              stockLevelAfterPurchase: 50,
              expense: 1000,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "09-01-2025",
          transactionId: "TX011",
          modeOfPayment: "Bank Transfer",
          amount: 30000,
        },
      ],
    },
    {
      id: 12,
      supplierName: "Supplier L",
      branch: "Kericho",
      contactDetails: "supplierL@example.com",
      creditLimit: 50000,
      paymentTerms: "Net 30",
      lateFees: 90,
      adjustments: 40,
      writeOffs: 15,
      followUpNotes: "Verify stock levels",
      followUpPerson: "Anna Reed",
      followUpRole: "Inventory Manager",
      purchases: [
        {
          purchaseNumber: "PUR_012",
          purchaseDate: "06-01-2025",
          receivedDate: "12-01-2025",
          amount: 25000,
          paymentStatus: "Partial",
          status: "Received",
          items: [
            {
              itemName: "Item 12",
              itemCode: "ITM012",
              category: "Stationery",
              purchaseDate: "06-01-2025",
              unitOfMeasure: "Pieces",
              quantityPurchased: 50,
              quantityReceived: 45,
              unitPrice: 500,
              previousUnitPrice: 480,
              totalCost: 25000,
              stockLevelBeforePurchase: 70,
              stockLevelAfterPurchase: 115,
              expense: 500,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "12-01-2025",
          transactionId: "TX012",
          modeOfPayment: "Cheque",
          amount: 10000,
        },
      ],
    },
    {
      id: 13,
      supplierName: "Supplier M",
      branch: "Voi",
      contactDetails: "supplierM@example.com",
      creditLimit: 60000,
      paymentTerms: "Net 15",
      lateFees: 150,
      adjustments: 60,
      writeOffs: 10,
      followUpNotes: "Update invoice details",
      followUpPerson: "Mark Nelson",
      followUpRole: "Finance Officer",
      purchases: [
        {
          purchaseNumber: "PUR_013",
          purchaseDate: "08-01-2025",
          receivedDate: "13-01-2025",
          amount: 40000,
          paymentStatus: "Unpaid",
          status: "Ordered",
          items: [
            {
              itemName: "Item 13",
              itemCode: "ITM013",
              category: "Office Supplies",
              purchaseDate: "08-01-2025",
              unitOfMeasure: "Pieces",
              quantityPurchased: 80,
              quantityReceived: 0,
              unitPrice: 500,
              previousUnitPrice: 480,
              totalCost: 40000,
              stockLevelBeforePurchase: 100,
              stockLevelAfterPurchase: 100,
              expense: 500,
            },
          ],
        },
      ],
      paymentHistory: [],
    },
    {
      id: 14,
      supplierName: "Supplier N",
      branch: "Meru",
      contactDetails: "supplierN@example.com",
      creditLimit: 55000,
      paymentTerms: "Net 45",
      lateFees: 140,
      adjustments: 70,
      writeOffs: 20,
      followUpNotes: "Check payment discrepancies",
      followUpPerson: "Peter White",
      followUpRole: "Accountant",
      purchases: [
        {
          purchaseNumber: "PUR_014",
          purchaseDate: "10-01-2025",
          receivedDate: "15-01-2025",
          amount: 35000,
          paymentStatus: "Partial",
          status: "Received",
          items: [
            {
              itemName: "Item 14",
              itemCode: "ITM014",
              category: "Cleaning Supplies",
              purchaseDate: "10-01-2025",
              unitOfMeasure: "Liters",
              quantityPurchased: 100,
              quantityReceived: 90,
              unitPrice: 350,
              previousUnitPrice: 340,
              totalCost: 31500,
              stockLevelBeforePurchase: 50,
              stockLevelAfterPurchase: 140,
              expense: 350,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "15-01-2025",
          transactionId: "TX014",
          modeOfPayment: "Bank Transfer",
          amount: 20000,
        },
      ],
    },
    {
      id: 15,
      supplierName: "Supplier O",
      branch: "Nanyuki",
      contactDetails: "supplierO@example.com",
      creditLimit: 65000,
      paymentTerms: "Net 30",
      lateFees: 180,
      adjustments: 90,
      writeOffs: 30,
      followUpNotes: "Request delivery confirmation",
      followUpPerson: "Sophia Green",
      followUpRole: "Supply Chain Manager",
      purchases: [
        {
          purchaseNumber: "PUR_015",
          purchaseDate: "12-01-2025",
          receivedDate: "18-01-2025",
          amount: 45000,
          paymentStatus: "Paid",
          status: "Received",
          items: [
            {
              itemName: "Item 15",
              itemCode: "ITM015",
              category: "Electronics",
              purchaseDate: "12-01-2025",
              unitOfMeasure: "Pieces",
              quantityPurchased: 90,
              quantityReceived: 90,
              unitPrice: 500,
              previousUnitPrice: 480,
              totalCost: 45000,
              stockLevelBeforePurchase: 200,
              stockLevelAfterPurchase: 290,
              expense: 500,
            },
          ],
        },
      ],
      paymentHistory: [
        {
          paymentDate: "18-01-2025",
          transactionId: "TX015",
          modeOfPayment: "Cash",
          amount: 45000,
        },
      ],
    },
  ]

  useEffect(() => {
    const names = mockPurchaseData.flatMap((supplier) =>
      supplier.purchases.flatMap((purchase) => purchase.items.map((item) => item.itemName)),
    )
    setItemNames([...new Set(names)])
  }, [])

  const handleFilterChange = (_changedValues, allValues) => {
    const { fromDate, toDate, itemName, status } = allValues
    setFilters({
      fromDate: fromDate ? dayjs(fromDate) : dayjs().startOf("month"),
      toDate: toDate ? dayjs(toDate) : dayjs().endOf("month"),
      itemName,
      status,
    })
  }

  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00"
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const calculateAgingAnalysis = (purchases) => {
    const today = dayjs()
    const agingAnalysis = { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 }

    purchases.forEach((purchase) => {
      const purchaseDate = dayjs(purchase.purchaseDate, "DD-MM-YYYY")
      const daysDiff = today.diff(purchaseDate, "day")

      if (daysDiff >= 0 && daysDiff <= 30) {
        agingAnalysis["0-30"] += purchase.amount
      } else if (daysDiff > 30 && daysDiff <= 60) {
        agingAnalysis["31-60"] += purchase.amount
      } else if (daysDiff > 60 && daysDiff <= 90) {
        agingAnalysis["61-90"] += purchase.amount
      } else if (daysDiff > 90) {
        agingAnalysis["90+"] += purchase.amount
      }
    })

    return agingAnalysis
  }

  const calculateOutstandingBalance = (purchases, paymentHistory) => {
    const totalPurchases = purchases.reduce((sum, purchase) => {
      const purchaseTotal = purchase.items.reduce((itemSum, item) => {
        return itemSum + item.quantityPurchased * item.unitPrice
      }, 0)
      return sum + purchaseTotal
    }, 0)

    const totalPayments = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0)

    return totalPurchases - totalPayments
  }

  const calculateUnpaidAndPartialTotals = (purchases) => {
    let unpaidTotal = 0
    let partialTotal = 0

    purchases.forEach((purchase) => {
      const purchaseTotal = purchase.items.reduce((itemSum, item) => {
        return itemSum + item.quantityPurchased * item.unitPrice
      }, 0)

      if (purchase.paymentStatus === "Unpaid") {
        unpaidTotal += purchaseTotal
      } else if (purchase.paymentStatus === "Partial") {
        partialTotal += purchaseTotal
      }
    })

    return { unpaidTotal, partialTotal }
  }

  const generateReport = () => {
    const { fromDate, toDate, itemName, status } = form.getFieldsValue()

    if (!fromDate || !toDate) {
      notificationApi.error({
        message: "Date Selection Required",
        description: "Please select both 'From Date' and 'To Date' to generate the report.",
        placement: "topRight",
        className: "bg-red-50",
      })
      return
    }

    setLoading(true)
    setTimeout(() => {
      const filteredByDate = mockPurchaseData.filter((supplier) => {
        return supplier.purchases.some((purchase) => {
          const purchaseDate = dayjs(purchase.purchaseDate, "DD-MM-YYYY")
          return purchaseDate.isAfter(fromDate) && purchaseDate.isBefore(toDate)
        })
      })

      if (filteredByDate.length === 0) {
        notificationApi.warning({
          message: "No Data Found",
          description: "No data found within the selected date range.",
          placement: "topRight",
          className: "bg-yellow-50",
        })
        setLoading(false)
        return
      }

      const updatedPurchaseData = filteredByDate.map((supplier) => {
        const outstandingBalance = calculateOutstandingBalance(supplier.purchases, supplier.paymentHistory)
        const { unpaidTotal, partialTotal } = calculateUnpaidAndPartialTotals(supplier.purchases)

        return {
          ...supplier,
          agingAnalysis: calculateAgingAnalysis(supplier.purchases),
          outstandingBalance,
          unpaidTotal,
          partialTotal,
        }
      })

      setPurchaseData(updatedPurchaseData)
      setLoading(false)
      setIsReportVisible(true)
      setReportGeneratedTime(dayjs().format("DD-MM-YYYY HH:mm:ss"))
      notificationApi.success({
        message: "Report Generated",
        description: "Purchase Analysis Report generated successfully.",
        placement: "topRight",
        className: "bg-green-50",
      })
    }, 1000)
  }

  const exportToPDF = () => {
    const doc = new jsPDF({ format: "a4" })

    const brandColors = {
      primary: "#1a237e",
      secondary: "#303f9f",
      accent: "#3949ab",
      gray: "#757575",
      lightGray: "#f5f5f5",
    }

    const margin = { top: 20, left: 20, right: 20 }

    doc.setFillColor(brandColors.primary)
    doc.rect(0, 0, doc.internal.pageSize.width, 40, "F")

    doc.setTextColor("#FFFFFF")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(18)
    doc.text("Snave Webhub Africa", 70, 20)
    doc.setFontSize(16)
    doc.setFont("helvetica", "normal")
    doc.text("Purchase Analysis Report", 70, 30)

    doc.setTextColor(brandColors.primary)
    doc.setFontSize(12)
    doc.roundedRect(margin.left, 50, doc.internal.pageSize.width - 40, 35, 3, 3, "S")

    doc.setFont("helvetica", "bold")
    doc.text(" Purchase Analysis Report Information", margin.left + 5, 60)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(brandColors.gray)
    doc.text(
      `From: ${filters.fromDate.format("DD-MM-YYYY")} To: ${filters.toDate.format("DD-MM-YYYY")}`,
      margin.left + 5,
      70,
    )
    doc.text(`Generated : ${reportGeneratedTime}`, margin.left + 5, 80)
    doc.text(`Generated by : ${generatedBy}`, doc.internal.pageSize.width - 80, 80)

    doc.autoTable({
      startY: 100,
      head: [
        [
          "SUPPLIER NAME",
          "BRANCH",
          "OUTSTANDING BALANCE (KES)",
          "PRICE DIFFERENCE (KES)",
          "CREDIT LIMIT",
          "UTILIZATION",
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
                return itemSum + (item.quantityPurchased * item.unitPrice - item.quantityReceived * item.unitPrice)
              }, 0)
            )
          }, 0),
        ),
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
        3: { halign: "right", cellWidth: 50 },
        4: { halign: "right", cellWidth: 50 },
        5: { halign: "right", cellWidth: 50 },
      },
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    })

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [
        [
          "Item Name",
          "Item Code",
          "Category",
          "Unit of Measure",
          "Quantity",
          "Unit Price",
          "Total Cost",
          "Stock Before",
          "Stock After",
          "Price History",
        ],
      ],
      body: purchaseData.flatMap((supplier) =>
        supplier.purchases.flatMap((purchase) =>
          purchase.items.map((item) => [
            item.itemName,
            item.itemCode,
            item.category,
            item.unitOfMeasure,
            item.quantityPurchased,
            formatNumber(item.unitPrice),
            formatNumber(item.totalCost),
            item.stockLevelBeforePurchase,
            item.stockLevelAfterPurchase,
            item.purchases
              .map((purchase) => `${purchase.purchaseDate}: ${formatNumber(purchase.unitPrice)}`)
              .join("\n"),
          ]),
        ),
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
        9: { cellWidth: 50 },
      },
      alternateRowStyles: {
        fillColor: brandColors.lightGray,
      },
      margin: margin,
    })

    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFillColor(brandColors.primary)
        doc.rect(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, 20, "F")
        doc.setTextColor("#FFFFFF")
        doc.setFontSize(8)
        doc.text("© 2025 Snave Webhub Africa. All rights reserved.", margin.left, doc.internal.pageSize.height - 10)
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10)
      }
    }

    addFooter()
    doc.save(`purchase_report_${dayjs().format("DD-MM-YYYY")}.pdf`)

    notificationApi.success({
      message: "PDF Export Complete",
      description: "Your report has been successfully exported.",
      placement: "topRight",
      className: "bg-green-50",
    })
  }

  const handleSearch = (value) => {
    setSearchText(value)
    setPagination({ ...pagination, current: 1 })
  }

  const filteredData = purchaseData.filter((item) => {
    const matchesSearchText =
      item.supplierName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.contactDetails.toLowerCase().includes(searchText.toLowerCase())

    const matchesAgeRange = !selectedAgeRange || item.agingAnalysis[selectedAgeRange] > 0

    const matchesItemName =
      !filters.itemName ||
      item.purchases.some((purchase) => purchase.items.some((item) => item.itemName === filters.itemName))

    const matchesStatus = !filters.status || item.purchases.some((purchase) => purchase.status === filters.status)

    return matchesSearchText && matchesAgeRange && matchesItemName && matchesStatus
  })

  const filterPurchasesByAgeRange = (purchases, ageRange) => {
    const today = dayjs()
    return purchases.filter((purchase) => {
      const purchaseDate = dayjs(purchase.purchaseDate, "DD-MM-YYYY")
      const daysDiff = today.diff(purchaseDate, "day")

      const matchesAgeRange =
        (ageRange === "0-30" && daysDiff >= 0 && daysDiff <= 30) ||
        (ageRange === "31-60" && daysDiff > 30 && daysDiff <= 60) ||
        (ageRange === "61-90" && daysDiff > 60 && daysDiff <= 90) ||
        (ageRange === "90+" && daysDiff > 90)

      const matchesStatus = !filters.status || purchase.status === filters.status

      return matchesAgeRange && matchesStatus
    })
  }

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
      title: "ITEM NAME",
      key: "itemName",
      render: (_, record) => {
        const firstPurchase = record.purchases[0]
        if (firstPurchase && firstPurchase.items && firstPurchase.items.length > 0) {
          return firstPurchase.items[0].itemName
        }
        return "N/A"
      },
    },
    {
      title: "CATEGORY",
      key: "category",
      render: (_, record) => {
        const firstPurchase = record.purchases[0]
        if (firstPurchase && firstPurchase.items && firstPurchase.items.length > 0) {
          return firstPurchase.items[0].category
        }
        return "N/A"
      },
    },
    {
      title: "BALANCE (KES)",
      dataIndex: "outstandingBalance",
      key: "outstandingBalance",
      render: (outstandingBalance) => <span>{formatNumber(outstandingBalance)}</span>,
      align: "right",
    },
    {
      title: "PRICE DIFF (KES)",
      key: "priceDifference",
      align: "right",
      render: (_, record) => {
        const priceDifference = record.purchases.reduce((sum, purchase) => {
          return (
            sum +
            purchase.items.reduce((itemSum, item) => {
              const unitPriceDifference = item.unitPrice - item.previousUnitPrice
              return itemSum + unitPriceDifference
            }, 0)
          )
        }, 0)

        let color = "gray"
        if (priceDifference > 0) {
          color = "red"
        } else if (priceDifference < 0) {
          color = "green"
        }

        return <Tag color={color}>{formatNumber(priceDifference)}</Tag>
      },
    },
    {
      title: "DEPOSITED AMT",
      dataIndex: "creditLimit",
      key: "creditLimit",
      render: (creditLimit) => <span>{formatNumber(creditLimit)}</span>,
    },
    {
      title: "UTILIZATION",
      key: "utilization",
      render: (_, record) => {
        const utilization = (record.outstandingBalance / record.creditLimit) * 100
        return <Progress percent={utilization.toFixed(2)} status={utilization > 100 ? "exception" : "normal"} />
      },
    },
  ]

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
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
    },
    {
      title: "UoM",
      dataIndex: "unitOfMeasure",
      key: "unitOfMeasure",
    },
    {
      title: "Qty Purchased",
      dataIndex: "quantityPurchased",
      key: "quantityPurchased",
    },
    {
      title: "Unit Price ",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (unitPrice) => formatNumber(unitPrice),
    },
    {
      title: "Total Cost ",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (totalCost) => formatNumber(totalCost),
    },
    {
      title: "Stock Before",
      dataIndex: "stockLevelBeforePurchase",
      key: "stockLevelBeforePurchase",
    },
    {
      title: "Stock After",
      key: "stockLevelAfterPurchase",
      render: (_, record) => {
        const stockAfter = record.stockLevelBeforePurchase + record.quantityPurchased
        return stockAfter
      },
    },
    {
      title: "Previous Price",
      dataIndex: "previousUnitPrice",
      key: "previousUnitPrice",
      render: (previousUnitPrice) => formatNumber(previousUnitPrice),
    },
    {
      title: "Current Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (unitPrice) => formatNumber(unitPrice),
    },
    {
      title: "Price diff Status",
      key: "priceChangeStatus",
      align: "right",
      render: (_, record) => {
        const priceDifference = record.unitPrice - record.previousUnitPrice
        let status = "No Change in Price"
        let color = "gray"

        if (priceDifference > 0) {
          status = `Price Up (${formatNumber(priceDifference)})`
          color = "red"
        } else if (priceDifference < 0) {
          status = `Price Down (${formatNumber(Math.abs(priceDifference))})`
          color = "green"
        }

        return <Tag color={color}>{status}</Tag>
      },
    },
  ]

  const totalPayables = purchaseData.reduce((sum, item) => sum + (item.outstandingBalance || 0), 0)
  const totalUnpaid = purchaseData.reduce((sum, item) => sum + (item.unpaidTotal || 0), 0)
  const totalPartial = purchaseData.reduce((sum, item) => sum + (item.partialTotal || 0), 0)

  const collapseItems = [
    {
      key: "1",
      label: "Purchase Analysis Report",
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
            rowKey={(record) => `${record.id}-${record.supplierName}`}
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
                  : record.purchases

                // Calculate totals for the selected purchases
                const totalReceivedQty = selectedPurchases.reduce((sum, purchase) => {
                  return sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantityReceived, 0)
                }, 0)

                const totalExpense = selectedPurchases.reduce((sum, purchase) => {
                  return sum + purchase.items.reduce((itemSum, item) => itemSum + item.expense, 0)
                }, 0)

                const subtotal = selectedPurchases.reduce((sum, purchase) => {
                  return (
                    sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantityReceived * item.unitPrice, 0)
                  )
                }, 0)

                const grandTotal = subtotal + totalExpense

                return (
                  <div key={`expanded-${record.id}`}>
                    <Title level={4}> Purchase Aging Analysis</Title>
                    <hr className="mb-4" />
                    <Row gutter={16}>
                      <Col span={6} key={`aging-0-30-${record.id}`}>
                        <Card className="bg-blue-50 cursor-pointer" onClick={() => setSelectedPurchaseAgeRange("0-30")}>
                          <Statistic
                            title="0-30 Days"
                            value={formatNumber(
                              filterPurchasesByAgeRange(record.purchases, "0-30").reduce(
                                (sum, purchase) => sum + purchase.amount,
                                0,
                              ),
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
                                0,
                              ),
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
                                0,
                              ),
                            )}
                          />
                        </Card>
                      </Col>
                      <Col span={6} key={`aging-90+-${record.id}`}>
                        <Card className="bg-red-50 cursor-pointer" onClick={() => setSelectedPurchaseAgeRange("90+")}>
                          <Statistic
                            title="90+ Days"
                            value={formatNumber(
                              filterPurchasesByAgeRange(record.purchases, "90+").reduce(
                                (sum, purchase) => sum + purchase.amount,
                                0,
                              ),
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
                      dataSource={selectedPurchases.flatMap((purchase) => purchase.items)}
                      columns={itemColumns}
                      pagination={false}
                      rowKey={(record) => `${record.itemCode}-${record.purchaseDate}`}
                      footer={() => (
                        <div className="flex justify-end space-x-40">
                          <Text strong className="text-[16px] text-gray-500">
                            Total Received Qty : {totalReceivedQty}
                          </Text>
                          <Text strong className="text-[16px] text-blue-500">
                            Subtotal : KES : {formatNumber(subtotal)}
                          </Text>
                          <Text strong className="text-[16px] text-red-500">
                            Total Expense : KES : {formatNumber(totalExpense)}
                          </Text>
                          <Text strong className="text-[16px] text-green-500">
                            Grand Total : KES : {formatNumber(grandTotal)}
                          </Text>
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
                        <Card className="bg-gray-50 border border-gray-200" styles={{ body: { padding: "16px" } }}>
                          <Row justify="space-between" align="middle">
                            <Col>
                              <Text strong className="text-lg">
                                Total Payments Amount :
                              </Text>
                            </Col>
                            <Col>
                              <Text strong className="text-lg text-green-600">
                                {formatNumber(record.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0))}
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
                )
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
  ]

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
                { title: " Purchase Analysis Report" },
              ]}
            />
            <hr />
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Purchase Analysis Report
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
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
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
  )
}

export default PurchaseReport

