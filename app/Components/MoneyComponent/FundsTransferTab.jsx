// components/FundsTransferTab.jsx
import React, { useState } from "react";
import { Button, Form, DatePicker, Select, Input, Row, Col } from "antd";
import FundsTransferTable from "../MoneyComponent/FundsTransferTable";

const { Option } = Select;

const FundsTransferTab = () => {
  const [showFundsTransferForm, setShowFundsTransferForm] = useState(false);
  const [form] = Form.useForm();
  const [fundsTransferData, setFundsTransferData] = useState([]);

  const handleFundsTransferSubmit = (values) => {
    const newEntry = {
      id: fundsTransferData.length + 1,
      transferDate: values.transferDate.format("DD-MMM-YYYY"),
      accountName: values.fromAccount,
      postedBy: "User", // Replace with actual user
      branch: "Main Branch", // Replace with actual branch
      description: "Funds Transfer", // Replace with actual description
      in: values.amount,
      out: 0,
    };
    setFundsTransferData([...fundsTransferData, newEntry]);
    form.resetFields();
  };

  return (
    <>
      <div className="text-right">
        <Button
          type="primary"
          onClick={() => setShowFundsTransferForm(!showFundsTransferForm)}
          style={{ marginBottom: 16 }}
        >
          {showFundsTransferForm ? "Close Form" : "Initiate Funds Transfer"}
        </Button>
      </div>
      {showFundsTransferForm && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFundsTransferSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Transfer Date:"
                name="transferDate"
                rules={[
                  {
                    required: true,
                    message: "Please select the transfer date",
                  },
                ]}
              >
                <DatePicker format="DD-MMM-YYYY" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="From Account:"
                name="fromAccount"
                rules={[
                  { required: true, message: "Please select the from account" },
                ]}
              >
                <Select placeholder="Select from account">
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
                label="To Account:"
                name="toAccount"
                rules={[
                  { required: true, message: "Please select the to account" },
                ]}
              >
                <Select placeholder="Select to account">
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
            <Col span={12}>
              <Form.Item
                label="Amount:"
                name="amount"
                rules={[{ required: true, message: "Please enter the amount" }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Narration:" name="narration">
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>
          <div className="text-right">
            <Button type="primary" htmlType="submit">
              Submit Transfer of Funds
            </Button>
          </div>
        </Form>
      )}
      <hr className="mt-4" />
      <FundsTransferTable fundsTransferData={fundsTransferData} />
    </>
  );
};

export default FundsTransferTab;
