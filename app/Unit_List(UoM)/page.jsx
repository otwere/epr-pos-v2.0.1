"use client";

import React from "react";
import {
  Layout,
  Breadcrumb,
  Typography,
  Input,
  Button,
  Table,
  Modal,
  message,
  Card,
  Form,
  Space,
  Switch,
  Pagination,
  Tooltip,
  Select,
} from "antd";
import {
  HomeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";

// Importing Components
import Header from "../Components/HeaderComponent/Header";
import Sidebar from "../Components/SidebarComponent/Sidebar";
import Footer from "../Components/FooterComponent/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;

function UnitList() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [units, setUnits] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState("create");
  const [form] = Form.useForm();
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [editingUnit, setEditingUnit] = React.useState(null);

  const initialUnits = React.useMemo(
    () => [
      {
        id: "1",
        unitId: "U001",
        unitName: "Unit One",
        shortName: "UT001",
        baseUnit: "", // Base unit placeholder
        description: "Unit Description",
        status: true,
      },
      {
        id: "2",
        unitId: "U002",
        unitName: "Unit Two",
        shortName: "UT002",
        baseUnit: "", // Base unit placeholder
        description: "Unit Description -2",
        status: true,
      },
    ],
    []
  );

  const generateNextId = React.useCallback((currentUnits) => {
    if (currentUnits.length === 0) return "U001";

    const lastUnit = [...currentUnits]
      .sort((a, b) => parseInt(a.unitId.slice(1)) - parseInt(b.unitId.slice(1)))
      .pop();

    const lastNumber = parseInt(lastUnit.unitId.slice(1));
    return `U${String(lastNumber + 1).padStart(3, "0")}`;
  }, []);

  React.useEffect(() => {
    const storedUnits = localStorage.getItem("units");
    if (storedUnits) {
      setUnits(JSON.parse(storedUnits));
    } else {
      setUnits(initialUnits);
      localStorage.setItem("units", JSON.stringify(initialUnits));
    }
  }, [initialUnits]);

  React.useEffect(() => {
    localStorage.setItem("units", JSON.stringify(units));
  }, [units]);

  const getFilteredAndPaginatedUnits = React.useCallback(() => {
    setLoading(true);
    try {
      const filteredBySearch = units.filter((unit) =>
        Object.values(unit).some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );

      const filtered = filterStatus
        ? filteredBySearch.filter((unit) =>
            filterStatus === "active" ? unit.status : !unit.status
          )
        : filteredBySearch;

      const startIndex = (pagination.current - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const paginatedUnits = filtered.slice(startIndex, endIndex);

      setPagination((prev) => ({ ...prev, total: filtered.length }));
      return paginatedUnits;
    } catch (error) {
      messageApi.error("Failed to fetch units");
      return [];
    } finally {
      setLoading(false);
    }
  }, [units, pagination.current, pagination.pageSize, searchTerm, filterStatus, messageApi]);

  const handleTableChange = React.useCallback((newPagination) => {
    setPagination(newPagination);
  }, []);

  const handleSearch = React.useCallback((e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleStatusFilterChange = React.useCallback((value) => {
    setFilterStatus(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const filteredUnits = React.useMemo(() => {
    return getFilteredAndPaginatedUnits();
  }, [getFilteredAndPaginatedUnits]);

  const openModal = React.useCallback(() => {
    setModalMode("create");
    const nextUnitId = generateNextId(units);

    form.resetFields();
    form.setFieldsValue({
      unitId: nextUnitId,
    });

    setEditingUnit(null);
    setIsModalOpen(true);
  }, [form, units, generateNextId]);

  const closeModal = React.useCallback(() => {
    setIsModalOpen(false);
    form.resetFields();
  }, [form]);

  const handleSave = React.useCallback(async () => {
    try {
      const values = await form.validateFields();

      if (editingUnit) {
        setUnits((prevUnits) =>
          prevUnits.map((unit) =>
            unit.id === editingUnit.id ? { ...unit, ...values } : unit
          )
        );
        messageApi.success("Unit updated successfully");
      } else {
        const newUnit = {
          ...values,
          id: String(Date.now()),
          status: true,
        };

        setUnits((prevUnits) => [...prevUnits, newUnit]);
        messageApi.success("New unit added successfully");
      }
      closeModal();
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  }, [editingUnit, form, messageApi, closeModal]);

  const handleEdit = React.useCallback((unit) => {
    setEditingUnit(unit);
    form.setFieldsValue(unit);
    setModalMode("edit");
    setIsModalOpen(true);
  }, [form]);

  const handleDelete = React.useCallback((id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this unit?",
      content: "This action cannot be undone.",
      onOk: async () => {
        setLoading(true);
        try {
          setUnits((prevUnits) => prevUnits.filter((unit) => unit.id !== id));
          messageApi.success("Unit deleted successfully");
        } catch (error) {
          messageApi.error("Failed to delete unit");
        } finally {
          setLoading(false);
        }
      },
    });
  }, [messageApi]);

  const toggleUnitStatus = React.useCallback((id) => {
    setUnits((prevUnits) =>
      prevUnits.map((unit) =>
        unit.id === id ? { ...unit, status: !unit.status } : unit
      )
    );
    messageApi.success("Unit status updated");
  }, [messageApi]);

  const columns = React.useMemo(
    () => [
      {
        title: "Unit ID",
        dataIndex: "unitId",
        sorter: (a, b) => (a.unitId ?? "").localeCompare(b.unitId ?? ""),
      },
      {
        title: "Unit Name",
        dataIndex: "unitName",
        sorter: (a, b) => (a.unitName ?? "").localeCompare(b.unitName ?? ""),
      },
      {
        title: "Short Name",
        dataIndex: "shortName",
        sorter: (a, b) => (a.shortName ?? "").localeCompare(b.shortName ?? ""),
      },
      {
        title: "Base Unit",
        dataIndex: "baseUnit",
        render: (text) => text ?? "-",
      },
      {
        title: "Description",
        dataIndex: "description",
        render: (text) => text ?? "-",
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status, record) => (
          <Switch
            checked={!!status}
            onChange={() => toggleUnitStatus(record.id)}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space>
            <Tooltip title="Edit Unit">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
            <Tooltip title="Delete Unit">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [toggleUnitStatus, handleEdit, handleDelete]
  );

  return (
    <div className="min-h-screen flex">
      {contextHolder}
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className="flex-1 bg-gray-50">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="p-6">
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
              { title: "Units List" },
            ]}
            className="mb-3"
          />
          <hr />

          <div className="mb-4 flex justify-between items-center">
            <Title level={4} className="text-blue-600 mt-2">
              Unit Management
            </Title>
            <Text type="secondary">Manage your units effectively</Text>
          </div>

          <Card className="shadow-sm rounded-lg">
            <div className="mb-4">
              <Space size="large" className="w-full flex justify-between">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search by Unit ID | Name | Base"
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: 300 }}
                />                
                <div className="flex items-center space-x-4">  
                <Select
                  defaultValue=""
                  style={{ width: 200 }}
                  onChange={handleStatusFilterChange}
                  options={[
                    { value: "", label: "Check by Status ( All )" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />                
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openModal}
                  >
                    Add Unit
                  </Button>
                </div>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={filteredUnits}
              rowKey="id"
              pagination={false}
              loading={loading}
              onChange={handleTableChange}
              className="border border-gray-200 rounded"
              locale={{
                emptyText: searchTerm
                  ? "No matching results found"
                  : "No data available",
              }}
            />

            <div className="flex justify-end mt-4">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger
                pageSizeOptions={["10", "20", "50"]}
                showTotal={(total) => `${total} items`}
                onChange={(page, pageSize) =>
                  setPagination({ ...pagination, current: page, pageSize })
                }
              />
            </div>
          </Card>
        </Content>
        <Footer />

        <Modal
          title={modalMode === "create" ? "Add New Unit" : "Edit Unit"}
          open={isModalOpen}
          onCancel={closeModal}
          destroyOnClose
          footer={[
            <Button key="cancel" onClick={closeModal}>
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
            >
              Save
            </Button>,
          ]}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={
              editingUnit || {
                unitId: "",
                unitName: "",
                shortName: "",
                baseUnit: "",
                description: "",
              }
            }
          >
            <Form.Item
              name="unitId"
              label="Unit ID"
              rules={[{ required: true, message: "Please input the unit ID" }]}
            >
              <Input placeholder="Auto-generated" disabled={true} />
            </Form.Item>
            <Form.Item
              name="unitName"
              label="Unit Name"
              rules={[{ required: true, message: "Please input the unit name" }]}
            >
              <Input placeholder="Enter unit name" />
            </Form.Item>
            <Form.Item
              name="shortName"
              label="Short Name"
              rules={[{ required: true, message: "Please input the short name" }]}
            >
              <Input placeholder="Short Name (e.g., Pc)" />
            </Form.Item>
            <Form.Item
              name="baseUnit"
              label="Base Unit"
              rules={[{ required: true, message: "Please select a base unit" }]}
            >
              <Select placeholder="Select base unit">
                <Select.Option value="Piece">Piece</Select.Option>
                <Select.Option value="Kilogram">Kilogram</Select.Option>
                <Select.Option value="Liter">Liter</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea placeholder="Enter unit description" />
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </div>
  );
}

export default UnitList;
