"use client";
import React, { useState } from "react";
import {
  Layout,
  Typography,
  Breadcrumb,
  Button,
  Form,
  DatePicker,
  Select,
  InputNumber,
  Input,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import Header from "../components/HeaderComponent/Header";
import Sidebar from "../components/SidebarComponent/Sidebar";
import Footer from "../components/FooterComponent/Footer";
import moment from "moment";
import axios from "axios";

const { Content } = Layout;
const { Title, Text } = Typography; // Added Text

const Add_Expense = () => {
  const [collapsed, setCollapsed] = useState(false);
  const formRef = React.createRef();

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post("/api/v1/expenses", values); // Updated endpoint
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const disabledDate = (current) => {
    // Disable future dates
    return current && current > moment().endOf("day");
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
      />

      <Layout className="flex-1 bg-gray-100">
        <Header
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        />

        <Content className="p-6">
          <Breadcrumb
            className="mb-4"
            items={[
              {
                title: (
                  <Link href="/">
                    <HomeOutlined /> Home
                  </Link>
                ),
              },
              { title: " Add Expenses" },
            ]}
          />
          <hr className="mb-2" />

          <div className="mb-4 flex justify-between items-center">
            <Title level={4} className="text-gray-700 mt-0">
              Expenses
            </Title>
            <Text type="secondary">Manage your Expenses</Text>
          </div>
          <hr className="mb-4" />

          <div className="mb-4 flex justify-between items-center"></div>

          <div className="bg-gray-50 rounded-sm p-6">
            <Form
              layout="vertical"
              onFinish={handleFormSubmit}
              ref={formRef}
              className="flex flex-wrap gap-4"
            >
              <Form.Item
                name="expenseDate"
                label="Expense Date"
                rules={[
                  { required: true, message: "Please select the expense date" },
                ]}
                className="flex-1 min-w-[200px]"
              >
                <DatePicker className="w-full" disabledDate={disabledDate} />
              </Form.Item>
              <Form.Item
                name="category"
                label="Category"
                rules={[
                  { required: true, message: "Please select the category" },
                ]}
                className="flex-1 min-w-[200px]"
              >
                <Select placeholder="Select a category">
                  <Select.Option value="travel">Travel</Select.Option>
                  <Select.Option value="food">Food</Select.Option>
                  <Select.Option value="office">Office</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="payingAccount"
                label="Paying Account"
                rules={[
                  {
                    required: true,
                    message: "Please select the paying account",
                  },
                ]}
                className="flex-1 min-w-[200px]"
              >
                <Select placeholder="Select a paying account">
                  <Select.Option value="cash">Cash</Select.Option>
                  <Select.Option value="mpesa">Mpesa</Select.Option>
                  <Select.Option value="creditCard">Credit Card</Select.Option>
                  <Select.Option value="bankTransfer">
                    Bank Transfer
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="amount"
                label="Amount"
                rules={[
                  { required: true, message: "Please enter the amount" },
                  {
                    type: "number",
                    min: 0,
                    message: "Amount must be a positive number",
                  },
                ]}
                className="flex-1 min-w-[200px]"
              >
                <InputNumber className="w-full" min={0} />
              </Form.Item>
              <Form.Item
                name="vat"
                label="VAT"
                rules={[{ required: true, message: "Please select the VAT" }]}
                className="flex-1 min-w-[200px]"
              >
                <Select placeholder="Select VAT">
                  <Select.Option value="zeroRated">
                    Zero Rated (0)
                  </Select.Option>
                  <Select.Option value="exempted"> Tax Exempted</Select.Option>
                  <Select.Option value="8%">8%</Select.Option>
                  <Select.Option value="16%">16%</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="uploadFile"
                label="Upload File"
                className="flex-1 min-w-[200px]"
              >
                <Input type="file" className="w-full" />
              </Form.Item>

              <Form.Item
                name="note"
                label="Note"
                rules={[
                  { max: 40, message: "Note must be less than 40 characters" },
                ]}
                className="flex-1 min-w-[200px]"
              >
                <Input.TextArea rows={4} maxLength={20} />
              </Form.Item>
              <Form.Item className="w-full text-right">
                <Link href="/">
                  <Button type="default" className="mr-2">
                    Close
                  </Button>
                </Link>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Content>

        <Footer />
      </Layout>
    </div>
  );
};

export default Add_Expense;
