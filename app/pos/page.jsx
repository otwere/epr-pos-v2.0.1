"use client";
import React, { useState, useCallback, useEffect, Suspense } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Modal,
  message,
  Breadcrumb,
  Typography,
  Card,
  Divider,
  Col,
  Row,
} from "antd";

import {
  HomeOutlined,
  ShoppingCartOutlined,
  SaveOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";

// Component imports (lazy-loaded)
const ItemTable = React.lazy(() =>
  import("../Components/ItemTableComponent/ItemTable")
);
const DiscountSection = React.lazy(() =>
  import("../Components/DiscountSectionComponent/DiscountSection")
);
const PaymentModal = React.lazy(() =>
  import("../Components/PaymentModelComponent/PaymentModel")
);
import {
  POSProvider,
  usePOS,
} from "../Components/POSContextComponent/POSContext";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;

const POS = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <POSProvider>
      <div className="min-h-screen flex">
        <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />
        
        <Layout className="flex-1 bg-gray-50 shadow-">
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          
          <Content
            className={`transition-all duration-300 p-6 ${collapsed ? "ml-0 w-full" : "ml-0 w-full"}`}
          >
            <POSContent />
          </Content>
          
          <Footer />
        </Layout>
      </div>
    </POSProvider>
  );
};

const POSContent = () => {
  const {
    branch,
    setBranch,
    customer,
    setCustomer,
    searchQuery,
    setSearchQuery,
    handleAddItem,
    totals,
    setDiscount,
    discount,
    isPercentage,
    setIsPercentage,
  } = usePOS();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Optimized memoization of formatWithCommas function
  const formatWithCommas = useCallback((value) => {
    if (typeof value !== "number") return value;
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  // Debounced search query logic
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle adding new item
  const handleSaveItem = useCallback(() => {
    form.validateFields().then((values) => {
      const newItem = {
        ...values,
        quantity: parseInt(values.quantity, 10),
        price: parseFloat(values.price),
        subtotal: values.quantity * values.price,
      };
      handleAddItem(newItem);
      setIsModalOpen(false);
      messageApi.success("Item added successfully!");
      form.resetFields();
    }).catch((_errorInfo) => {
      messageApi.error("Please fill in all required fields!");
    });
  }, [form, handleAddItem, messageApi]);

  return (
    <div>
      {contextHolder}
      
      <div className="mt-1">
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
              { title: "Point of Sale (POS)" },
            ]}
            className="mb-3"
          />
        <hr />
        <div className="mb-4 flex justify-between items-center">
          <Title level={4} className="!mb-0 mt-4 text-blue-600">
            Point of Sale (POS)
          </Title>
          <Text type="secondary" className="text-right mb-0">
            All fields with * are required
          </Text>
        </div>
      </div>

      <Card className="shadow-sm rounded-lg bg-gray-100 max-w-full">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            branch: "",
            customer: "",
            date: moment(),
            quantity: 1,
            price: 0,
            type: "Retail Price",
          }}
        >
          {/* Store and Customer Information Section */}
          <Divider orientation="left">
            <span className="text-gray-800">
              <InfoCircleOutlined className="mr-2" />
              Sale Information
            </span>
          </Divider>
          
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="branch"
                label="Branch *"
                rules={[{ required: true, message: "Branch is required" }]} >
                <Select
                  placeholder="Select Branch"
                  onChange={setBranch}
                  value={branch}
                >
                  <Select.Option value="">Main Branch (HQ)</Select.Option>
                  <Select.Option value="Branch - One">Branch-One</Select.Option>
                  <Select.Option value="Branch - Two">Branch-Two</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="customer"
                label="Customer *"
                rules={[{ required: true, message: "Customer is required" }]} >
                <Select
                  placeholder="Select Customer"
                  onChange={setCustomer}
                  value={customer}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Select.Option value="">Walk-In Customer</Select.Option>
                  <Select.Option value="Customer 1">Customer 1</Select.Option>
                  <Select.Option value="Customer 2">Customer 2</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="date" label="Date">
                <DatePicker 
                  style={{ width: "100%" }}
                  value={moment()}  // Use value instead of defaultValue
                  format="DD-MM-YYYY"
                  disabledDate={(current) =>
                    current && current > moment().endOf("day")
                  }
                />
              </Form.Item>

              <Form.Item name="searchQuery" label="Search Items">
                <Input
                  prefix={<PlusOutlined />}
                  placeholder="Search by Item Name | Barcode | Item Code"
                  value={debouncedSearchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Item Table */}
          <Divider orientation="left">
            <span className="text-gray-800">
              <ShoppingCartOutlined className="mr-2" />
              Sales Items
            </span>
          </Divider>
          
          <Suspense fallback={<div>Loading...</div>}>
            <ItemTable />
          </Suspense>

          {/* New Sales Button */}
          <div className="flex items-center mt-4">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              className="w-full"
            >
              Make Sales
            </Button>
          </div>

          {/* Discount Section */}
          <Suspense fallback={<div>Loading...</div>}>
            <DiscountSection
              discount={discount}
              setDiscount={setDiscount}
              totals={{
                ...totals,
                totalAmt: formatWithCommas(totals?.totalAmt),
                grandTotal: formatWithCommas(totals?.grandTotal),
              }}
              isPercentage={isPercentage}
              setIsPercentage={setIsPercentage}
            />
          </Suspense>

          {/* Payment Actions */}
          <div className="flex gap-4 justify-end mt-4">
            <Button 
              type="default"
              onClick={() => {
                // Reset functionality
              }}
            >
              Reset
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => setIsPaymentModalOpen(true)}
            >
              Proceed to Payment
            </Button>
          </div>
        </Form>
      </Card>

      {/* Add Item Modal */}
      <Modal
        title={<span className="text-blue-600 text-lg">Add New Sales Item</span>}
        open={isModalOpen}
        onOk={handleSaveItem}
        onCancel={() => setIsModalOpen(false)}
        okText="Add Item"
        cancelText="Cancel"
        width={850}
      >
        <Card className="bg-200-red">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              name: "",
              quantity: 1,
              price: 0,
              type: "Retail Price",
              code: "",
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Item Name *"
                  rules={[{ required: true, message: "Item name is required" }]} >
                  <Input 
                    prefix={<PlusOutlined />}
                    placeholder="Enter item name" 
                  />
                </Form.Item>

                <Form.Item
                  name="quantity"
                  label="Quantity *"
                  rules={[{ required: true, message: "Quantity is required" }]} >
                  <Input 
                    type="number" 
                    prefix={<PlusOutlined />}
                    min={1} 
                    placeholder="Enter quantity" 
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="price"
                  label="Unit Price *"
                  rules={[{ required: true, message: "Price is required" }]} >
                  <Input 
                    type="number" 
                    prefix="KES"
                    min={0} 
                    step={0.01} 
                    placeholder="Enter price" 
                  />
                </Form.Item>

                <Form.Item
                  name="typeofPricing"
                  label="Pricing Type *"
                  rules={[{ required: true, message: "Pricing type is required" }]} >
                  <Select>
                    <Select.Option value="Retail Price">Retail Price</Select.Option>
                    <Select.Option value="Wholesale Price">Wholesale Price</Select.Option>
                    <Select.Option value="Happy Hour">Happy Hour Price</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>

      {/* Payment Modal */}
      <Suspense fallback={<div>Loading Payment Modal...</div>}>
        <PaymentModal
          open={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          grandTotal={totals.grandTotal}
        />
      </Suspense>
    </div>
  );
};

export default POS;
