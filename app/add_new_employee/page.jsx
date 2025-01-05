"use client";
import React, { useState, useCallback, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  DatePicker,
  AutoComplete,
  message,
  Row,
  Col,
  Switch,
  Card,
  Divider,
  Typography,
  Breadcrumb,
  Layout,
  Steps,
  Space,
  Tooltip,
  Progress,
  Modal,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  ReloadOutlined,
  FileImageOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  ContactsOutlined,
  FileTextOutlined,
  LeftOutlined,
  RightOutlined,
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

const steps = [
  {
    title: "Basic Info",
    icon: <InfoCircleOutlined />,
  },
  {
    title: "Personal Information",
    icon: <FileTextOutlined />,
  },
  {
    title: "Benefit & Supervisor",
    icon: <FileTextOutlined />,
  },
  {
    title: "Additional Address",
    icon: <FileTextOutlined />,
  },
  {
    title: "Emergency Contact",
    icon: <ContactsOutlined />,
  },
  {
    title: "Document Uploads",
    icon: <UploadOutlined />,
  },
];

const Add_New_Employee = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const nextPage = () => {
    form
      .validateFields()
      .then(() => {
        setCurrentPage((prev) => prev + 1);
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  const prevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    onFinish(form.getFieldsValue());
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = useCallback(
    (values) => {
      setIsSubmitting(true);
      const submissionData = {
        ...values,
        employeePhoto: fileList.length > 0 ? fileList[0].originFileObj : null,
      };

      setTimeout(() => {
        console.log("Submission Data:", submissionData);
        messageApi.success("Employee added successfully!");
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
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />

      <Layout className="flex-1 bg-gray-100 flex flex-col">
        <Header collapsed={collapsed} onCollapse={toggleCollapsed} />

        <Content className="transition-all duration-300 p-8">
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
              { title: "Add New Employee" },
            ]}
            className="mb-2"
          />
          <Divider />

          <div className="p-4 border-b border-gray-200 mb-3">
            <div className="flex items-center justify-between pb-0">
              <h1 className="text-xl font-bold text-gray-700">
                Register New Employee
              </h1>
              <p className="text-sm text-gray-500">
                All fields marked * are required
              </p>
            </div>
          </div>

          <Card className="shadow-none rounded-lg p-6 bg-gray-50 mb-8">
            <Steps current={currentPage - 1} className="mb-6">
              {steps.map((step) => (
                <Steps.Step
                  key={step.title}
                  title={step.title}
                  icon={step.icon}
                />
              ))}
            </Steps>
            <Progress percent={(currentPage / steps.length) * 100} showInfo={false} />
            <Form
              ref={formRef}
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              {currentPage === 1 && (
                <>
                  <Divider orientation="left">
                    <InfoCircleOutlined /> Basic Info
                  </Divider>
                  <Row gutter={24}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="firstName"
                        label="First Name *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <Input placeholder="Enter first name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item name="middleName" label="Middle Name">
                        <Input placeholder="Enter middle name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name="lastName"
                        label="Last Name *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <Input placeholder="Enter last name" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label="Email Address *"
                        rules={[
                          { required: true, message: "This field is required" },
                          { type: "email", message: "Please enter a valid email" },
                        ]}
                      >
                        <Input placeholder="Enter email address" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label="Phone *"
                        rules={[
                          { required: true, message: "This field is required" },
                          { pattern: /^[0-9]{10}$/, message: "Please enter a valid phone number" },
                        ]}
                      >
                        <Input placeholder="Enter phone number" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="alternativePhone"
                        label="Alternative Phone"
                        rules={[
                          { pattern: /^[0-9]{10}$/, message: "Please enter a valid phone number" },
                        ]}
                      >
                        <Input placeholder="Enter alternative phone number" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="county" label="County">
                        <AutoComplete
                          options={filteredCounties.map((county) => ({ value: county }))}
                          onSearch={(value) => setSearchTerm(value)}
                          placeholder="Select county"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item name="city" label="City">
                        <Input placeholder="Enter city" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="poBox" label="P.O. Box">
                        <Input placeholder="Enter P.O. Box" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item name="zipCode" label="Zip Code">
                        <Input placeholder="Enter zip code" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              {currentPage === 2 && (
                <>
                  <Divider orientation="left">
                    <FileTextOutlined /> Personal Information
                  </Divider>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="division"
                        label="Division *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <Input placeholder="Enter division" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="position"
                        label="Position *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <Input placeholder="Enter position" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="dutyType" label="Duty Type">
                        <Input placeholder="Enter duty type" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="hireDate"
                        label="Hire Date *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="originalHireDate"
                        label="Original Hire Date"
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="terminationDate"
                        label="Termination Date"
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="terminationReason"
                        label="Termination Reason"
                      >
                        <Input placeholder="Enter termination reason" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="voluntaryTermination"
                        label="Voluntary Termination"
                      >
                        <Input placeholder="Enter voluntary termination" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="reHireDate" label="Re Hire Date">
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="rateType" label="Rate Type">
                        <Input placeholder="Enter rate type" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="rate"
                        label="Rate *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <Input placeholder="Enter rate" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="payFrequency"
                        label="Pay Frequency *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <Input placeholder="Enter pay frequency" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="payFrequencyText"
                        label="Pay Frequency Text"
                      >
                        <Input placeholder="Enter pay frequency text" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="hourlyRate2" label="Hourly rate2">
                        <Input placeholder="Enter hourly rate2" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="overtimeHourlyRate"
                        label="Overtime Hourly Rate"
                      >
                        <Input placeholder="Enter overtime hourly rate" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="bankName" label="Bank Name">
                        <Input placeholder="Enter bank name" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="bankAccountNo"
                        label="Bank Account No. *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <Input placeholder="Enter bank account no." />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="bankBranch" label="Bank Branch">
                        <Input placeholder="Enter bank branch" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider orientation="left">
                    <FileTextOutlined /> Biographical Info
                  </Divider>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="gender"
                        label="Gender *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <Select placeholder="Select gender">
                          <Option value="male">Male</Option>
                          <Option value="female">Female</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="maritalStatus" label="Marital Status">
                        <Input placeholder="Enter marital status" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="ethnicGroup" label="Ethnic Group">
                        <Input placeholder="Enter ethnic group" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="identityCardNo"
                        label="Identity Card (ID) No."
                      >
                        <Input placeholder="Enter identity card no." />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="kraPinNo" label="KRA PIN No.">
                        <Input placeholder="Enter KRA PIN no." />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="hudumaNo" label="Huduma No.">
                        <Input placeholder="Enter huduma no." />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="nssfNo" label="NSSF No.">
                        <Input placeholder="Enter NSSF no." />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="shifNo" label="SHIF No.">
                        <Input placeholder="Enter SHIF no." />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="citizenship" label="Citizenship">
                        <Input placeholder="Enter citizenship" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              {currentPage === 3 && (
                <>
                  <Divider orientation="left">
                    <FileTextOutlined /> Benefit
                  </Divider>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="benefitClassCode"
                        label="Benefit Class code"
                      >
                        <Input placeholder="Enter benefit class code" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="benefitDescription"
                        label="Benefit Description"
                      >
                        <Input placeholder="Enter benefit description" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="benefitAccrualDate"
                        label="Benefit Accrual Date"
                      >
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="benefitStatus" label="Benefit Status">
                        <Input placeholder="Enter benefit status" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider orientation="left">
                    <FileTextOutlined /> Supervisor
                  </Divider>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="supervisorName" label="Supervisor Name">
                        <Input placeholder="Enter supervisor name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="isSupervisor" label="Is Supervisor">
                        <Switch />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="supervisorReport"
                        label="Supervisor Report"
                      >
                        <Input placeholder="Enter supervisor report" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              {currentPage === 4 && (
                <>
                  <Divider orientation="left">
                    <FileTextOutlined /> Additional Address
                  </Divider>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="homePhone"
                        label="Home Phone *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <Input placeholder="Enter home phone" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="cellPhone"
                        label="Cell Phone *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <Input placeholder="Enter cell phone" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="homeEmail" label="Home Email">
                        <Input placeholder="Enter home email" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="businessPhone" label="Business Phone">
                        <Input placeholder="Enter business phone" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="businessEmail" label="Business Email">
                        <Input placeholder="Enter business email" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              {currentPage === 5 && (
                <>
                  <Divider orientation="left">
                    <ContactsOutlined /> Emergency Contact
                  </Divider>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="emergencyContact"
                        label="Emergency Contact *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <Input placeholder="Enter emergency contact" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="emergencyHomePhone"
                        label="Emergency Home Phone *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <Input placeholder="Enter emergency home phone" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="emergencyWorkPhone"
                        label="Emergency Work Phone *"
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
                      >
                        <Input placeholder="Enter emergency work phone" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="emergencyContactRelation"
                        label="Emergency Contact Relation"
                      >
                        <Input placeholder="Enter emergency contact relation" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              {currentPage === 6 && (
                <>
                  <Divider orientation="left">
                    <UploadOutlined /> Document Uploads
                  </Divider>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="resume" label="Resume">
                        <Upload
                          beforeUpload={() => false}
                          accept=".pdf,.doc,.docx"
                          maxCount={1}
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="offerLetter" label="Offer Letter">
                        <Upload
                          beforeUpload={() => false}
                          accept=".pdf,.doc,.docx"
                          maxCount={1}
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider orientation="left">
                    <FileImageOutlined /> Employee Photo
                  </Divider>
                  <Form.Item name="employeePhoto" label="Upload Employee Photo">
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleUpload}
                      beforeUpload={() => false}
                      maxCount={1}
                      accept="image/*"
                    >
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                  </Form.Item>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="passportPhoto" label="Passport photo">
                        <Upload
                          beforeUpload={() => false}
                          accept="image/*"
                          maxCount={1}
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="copyNationalID"
                        label="Copy National ID | Passport"
                      >
                        <Upload
                          beforeUpload={() => false}
                          accept="image/*,.pdf"
                          maxCount={1}
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="copyKraPin" label="Copy of KRA Pin">
                        <Upload
                          beforeUpload={() => false}
                          accept="image/*,.pdf"
                          maxCount={1}
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="policeClearanceCertificate"
                        label="Police Clearance Certificate"
                      >
                        <Upload
                          beforeUpload={() => false}
                          accept=".pdf,.doc,.docx"
                          maxCount={1}
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="taxComplianceCertificate"
                        label="Tax Compliance Certificate (TCC) from KRA"
                      >
                        <Upload
                          beforeUpload={() => false}
                          accept=".pdf,.doc,.docx"
                          maxCount={1}
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="helbCertificate"
                        label="Higher Education Loans Board (HELB) Certificate"
                      >
                        <Upload
                          beforeUpload={() => false}
                          accept=".pdf,.doc,.docx"
                          maxCount={1}
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="crbClearanceCertificate"
                        label="Credit Reference Bureau (CRB) clearance certificate"
                      >
                        <Upload
                          beforeUpload={() => false}
                          accept=".pdf,.doc,.docx"
                          maxCount={1}
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              <Form.Item>
                <Space className="flex justify-between w-full">
                  {currentPage > 1 && (
                    <Tooltip title="Previous Page">
                      <Button
                        icon={<LeftOutlined />}
                        onClick={prevPage}
                        className="bg-gray-300 text-black hover:bg-gray-400 rounded-lg px-4 py-2"
                      >
                        Previous
                      </Button>
                    </Tooltip>
                  )}
                  {currentPage < steps.length ? (
                    <Tooltip title="Next Page">
                      <Button
                        type="primary"
                        onClick={nextPage}
                        icon={<RightOutlined />}
                        className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2"
                      >
                        Next
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Save Employee">
                      <Button
                        type="primary"
                        onClick={showModal}
                        icon={<SaveOutlined />}
                        className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2"
                        disabled={isSubmitting}
                      >
                        Save Employee
                      </Button>
                    </Tooltip>
                  )}
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Content>
        <Footer />
      </Layout>

      <Modal
        title="Confirm Submission"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
      >
        <p>Are you sure you want to submit the employee details?</p>
      </Modal>
    </div>
  );
};

export default Add_New_Employee;