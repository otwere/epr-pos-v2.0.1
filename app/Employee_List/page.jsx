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

const ItemsList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [items, setItems] = useState([
    {
      slNo: 1,
      employeeId: "E001",
      firstName: "John",
      lastName: "Doe",
      phone: "123-456-7890",
      email: "john.doe@example.com",
      country: "Kenya",
      county: "Uasin Gishu",
      city: "Eldoret",
      zipCode: "30100",
      division: "Sales",
      position: "Sales Manager",
    },
    {
      slNo: 2,
      employeeId: "E002",
      firstName: "Jane",
      lastName: "Smith",
      phone: "987-654-3210",
      email: "jane.smith@example.com",
      country: "USA",
      county: "New York",
      city: "New York",
      zipCode: "10001",
      division: "Marketing",
      position: "Marketing Manager",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredItems = items.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this employee?",
      content: "This action cannot be undone.",
      onOk() {
        setItems(items.filter((item) => item.employeeId !== id));
        messageApi.success("Employee deleted successfully");
      },
    });
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true);
        setTimeout(() => {
          if (editingItem) {
            setItems(
              items.map((item) =>
                item.employeeId === editingItem.employeeId ? { ...editingItem, ...values } : item
              )
            );
            messageApi.success("Employee updated successfully");
          } else {
            const newItem = {
              ...values,
              slNo: items.length + 1,
              employeeId: `E${String(items.length + 1).padStart(3, "0")}`,
            };
            setItems([...items, newItem]);
            messageApi.success("New employee added successfully");
          }
          setIsDialogOpen(false);
          form.resetFields();
          setEditingItem(null);
          setLoading(false);
        }, 1000); // Simulate loading delay
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
        setLoading(false);
      });
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
      onClick: () => handleDelete(record.employeeId),
    },
  ];

  const columns = [
    { title: "#", dataIndex: "slNo", key: "slNo", sorter: (a, b) => a.slNo - b.slNo, className: "whitespace-nowrap" },
    { title: "Employee ID", dataIndex: "employeeId", key: "employeeId", sorter: (a, b) => a.employeeId.localeCompare(b.employeeId), className: "whitespace-nowrap" },
    { title: "First Name", dataIndex: "firstName", key: "firstName", sorter: (a, b) => a.firstName.localeCompare(b.firstName), className: "whitespace-nowrap" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName", sorter: (a, b) => a.lastName.localeCompare(b.lastName), className: "whitespace-nowrap" },
    { title: "Phone", dataIndex: "phone", key: "phone", className: "whitespace-nowrap" },
    { title: "Email Address", dataIndex: "email", key: "email", className: "whitespace-nowrap" },
    { title: "Country", dataIndex: "country", key: "country", sorter: (a, b) => a.country.localeCompare(b.country), className: "whitespace-nowrap" },
    { title: "County", dataIndex: "county", key: "county", className: "whitespace-nowrap" },
    { title: "City", dataIndex: "city", key: "city", className: "whitespace-nowrap" },
    { title: "Zip Code", dataIndex: "zipCode", key: "zipCode", className: "whitespace-nowrap" },
    { title: "Division | Dept", dataIndex: "division", key: "division", sorter: (a, b) => a.division.localeCompare(b.division), className: "whitespace-nowrap" },
    { title: "Position", dataIndex: "position", key: "position", sorter: (a, b) => a.position.localeCompare(b.position), className: "whitespace-nowrap" },
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
                { title: "Employee List" },
              ]}
            />
            <hr />
            
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2">
                Employees List
              </Title>
              <Text type="secondary"> View all Employees</Text>
            </div>
            <hr className="-mt-2 mb-4" />
          </div>

          <Card className="shadow-sm rounded-lg bg-gray-50">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search Employees by Employee ID, Name, Email, Phone, etc."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: 1280 }}
                />
              </div>
              <Button type="primary" icon={<PlusOutlined />}>
                <Link href="/add_new_employee">Add New Employee</Link>
              </Button>
            </div>

            <hr  className="mt-4"/>

            <Table
              dataSource={filteredItems}
              columns={columns}
              rowKey="employeeId"
              pagination={{
                total: filteredItems.length,
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
        title={editingItem ? "Edit Employee" : "Add New Employee"}
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
              editingItem || {
                slNo: "",
                employeeId: "",
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
                country: "",
                county: "",
                city: "",
                zipCode: "",
                division: "",
                position: "",
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
              name="employeeId"
              label="Employee ID"
              rules={[{ required: true, message: "Please input the Employee ID" }]}
            >
              <Input placeholder="Enter Employee ID" />
            </Form.Item>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please input the First Name" }]}
            >
              <Input placeholder="Enter First Name" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Please input the Last Name" }]}
            >
              <Input placeholder="Enter Last Name" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: "Please input the Phone" }]}
            >
              <Input placeholder="Enter Phone" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, message: "Please input the Email Address" }]}
            >
              <Input placeholder="Enter Email Address" />
            </Form.Item>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Please input the Country" }]}
            >
              <Input placeholder="Enter Country" />
            </Form.Item>
            <Form.Item
              name="county"
              label="County"
              rules={[{ required: true, message: "Please input the County" }]}
            >
              <Input placeholder="Enter County" />
            </Form.Item>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please input the City" }]}
            >
              <Input placeholder="Enter City" />
            </Form.Item>
            <Form.Item
              name="zipCode"
              label="Zip Code"
              rules={[{ required: true, message: "Please input the Zip Code" }]}
            >
              <Input placeholder="Enter Zip Code" />
            </Form.Item>
            <Form.Item
              name="division"
              label="Division"
              rules={[{ required: true, message: "Please input the Division" }]}
            >
              <Input placeholder="Enter Division" />
            </Form.Item>
            <Form.Item
              name="position"
              label="Position"
              rules={[{ required: true, message: "Please input the Position" }]}
            >
              <Input placeholder="Enter Position" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default ItemsList;