import React from 'react';
import { Form, Input, Button } from 'antd';

const PaymentDetailsForm = ({ onSubmit, isLoading }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: '400px', margin: '0 auto' }}
    >
      <Form.Item
        name="cardNumber"
        label="Card Number"
        rules={[{ required: true, message: 'Please enter your card number' }]}
      >
        <Input placeholder="1234 5678 9012 3456" />
      </Form.Item>
      <Form.Item
        name="expiryDate"
        label="Expiry Date"
        rules={[{ required: true, message: 'Please enter expiry date' }]}
      >
        <Input placeholder="MM/YY" />
      </Form.Item>
      <Form.Item
        name="cvv"
        label="CVV"
        rules={[{ required: true, message: 'Please enter CVV' }]}
      >
        <Input placeholder="123" maxLength={3} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          Pay Now
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PaymentDetailsForm;
