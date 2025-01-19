import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, InputNumber, Button, Space, message, Tag } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useQuotationContext } from "./QuotationContext";
import dayjs from 'dayjs';

const { Option } = Select;

const QuotationForm = ({ open, onCancel, onSave, editingQuotation }) => {
  const [form] = Form.useForm(); // Create form instance
  const { clients, products, addQuotation, updateQuotation } = useQuotationContext();

  useEffect(() => {
    if (editingQuotation) {
      form.setFieldsValue({
        ...editingQuotation,
        date: editingQuotation.date ? dayjs(editingQuotation.date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [editingQuotation, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        date: values.date.format('DD-MM-YYYY'),
      };
      if (editingQuotation) {
        await updateQuotation(editingQuotation.id, formattedValues);
      } else {
        await addQuotation(formattedValues);
      }
      onSave();
    } catch (error) {
      message.error("Validation failed: " + error.message);
    }
  };

  // Disable future dates
  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  // Status options with colors
  const statusOptions = [
    { value: 'Draft', color: 'default' },
    { value: 'Pending', color: 'orange' },
    { value: 'Sent', color: 'blue' },
    { value: 'Approved', color: 'green' },
    { value: 'Rejected', color: 'red' },
    { value: 'Expired', color: 'gray' },
  ];

  return (
    <Modal
      title={editingQuotation ? "Edit Quotation" : "New Quotation"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="quotationId" label="Quotation ID" rules={[{ required: true, message: 'Please input the Quotation ID' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please select the date' }]}>
          <DatePicker style={{ width: "100%" }} disabledDate={disabledDate} />
        </Form.Item>
        <Form.Item name="clientId" label="Client" rules={[{ required: true, message: 'Please select a client' }]}>
          <Select>
            {clients.map((client) => (
              <Option key={client.id} value={client.id}>
                {client.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.List name="items" rules={[{ required: true, message: 'Please add at least one item' }]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, "productId"]}
                    rules={[{ required: true, message: "Please select a product" }]}
                  >
                    <Select style={{ width: 200 }} placeholder="Select product">
                      {products.map((product) => (
                        <Option key={product.id} value={product.id}>
                          {product.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    rules={[{ required: true, message: "Please input the quantity" }]}
                  >
                    <InputNumber min={1} placeholder="Quantity" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "unitPrice"]}
                    rules={[{ required: true, message: "Please input the unit price" }]}
                  >
                    <InputNumber min={0} step={0.01} placeholder="Unit Price" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Product || Item
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item name="terms" label="Terms">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select a status' }]}>
          <Select>
            {statusOptions.map((status) => (
              <Option key={status.value} value={status.value}>
                <Tag color={status.color}>{status.value}</Tag>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuotationForm;