import React from "react";
import { Form, Input, DatePicker, Select, Button, Row, Col, Divider, Tooltip } from "antd";
import { FileTextOutlined, InfoCircleOutlined } from "@ant-design/icons";

const educationLevels = [
  { label: "University", value: "university" },
  { label: "College", value: "college" },
  { label: "Secondary", value: "secondary" },
];

const AcademicQualificationStep = ({ educationFields, handleEducationChange, removeEducationField, addEducationField }) => (
  <Form
    initialValues={{
      educationFields: educationFields.map(field => ({
        level: field.level,
        institution: field.institution,
        specialization: field.specialization,
        startDate: field.startDate,
        endDate: field.endDate,
        certificateNo: field.certificateNo,
        examBody: field.examBody,
        grade: field.grade,
      }))
    }}
    layout="vertical"
  >
    <Divider orientation="left">
      <FileTextOutlined /> Education | Academics Qualification
    </Divider>
    {educationFields.map((field, index) => (
      <div key={index}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item 
              label="Level of Education" 
              name={['educationFields', index, 'level']} 
              rules={[{ required: true, message: 'Please select the level of education' }]}
            >
              <Select
                value={field.level}
                onChange={(value) => handleEducationChange(index, "level", value)}
                placeholder="Select level of education"
              >
                {educationLevels.map((level) => (
                  <Select.Option key={level.value} value={level.value}>
                    {level.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item 
              label="Name of Institution" 
              name={['educationFields', index, 'institution']} 
              rules={[{ required: true, message: 'Please enter the name of institution' }]}
            >
              <Input
                value={field.institution}
                onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                placeholder="Enter name of institution"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item 
              label="Course or Area of Specialization" 
              name={['educationFields', index, 'specialization']} 
              rules={[{ required: true, message: 'Please enter the course or area of specialization' }]}
            >
              <Input
                value={field.specialization}
                onChange={(e) => handleEducationChange(index, "specialization", e.target.value)}
                placeholder="Enter course or area of specialization"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item 
              label="Start Date" 
              name={['educationFields', index, 'startDate']} 
              rules={[{ required: true, message: 'Please select the start date' }]}
            >
              <DatePicker
                value={field.startDate}
                onChange={(date) => handleEducationChange(index, "startDate", date)}
                style={{ width: "100%" }}
                placeholder="Select start date"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item 
              label="End Date" 
              name={['educationFields', index, 'endDate']} 
              rules={[{ required: true, message: 'Please select the end date' }]}
            >
              <DatePicker
                value={field.endDate}
                onChange={(date) => handleEducationChange(index, "endDate", date)}
                style={{ width: "100%" }}
                placeholder="Select end date"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item 
              label={
                <span>
                  Certificate Number{' '}
                  <Tooltip title="The number on your certificate">
                    <InfoCircleOutlined />
                  </Tooltip>
                </span>
              } 
              name={['educationFields', index, 'certificateNo']} 
              rules={[{ required: true, message: 'Please enter the certificate number' }]}
            >
              <Input
                value={field.certificateNo}
                onChange={(e) => handleEducationChange(index, "certificateNo", e.target.value)}
                placeholder="Enter certificate number"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item 
              label="Examination Body" 
              name={['educationFields', index, 'examBody']} 
              rules={[{ required: true, message: 'Please enter the examination body' }]}
            >
              <Input
                value={field.examBody}
                onChange={(e) => handleEducationChange(index, "examBody", e.target.value)}
                placeholder="Enter examination body"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item 
              label="Grade" 
              name={['educationFields', index, 'grade']} 
              rules={[{ required: true, message: 'Please enter the grade' }]}
            >
              <Input
                value={field.grade}
                onChange={(e) => handleEducationChange(index, "grade", e.target.value)}
                placeholder="Enter grade"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Button
              type="danger"
              onClick={() => removeEducationField(index)}
              className="mt-4 ml-auto block px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Remove
            </Button>
          </Col>
        </Row>
        <Divider />
      </div>
    ))}
    <Button
      type="dashed"
      onClick={addEducationField}
      className="w-full mb-4"
      icon={<FileTextOutlined />}
    >
      Add Education
    </Button>
  </Form>
);

export default AcademicQualificationStep;