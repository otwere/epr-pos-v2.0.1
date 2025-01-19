import React from "react";
import { Form, Input, DatePicker, Select, Button, Row, Col } from "antd";

const { Option } = Select;

const MakePaymentForm = () => (
  <Form layout="vertical">
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Date:"
          name="date"
          rules={[{ required: true, message: "Please select the date" }]}
        >
          <DatePicker format="DD-MMM-YYYY" style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Paying Account:"
          name="payingAccount"
          rules={[
            { required: true, message: "Please select the paying account" },
          ]}
        >
          <Select placeholder="Select paying account">         
            <Option value="Cash">Cash</Option>
            <Option value="Mpesa">Mpesa</Option>
            <Option value="Bank Transfer">Bank Transfer</Option>
            <Option value="Cheque">Cheque</Option>
            <Option value="Credit | Debit Cards | PDQ">
              Credit | Debit Cards | PDQ
            </Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Account To Pay:"
          name="accountToPay"
          rules={[
            { required: true, message: "Please select the account to pay" },
          ]}
        >
          <Select placeholder="Select account to pay">           
            <Option value="supplier 1">Supplier 1</Option>
            <Option value="supplier 2">Supplier 2</Option>
            <Option value="supplier 3">Supplier 3</Option>
            <Option value="supplier 4">Supplier 4</Option>            
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Outstanding Balance:" name="outstandingBalance">
          <Input readOnly />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Amount:"
          name="amount"
          rules={[{ required: true, message: "Please enter the amount" }]}
        >
          <Input type="number" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Narrative:" name="narrative">
          <Input.TextArea />
        </Form.Item>
      </Col>
    </Row>
    <div className="text-right">
      <Button type="primary" htmlType="submit">
        Submit Supplier Payment
      </Button>
    </div>
  </Form>
);

export default MakePaymentForm;
