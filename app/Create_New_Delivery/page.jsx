"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Modal,
  Card,
  Table,
  Breadcrumb,
  Layout,
  Typography,
  message,
  Dropdown,
  Spin,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  SaveOutlined,
  MoreOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import moment from "moment";

import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import Link from "next/link";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const customers = [
  { id: 1, name: "John Doe", address: "123 Main St, Eldoret, Kenya" },
  { id: 2, name: "Jane Smith", address: "456 Elm St, New York, USA" },
];

const products = [
  { id: 1, name: "Product A", price: 100 },
  { id: 2, name: "Product B", price: 200 },
];

const DeliveryNoteList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [deliveryNotes, setDeliveryNotes] = useState([
    {
      slNo: 1,
      deliveryNoteId: "DN001",
      deliveryDate: moment("2023-10-01"), // Ensure deliveryDate is a moment object
      customerName: "John Doe",
      customerAddress: "123 Main St, Eldoret, Kenya",
      products: [
        { productName: "Product A", quantity: 10, unitPrice: 100, totalAmount: 1000 },
      ],
      paymentTerms: "Net 30",
      status: "Delivered",
    },
    {
      slNo: 2,
      deliveryNoteId: "DN002",
      deliveryDate: moment("2023-10-02"), // Ensure deliveryDate is a moment object
      customerName: "Jane Smith",
      customerAddress: "456 Elm St, New York, USA",
      products: [
        { productName: "Product B", quantity: 5, unitPrice: 200, totalAmount: 1000 },
      ],
      paymentTerms: "Net 15",
      status: "Pending",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredNotes = deliveryNotes.filter((note) =>
    Object.values(note).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEdit = (note) => {
    setEditingNote({ ...note });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this delivery note?",
      content: "This action cannot be undone.",
      onOk() {
        setDeliveryNotes(deliveryNotes.filter((note) => note.deliveryNoteId !== id));
        messageApi.success("Delivery note deleted successfully");
      },
    });
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true);
        setTimeout(() => {
          if (editingNote) {
            setDeliveryNotes(
              deliveryNotes.map((note) =>
                note.deliveryNoteId === editingNote.deliveryNoteId ? { ...editingNote, ...values, deliveryDate: moment(values.deliveryDate) } : note
              )
            );
            messageApi.success("Delivery note updated successfully");
          } else {
            const newNote = {
              ...values,
              slNo: deliveryNotes.length + 1,
              deliveryNoteId: `DN${String(deliveryNotes.length + 1).padStart(3, "0")}`,
              totalAmount: values.products.reduce((sum, product) => sum + (product.quantity * product.unitPrice), 0),
              customerName: String(values.customerName), // Ensure customerName is a string
              deliveryDate: moment(values.deliveryDate), // Ensure deliveryDate is a moment object
            };
            setDeliveryNotes([...deliveryNotes, newNote]);
            messageApi.success("New delivery note added successfully");
          }
          setIsDialogOpen(false);
          form.resetFields();
          setEditingNote(null);
          setLoading(false);
        }, 1000); // Simulate loading delay
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
        setLoading(false);
      });
  };

  const handleAddNewNote = () => {
    setEditingNote(null);
    setIsDialogOpen(true);
    form.resetFields();
  };

  const handleProductChange = (value, index) => {
    const selectedProduct = products.find(product => product.id === value);
    if (selectedProduct) {
      const productsField = form.getFieldValue('products');
      productsField[index].unitPrice = selectedProduct.price;
      productsField[index].totalAmount = productsField[index].quantity * selectedProduct.price;
      form.setFieldsValue({ products: productsField });
    }
  };

  const handleQuantityChange = (value, index) => {
    const productsField = form.getFieldValue('products');
    productsField[index].quantity = value;
    productsField[index].totalAmount = productsField[index].quantity * productsField[index].unitPrice;
    form.setFieldsValue({ products: productsField });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [columns.map(col => col.title)],
      body: filteredNotes.map(note => columns.map(col => note[col.dataIndex])),
    });
    doc.save('delivery_notes.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredNotes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Delivery Notes");
    XLSX.writeFile(wb, 'delivery_notes.xlsx');
  };

  const actionsMenu = (record) => [
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => handleEdit(record),
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      onClick: () => handleDelete(record.deliveryNoteId),
    },
  ];

  const columns = [
    { title: "#", dataIndex: "slNo", key: "slNo", sorter: (a, b) => a.slNo - b.slNo, className: "whitespace-nowrap" },
    { title: "Delivery Note ID", dataIndex: "deliveryNoteId", key: "deliveryNoteId", sorter: (a, b) => a.deliveryNoteId.localeCompare(b.deliveryNoteId), className: "whitespace-nowrap" },
    { 
      title: "Delivery Date", 
      dataIndex: "deliveryDate", 
      key: "deliveryDate", 
      sorter: (a, b) => moment(a.deliveryDate).unix() - moment(b.deliveryDate).unix(), 
      className: "whitespace-nowrap",
      render: (text) => moment(text).isValid() ? moment(text).format("DD-MM-YYYY") : "Invalid Date" // Handle invalid dates
    },
    { 
      title: "Customer Name", 
      dataIndex: "customerName", 
      key: "customerName", 
      sorter: (a, b) => String(a.customerName).localeCompare(String(b.customerName)), // Ensure customerName is a string
      className: "whitespace-nowrap" 
    },
    { title: "Customer Address", dataIndex: "customerAddress", key: "customerAddress", className: "whitespace-nowrap" },
    { title: "Products", dataIndex: "products", key: "products", render: (products) => (
      <ul>
        {products.map((product, index) => (
          <li key={index}>{product.productName} - {product.quantity} x {product.unitPrice} = {product.totalAmount}</li>
        ))}
      </ul>
    ), className: "whitespace-nowrap" },
    { title: "Payment Terms", dataIndex: "paymentTerms", key: "paymentTerms", className: "whitespace-nowrap" },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status", 
      sorter: (a, b) => a.status.localeCompare(b.status), 
      className: "whitespace-nowrap",
      render: (status) => {
        let color;
        switch (status) {
          case "Delivered":
            color = "green";
            break;
          case "Pending":
            color = "orange";
            break;
          case "Cancelled":
            color = "red";
            break;
          default:
            color = "blue";
        }
        return <span style={{ color }}>{status}</span>;
      }
    },
    {
      title: "Actions",
      key: "actions",
      className: "whitespace-nowrap",
      render: (_text, record) => (
        <Dropdown menu={{ items: actionsMenu(record) }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex">
      {contextHolder}
      <Sidebar collapsed={collapsed} onCollapse={toggleCollapsed} />

      <Layout className="flex-1 bg-gray-100">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="transition-all duration-300 p-6">
          <div className="mt-0">
            <Breadcrumb
              className="mb-4"
              items={[
                { title: <Link href="/">Home</Link> },
                { title: "Delivery Notes List" },
              ]}
            />
            <hr />
            
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-600 mt-2">
                Delivery Notes List
              </Title>
              <Text type="secondary"> Manage and View all Delivery Notes</Text>
            </div>
            <hr className="-mt-2 mb-4" />
          </div>

          <Card className="shadow-sm rounded-lg bg-gray-50">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search Delivery Notes by ID, Customer Name, Product, etc."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: 600 }}
                />
              </div>
              <div className="flex space-x-4">
                <Button icon={<FilePdfOutlined />} onClick={exportToPDF}>
                  Export to PDF
                </Button>
                <Button icon={<FileExcelOutlined />} onClick={exportToExcel}>
                  Export to Excel
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNewNote}>
                  Add New Delivery Note
                </Button>
              </div>
            </div>

            <hr className="mt-4"/>

            <Table
              dataSource={filteredNotes}
              columns={columns}
              rowKey="deliveryNoteId"
              pagination={{
                total: filteredNotes.length,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ["10", "20", "50"],
                defaultPageSize: 10,
              }}
              loading={loading}
              scroll={{ x: true }}
            />
          </Card>
        </Content>

        <Footer />
      </Layout>

      <Modal
        title={editingNote ? "Edit Delivery Note" : "Add New Delivery Note"}
        open={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={loading}
          >
            Save
          </Button>,
        ]}
        width={1200}
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            initialValues={
              editingNote || {
                slNo: "",
                deliveryNoteId: "",
                deliveryDate: moment(), // Initialize with current date
                customerName: "",
                customerAddress: "",
                products: [{ productName: "", quantity: "", unitPrice: "", totalAmount: "" }],
                paymentTerms: "",
                status: "",
              }
            }
          >
            <div className="flex flex-wrap gap-4">
              <Form.Item
                name="slNo"
                label="SL No"
                rules={[{ required: true, message: "Please input the SL No" }]}
                className="flex-1"
              >
                <Input type="number" placeholder="Enter SL No" />
              </Form.Item>
              <Form.Item
                name="deliveryNoteId"
                label="Delivery Note ID"
                rules={[{ required: true, message: "Please input the Delivery Note ID" }]}
                className="flex-1"
              >
                <Input placeholder="Enter Delivery Note ID" disabled={!!editingNote} />
              </Form.Item>
            </div>

            <Form.Item
              name="deliveryDate"
              label="Delivery Date"
              rules={[{ required: true, message: "Please input the Delivery Date" }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>

            <div className="flex flex-wrap gap-4">
              <Form.Item
                name="customerName"
                label="Customer Name"
                rules={[{ required: true, message: "Please select the Customer Name" }]}
                className="flex-1"
              >
                <Select placeholder="Select Customer" onChange={(value) => {
                  const selectedCustomer = customers.find(customer => customer.id === value);
                  if (selectedCustomer) {
                    form.setFieldsValue({ customerAddress: selectedCustomer.address });
                  }
                }}>
                  {customers.map(customer => (
                    <Option key={customer.id} value={customer.id}>{customer.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="customerAddress"
                label="Customer Address"
                rules={[{ required: true, message: "Please input the Customer Address" }]}
                className="flex-1"
              >
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
                          {products.map(product => (
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
                      Add Product
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
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default DeliveryNoteList;