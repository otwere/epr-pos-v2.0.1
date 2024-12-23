"use client";

import React from "react";
import {
  Layout,
  Breadcrumb,
  Typography,
  Button,
  Table,
  Modal,
  message,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Space,
  Tooltip,
} from "antd";
import {
  HomeOutlined,
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// Importing Components
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

function IssuedProducts() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [issuedProducts, setIssuedProducts] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Initial mock data
  const initialProducts = React.useMemo(
    () => [
      {
        id: "1",
        itemName: "TEST PRODUCT",
        qty: 3,
        unitPrice: 200,
        subTotal: 600,
        postedBy: "Admin",
        date: "2024-12-22",
        branch: "Snave Webhub Africa - Eldoret CBD (HQ)",
        note: "",
      },
      {
        id: "2",
        itemName: "TEST PRODUCT",
        qty: 1,
        unitPrice: 200,
        subTotal: 200,
        postedBy: "Admin",
        date: "2024-12-22",
        branch: "Snave Webhub Africa - MOMBASA ROAD",
        note: "",
      },
    ],
    []
  );

  // Mock data for dropdowns
  const branches = [
    { value: "Snave Webhub Africa - ELdoret CBD", label: "Snave Webhub Africa - ELdoret CBD" },
    { value: "Snave Webhub Africa - Mombasa (Likoni)", label: "Snave Webhub Africa - Mombasa (Likoni)" },
    { value: "Snave Webhub Africa - Nairobi CBD", label: "Snave Webhub Africa - Nairobi CBD" },
  ];

  const products = [
    { value: "TEST PRODUCT (0002)", label: "TEST PRODUCT (0002)" },
    { value: "SAMPLE ITEM (0003)", label: "SAMPLE ITEM (0003)" },
  ];

  // Initialize products from localStorage or use initial data
  React.useEffect(() => {
    const storedProducts = localStorage.getItem("issuedProducts");
    if (storedProducts) {
      setIssuedProducts(JSON.parse(storedProducts));
    } else {
      setIssuedProducts(initialProducts);
      localStorage.setItem("issuedProducts", JSON.stringify(initialProducts));
    }
  }, [initialProducts]);

  // Update localStorage whenever products change
  React.useEffect(() => {
    localStorage.setItem("issuedProducts", JSON.stringify(issuedProducts));
  }, [issuedProducts]);

  const handleAdd = React.useCallback(() => {
    setIsModalOpen(true);
    setEditingProduct(null);
    form.resetFields();
    // Set default values
    form.setFieldsValue({
      branch: "Snave Webhub Africa - Eldoret CBD",
      date: dayjs(),
      unitPrice: 200,
      qty: 1,
      subTotal: 200,
    });
  }, [form]);

  const handleEdit = React.useCallback((product) => {
    setIsModalOpen(true);
    setEditingProduct(product);
    form.setFieldsValue({
      ...product,
      date: dayjs(product.date),
    });
  }, [form]);

  const handleDelete = React.useCallback((id) => {
    setIssuedProducts(prev => prev.filter(product => product.id !== id));
    messageApi.success("Product deleted successfully");
  }, [messageApi]);

  const calculateSubTotal = React.useCallback((unitPrice, qty) => {
    return (unitPrice || 0) * (qty || 0);
  }, []);

  // Handle form value changes to update sub total
  const handleFormValuesChange = React.useCallback(
    (changedValues, allValues) => {
      if ('unitPrice' in changedValues || 'qty' in changedValues) {
        const subTotal = calculateSubTotal(allValues.unitPrice, allValues.qty);
        form.setFieldValue('subTotal', subTotal);
      }
    },
    [calculateSubTotal, form]
  );

  const handleSave = React.useCallback(async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct) {
        setIssuedProducts(prev => prev.map(product => 
          product.id === editingProduct.id ? { ...product, ...values, date: values.date.format('DD-MM-YYYY') } : product
        ));
        messageApi.success("Product updated successfully");
      } else {
        const newProduct = {
          ...values,
          id: String(Date.now()),
          date: values.date.format('DD-MM-YYYY'),
          postedBy: "Admin",
        };
        setIssuedProducts(prev => [...prev, newProduct]);
        messageApi.success("Product issued successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      if (error.errorFields) {
        // Form validation error
        messageApi.error("Please check your input and try again.");
      } else {
        // Other errors
        messageApi.error("An unexpected error occurred. Please try again.");
        console.error("Save Failed:", error);
      }
      // Keep the modal open so the user can correct their input
    }
  }, [form, messageApi, editingProduct]);

  const columns = React.useMemo(
    () => [
      {
        title: "SN",
        key: "index",
        render: (_, __, index) => index + 1,
        width: 50,
      },
      {
        title: "Item Name",
        dataIndex: "itemName",
        key: "itemName",
        className: "text-nowrap",
      },
      {
        title: "Qty",
        dataIndex: "qty",
        key: "qty",
      },
      {
        title: "Unit Price",
        dataIndex: "unitPrice",
        key: "unitPrice",
      },
      {
        title: "Sub Total",
        dataIndex: "subTotal",
        key: "subTotal",
      },
      {
        title: "Posted By",
        dataIndex: "postedBy",
        key: "postedBy",
        className: "text-nowrap",
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        className: "text-nowrap",
      },
      {
        title: "Branch",
        dataIndex: "branch",
        key: "branch",
        className: "text-nowrap",        
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Space size="small">
            <Tooltip title="View">
              <Button type="text" icon={<EyeOutlined />} />
            </Tooltip>
            <Tooltip title="Edit">
              <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
            </Tooltip>
            <Tooltip title="Delete">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => handleDelete(record.id)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [handleEdit, handleDelete]
  );

  return (
    <div className="min-h-screen flex">
      {contextHolder}
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className="flex-1">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="p-6 bg-gray-50">
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
              { title: "Issued Products" },
            ]}
            className="mb-3"
          />
          <hr />

          <div className="mb-4 flex justify-between items-center">
            <Title level={4} className="text-blue-600 mt-2">
              Issued Products
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-blue-500"
            >
              Add Issued
            </Button>
          </div>

          <Card className="shadow-sm rounded-lg overflow-x-auto">
            <Table
              columns={columns}
              dataSource={issuedProducts}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              loading={loading}
              className="border border-gray-200 rounded"
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Content>
        <Footer />

        <Modal
          title={editingProduct ? "Edit Issued Product" : "Add Issued Product"}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          width={1300}
          footer={[
            <Button key="cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              className="bg-blue-600"
              icon={<SaveOutlined />}
              onClick={handleSave}
            >
              Submit
            </Button>,
          ]}
        >
          <Form
            form={form}
            layout="vertical"
            onValuesChange={handleFormValuesChange}
            initialValues={{
              branch: "Snave Webhub Africa",
              date: dayjs(),
              unitPrice: 200,
              qty: 1,
              subTotal: 200,
            }}
          >
            <div className="space-y-4">
              <Form.Item
                name="branch"
                label="Branch | Station"
                rules={[{ required: true, message: "Please select a branch" }]}
              >
                <Select
                  options={branches}
                  placeholder="Select branch"
                />
              </Form.Item>

              <div className="grid grid-cols-5 gap-4">
                <Form.Item
                  name="itemName"
                  label="Item Name"
                  className="col-span-1"
                  rules={[{ required: true, message: "Please select an item" }]}
                >
                  <Select
                    options={products}
                    placeholder="Select item"
                  />
                </Form.Item>

                <Form.Item
                  name="unitPrice"
                  label="Unit Price"
                  className="col-span-1"
                  rules={[{ required: true, message: "Please enter unit price" }]}
                >
                  <InputNumber
                    className="w-full"
                    min={0}
                    placeholder="Enter unit price"
                  />
                </Form.Item>

                <Form.Item
                  name="qty"
                  label="Qty"
                  className="col-span-1"
                  rules={[{ required: true, message: "Please enter quantity" }]}
                >
                  <InputNumber
                    className="w-full"
                    min={1}
                    placeholder="Enter quantity"
                  />
                </Form.Item>

                <Form.Item
                  name="subTotal"
                  label="Sub Total"
                  className="col-span-1"
                >
                  <InputNumber
                    className="w-full"
                    disabled
                    placeholder="0.00"
                  />
                </Form.Item>

                <Form.Item
                  name="date"
                  label="Date"
                  className="col-span-1"
                  rules={[{ required: true, message: "Please select a date" }]}
                >
                  <DatePicker className="w-full" format="DD-MMM-YYYY" />
                </Form.Item>
              </div>

              <Space className="w-full">
                <Form.Item
                  name="note"
                  label="Note"
                  className="flex-1 w-full"
                >
                  <TextArea rows={4} placeholder="Enter note" />
                </Form.Item>
              </Space>
            </div>
          </Form>
        </Modal>
      </Layout>
    </div>
  );
}

export default IssuedProducts;

