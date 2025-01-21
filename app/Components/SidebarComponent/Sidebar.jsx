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
import { Menu, Tooltip } from "antd";
import Link from "next/link";
import Logo from "../LogoComponent/Logo";
import "../SidebarComponent/Sidebar.css";

const Sidebar = ({ collapsed, ref }) => {
  const [hovered, setHovered] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollTop = 0; // Reset scroll on collapse change
    }
  }, [collapsed, ref]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (menuItems.map((item) => item.key).indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      title: "Dashboard",
      link: "/Dashboard",
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
        { key: "5-1", icon: <PlusOutlined />, title: "Generate New Quotation | List", link: "/Create_New_Quotation" },
        // { key: "5-2", icon: <UnorderedListOutlined />, title: "Quotation List", link: "/Quotation_List" },
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
        { key: "7-1", icon: <PlusOutlined />, title: "Create New Delivery | List", link: "/Create_New_Delivery", },
        // { key: "7-2", icon: <UnorderedListOutlined />, title: "Delivery List" , link: "Delivery_List",},
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
          link: "/customers_list",
        },
        { key: "9-3", icon: <FileZipOutlined />, title: "Archived Customers", link: "/customers_list/archive" },
      ],
    },
    {
      key: "10",
      icon: <SnippetsOutlined />,
      title: "Documents | Files",
      subItems: [
        { key: "10-1", icon: <DiffOutlined />, title: "Add New Document File", link: "/add_new_document" },

      ],
    },
    {
      key: "11",
      icon: <DollarOutlined />,
      title: "Expenses",
      subItems: [
        { key: "11-1", icon: <PlusOutlined />, title: "Add New Expenditure", link: "/expense" },
        {
          key: "11-2",
          icon: <CalculatorOutlined />,
          title: "Expenditure Breakdown",
          link: "/expenditure_breakdown",
        },
      ],
    },
    {
      key: "12",
      icon: <DatabaseOutlined />,
      title: "Accounting",
      subItems: [
        { key: "12-1", icon: <HddFilled />, title: "Accounts Types", link: "/account_type", },
        { key: "12-2", icon: <BlockOutlined />, title: "Sub Accounts Types", link: "/subaccount_type", },
        {
          key: "12-3",
          icon: <PlusCircleOutlined />,
          title: "Add Charts of Account | List",
          link: "/charts_of_account",
        },
        // {
        //   key: "12-4",
        //   icon: <DotChartOutlined />,
        //   title: "Chart of Accounts List",
        // },
        { key: "12-5", icon: <DollarOutlined />, title: "Accounts Balances", link: "/accounts_balances", },
        { key: "12-6", icon: <DollarOutlined />, title: "Money | Payments", link: "/money_payments", },
        { key: "12-7", icon: <DollarOutlined />, title: "Journal Entry", link: "/journal_entry", },
        {
          key: "12-8",
          icon: <DollarOutlined />,
          title: "Profit & Loss (P & L)",
          link: "/profit_loss",
        },
        { key: "12-9", icon: <ApartmentOutlined />, title: "Balance Sheet", link: "/balance_sheet", },
        { key: "12-10", icon: <GoldOutlined />, title: "Trial Balance", link: "/trial_balance", },
        { key: "12-11", icon: <GoldOutlined />, title: "Cash Flow Report", link: "/cash_flow_report", },
        {
          key: "12-12",
          icon: <UsergroupAddOutlined />,
          title: "Customers Balances",
          link: "/customers_balances",
        },
        {
          key: "12-13",
          icon: <UsergroupAddOutlined />,
          title: "Suppliers Balances",
          link: "/suppliers_balances",
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
          link: "/summary_daily_report",
        },
        { key: "14-2", icon: <BlockOutlined />, title: "Employee Branch Report", link: "/employee_branch_report", },
        { key: "14-3", icon: <BlockOutlined />, title: "Z-Report", link: "/z-report", },
        { key: "14-4", icon: <TagsOutlined />, title: "Debtors Report", link: "/debtors_report", },
        { key: "14-5", icon: <UsergroupAddOutlined />, title: "Creditors Report", link: "/creditors_report", },
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
          link: "/income_company_tax_report",
        },
        {
          key: "15-2",
          icon: <PercentageOutlined />,
          title: "VAT Tax (Value Added Tax) - Report",
          link: "/VAT_Tax_Report",
        },
        {
          key: "15-3",
          icon: <PercentageOutlined />,
          title: "WithHolding Tax (WHT) - Report",
          link: "/WithHolding_Tax_Report",
        },
      ],
    },
    {
      key: "16",
      icon: <ShoppingCartOutlined />,
      title: "Sales Reports",
      subItems: [
        { key: "16-1", icon: <FileDoneOutlined />, title: "Clearance Report", link: "/clearance_report", },
        { key: "16-2", icon: <BlockOutlined />, title: "Sales Report" , link:"/sales_report"},
        { key: "16-3", icon: <BlockOutlined />, title: "Sales Report Custom", link:"/sales_report_summary", },
        {
          key: "16-4",
          icon: <BarChartOutlined />,
          title: "Sales Report (Employees | Branches)", 
          link:"/sales_report_employees",
        },
        { key: "16-5", icon: <BlockOutlined />, title: "Items Sales Report", link:"/item_sales_report", },
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
      title: "Human Resource (HRIMS)",
      subItems: [
        { key: "19-1", icon: <UserAddOutlined />, title: "Add New Employee", link: "/add_new_employee" },
        { key: "19-2", icon: <UnorderedListOutlined />, title: "Employee List", link: "/Employee_List" },
        { key: "19-3", icon: <FileTextOutlined />, title: "Attendance Report", link: "/Attendance_Report" },
        { key: "19-4", icon: <DollarOutlined />, title: "Payroll", link: "/Payroll" },
        { key: "19-5", icon: <FileTextOutlined />, title: "Employee Data Management", link: "/Employee_Data_Management" },
        { key: "19-6", icon: <FileTextOutlined />, title: "Leave Management", link: "/Leave_Management" },
        { key: "19-7", icon: <FileTextOutlined />, title: "Time | Attendance Management", link: "/Time_Attendance_Management" },
        { key: "19-8", icon: <FileTextOutlined />, title: "Bulk SMS", link: "/Bulk_SMS" },
        { key: "19-9", icon: <FileTextOutlined />, title: "Allowances | Deductions", link: "/Allowances_Deductions_Management" },
        { key: "19-10", icon: <FileTextOutlined />, title: "Statutory Deductions Management", link: "/Statutory_Deductions_Management" },
        { key: "19-11", icon: <FileTextOutlined />, title: "Payroll Processing", link: "/Payroll_Processing" },
        { key: "19-12", icon: <FileTextOutlined />, title: "Documents Management", link: "/Documents_Management" },
        { key: "19-13", icon: <FileTextOutlined />, title: "Advance Salary Management", link: "/Advance_Salary_Management" },
        { key: "19-14", icon: <FileTextOutlined />, title: "Warning Letters Management", link: "/Warning_Letters_Management" },
        { key: "19-15", icon: <FileTextOutlined />, title: "Appointments Management", link: "/Appointments_Management" },
        {
          key: "19-16",
          icon: <ReconciliationOutlined />,
          title: "Reports Management",
          subItems: [
            { key: "19-16-1", icon: <BarChartOutlined />, title: "Employee Performance", link: "/Employee_Performance" },
            { key: "19-16-2", icon: <AuditOutlined />, title: "Audit Reports", link: "/Audit_Reports" },
            { key: "19-16-3", icon: <FileTextOutlined />, title: "NSSF Report", link: "/NSSF_Report" },
            { key: "19-16-4", icon: <FileTextOutlined />, title: "NHIF Report", link: "/NHIF_Report" },
            { key: "19-16-5", icon: <FileTextOutlined />, title: "PAYE Report", link: "/PAYE_Report" },
            { key: "19-16-6", icon: <FileTextOutlined />, title: "P9 Report", link: "/P9_Report" },
            { key: "19-16-7", icon: <FileTextOutlined />, title: "Leave Reports", link: "/Leave_Reports" },
            { key: "19-16-8", icon: <FileTextOutlined />, title: "Attendance Reports", link: "/Attendance_Reports" },
          ],
        },
      ],
    },
    {
      key: "20",
      icon: <UsergroupAddOutlined />,
      title: "Users Management",
      subItems: [
        { key: "20-1", icon: <UsergroupAddOutlined />, title: "Add New User" },
        { key: "20-2", icon: <UnorderedListOutlined />, title: "User List" },
        { key: "20-3", icon: <LinkOutlined />, title: "Users Logs" },
        { key: "20-4", icon: <UnorderedListOutlined />, title: "Roles List" },
      ],
    },
    {
      key: "21",
      icon: <SettingOutlined />,
      title: "Settings",
      subItems: [
        { key: "21-1", icon: <BankOutlined />, title: "Company Profile" },
        { key: "21-2", icon: <SecurityScanOutlined />, title: "Site Settings" },
        { key: "21-3", icon: <BankOutlined />, title: "Manage Branch" },
        { key: "21-4", icon: <PercentageOutlined />, title: "Tax List" },
        { key: "21-5", icon: <LinkOutlined />, title: "Salutation" },
        { key: "21-6", icon: <LinkOutlined />, title: "Progress Status" },
        { key: "21-7", icon: <LinkOutlined />, title: "New Country" },
        { key: "21-8", icon: <UnorderedListOutlined />, title: "Country List" },
        {
          key: "21-9",
          icon: <UnorderedListOutlined />,
          title: "Currency List",
        },
        { key: "21-10", icon: <LockOutlined />, title: "Change Password" },
        { key: "21-11", icon: <AuditOutlined />, title: "Audit Trail" },
        { key: "21-12", icon: <HddOutlined />, title: "Database Backup" },
      ],
    },


    {
      key: "22",
      icon: <LogoutOutlined />,
      title: "Logout",
      link: "/",
    },
  ];

  const generateMenuItems = () => {
    return menuItems.map((item) => {
      if (item.subItems) {
        return {
          key: item.key,
          icon: <Tooltip title={item.title}>{item.icon}</Tooltip>,
          label: item.link ? <Link href={item.link}>{item.title}</Link> : item.title,
          children: item.subItems.map((subItem) => {
            if (subItem.subItems) {
              return {
                key: subItem.key,
                icon: <Tooltip title={subItem.title}>{subItem.icon}</Tooltip>,
                label: subItem.link ? <Link href={subItem.link}>{subItem.title}</Link> : subItem.title,
                children: subItem.subItems.map((nestedSubItem) => ({
                  key: nestedSubItem.key,
                  icon: <Tooltip title={nestedSubItem.title}>{nestedSubItem.icon}</Tooltip>,
                  label: nestedSubItem.link ? <Link href={nestedSubItem.link}>{nestedSubItem.title}</Link> : nestedSubItem.title,
                })),
              };
            }
            return {
              key: subItem.key,
              icon: <Tooltip title={subItem.title}>{subItem.icon}</Tooltip>,
              label: subItem.link ? <Link href={subItem.link}>{subItem.title}</Link> : subItem.title,
            };
          }),
        };
      }
      return {
        key: item.key,
        icon: <Tooltip title={item.title}>{item.icon}</Tooltip>,
        label: item.link ? <Link href={item.link}>{item.title}</Link> : item.title,
      };
    });
  };

  return (
    <div
      className={`sidebar ${collapsed ? "collapsed no-animation" : "no-animation"}`}
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
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        {...(hovered && { className: "submenu-hovered" })}
      />
    </div>
  );
};

export default Sidebar;