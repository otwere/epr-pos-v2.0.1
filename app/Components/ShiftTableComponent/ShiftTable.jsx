import React, { useState, useCallback, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  Dropdown,
  message,
  Typography,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import DeleteConfirmationModal from "../DeleteConfirmationModalComponent/DeleteConfirmationModal";

dayjs.extend(isBetween);

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const branches = [
  "Mombasa Branch Likoni",
  "Nakuru Branch",
  "Nairobi Branch (HQ)",
];

const ShiftTable = () => {
  const [data, setData] = useState([
    {
      key: "1",
      branch: "Mombasa Branch Likoni",
      shiftDate: "2024-12-15",
      openingTime: "2024-12-15 13:31:30",
      closingTime: "2024-12-17 13:33:20",
      status: "Closed",
    },
    {
      key: "2",
      branch: "Nakuru Branch",
      shiftDate: "2024-12-16",
      openingTime: "2024-12-16 13:24:12",
      closingTime: "2024-12-17 13:31:23",
      status: "Closed",
    },
    {
      key: "3",
      branch: "Nairobi Branch (HQ)",
      shiftDate: "2024-12-17",
      openingTime: "2024-12-17 13:37:28",
      closingTime: "0000-00-00",
      status: "Opened",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState(null);
  const [editingShift, setEditingShift] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDateRange, setSearchDateRange] = useState([]);

  const openEditModal = useCallback((record) => {
    setEditingShift(record);
    form.setFieldsValue({
      branch: record?.branch || "",
      shiftDate: record?.shiftDate ? dayjs(record.shiftDate) : null,
      openingTime: record?.openingTime ? dayjs(record.openingTime) : null,
      closingTime:
        record?.closingTime && record.closingTime !== "0000-00-00"
          ? dayjs(record.closingTime)
          : null,
    });
    setIsModalOpen(true);
  }, [form]);

  const closeModal = useCallback(() => {
    setEditingShift(null);
    form.resetFields();
    setIsModalOpen(false);
  }, [form]);

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const newData = {
          key: editingShift ? editingShift.key : Date.now().toString(),
          branch: values.branch,
          shiftDate: values.shiftDate.format("YYYY-MM-DD"),
          openingTime: values.openingTime.format("YYYY-MM-DD HH:mm:ss"),
          closingTime: values.closingTime
            ? values.closingTime.format("YYYY-MM-DD HH:mm:ss")
            : "0000-00-00",
          status:
            values.closingTime && values.closingTime.format("YYYY-MM-DD") !== "0000-00-00"
              ? "Closed"
              : "Opened",
        };

        // Check for overlapping shifts
        const isOverlapping = data.some((item) => {
          if (item.branch === newData.branch && item.key !== newData.key) {
            const newOpening = dayjs(newData.openingTime);
            const newClosing = newData.closingTime === "0000-00-00" ? dayjs().add(100, 'year') : dayjs(newData.closingTime);
            const existingOpening = dayjs(item.openingTime);
            const existingClosing = item.closingTime === "0000-00-00" ? dayjs().add(100, 'year') : dayjs(item.closingTime);

            return (
              (newOpening.isBetween(existingOpening, existingClosing, null, '[]') ||
                newClosing.isBetween(existingOpening, existingClosing, null, '[]')) ||
              (existingOpening.isBetween(newOpening, newClosing, null, '[]') ||
                existingClosing.isBetween(newOpening, newClosing, null, '[]'))
            );
          }
          return false;
        });

        if (isOverlapping) {
          message.error("Shift overlaps with an existing shift for the same branch!");
          return;
        }

        if (editingShift) {
          setData((prev) =>
            prev.map((item) => (item.key === editingShift.key ? newData : item))
          );
          message.success("Shift updated successfully!");
        } else {
          setData((prev) => [...prev, newData]);
          message.success("Shift added successfully!");
        }
        closeModal();
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
        message.error("Failed to submit the form. Please check the fields and try again.");
      });
  }, [editingShift, data, closeModal, form]);

  const promptDelete = useCallback((record) => {
    setShiftToDelete(record);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (!shiftToDelete) return;

    setData((prev) => prev.filter((item) => item.key !== shiftToDelete.key));
    message.success(
      `Shift for ${shiftToDelete.branch} on ${shiftToDelete.shiftDate} deleted successfully!`
    );

    setIsDeleteModalOpen(false);
    setShiftToDelete(null);
  }, [shiftToDelete]);

  const handleView = useCallback((record) => {
    Modal.info({
      title: "Shift Details",
      content: (
        <div>
          <p>
            <Text strong>Branch:</Text> {record.branch}
          </p>
          <p>
            <Text strong>Shift Date:</Text> {record.shiftDate}
          </p>
          <p>
            <Text strong>Opening Time:</Text> {record.openingTime}
          </p>
          <p>
            <Text strong>Closing Time:</Text> {record.closingTime === "0000-00-00" ? "N/A" : record.closingTime}
          </p>
          <p>
            <Text strong>Status:</Text>
            <Tag color={record.status === "Opened" ? "green" : "orange"}>
              {record.status}
            </Tag>
          </p>
          <p>
            <Text strong>Duration:</Text> {calculateDuration(record.openingTime, record.closingTime)}
          </p>
        </div>
      ),
    });
  }, []);

  const calculateDuration = (openingTime, closingTime) => {
    if (closingTime === "0000-00-00") return "Open 24 / 7";
    const start = dayjs(openingTime);
    const end = dayjs(closingTime);
    const duration = end.diff(start, 'hour', true);
    return `${duration.toFixed(2)} hours`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedData = data.map((shift) => {
        const currentTime = dayjs();
        const openingTime = dayjs(shift.openingTime);
        const closingTime = shift.closingTime !== "0000-00-00" ? dayjs(shift.closingTime) : null;

        if (closingTime && currentTime.isAfter(closingTime)) {
          shift.status = "Closed";
        } else if (currentTime.isBetween(openingTime, closingTime, null, "[)")) {
          shift.status = "Opened";
        } else {
          shift.status = "Closed";
        }

        return shift;
      });
      setData(updatedData);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [data]);

  const columns = [
    {
      title: "Branch | Station",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Shift Date",
      dataIndex: "shiftDate",
      key: "shiftDate",
    },
    {
      title: "Opening Date | Time",
      dataIndex: "openingTime",
      key: "openingTime",
      render: (time) => dayjs(time).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Closing Date | Time",
      dataIndex: "closingTime",
      key: "closingTime",
      render: (time) =>
        time === "0000-00-00" ? "N/A" : dayjs(time).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Opened" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => calculateDuration(record.openingTime, record.closingTime),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const menuItems = [
          {
            key: "view",
            label: "View Details",
            icon: <EyeOutlined />,
            onClick: () => handleView(record),
          },
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined />,
            onClick: () => openEditModal(record),
          },
          {
            key: "delete",
            label: "Delete",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => promptDelete(record),
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button>
              <Space>
                Actions
                <MoreOutlined />
              </Space>
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const filteredData = data.filter((item) => {
    const matchesSearchText =
      item.branch.toLowerCase().includes(searchText) ||
      item.shiftDate.includes(searchText) ||
      item.status.toLowerCase().includes(searchText);

    const matchesStatus = searchStatus ? item.status === searchStatus : true;

    const matchesDateRange = searchDateRange.length
      ? dayjs(item.shiftDate).isBetween(searchDateRange[0], searchDateRange[1], null, '[]')
      : true;

    return matchesSearchText && matchesStatus && matchesDateRange;
  });

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Search by branch | date | status"
          onChange={(e) => setSearchText(e.target.value.toLowerCase())}
          className="w-1/3"
          prefix={<SearchOutlined className="text-gray-400" />}
        />
        <Space>
          <Select
            placeholder="Filter by status"
            allowClear
            onChange={(value) => setSearchStatus(value)}
            className="w-40"
          >
            <Option value="Opened">Opened</Option>
            <Option value="Closed">Closed</Option>
          </Select>
          <RangePicker
            onChange={(dates) => setSearchDateRange(dates)}
            className="w-48"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openEditModal(null)}
          >
            Add Shift
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} shifts`,
        }}
        rowClassName={(record) =>
          record.status === "Opened" ? "bg-green-100" : ""
        }
        locale={{ emptyText: "No shifts available. Add a shift to get started!" }}
      />

      {/* Edit/Add Shift Modal */}
      <Modal
        title={editingShift ? "Edit Shift" : "Add Shift"}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={handleSubmit}
        okText={editingShift ? "Update" : "Add"}
        style={{ width: '1400px' }} // Added this line to increase modal width
      >
        <Form form={form} layout="vertical">
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="branch"
              label="Branch | Station"
              rules={[{ required: true, message: "Please select branch!" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Select branch | station">
                {branches.map((branch) => (
                  <Option key={branch} value={branch}>
                    {branch}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="shiftDate"
              label="Shift Date"
              rules={[{ required: true, message: "Please select shift date!" }]}
              style={{ flex: 1 }}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="openingTime"
              label="Opening Date | Time"
              rules={[{ required: true, message: "Please select opening time!" }]}
              style={{ flex: 1 }}
            >
              <DatePicker showTime format="DD-MM-YYYY HH:mm:ss" className="w-full" />
            </Form.Item>
            <Form.Item
              name="closingTime"
              label="Closing Date | Time"
              rules={[
                { required: true, message: "Please select closing time!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const openingTime = dayjs(getFieldValue("openingTime"));
                    const closingTime = dayjs(value);
                    if (!value || closingTime.isAfter(openingTime)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Closing time must be after opening time!")
                    );
                  },
                }),
              ]}
              style={{ flex: 1 }}
            >
              <DatePicker showTime format="DD-MM-YYYY HH:mm:ss" className="w-full" />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        shiftToDelete={shiftToDelete}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default ShiftTable;