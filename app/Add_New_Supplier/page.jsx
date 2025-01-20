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
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  ReloadOutlined,
  FileImageOutlined,
  HomeOutlined,
  ShopOutlined,
  InfoCircleOutlined,
  ContactsOutlined,
  EnvironmentOutlined,
  BankOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Option } = Select;
const { Text } = Typography;

const counties = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
];

const Add_New_Supplier = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCounties = counties.filter((county) =>
    county.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const handleUpload = useCallback(({ fileList: newFileList }) => {
    setFileList(newFileList);
  }, []);

  const handleReset = useCallback(() => {
    formRef.current.resetFields();
    setFileList([]);
  }, []);

  const onFinish = useCallback(
    (values) => {
      setIsSubmitting(true);
      const submissionData = {
        ...values,
        shopPhoto: fileList.length > 0 ? fileList[0].originFileObj : null,
      };

      setOpenModal(true);
      setConfirmLoading(true);

      setTimeout(() => {
        console.log("Submission Data:", submissionData);
        messageApi.success("Supplier added successfully!");
        setOpenModal(false);
        setConfirmLoading(false);
        handleReset();
        setIsSubmitting(false);
      }, 1000);
    },
    [fileList, messageApi, handleReset]
  );

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
              { title: "Add New Supplier" },
            ]}
            className="mb-2"
          />
          <hr className="mb-2" />

          <div className="p-3 border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-600">
                *Register New Supplier
              </h1>
              <p className="text-sm text-gray-500 text-right">
                All fields marked * are required
              </p>
            </div>
          </div>

          <hr  className="mb-4"/>

          <Card className="rounded-sm p-4 bg-gray-50 mb-8">
            <Form
              ref={formRef}
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Divider orientation="left">
                <ShopOutlined /> Business Details
              </Divider>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="businessName"
                    label="Business Registration Name | Trade Name *"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input placeholder="Enter business name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="businessRegCertNumber"
                    label="Business Registration Incorporation |  Certificate Number *"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input placeholder="Enter certificate number" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="businessLicenseNumber"
                    label="Valid Business Permit | Trade License Number *"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input placeholder="Enter license number" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="licenseExpiryDate"
                    label="License Expiry Date *"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input type="date" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">
                <InfoCircleOutlined /> General Information
              </Divider>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="supplierName"
                    label="Supplier Name *"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input placeholder="Enter supplier name" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="phoneNumber"
                    label="Phone No. *"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input placeholder="Enter phone number" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="altPhoneNumber" label="Alt. Phone No.">
                    <Input placeholder="Enter alternate phone number" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Active Email Address *"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input placeholder="Enter phone  active Email Address" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">
                <ContactsOutlined /> Contact Person Details
              </Divider>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="contactPersonName"
                    label="Contact Person Name *"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input placeholder="Enter Contact Person Name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="contactPersonPhone"
                    label="Contact Person Phone Number *"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input placeholder="Enter phone number" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="contactPersonEmailAddress"
                    label="Contact  Person  Email  Address *"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input placeholder="Enter phone Active Email Address" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="contactPersonPosition"
                    label="Contact Person Position *"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input placeholder="Enter Position e.g  CEO | Director | Manager" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">
                <EnvironmentOutlined /> Business Physical Address Details
              </Divider>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="county"
                    label="County *"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Select county"
                      onSearch={(value) => setSearchTerm(value)}
                      filterOption={false}
                    >
                      {filteredCounties.map((county) => (
                        <Option key={county} value={county}>
                          {county}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="townCity" label="Town | City">
                    <Input placeholder="Enter Town or City" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="poBox" label="P.O. Box">
                    <Input placeholder="Enter P.O Box" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="postalCode" label="Postal Code">
                    <Input placeholder="Enter Postal Code" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item name="address" label="Address / Physical Location">
                    <Input.TextArea
                      rows={3}
                      placeholder="Enter address or physical location"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">
                <FileTextOutlined /> Tax and Financial Details
              </Divider>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="kraPin" label="KRA Pin">
                    <Input placeholder="Enter KRA Pin" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="openingBalance"
                    label="Opening Balance *"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <InputNumber
                      className="w-full"
                      placeholder="Enter opening balance"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="applyWithholdingTax"
                    label="Apply Withholding Tax (2%)"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">
                <BankOutlined /> Bank and Payment Details
              </Divider>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="migrationControlAccount"
                    label="Migration Control Account"
                  >
                    <Select placeholder="Select account type">
                      <Option value="Share Capital Account">
                        Share Capital Account
                      </Option>
                      <Option value="Migration Control">
                        Migration Control
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="tillNumber" label="Till Number">
                    <Input placeholder="Enter till number" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="paybillNumber" label="Paybill Number">
                    <Input placeholder="Enter paybill number" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="accountName" label="Account Name">
                    <Input placeholder="Enter account name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="bankAccountName" label="Bank Account Name">
                    <Input placeholder="Enter bank account name" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="bankAccountNumber"
                    label="Bank Account Number"
                  >
                    <Input placeholder="Enter bank account number" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="bankName" label="Bank Name">
                    <Input placeholder="Enter bank name" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="bankBranch" label="Bank Branch">
                    <Input placeholder="Enter bank branch" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">
                <UploadOutlined /> Document Uploads
              </Divider>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="incorporationCert"
                    label="Certificate of Incorporation/Business Name Certificate"
                  >
                    <Upload beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="cr12or13" label="CR-12 or CR-13">
                    <Upload beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="businessLicense"
                    label="Business Permit | Trade License"
                  >
                    <Upload beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="kraPinCert" label="KRA PIN Certificate">
                    <Upload beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="taxComplianceCert"
                    label="Valid Tax Compliance Certificate"
                  >
                    <Upload beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">
                <FileImageOutlined /> Shop Photo
              </Divider>
              <Form.Item name="shopPhoto" label="Upload Shop Photo">
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
                    disabled={isSubmitting}
                  >
                    Save Supplier
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
          <p className="mt-4">Saving supplier details...</p>
        </div>
      </Modal>
    </div>
  );
};

export default Add_New_Supplier;
