"use client";
import React, { useState, useCallback, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  InputNumber,
  Modal,
  message,
  Row,
  Col,
  Switch,
  Card,
  Divider,
  Typography,
  Breadcrumb,
  Layout,
  DatePicker,
  Radio,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  ReloadOutlined,
  FileImageOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Option } = Select;
const { Text } = Typography;

const AddItems = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const formRef = useRef(null);

  const CATEGORIES = {
    groceries: ["Dairy", "Bakery", "Produce", "Frozen Foods"],
    electronics: ["Smartphones", "Laptops", "Accessories", "Audio"],
    clothing: ["Men", "Women", "Children", "Accessories"],
  };

  const BRANCHES = ["Main Branch", "Branch 1", "Branch 2", "Branch 3"];
  const TAX_TYPES = ["VAT", "GST", "None"];
  const UNITS = ["Pieces", "Kg", "Liters", "Boxes", "Packets"];

  const rules = {
    required: [{ required: true, message: "This field is required" }],
    number: [{ type: "number", min: 0, message: "Must be a positive number" }],
    dateRule: [{ required: true, message: "Please select a date" }],
  };

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  const handleUpload = useCallback(({ fileList: newFileList }) => {
    setFileList(newFileList);
  }, []);

  const calculateProfitMargin = useCallback((salesPrice, purchasePrice) => {
    if (!purchasePrice || purchasePrice === 0) return 0;
    return (((salesPrice - purchasePrice) / purchasePrice) * 100).toFixed(2);
  }, []);

  const handleReset = useCallback(() => {
    formRef.current.resetFields();
    setFileList([]);
  }, []);

  const onFinish = useCallback((values) => {
    const submissionData = {
      ...values,
      image: fileList.length > 0 ? fileList[0].originFileObj : null,
      expireDate: values.expireDate?.format("DD-MM-YYYY"),
      profitMargin: calculateProfitMargin(
        values.salesPrice,
        values.purchasePrice
      ),
    };

    setOpenModal(true);
    setConfirmLoading(true);

    setTimeout(() => {
      console.log("Submission Data:", submissionData);
      messageApi.success("Item added successfully!");
      setOpenModal(false);
      setConfirmLoading(false);
      handleReset();
    }, 1000);
  }, [fileList, calculateProfitMargin, messageApi, handleReset]);

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div className="mt-2">Upload</div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />

      <Layout className="flex-1 bg-gray-100">
        <Header collapsed={collapsed} onCollapse={toggleCollapsed} />

        <Content className="transition-all duration-300 p-6">
          {contextHolder}

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
              { title: "Add Items | Products" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          <Card
            title={
              <Text className="text-xl font-semibold mt-0">
                *Register New Items
              </Text>
            }
            extra={
              <Text type="secondary" className="text-sm">
                All fields marked * are required
              </Text>
            }
            className="shadow-sm rounded-sm p-4 bg-gray-50 mb-8"
          >
            <Form
              ref={formRef}
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                manageStock: true,
                allowNegativeSale: false,
                purpose: "sale",
                taxType: "None",
                profitMargin: 0,
                salesPersonCommission: 0,
                alertQuantity: 0,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="branch"
                    label="Branch *"
                    rules={rules.required}
                  >
                    <Select placeholder="Select branch">
                      {BRANCHES.map((branch) => (
                        <Option key={branch} value={branch}>
                          {branch}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    name="itemName"
                    label="Item Name *"
                    rules={rules.required}
                  >
                    <Input placeholder="Enter item name" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item name="brand" label="Brand">
                    <Input placeholder="Enter brand name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="category"
                    label="Category *"
                    rules={rules.required}
                  >
                    <Select placeholder="Select category">
                      {Object.keys(CATEGORIES).map((category) => (
                        <Option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item name="unit" label="Unit *" rules={rules.required}>
                    <Select placeholder="Select unit">
                      {UNITS.map((unit) => (
                        <Option key={unit} value={unit}>
                          {unit}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item name="sku" label="Serial Key Unit (SKU)">
                    <Input placeholder="Enter SKU" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="uniqueIdentifier"
                    label="Serial Key Unit (Unique Identifier)"
                  >
                    <Input placeholder="Enter unique identifier" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    name="alertQuantity"
                    label="Alert Quantity"
                    rules={rules.number}
                  >
                    <InputNumber
                      className="w-full"
                      placeholder="Enter alert quantity"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item name="hsCode" label="HS Code">
                    <Input placeholder="Enter HS code" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item name="expireDate" label="Expire Date">
                    <DatePicker
                      format="DD-MM-YYYY"
                      className="w-full"
                      placeholder="Select expire date"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item name="purpose" label="Purpose">
                    <Radio.Group>
                      <Radio value="sale">For Sale</Radio>
                      <Radio value="not-for-sale">Not For Sale</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="manageStock"
                        label="Manage Stock"
                        valuePropName="checked"
                      >
                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="allowNegativeSale"
                        label="Allow -ve Sale"
                        valuePropName="checked"
                      >
                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Divider orientation="left">Pricing Information</Divider>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="purchasePrice"
                    label="Purchase Price *"
                    rules={rules.required}
                  >
                    <InputNumber
                      className="w-full"
                      prefix="KES"
                      placeholder="Enter purchase price"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    name="taxType"
                    label="Tax Type *"
                    rules={rules.required}
                  >
                    <Select placeholder="Select tax type">
                      {TAX_TYPES.map((tax) => (
                        <Option key={tax} value={tax}>
                          {tax}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    name="taxAmount"
                    label="Tax Amount"
                    rules={rules.number}
                  >
                    <InputNumber
                      className="w-full"
                      prefix="KES"
                      placeholder="Enter tax amount"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    name="salesPrice"
                    label="Sales Price/Retail Price *"
                    rules={rules.required}
                  >
                    <InputNumber
                      className="w-full"
                      prefix="KES"
                      placeholder="Enter sales price"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item
                    name="wholesalePrice"
                    label="Wholesale Price"
                    rules={rules.number}
                  >
                    <InputNumber
                      className="w-full"
                      prefix="KES"
                      placeholder="Enter wholesale price"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item
                    name="minimumPrice"
                    label="Promotion/Minimum Sales Price"
                    rules={rules.number}
                  >
                    <InputNumber
                      className="w-full"
                      prefix="KES"
                      placeholder="Enter minimum price"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item
                    name="salesPersonCommission"
                    label="Sales Person Commission (%)"
                    rules={rules.number}
                  >
                    <InputNumber
                      className="w-full"
                      placeholder="Enter commission percentage"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="openingStock" label="New Opening Stock">
                    <InputNumber
                      className="w-full"
                      placeholder="Enter opening stock"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="description" label="Description">
                    <Input.TextArea
                      rows={4}
                      placeholder="Enter product description"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Product Image</Divider>
              <Form.Item name="image" label="Upload Product Image">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleUpload}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>

              <Form.Item>
                <div className="flex justify-end space-x-2">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleReset}
                    className="bg-gray-300 text-black hover:bg-gray-400 rounded-lg px-4 py-2"
                  >
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2"
                  >
                    Save Product
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Content>
        <Footer />
      </Layout>

      <Modal
        title="Processing"
        open={openModal}
        confirmLoading={confirmLoading}
        footer={null}
      >
        <div className="text-center">
          <FileImageOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
          <p className="mt-4">Saving product details...</p>
        </div>
      </Modal>
    </div>
  );
};

export default AddItems;