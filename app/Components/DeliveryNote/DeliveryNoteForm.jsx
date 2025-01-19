import React from "react";
import { Form, Input, Select, Button, DatePicker, Spin, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;

export const DeliveryNoteForm = ({ form, loading, editingNote, handleProductChange, handleQuantityChange, customers, products }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    messageApi.success("Delivery note saved successfully");
  };

  const onFinishFailed = (errorInfo) => {
    messageApi.error("Validation failed. Please check the form.");
    console.log("Validation Failed:", errorInfo);
  };

  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        initialValues={editingNote || { deliveryDate: moment(), products: [{}] }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="flex flex-wrap gap-4">
          <Form.Item name="slNo" label="SL No" rules={[{ required: true, message: "Please input the SL No" }]} className="flex-1">
            <Input type="number" placeholder="Enter SL No" />
          </Form.Item>
          <Form.Item name="deliveryNoteId" label="Delivery Note ID" rules={[{ required: true, message: "Please input the Delivery Note ID" }]} className="flex-1">
            <Input placeholder="Enter Delivery Note ID" disabled={!!editingNote} />
          </Form.Item>
        </div>

        <Form.Item name="deliveryDate" label="Delivery Date" rules={[{ required: true, message: "Please input the Delivery Date" }]}>
          <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
        </Form.Item>

        <div className="flex flex-wrap gap-4">
          <Form.Item name="customerName" label="Customer Name" rules={[{ required: true, message: "Please select the Customer Name" }]} className="flex-1">
            <Select placeholder="Select Customer" onChange={(value) => {
              const selectedCustomer = customers.find(customer => customer.id === value);
              if (selectedCustomer) {
                form.setFieldsValue({ customerAddress: selectedCustomer.address });
              }
            }}>
              {customers && customers.map(customer => (
                <Option key={customer.id} value={customer.id}>{customer.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="customerAddress" label="Customer Address" rules={[{ required: true, message: "Please input the Customer Address" }]} className="flex-1">
            <Input placeholder="Enter Customer Address" />
          </Form.Item>
        </div>

        <Form.List name="products">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="flex flex-wrap gap-4 items-center">
                  <Form.Item
                    {...restField}
                    name={[name, 'productName']}
                    label="Product Name | Item"
                    rules={[{ required: true, message: "Please select the Product Name" }]}
                    className="flex-1"
                  >
                    <Select placeholder="Select Product" onChange={(value) => handleProductChange(value, name)}>
                      {products && products.map(product => (
                        <Option key={product.id} value={product.id}>{product.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'quantity']}
                    label="Quantity"
                    rules={[{ required: true, message: "Please input the Quantity" }]}
                    className="flex-1"
                  >
                    <Input type="number" placeholder="Enter Quantity" onChange={(e) => handleQuantityChange(e.target.value, name)} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'unitPrice']}
                    label="Unit Price"
                    rules={[{ required: true, message: "Please input the Unit Price" }]}
                    className="flex-1"
                  >
                    <Input type="number" placeholder="Enter Unit Price" disabled />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'totalAmount']}
                    label="Total Amount"
                    className="flex-1"
                  >
                    <Input type="number" placeholder="Total Amount" disabled />
                  </Form.Item>
                  <Button type="dashed" onClick={() => remove(name)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Product | Item
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          name="paymentTerms"
          label="Payment Terms"
          rules={[{ required: true, message: "Please select the Payment Terms" }]}
        >
          <Select placeholder="Select Payment Terms">
            <Option value="Net 30">Net 30</Option>
            <Option value="Net 15">Net 15</Option>
            <Option value="Due on Receipt">Due on Receipt</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select the Status" }]}
        >
          <Select placeholder="Select Status">
            <Option value="Pending">Pending</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};