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

function BrandsList() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [brands, setBrands] = React.useState([]);
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
  const [editingBrand, setEditingBrand] = React.useState(null);

  // Initial mock data
  const initialBrands = React.useMemo(
    () => [
      {
        id: "1",
        brandId: "B001",
        brandCode: "BR001",
        brandName: "Brand One",
        description: "Brand One Description",
        status: true,
      },
      {
        id: "2",
        brandId: "B002",
        brandCode: "BR002",
        brandName: "Brand Two",
        description: "Brand Two Description",
        status: false,
      },
    ],
    []
  );

  // Generate next ID in sequence
  const generateNextId = React.useCallback((currentBrands) => {
    if (currentBrands.length === 0) return "B001";

    const lastBrand = [...currentBrands]
      .sort(
        (a, b) => parseInt(a.brandId.slice(1)) - parseInt(b.brandId.slice(1))
      )
      .pop();

    const lastNumber = parseInt(lastBrand.brandId.slice(1));
    return `B${String(lastNumber + 1).padStart(3, "0")}`;
  }, []);

  // Generate next brand code in sequence
  const generateNextBrandCode = React.useCallback((currentBrands) => {
    if (currentBrands.length === 0) return "BR001";

    const lastBrand = [...currentBrands]
      .sort(
        (a, b) =>
          parseInt(a.brandCode.slice(2)) - parseInt(b.brandCode.slice(2))
      )
      .pop();

    const lastNumber = parseInt(lastBrand.brandCode.slice(2));
    return `BR${String(lastNumber + 1).padStart(3, "0")}`;
  }, []);

  // Initialize brands from localStorage or use initial data
  React.useEffect(() => {
    const storedBrands = localStorage.getItem("brands");
    if (storedBrands) {
      setBrands(JSON.parse(storedBrands));
    } else {
      setBrands(initialBrands);
      localStorage.setItem("brands", JSON.stringify(initialBrands));
    }
  }, [initialBrands]);

  // Update localStorage whenever brands change
  React.useEffect(() => {
    localStorage.setItem("brands", JSON.stringify(brands));
  }, [brands]);

  // Filter and paginate brands
  const getFilteredAndPaginatedBrands = React.useCallback(() => {
    setLoading(true);
    try {
      // Apply search filter
      const filteredBySearch = brands.filter((brand) =>
        Object.values(brand).some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );

      // Apply status filter
      const filtered = filterStatus
        ? filteredBySearch.filter((brand) =>
            filterStatus === "active" ? brand.status : !brand.status
          )
        : filteredBySearch;

      // Apply pagination
      const startIndex = (pagination.current - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const paginatedBrands = filtered.slice(startIndex, endIndex);

      setPagination((prev) => ({ ...prev, total: filtered.length }));
      return paginatedBrands;
    } catch (error) {
      messageApi.error("Failed to fetch brands");
      return [];
    } finally {
      setLoading(false);
    }
  }, [
    brands,
    pagination.current,
    pagination.pageSize,
    searchTerm,
    filterStatus,
    messageApi,
  ]);

  const handleTableChange = React.useCallback((newPagination) => {
    setPagination(newPagination);
  }, []);

  const handleSearch = React.useCallback((e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page on search
  }, []);

  const handleStatusFilterChange = React.useCallback((value) => {
    setFilterStatus(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const filteredBrands = React.useMemo(() => {
    return getFilteredAndPaginatedBrands();
  }, [getFilteredAndPaginatedBrands]);

  const openModal = React.useCallback(() => {
    setModalMode("create");
    const nextBrandId = generateNextId(brands);
    const nextBrandCode = generateNextBrandCode(brands);

    form.resetFields();
    form.setFieldsValue({
      brandId: nextBrandId,
      brandCode: nextBrandCode,
    });

    setEditingBrand(null);
    setIsModalOpen(true);
  }, [form, brands, generateNextId, generateNextBrandCode]);

  const closeModal = React.useCallback(() => {
    setIsModalOpen(false);
    form.resetFields();
  }, [form]);

  const handleSave = React.useCallback(async () => {
    try {
      const values = await form.validateFields();

      if (editingBrand) {
        // Update existing brand
        setBrands((prevBrands) =>
          prevBrands.map((brand) =>
            brand.id === editingBrand.id ? { ...brand, ...values } : brand
          )
        );
        messageApi.success("Brand updated successfully");
      } else {
        // Create new brand
        const newBrand = {
          ...values,
          id: String(Date.now()),
          status: true,
        };

        setBrands((prevBrands) => [...prevBrands, newBrand]);
        messageApi.success("New brand added successfully");
      }
      closeModal();
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  }, [editingBrand, form, messageApi, closeModal]);

  const handleEdit = React.useCallback(
    (brand) => {
      setEditingBrand(brand);
      form.setFieldsValue(brand);
      setModalMode("edit");
      setIsModalOpen(true);
    },
    [form]
  );

  const handleDelete = React.useCallback(
    (id) => {
      Modal.confirm({
        title: "Are you sure you want to delete this brand?",
        content: "This action cannot be undone.",
        onOk: async () => {
          setLoading(true);
          try {
            setBrands((prevBrands) =>
              prevBrands.filter((brand) => brand.id !== id)
            );
            messageApi.success("Brand deleted successfully");
          } catch (error) {
            messageApi.error("Failed to delete brand");
          } finally {
            setLoading(false);
          }
        },
      });
    },
    [messageApi]
  );

  const toggleBrandStatus = React.useCallback(
    (id) => {
      setBrands((prevBrands) =>
        prevBrands.map((brand) =>
          brand.id === id ? { ...brand, status: !brand.status } : brand
        )
      );
      messageApi.success("Brand status updated");
    },
    [messageApi]
  );

  const columns = React.useMemo(
    () => [
      {
        title: "Brand ID",
        dataIndex: "brandId",
        sorter: (a, b) => (a.brandId ?? "").localeCompare(b.brandId ?? ""),
      },
      {
        title: "Brand Code",
        dataIndex: "brandCode",
        sorter: (a, b) => (a.brandCode ?? "").localeCompare(b.brandCode ?? ""),
      },
      {
        title: "Brand Name",
        dataIndex: "brandName",
        sorter: (a, b) => (a.brandName ?? "").localeCompare(b.brandName ?? ""),
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
            onChange={() => toggleBrandStatus(record.id)}
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
            <Tooltip title="Edit Brand">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
            <Tooltip title="Delete Brand">
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
    [toggleBrandStatus, handleEdit, handleDelete]
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
              { title: "Brands List" },
            ]}
            className="mb-3"
          />
          <hr />

          <div className="mb-4 flex justify-between items-center">
            <Title level={4} className="text-blue-600 mt-2">
              Brand Management
            </Title>
            <Text type="secondary">Manage your brands effectively</Text>
          </div>

          <Card className="shadow-sm rounded-lg">
            <div className="mb-4">
              <Space size="large" className="w-full flex justify-between">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search brands..."
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
                    Add Brand
                  </Button>
                </div>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={filteredBrands}
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
          title={modalMode === "create" ? "Add New Brand" : "Edit Brand"}
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
              editingBrand || {
                brandId: "",
                brandCode: "",
                brandName: "",
                description: "",
              }
            }
          >
            <Form.Item
              name="brandId"
              label="Brand ID"
              rules={[{ required: true, message: "Please input the brand ID" }]}
            >
              <Input placeholder="Auto-generated" disabled={true} />
            </Form.Item>
            <Form.Item
              name="brandCode"
              label="Brand Code"
              rules={[
                { required: true, message: "Please input the brand code" },
              ]}
            >
              <Input placeholder="Auto-generated" disabled={true} />
            </Form.Item>
            <Form.Item
              name="brandName"
              label="Brand Name"
              rules={[
                { required: true, message: "Please input the brand name" },
              ]}
            >
              <Input placeholder="Enter brand name" />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea placeholder="Enter brand description" />
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </div>
  );
}

export default BrandsList;
