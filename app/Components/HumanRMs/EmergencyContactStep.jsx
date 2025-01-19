import React from "react";
import { Button,Form, Input, Row, Col, Divider, Select } from "antd";
import { ContactsOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const EmergencyContactStep = ({ form }) => {
  const phoneNumberValidator = (_, value) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    if (!value || phoneRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please enter a valid phone number"));
  };

  return (
    <>
      <Divider orientation="left">
        <ContactsOutlined /> Emergency Contact
      </Divider>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="emergencyContactPerson"
            label="Contact Person Names *"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input placeholder="Enter emergency contact person names" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="emergencyContactPhone"
            label="Emergency Contact Phone *"
            rules={[
              { required: true, message: "This field is required" },
              { validator: phoneNumberValidator },
            ]}
          >
            <Input placeholder="Enter emergency contact phone" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="emergencyContactRelation"
            label="Emergency Contact Relationship"
          >
            <Select placeholder="Select emergency contact relation">
              <Option value="parent">Parent</Option>
              <Option value="sibling">Sibling</Option>
              <Option value="spouse">Spouse</Option>
              <Option value="friend">Friend</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.List name="additionalContacts">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row gutter={16} key={key}>
                <Col xs={24} md={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "contactPerson"]}
                    label="Contact Person Names *"
                    rules={[{ required: true, message: "This field is required" }]}
                  >
                    <Input placeholder="Enter emergency contact person names" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "contactPhone"]}
                    label="Emergency Contact Phone *"
                    rules={[
                      { required: true, message: "This field is required" },
                      { validator: phoneNumberValidator },
                    ]}
                  >
                    <Input placeholder="Enter emergency contact phone" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    {...restField}
                    name={[name, "contactRelation"]}
                    label="Emergency Contact Relationship"
                  >
                    <Select placeholder="Select emergency contact relation">
                      <Option value="parent">Parent</Option>
                      <Option value="sibling">Sibling</Option>
                      <Option value="spouse">Spouse</Option>
                      <Option value="friend">Friend</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={2}>
                  <button
                    type="button"
                    onClick={() => remove(name)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Remove
                  </button>
                </Col>
              </Row>
            ))}
            {fields.length < 1 && (
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Another Contact
                </Button>
              </Form.Item>
            )}
          </>
        )}
      </Form.List>
    </>
  );
};

export default EmergencyContactStep;