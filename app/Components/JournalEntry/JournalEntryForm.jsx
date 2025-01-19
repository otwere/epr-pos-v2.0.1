import React, { useState } from "react";
import { Form, Input, Select, DatePicker, InputNumber, Button, Card, Typography, message } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

const JournalEntryForm = ({
  isFormOpen,
  setIsFormOpen,
  accounts,
  setAccounts,
  nextJournalEntryNumber,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (values) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      message.error({
        content: "An error occurred while adding the entry",
        duration: 3,
        className: 'z-50'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDate = (current) => current && current > dayjs().endOf("day");

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-40">
      <Card className="w-1/2 max-w-3xl shadow-lg">
        <Title level={4} className="mb-4">Add New Journal Entry</Title>
        <hr className="mb-4" />
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSave}
          className="relative"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="transactionDate"
              label="Transaction Date"
              rules={[{ required: true, message: "Please select a transaction date" }]}
            >
              <DatePicker className="w-full" disabledDate={disabledDate} />
            </Form.Item>
            <Form.Item
              name="creditAccount"
              label="Credit Account"
              rules={[{ required: true, message: "Please select a credit account" }]}
            >
              <Select placeholder="Select credit account" className="w-full">
                {accounts.map((account) => (
                  <Option key={account} value={account}>
                    {account}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="debitAccount"
              label="Debit Account"
              rules={[{ required: true, message: "Please select a debit account" }]}
            >
              <Select placeholder="Select debit account" className="w-full">
                {accounts.map((account) => (
                  <Option key={account} value={account}>
                    {account}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="amount"
              label="Amount"
              rules={[
                { required: true, message: "Please enter an amount" },
                { type: 'number', min: 0, message: "Amount must be a positive number" }
              ]}
            >
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item
              name="narration"
              label="Narration"
              rules={[{ required: true, message: "Please enter a narration" }]}
              className="col-span-2"
            >
              <Input.TextArea placeholder="Description" className="w-full" />
            </Form.Item>
          </div>
          <div className="flex justify-end space-x-4">
            <Button 
              onClick={() => setIsFormOpen(false)} 
              disabled={isSubmitting}
              className="hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isSubmitting}
              className="hover:opacity-90"
            >
              Submit
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default JournalEntryForm;

