"use client";
import React, { useState } from "react";
import { Layout, Typography, Breadcrumb, message, Card } from "antd";
import Link from "next/link";
import Header from "../components/HeaderComponent/Header";
import Sidebar from "../components/SidebarComponent/Sidebar";
import Footer from "../components/FooterComponent/Footer";
import QuotationList from "../components/Quotation/QuotationList";
import QuotationForm from "../components/Quotation/QuotationForm";
import { QuotationProvider } from "../components/Quotation/QuotationContext";

const { Content } = Layout;
const { Title, Text } = Typography;

const QuotationPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleAddNewQuotation = () => {
    setIsModalOpen(true);
    setEditingQuotation(null);
  };

  const handleEditQuotation = (quotation) => {
    setIsModalOpen(true);
    setEditingQuotation(quotation);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingQuotation(null);
  };

  const handleQuotationSaved = () => {
    setIsModalOpen(false);
    setEditingQuotation(null);
    messageApi.success("Quotation saved successfully");
  };

  return (
    <QuotationProvider>
      {contextHolder}
      <div className="min-h-screen flex">
        <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />
        <Layout className="flex-1 bg-gray-100">
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content className="transition-all duration-300 p-6">
            <div className="mt-0">
              <Breadcrumb
                className="mb-4"
                items={[
                  { title: <Link href="/">Home</Link> },
                  { title: " Generate Quotations" },
                ]}
              />
              <hr />
              <div className="mb-4 flex justify-between items-center">
                <Title level={4} className="text-blue-800 mt-2">
                 Generate Quotations
                </Title>
                <Text type="secondary">Generate and view all Quotations</Text>
              </div>
            </div>

            <hr className="mb-3" />

            <Card className="rounded-md bg-gray-50">
              <QuotationList
                onAddNew={handleAddNewQuotation}
                onEdit={handleEditQuotation}
              />
            </Card>
            <QuotationForm
              open={isModalOpen}
              onCancel={handleModalClose}
              onSave={handleQuotationSaved}
              editingQuotation={editingQuotation}
            />
          </Content>
          <Footer />
        </Layout>
      </div>
    </QuotationProvider>
  );
};

export default QuotationPage;