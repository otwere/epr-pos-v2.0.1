"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Table,
  Modal,
  message,
  Row,
  Col,
  Card,
  Divider,
  Typography,
  Breadcrumb,
  Layout,
  Popconfirm,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  HomeOutlined,
  ReloadOutlined,
  FileImageOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import AddItemForm from "./AddItemForm";
import { useRouter } from "next/navigation";

const { Content } = Layout;
const { Option } = Select;
const { Text } = Typography;

const PurchaseItems = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [totals, setTotals] = useState({
    subtotal: 0,
    roundOff: 0,
    grandTotal: 0,
    stockValue: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [editingKey, setEditingKey] = useState("");
  const router = useRouter();

  useEffect(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.totalAmount),
      0
    );
    const roundOff = Math.round(subtotal * 100) / 100 - subtotal;
    const grandTotal = Math.round(subtotal * 100) / 100;
    const stockValue = items.reduce(
      (sum, item) => sum + parseFloat(item.unitCost) * item.stock,
      0
    );

    setTotals({ subtotal, roundOff, grandTotal, stockValue });
  }, [items]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const handleSave = async (values) => {
    setOpenModal(true);
    setConfirmLoading(true);
    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Received values of form: ", values);
      console.log("Items: ", items);

      messageApi.success("Purchase order saved successfully");
      handleReset();
    } catch (error) {
      messageApi.error("Failed to save purchase order");
    } finally {
      setOpenModal(false);
      setConfirmLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setItems([]);
  };

  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
    setItemModalOpen(false);
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...items];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setItems(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (key) => {
    const newData = items.filter((item) => item.key !== key);
    setItems(newData);
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Purchase Price",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
    },
    {
      title: "Tax %",
      dataIndex: "taxPercentage",
      key: "taxPercentage",
    },
    {
      title: "Tax Amt (KES)",
      dataIndex: "taxAmt",
      key: "taxAmt",
    },
    {
      title: "Discount %",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
    },
    {
      title: "Unit Cost",
      dataIndex: "unitCost",
      key: "unitCost",
    },
    {
      title: "Total Amount(KES)",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Unit Sales(KES)",
      dataIndex: "unitSales",
      key: "unitSales",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Expiry",
      dataIndex: "expiry",
      key: "expiry",
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              <EditOutlined />
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <a>
                <DeleteOutlined />
              </a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const rules = {
    required: [{ required: true, message: "This field is required" }],
  };
  

  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />

      <Layout className="flex-1 bg-gray-50">
        <Header collapsed={collapsed} onCollapse={toggleCollapsed} />

        <Content className="transition-all duration-300 p-6">
          {contextHolder}

          <Breadcrumb
            items={[
              {
                title: (
                  <span>
                    <HomeOutlined /> Home
                  </span>
                ),
                href: "/",
              },
              { title: "Purchase Items" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          <Card
            title={
              <Text className="text-xl font-semibold mt-0">
                *Purchase Items
              </Text>
            }
            extra={
              <Text type="secondary" className="text-sm">
                All fields marked * are required
              </Text>
            }
            
            className="shadow-sm rounded-sm p-4 bg-gray-100 mb-8"          >
            
            <Form form={form} onFinish={handleSave} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="supplier"
                    label="Supplier *"
                    rules={rules.required}
                  >
                    <Select placeholder="Select supplier">
                      <Option value="supplier1">Supplier 1</Option>
                      <Option value="supplier2">Supplier 2</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="purchaseDate"
                    label="Purchase Date *"
                    rules={rules.required}
                  >
                    <DatePicker className="w-full" format="DD-MM-YYYY" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="invoiceNumber"
                    label="Invoice Number *"
                    rules={rules.required}
                  >
                    <Input placeholder="Enter invoice number" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="orderStatus"
                    label="Order Status *"
                    rules={rules.required}
                  >
                    <Select placeholder="Select order Status">
                      <Option value="received">Received</Option>
                      <Option value="lpo">LPO</Option>
                      <Option value="requisition">Requisition</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="cuNumber"
                    label="CU Number"
                   
                  >
                    <Input placeholder="Control Unit No (CU)" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="purchaseExpense"
                    label="Purchase Expense"                    
                  >
                    <Input placeholder="0" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Purchase Items</Divider>
              <div className="flex justify-between items-center mb-5">
                <Input.Search
                  placeholder="Search items"
                  onSearch={(value) => setSearchText(value)}
                  style={{ width: 350 }}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => router.push("/Purchase_Analysis_List")}
                    className="bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-lg px-4 py-2"
                  >
                    View Purchase History
                  </Button>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => setItemModalOpen(true)}
                    className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2"
                  >
                    Add Item
                  </Button>
                </div>
              </div>

              <Table
                dataSource={items.filter((item) =>
                  Object.values(item).some((val) =>
                    val
                      .toString()
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  )
                )}
                columns={columns}
                pagination={false}
                className="mb-4"
              />
              <Col justify="right" className="mb-6 ml-[39rem] w-full">
                <Col xs={24} md={12} lg={10}>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <Text className="uppercase tracking-wider font-medium text-gray-800">
                        Subtotal
                      </Text>
                      <Text className="font-semibold text-gray-900">
                        KES : {totals.subtotal.toFixed(2)}
                      </Text>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <Text className="uppercase tracking-wider font-medium text-gray-800">
                        Round Off
                      </Text>
                      <Text className="font-semibold text-gray-900">
                        KES : {totals.roundOff.toFixed(2)}
                      </Text>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <Text className="uppercase tracking-wider font-medium text-gray-800">
                        Stock Value
                      </Text>
                      <Text className="font-semibold text-gray-900">
                        KES : {totals.stockValue.toFixed(2)}
                      </Text>
                    </div>
                    <div className="flex justify-between items-center  text-red-700 border-t pt-4">
                      <Text className="uppercase  font-bold text-blue-600">
                        Grand Total
                      </Text>
                      <Text className="font-bold text-lg text-green-500">
                        KES : {totals.grandTotal.toFixed(2)}
                      </Text>
                    </div>
                  </div>
                </Col>
              </Col>

              <Form.Item>
                <div className="flex justify-end space-x-2">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleReset}
                    className="bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-lg px-4 py-2"
                  >
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={confirmLoading}
                    className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-4 py-2"
                  >
                    Save Purchase
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Content>
        <Footer />
      </Layout>

      <Modal
        title="Add Item"
        open={itemModalOpen}
        onCancel={() => setItemModalOpen(false)}
        footer={null}
        width={1080}
      >
        <AddItemForm
          onSubmit={handleAddItem}
          onCancel={() => setItemModalOpen(false)}
        />
      </Modal>

      <Modal
        title="Processing"
        open={openModal}
        confirmLoading={confirmLoading}
        footer={null}
      >
        <div className="text-center">
          <FileImageOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
          <p className="mt-4">Saving purchase order...</p>
        </div>
      </Modal>
    </div>
  );
};

export default PurchaseItems;
