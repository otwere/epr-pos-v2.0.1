import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, Row, Col, message } from "antd";
import axios from "axios";

const { Option } = Select;

const ReceivePaymentForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [outstandingBalance, setOutstandingBalance] = useState(0);

  useEffect(() => {
    // Fetch accounts from the backend
    axios.get("/api/accounts")
      .then(response => {
        setAccounts(response.data);
      })
      .catch(error => {
        console.error("Error fetching accounts:", error);
      });
  }, []);

  const handleAccountChange = (value) => {
    // Fetch outstanding balance for the selected account
    axios.get(`/api/accounts/${value}/balance`)
      .then(response => {
        setOutstandingBalance(response.data.balance);
      })
      .catch(error => {
        console.error("Error fetching outstanding balance:", error);
      });
  };

  const onFinish = (values) => {
    setLoading(true);
    axios.post("/api/payments/receive", values)
      .then(response => {
        message.success("Payment received successfully!");
        form.resetFields();
      })
      .catch(error => {
        message.error("Failed to receive payment. Please try again.");
        console.error("Error receiving payment:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Date:" name="date" rules={[{ required: true, message: "Please select the date" }]}>
            <DatePicker format="DD-MMM-YYYY" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Received From:" name="receivedFrom" rules={[{ required: true, message: "Please enter received from" }]}>
            <Select placeholder="Select Client">
              <Option value="client 1">Client 1</Option>
              <Option value="client 2">Client 2</Option>
              <Option value="client 3">Client 3</Option>              
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Receiving Account:" name="receivingAccount" rules={[{ required: true, message: "Please select the receiving account" }]}>
            <Select placeholder="Select receiving account" onChange={handleAccountChange}>
              <Option value="Cash">Cash</Option>
              <Option value="Mpesa">Mpesa</Option>
              <Option value="Bank Transfer">Bank Transfer</Option>
              <Option value="Credit | Debit Cards (PDQ)">Credit | Debit Cards ( PDQ )</Option>
              <Option value="Cheque">Cheque</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Outstanding Balance:">
            <Input value={outstandingBalance} readOnly />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Amount:" name="amount" rules={[{ required: true, message: "Please enter the amount" }]}>
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Currency:" name="currency" rules={[{ required: true, message: "Please select the currency" }]}>
            <Select placeholder="Select currency">
              <Option value="USD">USD</Option>
              <Option value="KES">KES</Option>
              <Option value="EUR">EUR</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        
        <Col span={12}>
          <Form.Item label="Narrative:" name="narrative">
            <Input.TextArea />
          </Form.Item>
        </Col>
      </Row>
      <div className="text-right">
      <Button type="primary" htmlType="submit" loading={loading}>
        Received Payment
      </Button>
      </div>
    </Form>
  );
};

export default ReceivePaymentForm;