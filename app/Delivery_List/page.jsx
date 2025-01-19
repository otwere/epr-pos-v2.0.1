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
} from "@ant-design/icons";

import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";
import Link from "next/link";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const DeliveryNoteList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [deliveryNotes, setDeliveryNotes] = useState([
    {
      slNo: 1,
      deliveryNoteId: "DN001",
      deliveryDate: "2023-10-01",
      customerName: "John Doe",
      customerAddress: "123 Main St, Eldoret, Kenya",
      productName: "Product A",
      quantity: 10,
      unitPrice: 100,
      totalAmount: 1000,
      paymentTerms: "Net 30",
      status: "Delivered",
    },
    {
      slNo: 2,
      deliveryNoteId: "DN002",
      deliveryDate: "2023-10-02",
      customerName: "Jane Smith",
      customerAddress: "456 Elm St, New York, USA",
      productName: "Product B",
      quantity: 5,
      unitPrice: 200,
      totalAmount: 1000,
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
                note.deliveryNoteId === editingNote.deliveryNoteId ? { ...editingNote, ...values } : note
              )
            );
            messageApi.success("Delivery note updated successfully");
          } else {
            const newNote = {
              ...values,
              slNo: deliveryNotes.length + 1,
              deliveryNoteId: `DN${String(deliveryNotes.length + 1).padStart(3, "0")}`,
              totalAmount: values.quantity * values.unitPrice,
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

  useEffect(() => {
    return () => {
      // Cleanup function to avoid warning
      setLoading(false);
    };
  }, []);

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
    { title: "Delivery Date", dataIndex: "deliveryDate", key: "deliveryDate", sorter: (a, b) => a.deliveryDate.localeCompare(b.deliveryDate), className: "whitespace-nowrap" },
    { title: "Customer Name", dataIndex: "customerName", key: "customerName", sorter: (a, b) => a.customerName.localeCompare(b.customerName), className: "whitespace-nowrap" },
    { title: "Customer Address", dataIndex: "customerAddress", key: "customerAddress", className: "whitespace-nowrap" },
    { title: "Product Name", dataIndex: "productName", key: "productName", sorter: (a, b) => a.productName.localeCompare(b.productName), className: "whitespace-nowrap" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity", sorter: (a, b) => a.quantity - b.quantity, className: "whitespace-nowrap" },
    { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice", sorter: (a, b) => a.unitPrice - b.unitPrice, className: "whitespace-nowrap" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount", sorter: (a, b) => a.totalAmount - b.totalAmount, className: "whitespace-nowrap" },
    { title: "Payment Terms", dataIndex: "paymentTerms", key: "paymentTerms", className: "whitespace-nowrap" },
    { title: "Status", dataIndex: "status", key: "status", sorter: (a, b) => a.status.localeCompare(b.status), className: "whitespace-nowrap" },
    {
      title: "Actions",
      key: "actions",
      className: "whitespace-nowrap",
      render: (text, record) => (
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
              <Title level={4} className="text-blue-800 mt-2">
                Delivery Notes List
              </Title>
              <Text type="secondary"> View all Delivery Notes</Text>
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
                  style={{ width: 1200 }}
                />
              </div>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNewNote}>
                Add New Delivery Note
              </Button>
            </div>

            <hr  className="mt-4"/>

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
              scroll={{ x: true }} // Ensure horizontal scrolling for small screens
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
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            initialValues={
              editingNote || {
                slNo: "",
                deliveryNoteId: "",
                deliveryDate: "",
                customerName: "",
                customerAddress: "",
                productName: "",
                quantity: "",
                unitPrice: "",
                totalAmount: "",
                paymentTerms: "",
                status: "",
              }
            }
          >
            <Form.Item
              name="slNo"
              label="SL No"
              rules={[{ required: true, message: "Please input the SL No" }]}
            >
              <Input type="number" placeholder="Enter SL No" />
            </Form.Item>
            <Form.Item
              name="deliveryNoteId"
              label="Delivery Note ID"
              rules={[{ required: true, message: "Please input the Delivery Note ID" }]}
            >
              <Input placeholder="Enter Delivery Note ID" />
            </Form.Item>
            <Form.Item
              name="deliveryDate"
              label="Delivery Date"
              rules={[{ required: true, message: "Please input the Delivery Date" }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="customerName"
              label="Customer Name"
              rules={[{ required: true, message: "Please input the Customer Name" }]}
            >
              <Input placeholder="Enter Customer Name" />
            </Form.Item>
            <Form.Item
              name="customerAddress"
              label="Customer Address"
              rules={[{ required: true, message: "Please input the Customer Address" }]}
            >
              <Input placeholder="Enter Customer Address" />
            </Form.Item>
            <Form.Item
              name="productName"
              label="Product Name"
              rules={[{ required: true, message: "Please input the Product Name" }]}
            >
              <Input placeholder="Enter Product Name" />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: "Please input the Quantity" }]}
            >
              <Input type="number" placeholder="Enter Quantity" />
            </Form.Item>
            <Form.Item
              name="unitPrice"
              label="Unit Price"
              rules={[{ required: true, message: "Please input the Unit Price" }]}
            >
              <Input type="number" placeholder="Enter Unit Price" />
            </Form.Item>
            <Form.Item
              name="totalAmount"
              label="Total Amount"
              rules={[{ required: true, message: "Please input the Total Amount" }]}
            >
              <Input type="number" placeholder="Enter Total Amount" />
            </Form.Item>
            <Form.Item
              name="paymentTerms"
              label="Payment Terms"
              rules={[{ required: true, message: "Please input the Payment Terms" }]}
            >
              <Input placeholder="Enter Payment Terms" />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please input the Status" }]}
            >
              <Input placeholder="Enter Status" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default DeliveryNoteList;