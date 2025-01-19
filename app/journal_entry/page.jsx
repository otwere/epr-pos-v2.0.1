"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Layout, Typography, Breadcrumb, notification, message } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Header from "../components/HeaderComponent/Header";
import Sidebar from "../components/SidebarComponent/Sidebar";
import Footer from "../components/FooterComponent/Footer";
import JournalEntryTable from "../components/JournalEntry/JournalEntryTable";
import JournalEntryForm from "../components/JournalEntry/JournalEntryForm";
import { generateNextJournalEntryNumber } from "../Components/JournalEntry/journalEntryUtils";
import { handleBulkDelete } from "../Components/JournalEntry/deleteUtils";
import Link from "next/link";

const { Content } = Layout;
const { Title, Text } = Typography;

const JournalEntry = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([
    "Cash", "Mpesa", "Bank", "Accounts Receivable", "Accounts Payable",
    "Inventory", "Sales Revenue", "Cost of Goods Sold", "Expenses",
    "Loans Payable", "Equity"
  ]);
  const [nextJournalEntryNumber, setNextJournalEntryNumber] = useState("JE001");

  useEffect(() => {
    setNextJournalEntryNumber(generateNextJournalEntryNumber(items));
  }, [items]);

  const toggleCollapsed = useCallback(() => setCollapsed(prev => !prev), []);

  const handleSearch = useCallback((e) => setSearchTerm(e.target.value), []);

  const filteredItems = tableData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleFormSubmit = useCallback((values) => {
    setLoading(true);
    // Simulating an API call
    setTimeout(() => {
      const { transactionDate, creditAccount, debitAccount, amount, narration } = values;

      if (creditAccount === debitAccount) {
        message.error("Credit and Debit accounts must be different");
        setLoading(false);
        return;
      }

      const newEntries = [
        {
          id: Date.now().toString() + "-debit",
          journalEntryNumber: nextJournalEntryNumber,
          accountName: debitAccount,
          transactionDate: transactionDate.format("DD-MM-YYYY"),
          credit: 0,
          debit: amount,
          amount: amount,
          narration: narration,
        },
        {
          id: Date.now().toString() + "-credit",
          journalEntryNumber: nextJournalEntryNumber,
          accountName: creditAccount,
          transactionDate: transactionDate.format("DD-MM-YYYY"),
          credit: amount,
          debit: 0,
          amount: amount,
          narration: narration,
        }
      ];

      setItems(prevItems => [...prevItems, ...newEntries]);
      setTableData(prevData => [...prevData, ...newEntries]);

      const newAccounts = [creditAccount, debitAccount].filter(
        (account) => !accounts.includes(account)
      );
      if (newAccounts.length > 0) {
        setAccounts(prevAccounts => [...prevAccounts, ...newAccounts]);
      }

      notification.success({
        message: "Success",
        description: "New journal entry added successfully",
        placement: "topRight",
      });

      setIsFormOpen(false);
      setLoading(false);
    }, 1000);
  }, [accounts, nextJournalEntryNumber]);

  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />
      <Layout className="flex-1 bg-gray-100">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="transition-all duration-300 p-6">
          <Breadcrumb
            className="mb-4"
            items={[
              { title: <Link href="/"><HomeOutlined /> Home</Link> },
              { title: "Add Journal Entry" },
            ]}
          />
          <hr />
          <div className="mb-4 flex justify-between items-center">
            <Title level={4} className="text-blue-800 mt-2">Journal Entry</Title>
            <Text type="secondary">List of Journal Entries</Text>
          </div>
          <hr className="mb-4" />
          <JournalEntryTable
            items={filteredItems}
            loading={loading}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            handleSearch={handleSearch}
            searchTerm={searchTerm}
            setIsFormOpen={setIsFormOpen}
            handleBulkDelete={() => handleBulkDelete(tableData, setTableData, selectedRowKeys, setSelectedRowKeys, setLoading, notification)}
          />
        </Content>
        <Footer />
      </Layout>
      {isFormOpen && (
        <JournalEntryForm
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          accounts={accounts}
          setAccounts={setAccounts}
          nextJournalEntryNumber={nextJournalEntryNumber}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default JournalEntry;

