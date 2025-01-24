"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Layout,
  Breadcrumb,
  Typography,
  Input,
  Table,
  Card,
  Space,
  Pagination,
  Button,
  Modal,
  Form,
  Select,
  notification,
} from "antd";
import { HomeOutlined, SearchOutlined, BellOutlined } from "@ant-design/icons";

// Importing Components
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const StockAlert = React.forwardRef((props, ref) => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [alertSettings, setAlertSettings] = useState({
    priceAlert: null,
    volumeAlert: null,
    percentageChangeAlert: null,
  });

  const inputRef = useRef();

  // Mock Data Initialization
  useEffect(() => {
    const mockProducts = [
      {
        id: "1",
        categoryName: "Electronics",
        itemName: "Smartphone",
        reorderLevel: 10,
        stockAvailable: 5,
      },
      {
        id: "2",
        categoryName: "Clothing",
        itemName: "T-Shirt",
        reorderLevel: 20,
        stockAvailable: 15,
      },
      {
        id: "3",
        categoryName: "Home Appliances",
        itemName: "Microwave Oven",
        reorderLevel: 8,
        stockAvailable: 3,
      },
      {
        id: "4",
        categoryName: "Books",
        itemName: "Bestseller Novel",
        reorderLevel: 30,
        stockAvailable: 25,
      },
      {
        id: "5",
        categoryName: "Groceries",
        itemName: "Organic Milk",
        reorderLevel: 50,
        stockAvailable: 40,
      },
    ];
    setProducts(mockProducts);
    setPagination((prev) => ({ ...prev, total: mockProducts.length }));
  }, []);

  // Compute Filtered and Paginated Products
  const filteredAndPaginatedProducts = React.useMemo(() => {
    setLoading(true);
    try {
      const filtered = products.filter((product) =>
        Object.values(product).some((value) => {
          // Handle undefined or null values gracefully
          if (value === undefined || value === null) return false;
          return String(value)
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        })
      );

      const startIndex = (pagination.current - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;

      setPagination((prev) => ({ ...prev, total: filtered.length }));
      return filtered.slice(startIndex, endIndex);
    } catch (error) {
      console.error("Failed to filter products", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [products, pagination.current, pagination.pageSize, searchTerm]);

  // Handlers
  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    notification.success({
      message: "Alert Set",
      description: `Alerts for ${selectedProduct.itemName} have been updated.`,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAlertSettingsChange = (key, value) => {
    setAlertSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Table Columns with Sorting Removed
  const columns = React.useMemo(
    () => [
      {
        title: "#ID",
        dataIndex: "id",
      },
      {
        title: "Category Name",
        dataIndex: "categoryName",
      },
      {
        title: "Item Name",
        dataIndex: "itemName",
      },
      {
        title: "Reorder Level",
        dataIndex: "reorderLevel",
        align: "right",
        render: (value) => <span className="font-medium">{value}</span>,
      },
      {
        title: "Stock Available",
        dataIndex: "stockAvailable",
        align: "right",
        render: (value, record) => {
          const stockAvailable = value ?? 0;
          const reorderLevel = record.reorderLevel ?? 0;

          if (reorderLevel === 0) return <span className="font-medium">N/A</span>;

          const stockPercentage = (stockAvailable / reorderLevel) * 100;
          let textClass = "";

          if (stockPercentage < 25) {
            textClass = "text-red-500";
          } else if (stockPercentage >= 25 && stockPercentage < 50) {
            textClass = "text-yellow-500";
          } else if (stockPercentage >= 50) {
            textClass = "text-green-500";
          }

          return <span className={`font-medium ${textClass}`}>{stockAvailable}</span>;
        },
      },
      {
        title: "Actions",
        key: "actions",
        align: "right",
        render: (_, record) => (
          <Button type="link" onClick={() => showModal(record)}>
            <BellOutlined /> Set Alerts
          </Button>
        ),
      },
    ],
    []
  );

  // Render Component
  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className="flex-1 bg-gray-100">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="p-6">
          <Breadcrumb
            items={[
              {
                title: (
                  <span>
                    <HomeOutlined  className="text-blue-500"/> Home
                  </span>
                ),
                href: "/Dashboard",
              },
              { title: "Stock Alert" },
            ]}
            className="mb-3"
          />
          <hr />

          <div className="mb-4 flex justify-between items-center">
            <Title level={4} className="text-blue-600 mt-2">
              Stock Alert
            </Title>
          </div>

          <hr className="mb-4" />

          <Card className="rounded-lg bg-gray-50">
            <div className="mb-4">
              <Space size="large" className="w-full flex justify-between">
                <Input
                  ref={inputRef}
                  prefix={<SearchOutlined />}
                  placeholder="Search by Category | Item Name"
                  value={searchTerm}
                  onChange={handleSearch}                  
                  style={{ width: 1360 }}
                />
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={filteredAndPaginatedProducts}
              rowKey="id"
              pagination={false}
              loading={loading}
              onChange={handleTableChange}
              className="border border-gray-200 rounded"
              locale={{
                emptyText: searchTerm
                  ? "No matching results found"
                  : "No data available",
              }}
            />

            <div className="flex justify-end mt-4">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger
                pageSizeOptions={["10", "20", "50"]}
                showTotal={(total) => `${total} items`}
                onChange={(page, pageSize) =>
                  setPagination({ ...pagination, current: page, pageSize })
                }
              />
            </div>
          </Card>
        </Content>
        <Footer />
      </Layout>

      {/* Alert Settings Modal */}
      <Modal
        title={`Set Alerts for ${selectedProduct?.itemName}`}
        open={isModalVisible} // Updated from `visible` to `open`
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Price Alert">
            <Input
              type="number"
              placeholder="Set price threshold"
              value={alertSettings.priceAlert}
              onChange={(e) =>
                handleAlertSettingsChange("priceAlert", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item label="Volume Alert">
            <Input
              type="number"
              placeholder="Set volume threshold"
              value={alertSettings.volumeAlert}
              onChange={(e) =>
                handleAlertSettingsChange("volumeAlert", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item label="Percentage Change Alert">
            <Select
              placeholder="Select percentage change"
              value={alertSettings.percentageChangeAlert}
              onChange={(value) =>
                handleAlertSettingsChange("percentageChangeAlert", value)
              }
            >
              <Option value="5">5%</Option>
              <Option value="10">10%</Option>
              <Option value="15">15%</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default StockAlert;