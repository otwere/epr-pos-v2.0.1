import React, { useState } from "react";
import {
  Form,
  Upload,
  Button,
  Row,
  Col,
  Divider,
  Card,
  Typography,
  Steps,
  Space,
  message,
  Progress,
  Modal,
} from "antd";
import { UploadOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Step } = Steps;

const DocumentUploads = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileList, setFileList] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePreview = async (file) => {
    if (file.type.startsWith("image/")) {
      const src = file.url;
      const imgWindow = window.open(src);
      imgWindow.document.write(`<img src="${src}" alt="Preview" style="max-width: 100%;"/>`);
    } else {
      message.info("Preview not available for this file type.");
    }
  };

  const steps = [
    {
      title: "Personal Documents",
      content: (
        <>
          <Row gutter={[16, 24]}>
            <Col xs={24} md={12}>
              <Form.Item name="resume" label={<Text>Resume</Text>}>
                <Upload
                  fileList={fileList.resume || []}
                  beforeUpload={(file) => beforeUpload(file, "resume")}
                  onChange={(info) => handleFileUpload(info, "resume")}
                  onPreview={handlePreview}
                  accept=".pdf,.doc,.docx,image/*"
                  maxCount={1}
                  onRemove={() => handleRemove("resume")}
                >
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    className="bg-blue-500 text-white"
                  >
                    Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="offerLetter" label={<Text>Offer Letter</Text>}>
                <Upload
                  fileList={fileList.offerLetter || []}
                  beforeUpload={(file) => beforeUpload(file, "offerLetter")}
                  onChange={(info) => handleFileUpload(info, "offerLetter")}
                  onPreview={handlePreview}
                  accept=".pdf,.doc,.docx,image/*"
                  maxCount={1}
                  onRemove={() => handleRemove("offerLetter")}
                >
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    className="bg-blue-500 text-white"
                  >
                    Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 24]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="passportPhoto"
                label={<Text>Passport Photo</Text>}
              >
                <Upload
                  fileList={fileList.passportPhoto || []}
                  beforeUpload={(file) => beforeUpload(file, "passportPhoto")}
                  onChange={(info) => handleFileUpload(info, "passportPhoto")}
                  onPreview={handlePreview}
                  accept="image/*"
                  maxCount={1}
                  onRemove={() => handleRemove("passportPhoto")}
                >
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    className="bg-blue-500 text-white"
                  >
                    Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="copyNationalID"
                label={<Text>Copy National ID | Passport</Text>}
              >
                <Upload
                  fileList={fileList.copyNationalID || []}
                  beforeUpload={(file) => beforeUpload(file, "copyNationalID")}
                  onChange={(info) => handleFileUpload(info, "copyNationalID")}
                  onPreview={handlePreview}
                  accept="image/*,.pdf"
                  maxCount={1}
                  onRemove={() => handleRemove("copyNationalID")}
                >
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    className="bg-blue-500 text-white"
                  >
                    Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: "Legal & Compliance",
      content: (
        <>
          <Row gutter={[16, 24]}>
            <Col xs={24} md={12}>
              <Form.Item name="copyKraPin" label={<Text>Copy of KRA Pin</Text>}>
                <Upload
                  fileList={fileList.copyKraPin || []}
                  beforeUpload={(file) => beforeUpload(file, "copyKraPin")}
                  onChange={(info) => handleFileUpload(info, "copyKraPin")}
                  onPreview={handlePreview}
                  accept="image/*,.pdf"
                  maxCount={1}
                  onRemove={() => handleRemove("copyKraPin")}
                >
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    className="bg-blue-500 text-white"
                  >
                    Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="policeClearanceCertificate"
                label={<Text>Police Clearance Certificate</Text>}
              >
                <Upload
                  fileList={fileList.policeClearanceCertificate || []}
                  beforeUpload={(file) =>
                    beforeUpload(file, "policeClearanceCertificate")
                  }
                  onChange={(info) =>
                    handleFileUpload(info, "policeClearanceCertificate")
                  }
                  onPreview={handlePreview}
                  accept=".pdf,.doc,.docx"
                  maxCount={1}
                  onRemove={() => handleRemove("policeClearanceCertificate")}
                >
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    className="bg-blue-500 text-white"
                  >
                    Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 24]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="taxComplianceCertificate"
                label={<Text>Tax Compliance Certificate (TCC) from KRA</Text>}
              >
                <Upload
                  fileList={fileList.taxComplianceCertificate || []}
                  beforeUpload={(file) =>
                    beforeUpload(file, "taxComplianceCertificate")
                  }
                  onChange={(info) =>
                    handleFileUpload(info, "taxComplianceCertificate")
                  }
                  onPreview={handlePreview}
                  accept=".pdf,.doc,.docx"
                  maxCount={1}
                  onRemove={() => handleRemove("taxComplianceCertificate")}
                >
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    className="bg-blue-500 text-white"
                  >
                    Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="helbCertificate"
                label={
                  <Text>Higher Education Loans Board (HELB) Certificate</Text>
                }
              >
                <Upload
                  fileList={fileList.helbCertificate || []}
                  beforeUpload={(file) => beforeUpload(file, "helbCertificate")}
                  onChange={(info) => handleFileUpload(info, "helbCertificate")}
                  onPreview={handlePreview}
                  accept=".pdf,.doc,.docx"
                  maxCount={1}
                  onRemove={() => handleRemove("helbCertificate")}
                >
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    className="bg-blue-500 text-white"
                  >
                    Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: "Academic Certificates",
      content: (
        <>
          <Row gutter={[16, 24]}>
            <Col xs={24} md={12}>
              <Form.Item name="phdCertificate" label="PhD Certificate">
                <Upload
                  fileList={fileList.phdCertificate || []}
                  beforeUpload={(file) => beforeUpload(file, "phdCertificate")}
                  onChange={(info) => handleFileUpload(info, "phdCertificate")}
                  onPreview={handlePreview}
                  accept=".pdf,.doc,.docx"
                  maxCount={1}
                  onRemove={() => handleRemove("phdCertificate")}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="mastersCertificate"
                label="Master's Degree Certificate"
              >
                <Upload
                  fileList={fileList.mastersCertificate || []}
                  beforeUpload={(file) => beforeUpload(file, "mastersCertificate")}
                  onChange={(info) => handleFileUpload(info, "mastersCertificate")}
                  onPreview={handlePreview}
                  accept=".pdf,.doc,.docx"
                  maxCount={1}
                  onRemove={() => handleRemove("mastersCertificate")}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 24]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="bachelorsCertificate"
                label="Bachelor's Degree Certificate"
              >
                <Upload
                  fileList={fileList.bachelorsCertificate || []}
                  beforeUpload={(file) => beforeUpload(file, "bachelorsCertificate")}
                  onChange={(info) => handleFileUpload(info, "bachelorsCertificate")}
                  onPreview={handlePreview}
                  accept=".pdf,.doc,.docx"
                  maxCount={1}
                  onRemove={() => handleRemove("bachelorsCertificate")}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="diplomaCertificate" label="Diploma Certificate">
                <Upload
                  fileList={fileList.diplomaCertificate || []}
                  beforeUpload={(file) => beforeUpload(file, "diplomaCertificate")}
                  onChange={(info) => handleFileUpload(info, "diplomaCertificate")}
                  onPreview={handlePreview}
                  accept=".pdf,.doc,.docx"
                  maxCount={1}
                  onRemove={() => handleRemove("diplomaCertificate")}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 24]}>
            <Col xs={24} md={12}>
              <Form.Item name="certificate" label="Certificate">
                <Upload
                  fileList={fileList.certificate || []}
                  beforeUpload={(file) => beforeUpload(file, "certificate")}
                  onChange={(info) => handleFileUpload(info, "certificate")}
                  onPreview={handlePreview}
                  accept=".pdf,.doc,.docx"
                  maxCount={1}
                  onRemove={() => handleRemove("certificate")}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="kcseCertificate" label="KCSE Certificate">
                <Upload
                  fileList={fileList.kcseCertificate || []}
                  beforeUpload={(file) => beforeUpload(file, "kcseCertificate")}
                  onChange={(info) => handleFileUpload(info, "kcseCertificate")}
                  onPreview={handlePreview}
                  accept=".pdf,.doc,.docx"
                  maxCount={1}
                  onRemove={() => handleRemove("kcseCertificate")}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 24]}>
            <Col xs={24} md={12}>
              <Form.Item name="kcpeCertificate" label="KCPE/CPE Certificate">
                <Upload
                  fileList={fileList.kcpeCertificate || []}
                  beforeUpload={(file) => beforeUpload(file, "kcpeCertificate")}
                  onChange={(info) => handleFileUpload(info, "kcpeCertificate")}
                  onPreview={handlePreview}
                  accept=".pdf,.doc,.docx"
                  maxCount={1}
                  onRemove={() => handleRemove("kcpeCertificate")}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="cbcCertificate" label="CBC Certificate">
                <Upload
                  fileList={fileList.cbcCertificate || []}
                  beforeUpload={(file) => beforeUpload(file, "cbcCertificate")}
                  onChange={(info) => handleFileUpload(info, "cbcCertificate")}
                  onPreview={handlePreview}
                  accept=".pdf,.doc,.docx"
                  maxCount={1}
                  onRemove={() => handleRemove("cbcCertificate")}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const beforeUpload = (file, field) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    const isAllowedType = allowedTypes.includes(file.type);
    if (!isAllowedType) {
      message.error("You can only upload PDF, DOC, DOCX, JPEG, or PNG files!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("File must be smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleFileUpload = (info, field) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      setUploadProgress(info.file.percent);
      return;
    }
    if (info.file.status === "done") {
      setUploading(false);
      setUploadProgress(100);
      setFileList((prev) => ({
        ...prev,
        [field]: [info.file],
      }));
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      setUploading(false);
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleRemove = (field) => {
    setFileList((prev) => ({
      ...prev,
      [field]: [],
    }));
    message.success("File removed successfully");
  };

  const handleNext = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    setCurrentStep(currentStep + 1);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    setIsModalOpen(false);
    message.success("Documents submitted successfully!");
  };

  return (
    <Card bordered={false} className="p-1 mb-6 bg-gray-50">
      <Title level={4} style={{ marginBottom: 24 }}>
        <UploadOutlined /> Document Uploads
      </Title>
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        {steps.map((step, index) => (
          <Step
            key={index}
            title={step.title}
            icon={completedSteps.includes(index) ? <CheckCircleOutlined /> : null}
          />
        ))}
      </Steps>
      <div style={{ minHeight: 300 }}>
        {steps[currentStep]?.content || <div>No content available for this step.</div>}
      </div>
      {uploading && (
        <Progress percent={uploadProgress} status="active" style={{ marginTop: 16 }} />
      )}
      <Divider />
      <Space>
        {currentStep > 0 && (
          <div className="flex mr-auto">
          <Button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="bg-gray-500 text-white"
          >
            Previous
          </Button>
        </div>
        
        )}
        {currentStep < steps.length - 1 && (
          <div className="flex ml-auto">
            <Button
              type="primary"
              onClick={handleNext}
              className="bg-blue-500 text-white"
            >
              Next
            </Button>
          </div>
        )}
        {currentStep === steps.length - 1 && (
          <Button 
            type="primary"
            icon={<CheckCircleOutlined />}
            className="bg-green-500 text-white"
            onClick={showModal}
          >
            Submit Documents
          </Button>
        )}
      </Space>
      <Modal
        title="Confirm Submission"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>Are you sure you want to submit these documents?</p>
      </Modal>
    </Card>
  );
};

export default DocumentUploads;