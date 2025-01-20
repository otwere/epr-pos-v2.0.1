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
  Row,
  Col,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  SaveOutlined,
  MoreOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
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
    { title: "#", dataIndex: "slNo", key: "slNo", sorter: (a, b) => a.slNo - b.slNo },
    { title: "$ID", dataIndex: "employeeId", key: "employeeId", sorter: (a, b) => a.employeeId.localeCompare(b.employeeId) },
    { title: "First Name", dataIndex: "firstName", key: "firstName", sorter: (a, b) => a.firstName.localeCompare(b.firstName) },
    { title: "Last Name", dataIndex: "lastName", key: "lastName", sorter: (a, b) => a.lastName.localeCompare(b.lastName) },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email Address", dataIndex: "email", key: "email" },
    { title: "Country", dataIndex: "country", key: "country", sorter: (a, b) => a.country.localeCompare(b.country) },
    { title: "County", dataIndex: "county", key: "county" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Code", dataIndex: "zipCode", key: "zipCode" },
    { title: "Department", dataIndex: "division", key: "division", sorter: (a, b) => a.division.localeCompare(b.division) },
    { title: "Position", dataIndex: "position", key: "position", sorter: (a, b) => a.position.localeCompare(b.position) },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Dropdown menu={{ items: actionsMenu(record) }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Calculate dashboard metrics
  const totalEmployees = items.length;
  const employeesByDepartment = items.reduce((acc, item) => {
    acc[item.division] = (acc[item.division] || 0) + 1;
    return acc;
  }, {});

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
            <hr className="border-gray-200" />
            
            <div className="mb-4 flex justify-between items-center">
              <Title level={4} className="text-blue-800 mt-2 font-semibold">
                Employees Dashboard
              </Title>
              <Text type="secondary" className="text-gray-500"> Overview of Employees</Text>
            </div>
            <hr className="border-gray-200 -mt-2 mb-4" />
          </div>

          {/* Dashboard Section */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col span={8}>
              <Card className="rounded-lg border-0 hover:shadow-lg transition-shadow duration-300">
                <Statistic
                  title="Total Employees"
                  value={totalEmployees}
                  prefix={<UserOutlined className="text-blue-500" />}
                  valueStyle={{ color: '#1E40AF' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card className="rounded-lg border-0 hover:shadow-lg transition-shadow duration-300">
                <Statistic
                  title="Employees in Sales"
                  value={employeesByDepartment["Sales"] || 0}
                  prefix={<TeamOutlined className="text-blue-500" />}
                  valueStyle={{ color: '#1E40AF' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card className="rounded-lg border-0 hover:shadow-lg transition-shadow duration-300">
                <Statistic
                  title="Employees in Marketing"
                  value={employeesByDepartment["Marketing"] || 0}
                  prefix={<TeamOutlined className="text-blue-500" />}
                  valueStyle={{ color: '#1E40AF' }}
                />
              </Card>
            </Col>
          </Row>

          <Card className="rounded-lg border-0 bg-gray-50">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  placeholder="Search Employees by Employee ID, Name, Email, Phone, etc."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full"
                />
              </div>
              <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 hover:bg-blue-700">
                <Link href="/add_new_employee">Add New Employee</Link>
              </Button>
            </div>

            <hr className="border-gray-200 mt-4 mb-4" />

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
              scroll={{ x: true }}
              className="rounded-lg"
              rowClassName="hover:bg-gray-50 transition-colors duration-200"
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
          <Button key="cancel" onClick={() => setIsDialogOpen(false)} className="border-gray-300">
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>,
        ]}
        className="rounded-lg"
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
              <Input type="number" placeholder="Enter SL No" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="employeeId"
              label="Employee ID"
              rules={[{ required: true, message: "Please input the Employee ID" }]}
            >
              <Input placeholder="Enter Employee ID" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please input the First Name" }]}
            >
              <Input placeholder="Enter First Name" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Please input the Last Name" }]}
            >
              <Input placeholder="Enter Last Name" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: "Please input the Phone" }]}
            >
              <Input placeholder="Enter Phone" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, message: "Please input the Email Address" }]}
            >
              <Input placeholder="Enter Email Address" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Please input the Country" }]}
            >
              <Input placeholder="Enter Country" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="county"
              label="County"
              rules={[{ required: true, message: "Please input the County" }]}
            >
              <Input placeholder="Enter County" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please input the City" }]}
            >
              <Input placeholder="Enter City" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="zipCode"
              label="Zip Code"
              rules={[{ required: true, message: "Please input the Zip Code" }]}
            >
              <Input placeholder="Enter Zip Code" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="division"
              label="Division"
              rules={[{ required: true, message: "Please input the Division" }]}
            >
              <Input placeholder="Enter Division" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="position"
              label="Position"
              rules={[{ required: true, message: "Please input the Position" }]}
            >
              <Input placeholder="Enter Position" className="rounded-lg" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default ItemsList;