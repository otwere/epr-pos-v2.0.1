// RaiseCreditNote.jsx
"use client";
import React from "react";
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Select,
} from "antd";

const { Option } = Select;

const RaiseCreditNote = ({ onClose, onSave }) => {
  const [form] = Form.useForm();

  const generateSerialNo = (existingData) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const lastSequence = Math.max(
      0,
      ...existingData.map((item) =>
        parseInt(item.serialNo?.split("-")[1] || "0")
      )
    );
    const newSequence = String(lastSequence + 1).padStart(3, "0");
    return `${year}${month}-${newSequence}`;
  };

  const validateDate = (date) => {
    const now = new Date();
    const selectedDate = new Date(date);
    const pastDateLimit = new Date();
    pastDateLimit.setDate(now.getDate() - 7);

    if (selectedDate > now) {
      return Promise.reject(new Error("Date cannot be in the future!"));
    }
    if (selectedDate < pastDateLimit) {
      return Promise.reject(new Error("Date cannot be more than 7 days in the past!"));
    }
    return Promise.resolve();
  };

  const validateAmount = (amount, salesPrice) => {
    if (amount <= 0) {
      return Promise.reject(new Error("Amount must be greater than 0!"));
    }
    if (amount > salesPrice) {
      return Promise.reject(new Error("Amount cannot be more than the sales price!"));
    }
    return Promise.resolve();
  };

  const handleFormSubmit = (values) => {
    const newNote = {
      ...values,
      key: Date.now(),
      serialNo: generateSerialNo(JSON.parse(localStorage.getItem("salesData")) || []),
    };
    onSave(newNote);
    form.resetFields();
    if (onClose) onClose();
  };

  return (
    <Card className="rounded-sm p-0">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          totalAmount: 0,
          customerName: "Walk-in-Customer",
        }}
        className="space-y-4"
      >
        <div className="flex flex-wrap gap-4">
          <Form.Item
            label="Credit Note Date"
            name="creditNoteDate"
            rules={[
              { required: true, message: "Please select the credit note date!" },
              { validator: (_, value) => validateDate(value) },
            ]}
            className="flex-1"
          >
            <DatePicker className="w-full" disabledDate={(current) => current && current > new Date()} />
          </Form.Item>

          <Form.Item
            label="Invoice No."
            name="invoiceNo"
            rules={[
              { required: true, message: "Please enter the invoice number!" },
            ]}
            className="flex-1"
          >
            <Select placeholder="Select Invoice No.">
              {["INV001", "INV002", "INV003"].map((invoice) => (
                <Option key={invoice} value={invoice}>
                  {invoice}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label="Customer Name"
          name="customerName"
          rules={[{ required: true, message: "Please select a customer!" }]}
        >
          <Select
            showSearch
            placeholder="Select a Customer"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {["Walk-in-Customer", "Customer A", "Customer B"].map((customer) => (
              <Option key={customer} value={customer}>
                {customer}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Total Amount"
          name="totalAmount"
          rules={[
            { required: true, message: "Please enter the total amount!" },
            { validator: (_, value) => validateAmount(value, 1000) }, // Replace 1000 with the actual sales price
          ]}
        >
          <InputNumber
            className="w-full"
            min={0}
            placeholder="Enter Total Amount"
            formatter={(value) =>
              `KES ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/KES\s?|,/g, "")}
          />
        </Form.Item>

        <div className="flex flex-wrap gap-4">
          <Form.Item
            label="Created By"
            name="createdBy"
            rules={[{ required: true, message: "Please enter the creator's name!" }]}
            className="flex-1"
          >
            <Select placeholder="Select Creator's Name">
              {["User1", "User2", "User3"].map((user) => (
                <Option key={user} value={user}>
                  {user}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Branch"
            name="branch"
            rules={[{ required: true, message: "Please enter the branch!" }]}
            className="flex-1"
          >
            <Select placeholder="Select Branch">
              {["Branch1", "Branch2", "Branch3"].map((branch) => (
                <Option key={branch} value={branch}>
                  {branch}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="flex justify-end gap-4">
          <Button onClick={onClose} type="default">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Save Credit Note
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default RaiseCreditNote;
