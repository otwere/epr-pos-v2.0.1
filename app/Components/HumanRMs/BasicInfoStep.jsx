import React from "react";
import { Form, Input, Row, Col, Divider, AutoComplete } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const BasicInfoStep = ({ form, filteredCounties, searchTerm, setSearchTerm }) => (
  <>
    <Divider orientation="left">
      <InfoCircleOutlined /> Basic Information
    </Divider>
    <Row gutter={24}>
      <Col xs={24} md={8}>
        <Form.Item
          name="firstName"
          label="First Name *"
          rules={[{ required: true, message: "This field is required" }]}
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
          rules={[{ required: true, message: "This field is required" }]}
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
        <Form.Item name="alternativePhone" label="Alternative Phone">
          <Input placeholder="Enter alternative phone number" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name="county"
          label="County"
          rules={[{ required: true, message: "This field is required" }]}
        >
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
);

export default BasicInfoStep;