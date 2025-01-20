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
const { Text } = Typography;
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

function DamagedProducts() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [DamagedProducts, setDamagedProducts] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [grandTotal, setGrandTotal] = React.useState(0);

  // Initial mock data
  const initialProducts = React.useMemo(
    () => [
      {
        id: "1",
        itemName: "TEST PRODUCT",
        qty: 3,
        unitPrice: "",
        subTotal: "",
        postedBy: "Branch Manager",
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
        date: "22-12-2024",
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
    const storedProducts = localStorage.getItem("damagedProducts");
    if (storedProducts) {
      setDamagedProducts(JSON.parse(storedProducts));
    } else {
      setDamagedProducts(initialProducts);
      localStorage.setItem("damagedProducts", JSON.stringify(initialProducts));
    }
  }, [initialProducts]);

  const calculateSubTotal = React.useCallback((unitPrice, qty) => {
    return (unitPrice || 0) * (qty || 0);
  }, []);

  const calculateGrandTotal = React.useCallback(() => {
    return DamagedProducts.reduce((total, product) => total + product.subTotal, 0);
  }, [DamagedProducts]);

  // Update localStorage whenever products change
  React.useEffect(() => {
    localStorage.setItem("damagedProducts", JSON.stringify(DamagedProducts));
    setGrandTotal(calculateGrandTotal());
  }, [DamagedProducts, calculateGrandTotal]);

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
    setDamagedProducts(prev => prev.filter(product => product.id !== id));
    messageApi.success("Product deleted successfully");
  }, [messageApi]);

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
        setDamagedProducts(prev => prev.map(product => 
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
        setDamagedProducts(prev => [...prev, newProduct]);
        messageApi.success("Product damaged successfully");
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
        render: (price) => `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
      {
        title: "Sub Total",
        dataIndex: "subTotal",
        key: "subTotal",
        render: (subTotal) => `$${subTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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
              { title: "Damaged Products" },
            ]}
            className="mb-3"
          />
          <hr className="mb-4" />

          <div className="mb-4 flex justify-between items-center">
            <Title level={4} className="text-blue-600 m-0">
              Damaged Products
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              Add Damaged
            </Button>
          </div>

          <Card className="rounded-lg overflow-hidden">
            <Table
              columns={columns}
              dataSource={DamagedProducts}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
              loading={loading}
              className="border-0"
              scroll={{ x: 'max-content' }}
              summary={() => (
                <Table.Summary fixed>
                <Table.Summary.Row className="bg-gray-100">
                  <Table.Summary.Cell index={0} colSpan={4} className="font-bold text-lg">
                    Grand Total :
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={8} colSpan={5} className="text-right"> {/* Add text-right here */}
                    <Text type="danger" className="font-bold text-lg">
                      Total Items : {DamagedProducts.length} | KES: {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
              
              )}
            />
          </Card>
        </Content>
        <Footer />

        <Modal
          title={editingProduct ? "Edit Damaged Product" : "Add Damaged Product"}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          width={1000}
          footer={[
            <Button key="cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
              icon={<SaveOutlined />}
              onClick={handleSave}
            >
              {editingProduct ? "Update Damaged Item" : "Add Damaged Item"}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Form.Item
                  name="itemName"
                  label="Item Name"
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
                  rules={[{ required: true, message: "Please enter unit price" }]}
                >
                  <InputNumber
                    className="w-full"
                    min={0}
                    placeholder="Enter unit price"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>

                <Form.Item
                  name="qty"
                  label="Qty"
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
                >
                  <InputNumber
                    className="w-full"
                    disabled
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>

                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true, message: "Please select a date" }]}
                >
                  <DatePicker className="w-full" format="DD-MMM-YYYY" />
                </Form.Item>
              </div>

              <Form.Item
                name="note"
                label="Note"
              >
                <TextArea rows={4} placeholder="Enter note" />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </Layout>
    </div>
  );
}

export default DamagedProducts;

