"use client";

import React, { useRef } from "react";
import {
  Layout,
  Breadcrumb,
  Typography,
  Input,
  Table,
  Card,
  Space,
  Pagination,
} from "antd";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";

// Importing Components
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Title } = Typography;

const StockAlert = React.forwardRef((props, ref) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = React.useState("");

  const inputRef = useRef(); // Input ref if needed

  // Mock Data Initialization
  React.useEffect(() => {
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
        Object.values(product).some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );

      const startIndex = (pagination.current - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;

      setPagination((prev) => ({ ...prev, total: filtered.length }));
      return filtered.slice(startIndex, endIndex);
    } catch (error) {
      console.error("Failed to fetch products", error);
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
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page on search
  };

  // Table Columns
  const columns = React.useMemo(
    () => [
      {
        title: "#ID",
        dataIndex: "id",
        sorter: (a, b) => a.id.localeCompare(b.id),
      },
      {
        title: "Category Name",
        dataIndex: "categoryName",
        sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      },
      {
        title: "Item Name",
        dataIndex: "itemName",
        sorter: (a, b) => a.itemName.localeCompare(b.itemName),
      },
      {
        title: "Reorder Level",
        dataIndex: "reorderLevel",
        sorter: (a, b) => a.reorderLevel - b.reorderLevel,
        align: "right", // Right align the column
        render: (value) => <span className="font-medium">{value}</span>,
      },
      {
        title: "Stock Available",
        dataIndex: "stockAvailable",
        sorter: (a, b) => a.stockAvailable - b.stockAvailable,
        align: "right", // Right align the column
        render: (value, record) => {
          // Handle undefined or NaN values gracefully
          const stockAvailable = value ?? 0;
          const reorderLevel = record.reorderLevel ?? 0;

          if (reorderLevel === 0) return <span className="font-medium">N/A</span>;

          const stockPercentage = (stockAvailable / reorderLevel) * 100;
          let textClass = "";

          if (stockPercentage < 25) {
            textClass = "text-red-500"; // Below 25%
          } else if (stockPercentage >= 25 && stockPercentage < 50) {
            textClass = "text-yellow-500"; // Between 25% and 50%
          } else if (stockPercentage >= 50) {
            textClass = "text-green-500"; // Above 50%
          }

          return <span className={`font-medium ${textClass}`}>{stockAvailable}</span>;
        },
      },
    ],
    []
  );

  // Render Component
  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className="flex-1 bg-gray-50">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="p-6">
          <Breadcrumb
            items={[
              {
                title: (
                  <span>
                    <HomeOutlined /> Home
                  </span>
                ),
                href: "/",
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

          <Card className="shadow-sm rounded-lg">
            <div className="mb-4">
              <Space size="large" className="w-full flex justify-between">
                <Input
                  ref={inputRef} // Using ref here
                  prefix={<SearchOutlined />}
                  placeholder="Search by Category | Item Name"
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: 300 }}
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
    </div>
  );
});

export default StockAlert;
