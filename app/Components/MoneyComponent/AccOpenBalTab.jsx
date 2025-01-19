// components/AccOpenBalTab.jsx
import React, { useState } from "react";
import { Button, Form, DatePicker, Select, Input, Row, Col } from "antd";
import AccOpenBalTable from "../MoneyComponent/AccOpenBalTable";
import moment from "moment";

const { Option } = Select;

const AccOpenBalTab = () => {
  const [showAccOpenBalForm, setShowAccOpenBalForm] = useState(false);
  const [form] = Form.useForm();
  const [accOpenBalData, setAccOpenBalData] = useState([]);

  const handleAccOpenBalSubmit = (values) => {
    const newEntry = {
      id: accOpenBalData.length + 1,
      createdDate: values.date.format("DD-MMM-YYYY"),
      accountName: values.account,
      postedBy: "Admin", // Replace with actual user
      branch: "Main Branch", // Replace with actual branch
      amount: values.openingBalance,
    };
    setAccOpenBalData([...accOpenBalData, newEntry]);
    form.resetFields();
  };

  const disableFutureDates = (current) => {
    return current && current > moment().endOf('day');
  };

  return (
    <>
      <div className="text-right">
        <Button
          type="primary"
          onClick={() => setShowAccOpenBalForm(!showAccOpenBalForm)}
          style={{ marginBottom: 16 }}
        >
          {showAccOpenBalForm ? "Close Form" : "Open Account Balance Form"}
        </Button>
      </div>
      {showAccOpenBalForm && (
        <Form form={form} layout="vertical" onFinish={handleAccOpenBalSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Date:"
                name="date"
                rules={[{ required: true, message: "Please select the date" }]}
              >
                <DatePicker format="DD-MMM-YYYY" style={{ width: "100%" }} disabledDate={disableFutureDates} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Account:"
                name="account"
                rules={[
                  { required: true, message: "Please select the account" },
                ]}
              >
                <Select placeholder="Select account">
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
                label="Opening Balance:"
                name="openingBalance"
                rules={[
                  {
                    required: true,
                    message: "Please enter the opening balance",
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <div className="text-right">
            <Button type="primary" htmlType="submit">
              Submit Opening Balance
            </Button>
          </div>
        </Form>
      )}
      <hr className="mt-4" />
      <AccOpenBalTable accOpenBalData={accOpenBalData} />
    </>
  );
};

export default AccOpenBalTab;
