import React, { useEffect, useState } from "react";
import {
  DashboardOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  TruckOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  DeliveredProcedureOutlined,
  UserAddOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  DollarOutlined,
  PlusOutlined,
  WarningOutlined,
  BarcodeOutlined,
  DeleteRowOutlined,
  StockOutlined,
  SnippetsOutlined,
  FileZipOutlined,
  DatabaseOutlined,
  LinkOutlined,
  PlusCircleOutlined,
  DiffOutlined,
  FieldTimeOutlined,
  UsergroupAddOutlined,
  RotateRightOutlined,
  RotateLeftOutlined,
  SwapOutlined,
  TagsOutlined,
  FileExcelOutlined,
  CalculatorOutlined,
  GoldOutlined,
  DotChartOutlined,
  ApartmentOutlined,
  BlockOutlined,
  AuditOutlined,
  HddOutlined,
  PercentageOutlined,
  SolutionOutlined,
  LockOutlined,
  SecurityScanOutlined,
  BankOutlined,
  CloseCircleOutlined,
  FileDoneOutlined,
  ReconciliationOutlined,
  FilePdfOutlined,
  HddFilled,
  ProductOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Link from "next/link";
import Logo from "../LogoComponent/Logo";
import "../SidebarComponent/Siderbar.css";

const Sidebar = ({ collapsed, ref }) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollTop = 0; // Reset scroll on collapse change
    }
  }, [collapsed, ref]);

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      title: "Dashboard",
      link: "/",
    },
    {
      key: "2",
      icon: <ProductOutlined />,
      title: "Shifts | Tables",
      subItems: [
        { key: "2-1", icon: <PlusOutlined />, title: "Manage Shift", link: "/Shift_List" },
      ],
    },
    {
      key: "3",
      icon: <ProductOutlined />,
      title: "Items | Products",
      subItems: [
        { key: "3-1", icon: <PlusOutlined />, title: "Add New Items", link: "/additems" },
        { key: "3-2", icon: <UnorderedListOutlined />, title: "Items List", link: "/itemslist" },
        { key: "3-3", icon: <StockOutlined />, title: "Stock Manager", link: "/Stock_Manager" },
        { key: "3-4", icon: <UnorderedListOutlined />, title: "Categories List", link: "/Categories_List" },
        { key: "3-5", icon: <UnorderedListOutlined />, title: "Brand List", link: "/Brand_List" },
        { key: "3-6", icon: <UnorderedListOutlined />, title: "Unit List (UoM)", link: "/Unit_List(UoM)" },
        { key: "3-7", icon: <BarcodeOutlined />, title: "Print Items Codes", link: "/Print_Items_Codes" },
        { key: "3-8", icon: <LinkOutlined />, title: "Issued Products", link: "/Issued_Products" },
        { key: "3-9", icon: <LinkOutlined />, title: "Manage Dispatch", link: "/Manage_Dispatch" },
        { key: "3-10", icon: <CloseCircleOutlined />, title: "Damaged Items | Products", link: "/Damaged_Items_Products" },
        { key: "3-11", icon: <WarningOutlined />, title: "Stock Alert", link: "/Stock_Alert" },
      ],
    },
    {
      key: "4",
      icon: <ShoppingOutlined />,
      title: "Purchases",
      subItems: [
        { key: "4-1", icon: <PlusOutlined />, title: "Add New Purchase", link: "/purchase_add_items" },
        { key: "4-2", icon: <UnorderedListOutlined />, title: "Purchase List", link: "/Purchase_List" },
        { key: "4-3", icon: <RotateLeftOutlined />, title: "Purchase Return", link: "/Purchase_Return" },
        { key: "4-4", icon: <UnorderedListOutlined />, title: "Purchase Analysis List", link: "/Purchase_Analysis_List" },
      ],
    },
    {
      key: "5",
      icon: <FileTextOutlined />,
      title: "Quotation",
      subItems: [
        { key: "5-1", icon: <PlusOutlined />, title: "Create New Quotation", link: "/Create_New_Quotation" },
        { key: "5-2", icon: <UnorderedListOutlined />, title: "Quotation List", link: "/Quotation_List" },
      ],
    },
    {
      key: "6",
      icon: <ShoppingCartOutlined />,
      title: "Sales",
      subItems: [
        { key: "6-1", icon: <ShoppingCartOutlined />, title: "Make New Sale - POS", link: "/pos" },
        { key: "6-2", icon: <UnorderedListOutlined />, title: "Sales List", link: "/Sales_List" },
        { key: "6-3", icon: <RotateRightOutlined />, title: "Sales Returns", link: "/Sales_Returns" },
        { key: "6-4", icon: <RotateRightOutlined />, title: "Sales Credit Note", link: "/Sales_Credit_Note" },
        { key: "6-5", icon: <SolutionOutlined />, title: "Invoice Sales", link: "/Invoice_Sales" },
        { key: "6-6", icon: <DeleteRowOutlined />, title: "Cancelled Sales", link: "/Cancelled_Sales" },
        { key: "6-7", icon: <FieldTimeOutlined />, title: "Sales Clearance", link: "/Sales_Clearance" },
      ],
    },
    {
      key: "7",
      icon: <DeliveredProcedureOutlined />,
      title: "Delivery Note",
      subItems: [
        { key: "7-1", icon: <PlusOutlined />, title: "Create New Delivery", link: "/Create_New_Delivery", },
        { key: "7-2", icon: <UnorderedListOutlined />, title: "Delivery List" , link: "Delivery_List",},
      ],
    },
    {
      key: "8",
      icon: <TruckOutlined />,
      title: "Suppliers",
      subItems: [
        { key: "8-1", icon: <UserAddOutlined />, title: "Add New Supplier", link: "Add_New_Supplier", },
        {
          key: "8-2",
          icon: <UnorderedListOutlined />,
          title: "Suppliers List",
          link: "/Suppliers_List",
        },
      ],
    },
    {
      key: "9",
      icon: <UsergroupAddOutlined />,
      title: "Customers | Clients",
      subItems: [
        {
          key: "9-1",
          icon: <UserAddOutlined />,
          title: "Register New Customer | Client",
          link: "/Register_New_Customer_Client"
        },
        {
          key: "9-2",
          icon: <UnorderedListOutlined />,
          title: "Customers | Client List",
          link: "/customers",
        },
        { key: "9-3", icon: <FileZipOutlined />, title: "Archived Customers", link: "Archived_Customers" },
      ],
    },
    {
      key: "10",
      icon: <SnippetsOutlined />,
      title: "Documents | Files",
      subItems: [
        { key: "10-1", icon: <DiffOutlined />, title: "Add New Document File", link: "/add_new_document" },
        { key: "10-2", icon: <UnorderedListOutlined />, title: "File Category", link: "File_Category", },
        {
          key: "10-3",
          icon: <UnorderedListOutlined />,
          title: "Document File List",
          link: "/document_file_list",
        },
      ],
    },
    {
      key: "11",
      icon: <DollarOutlined />,
      title: "Expenses",
      subItems: [
        { key: "11-1", icon: <PlusOutlined />, title: "Add New Expenditure" },
        {
          key: "11-2",
          icon: <CalculatorOutlined />,
          title: "Expenditure Breakdown",
        },
      ],
    },
    {
      key: "12",
      icon: <DatabaseOutlined />,
      title: "Accounting",
      subItems: [
        { key: "12-1", icon: <HddFilled />, title: "Accounts Types" },
        { key: "12-2", icon: <BlockOutlined />, title: "Sub Accounts Types" },
        {
          key: "12-3",
          icon: <PlusCircleOutlined />,
          title: "Add New Chart of Account",
        },
        {
          key: "12-4",
          icon: <DotChartOutlined />,
          title: "Chart of Accounts List",
        },
        { key: "12-5", icon: <DollarOutlined />, title: "Account Balances" },
        { key: "12-6", icon: <DollarOutlined />, title: "Money | Payments" },
        { key: "12-7", icon: <DollarOutlined />, title: "Journal Entry" },
        {
          key: "12-8",
          icon: <DollarOutlined />,
          title: "Profit & Loss (P & L)",
        },
        { key: "12-9", icon: <ApartmentOutlined />, title: "Balance Sheet" },
        { key: "12-10", icon: <GoldOutlined />, title: "Cash Flow Report" },
        {
          key: "12-11",
          icon: <UsergroupAddOutlined />,
          title: "Customers Balances",
        },
        {
          key: "12-12",
          icon: <UsergroupAddOutlined />,
          title: "Suppliers Balances",
        },
      ],
    },
    {
      key: "13",
      icon: <ReconciliationOutlined />,
      title: "Report Manager",
      subItems: [
        { key: "13-1", icon: <BarChartOutlined />, title: "Expense Report" },
        { key: "13-2", icon: <BlockOutlined />, title: " Profit Report" },
        { key: "13-3", icon: <TagsOutlined />, title: "Customers Report" },
        {
          key: "13-5",
          icon: <UsergroupAddOutlined />,
          title: "Supplier  Report",
        },
        {
          key: "13-6",
          icon: <FileExcelOutlined />,
          title: "Customers Statement(PDF)",
        },
        { key: "13-7", icon: <FilePdfOutlined />, title: "Happy Hour Report" },
        {
          key: "13-8",
          icon: <UsergroupAddOutlined />,
          title: "User Logs Report",
        },
        { key: "13-9", icon: <AuditOutlined />, title: "Audit Trail Report" },
      ],
    },
    {
      key: "14",
      icon: <BarChartOutlined />,
      title: "Summary Reports",
      subItems: [
        {
          key: "14-1",
          icon: <BarChartOutlined />,
          title: "Summary Daily Report",
        },
        { key: "14-2", icon: <BlockOutlined />, title: "Z-Report" },
        { key: "14-3", icon: <TagsOutlined />, title: "Debtors Report" },
        {
          key: "14-4",
          icon: <UsergroupAddOutlined />,
          title: "Creditors Report",
        },
      ],
    },
    {
      key: "15",
      icon: <PercentageOutlined />,
      title: "Tax Reports",
      subItems: [
        {
          key: "15-1",
          icon: <BankOutlined />,
          title: "Income Company - Tax Report",
        },
        {
          key: "15-2",
          icon: <PercentageOutlined />,
          title: "VAT Tax - Report",
        },
        {
          key: "15-3",
          icon: <PercentageOutlined />,
          title: "WithHolding Tax (WHT) - Report",
        },
      ],
    },
    {
      key: "16",
      icon: <ShoppingCartOutlined />,
      title: "Sales Reports",
      subItems: [
        { key: "16-1", icon: <FileDoneOutlined />, title: "Clearance Report" },
        { key: "16-2", icon: <BlockOutlined />, title: "Sales Report" },
        { key: "16-3", icon: <BlockOutlined />, title: "Sales Report Custom" },
        {
          key: "16-4",
          icon: <BarChartOutlined />,
          title: "Sales Report (Employees)",
        },
        { key: "16-5", icon: <BlockOutlined />, title: "Item Sales Report" },
        {
          key: "16-6",
          icon: <BlockOutlined />,
          title: "Sales Payments Report",
        },
        {
          key: "16-7",
          icon: <RotateRightOutlined />,
          title: "Sales Return Report",
        },
        { key: "16-8", icon: <BlockOutlined />, title: "Sales Cancel Report" },
      ],
    },
    {
      key: "17",
      icon: <ShoppingOutlined />,
      title: "Purchase Reports",
      subItems: [
        { key: "17-1", icon: <FilePdfOutlined />, title: "Purchase Report" },
        {
          key: "17-2",
          icon: <FilePdfOutlined />,
          title: "Items Purchase Report",
        },
        {
          key: "17-3",
          icon: <FilePdfOutlined />,
          title: "Purchase Payments Report",
        },
        {
          key: "17-4",
          icon: <FilePdfOutlined />,
          title: "Purchase Analysis Report",
        },
      ],
    },
    {
      key: "18",
      icon: <ReconciliationOutlined />,
      title: "Stock | Inventory Reports",
      subItems: [
        { key: "18-1", icon: <TagsOutlined />, title: "Price List" },
        {
          key: "18-2",
          icon: <FilePdfOutlined />,
          title: "Stock | Inventory Report",
        },
        { key: "18-3", icon: <BlockOutlined />, title: "Items Ledger Report" },
        { key: "18-5", icon: <FileExcelOutlined />, title: "Stock Template" },
        { key: "18-6", icon: <SwapOutlined />, title: "Stock Transfer" },
        { key: "18-7", icon: <StockOutlined />, title: "Stock Adjust Report" },
        { key: "18-8", icon: <WarningOutlined />, title: "Stock Alert Report" },
        {
          key: "18-9",
          icon: <DiffOutlined />,
          title: "Items Valuation Report",
        },
        {
          key: "18-10",
          icon: <FileProtectOutlined />,
          title: "Verified Stock | Inventory",
        },
        {
          key: "18-11",
          icon: <CloseCircleOutlined />,
          title: "Damaged Items Report",
        },
        { key: "18-12", icon: <BlockOutlined />, title: "Issued Items Report" },
      ],
    },
    {
      key: "19",
      icon: <UsergroupAddOutlined />,
      title: "Users Management",
      subItems: [
        { key: "19-1", icon: <UsergroupAddOutlined />, title: "Add New User" },
        { key: "19-2", icon: <UnorderedListOutlined />, title: "User List" },
        { key: "19-3", icon: <LinkOutlined />, title: "Users Logs" },
        { key: "19-4", icon: <UnorderedListOutlined />, title: "Roles List" },
      ],
    },
    {
      key: "20",
      icon: <SettingOutlined />,
      title: "Settings",
      subItems: [
        { key: "20-1", icon: <BankOutlined />, title: "Company Profile" },
        { key: "20-2", icon: <SecurityScanOutlined />, title: "Site Settings" },
        { key: "20-3", icon: <BankOutlined />, title: "Manage Branch" },
        { key: "20-4", icon: <PercentageOutlined />, title: "Tax List" },
        { key: "20-5", icon: <LinkOutlined />, title: "Salutation" },
        { key: "20-6", icon: <LinkOutlined />, title: "Progress Status" },
        { key: "20-7", icon: <LinkOutlined />, title: "New Country" },
        { key: "20-8", icon: <UnorderedListOutlined />, title: "Country List" },
        {
          key: "20-9",
          icon: <UnorderedListOutlined />,
          title: "Currency List",
        },
        { key: "20-10", icon: <LockOutlined />, title: "Change Password" },
        { key: "20-11", icon: <AuditOutlined />, title: "Audit Trail" },
        { key: "20-12", icon: <HddOutlined />, title: "Database Backup" },
      ],
    },
    { key: "21", icon: <LogoutOutlined />, title: "Logout" },
  ];
  
  const generateMenuItems = () => {
    return menuItems.map((item) => {
      if (item.subItems) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.link ? <Link href={item.link}>{item.title}</Link> : item.title,
          children: item.subItems.map((subItem) => ({
            key: subItem.key,
            icon: subItem.icon,
            label: subItem.link ? <Link href={subItem.link}>{subItem.title}</Link> : subItem.title,
          })),
        };
      }
      return {
        key: item.key,
        icon: item.icon,
        label: item.link ? <Link href={item.link}>{item.title}</Link> : item.title,
      };
    });
  };

  return (
    <div
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
    >
      <div className="logo-container">
        <Logo />
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        className="menu"
        inlineCollapsed={collapsed}
        items={generateMenuItems()}
        {...(hovered && { className: "submenu-hovered" })}
      />
    </div>
  );
};

export default Sidebar;

