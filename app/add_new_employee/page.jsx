"use client";
import React, { useState, useCallback, useRef } from "react";
import {
  Form,
  Card,
  Steps,
  Progress,
  Modal,
  Layout,
  message,
  Breadcrumb,
  Divider,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  ContactsOutlined,
  FileTextOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import BasicInfoStep from "../Components/HumanRMs/BasicInfoStep";
import PersonalInformationStep from "../Components/HumanRMs/PersonalInformationStep";
import BenefitSupervisorStep from "../Components/HumanRMs/BenefitSupervisorStep";
import WorkExperienceStep from "../Components/HumanRMs/WorkExperienceStep";
import AcademicQualificationStep from "../Components/HumanRMs/AcademicQualificationStep";
import EmergencyContactStep from "../Components/HumanRMs/EmergencyContactStep";
import DocumentUploads from "../Components/HumanRMs/DocumentUploads";
import FormNavigation from "../Components/HumanRms/FormNavigation";

const { Content } = Layout;

const counties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
  "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu",
  "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa",
  "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi",
  "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
];

const steps = [
  { title: "Basic Info", icon: <InfoCircleOutlined /> },
  { title: "Personal Info", icon: <FileTextOutlined /> },
  { title: "Supervisor", icon: <FileTextOutlined /> },
  { title: "Job Experience", icon: <FileDoneOutlined /> },
  { title: "Academics", icon: <FileTextOutlined /> },
  { title: "Strait Contact", icon: <ContactsOutlined /> },
  { title: "Document Uploads", icon: <UploadOutlined /> },
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

  const [educationFields, setEducationFields] = useState([
    {
      level: "university",
      institution: "",
      startDate: null,
      endDate: null,
      certificateNo: "",
      examBody: "",
      grade: "",
    },
  ]);

  const [experienceFields, setExperienceFields] = useState([
    {
      jobTitle: "",
      companyName: "",
      startDate: null,
      endDate: null,
      responsibilities: "",
      referrerName: "",
      referrerContact: "",
    },
  ]);

  const filteredCounties = counties.filter((county) =>
    county.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCollapsed = useCallback(() => setCollapsed((prev) => !prev), []);

  const handleUpload = useCallback(
    ({ fileList: newFileList }) => setFileList(newFileList),
    []
  );

  const handleReset = useCallback(() => {
    formRef.current.resetFields();
    setFileList([]);
  }, []);

  const nextPage = () =>
    form
      .validateFields()
      .then(() => setCurrentPage((prev) => prev + 1))
      .catch((errorInfo) => console.log("Validation Failed:", errorInfo));

  const prevPage = () => setCurrentPage((prev) => prev - 1);

  const showModal = () => setIsModalOpen(true);

  const handleOk = () => {
    setIsModalOpen(false);
    onFinish(form.getFieldsValue());
  };

  const handleCancel = () => setIsModalOpen(false);

  const onFinish = useCallback(
    (values) => {
      setIsSubmitting(true);
      const submissionData = {
        ...values,
        employeePhoto: fileList.length > 0 ? fileList[0].originFileObj : null,
        educationFields,
        experienceFields,
      };
      setTimeout(() => {
        console.log("Submission Data:", submissionData);
        messageApi.open({
          type: 'success',
          content: 'Employee added successfully!',
          duration: 3, // Duration in seconds
        });
        setConfirmLoading(false);
        handleReset();
        setIsSubmitting(false);
      }, 500);
    },
    [fileList, messageApi, handleReset, educationFields, experienceFields]
  );

  const addEducationField = () =>
    setEducationFields([
      ...educationFields,
      {
        level: "university",
        institution: "",
        startDate: null,
        endDate: null,
        certificateNo: "",
        examBody: "",
        grade: "",
      },
    ]);

  const removeEducationField = (index) =>
    setEducationFields(educationFields.filter((_, i) => i !== index));

  const handleEducationChange = (index, field, value) => {
    const newFields = [...educationFields];
    newFields[index][field] = value;
    setEducationFields(newFields);
  };

  const addExperienceField = () =>
    setExperienceFields([
      ...experienceFields,
      {
        jobTitle: "",
        companyName: "",
        startDate: null,
        endDate: null,
        responsibilities: "",
        referrerName: "",
        referrerContact: "",
      },
    ]);

  const removeExperienceField = (index) =>
    setExperienceFields(experienceFields.filter((_, i) => i !== index));

  const handleExperienceChange = (index, field, value) => {
    const newFields = [...experienceFields];
    newFields[index][field] = value;
    setExperienceFields(newFields);
  };

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
            className="mb-4 mt-[-1rem]"
          />
          <hr className="mb-2" />

          <div className="p-3 border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-600">
                *Register New Employee
              </h1>
              <p className="text-sm text-gray-500 text-right">
                All fields marked * are required
              </p>
            </div>
          </div>
          <hr className="mb-4" />

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
            <Progress
              percent={(currentPage / steps.length) * 100}
              showInfo={false}
            />
            <Form
              ref={formRef}
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              {currentPage === 1 && (
                <BasicInfoStep
                  form={form}
                  filteredCounties={filteredCounties}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              )}
              {currentPage === 2 && <PersonalInformationStep form={form} />}
              {currentPage === 3 && <BenefitSupervisorStep form={form} />}
              {currentPage === 4 && (
                <WorkExperienceStep
                  experienceFields={experienceFields}
                  handleExperienceChange={handleExperienceChange}
                  removeExperienceField={removeExperienceField}
                  addExperienceField={addExperienceField}
                />
              )}
              {currentPage === 5 && (
                <AcademicQualificationStep
                  educationFields={educationFields}
                  handleEducationChange={handleEducationChange}
                  removeEducationField={removeEducationField}
                  addEducationField={addEducationField}
                />
              )}
              {currentPage === 6 && <EmergencyContactStep form={form} />}
              {currentPage === 7 && (
                <DocumentUploads
                  fileList={fileList}
                  handleUpload={handleUpload}
                />
              )}

              <Form.Item>
                <FormNavigation
                  currentPage={currentPage}
                  steps={steps}
                  prevPage={prevPage}
                  nextPage={nextPage}
                  showModal={showModal}
                  isSubmitting={isSubmitting}
                />
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