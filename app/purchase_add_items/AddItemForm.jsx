import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, DatePicker, Select, Tooltip, Divider } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const AddItemForm = ({ onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [unitOptions, setUnitOptions] = useState(['pcs', 'kg', 'liter']);

  const handleSubmit = (values) => {
    const taxAmount = (values.purchasePrice * values.taxPercentage) / 100;
    const discountAmount = (values.purchasePrice * values.discountPercentage) / 100;
    const unitCost = values.purchasePrice + taxAmount - discountAmount;
    const totalAmount = unitCost * values.quantity;

    const newItem = {
      ...values,
      key: Date.now(), // unique key for each item
      taxAmount: taxAmount.toFixed(2),
      unitCost: unitCost.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
    onSubmit(newItem);
    form.resetFields();
  };

  const handleAddUnit = (newUnit) => {
    setUnitOptions([...unitOptions, newUnit]);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="name" label="Item Name" rules={[{ required: true, message: 'Please input the item name!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please input the quantity!' }]}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="unit" label="Unit" rules={[{ required: true, message: 'Please select the unit!' }]}>
        <Select
          style={{ width: '100%' }}
          placeholder="Select a unit"
          dropdownRender={(menu) => (
            <div>
              {menu}
              <Divider style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                <Input style={{ flex: 'auto' }} placeholder="Add custom unit" />
                <a
                  style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                  onClick={() => handleAddUnit('custom')}
                >
                  Add
                </a>
              </div>
            </div>
          )}
        >
          {unitOptions.map((unit) => (
            <Select.Option key={unit} value={unit}>
              {unit}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="purchasePrice" label="Purchase Price (Ksh)" rules={[{ required: true, message: 'Please input the purchase price!' }]}>
        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="taxPercentage"
        label={
          <span>
            Tax % {' '}
            <Tooltip title="Input the tax percentage for this item">
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
          </span>
        }
        rules={[{ required: true, message: 'Please input the tax percentage!' }]}
      >
        <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="discountPercentage" label="Discount %" rules={[{ required: true, message: 'Please input the discount percentage!' }]}>
        <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="unitSales" label="Unit Sales (Ksh)" rules={[{ required: true, message: 'Please input the unit sales price!' }]}>
        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Please input the stock quantity!' }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="expiry" label="Expiry" rules={[{ required: true, message: 'Please select the expiry date!' }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Item
        </Button>
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddItemForm;

