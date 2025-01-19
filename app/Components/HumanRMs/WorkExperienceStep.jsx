import React from "react";
import { Form, Input, DatePicker, Button, Row, Col, Divider } from "antd";
import { FileDoneOutlined } from "@ant-design/icons";

const WorkExperienceStep = ({ experienceFields, handleExperienceChange, removeExperienceField, addExperienceField }) => (
  <>
    <Divider orientation="left">
    <FileDoneOutlined /> Work Experience
    </Divider>
    {experienceFields.map((field, index) => (
      <div key={index}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Job Title" required>
              <Input
                value={field.jobTitle}
                onChange={(e) => handleExperienceChange(index, "jobTitle", e.target.value)}
                placeholder="Enter job title"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Company Name" required>
              <Input
                value={field.companyName}
                onChange={(e) => handleExperienceChange(index, "companyName", e.target.value)}
                placeholder="Enter company name"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Start Date" required>
              <DatePicker
                value={field.startDate}
                onChange={(date) => handleExperienceChange(index, "startDate", date)}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="End Date" required>
              <DatePicker
                value={field.endDate}
                onChange={(date) => handleExperienceChange(index, "endDate", date)}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={24}>
            <Form.Item label="Responsibilities" required>
              <Input.TextArea
                value={field.responsibilities}
                onChange={(e) => handleExperienceChange(index, "responsibilities", e.target.value)}
                placeholder="Describe your responsibilities"
                rows={4}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Referrer Name">
              <Input
                value={field.referrerName}
                onChange={(e) => handleExperienceChange(index, "referrerName", e.target.value)}
                placeholder="Enter referrer's name"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Referrer Contact">
              <Input
                value={field.referrerContact}
                onChange={(e) => handleExperienceChange(index, "referrerContact", e.target.value)}
                placeholder="Enter referrer's contact"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Button
              type="danger"
              onClick={() => removeExperienceField(index)}
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
      onClick={addExperienceField}
      className="w-full mb-4"
    >
      Add Work Experience
    </Button>
  </>
);

export default WorkExperienceStep;