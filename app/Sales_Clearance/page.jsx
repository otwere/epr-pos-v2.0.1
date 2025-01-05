"use client";
import React, { useState } from "react";
import { Layout, Typography, Breadcrumb, Button, Card, Row, Col } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import ClearBillModal from "../Components/clearance/clear-bill-modal";
import DataTable from "../Components/clearance/data-table";

const { Content } = Layout;
const { Title } = Typography;

const SalesClearance = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [salesData, setSalesData] = useState([
    {
      id: "1",
      salesPerson: "John Doe",
      date: "2024-01-20",
      shift: "morning",
      expectedAmount: 25000,
      availableAmount: 25000,
      difference: 0,
      status: "balanced",
      paymentModes: {
        cash: 15000,
        mpesa: 5000,
        pdq: 5000,
      },
    },
    {
      id: "2",
      salesPerson: "Jane Smith",
      date: "2024-01-19",
      shift: "evening",
      expectedAmount: 15000,
      availableAmount: 14000,
      difference: 1000,
      status: "shortage",
      paymentModes: {
        cash: 7000,
        mpesa: 3000,
        pdq: 4000,
      },
    },
  ]);
  const [filteredData, setFilteredData] = useState(salesData);

  const handleModalSubmit = (data) => {
    const updatedData = [
      ...salesData,
      {
        id: Date.now().toString(),
        ...data,
      },
    ];
    setSalesData(updatedData);
    setFilteredData(updatedData);
  };

  const handleFilter = (status) => {
    if (status === "all") {
      setFilteredData(salesData);
    } else {
      setFilteredData(salesData.filter((entry) => entry.status === status));
    }
  };

  const summary = {
    total: salesData.length,
    balanced: salesData.filter((entry) => entry.status === "balanced").length,
    shortage: salesData.filter((entry) => entry.status === "shortage").length,
    excess: salesData.filter((entry) => entry.status === "excess").length,
    totalShortage: salesData
      .filter((entry) => entry.status === "shortage")
      .reduce((acc, entry) => acc + entry.difference, 0),
    totalExcess: salesData
      .filter((entry) => entry.status === "excess")
      .reduce((acc, entry) => acc + entry.difference, 0),
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
      />

      <Layout className="flex-1 bg-gray-50">
        <Header
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        />

        <Content className="transition-all duration-300 p-6">
          <Breadcrumb
            items={[
              {
                title: (
                  <Link href="/">
                    <HomeOutlined /> Home
                  </Link>
                ),
              },
              { title: "Sales Clearance" },
            ]}
            className="mb-3"
          />
          <hr className="mb-2" />

          <div className="bg-gray-50 rounded-sm p-2">
            <div className="mb-3 flex justify-between items-center">
              <Title level={4}>Sales Clearance</Title>
              <Button type="primary" onClick={() => setModalVisible(true)}>
                Clear Sales Bills
              </Button>
            </div>

            <hr className="mb-4" />

            {/* Cards for Filter Summary */}
            <Row gutter={16} className="mb-4">
              <Col span={6}>
                <Card
                  title="Total Entries"
                  bordered={false}
                  onClick={() => handleFilter("all")}
                  className="cursor-pointer transition-transform duration-200 hover:shadow-lg hover:scale-95 bg-blue-100"
                >
                  <Title level={5} className="text-blue-800 text-center">
                    {summary.total}
                  </Title>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  title="Fully Collected / Nill Difference"
                  bordered={false}
                  onClick={() => handleFilter("balanced")}
                  className="cursor-pointer transition-transform duration-200 hover:shadow-lg hover:scale-95 bg-green-100"
                >
                  <Title level={5} className="text-green-600 text-center">
                    {summary.balanced}
                  </Title>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  title="Shortages (KES)"
                  bordered={false}
                  onClick={() => handleFilter("shortage")}
                  className="cursor-pointer transition-transform duration-200 hover:shadow-lg hover:scale-95 bg-red-100"
                >
                  <Title
                    level={5}
                    className="text-red-600 flex justify-between items-center !mb-0"
                  >
                    <span>{summary.shortage}</span>
                    <p className="text-right">
                      Total Amount : KES : {summary.totalShortage}
                    </p>
                  </Title>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  title="Excesses (KES)"
                  bordered={false}
                  onClick={() => handleFilter("excess")}
                  className="cursor-pointer transition-transform duration-200 hover:shadow-lg hover:scale-95 bg-yellow-100"
                >
                  <Title
                    level={5}
                    className="text-yellow-600 flex justify-between items-center !mb-0"
                  >
                    <span>{summary.excess}</span>
                    <p className="text-right">
                      Total Amount : KES : {summary.totalExcess}
                    </p>
                  </Title>
                </Card>
              </Col>
            </Row>

            <hr className="mt-2" />

            {/* Data Table */}
            <DataTable data={filteredData} loading={false} />
          </div>
        </Content>
        <Footer />
      </Layout>

      <ClearBillModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default SalesClearance;
