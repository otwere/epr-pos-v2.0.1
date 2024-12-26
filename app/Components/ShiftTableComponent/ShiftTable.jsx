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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween"; // Import the plugin
dayjs.extend(isBetween); // Extend dayjs with the isBetween plugin

import DeleteConfirmationModal from "../DeleteConfirmationModalComponent/DeleteConfirmationModal";

const { Text } = Typography;

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
  const [isDeleteModalOpen, setIsDeleteModalOepn] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState(null);
  const [editingShift, setEditingShift] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

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

        if (
          data.some(
            (item) =>
              item.shiftDate === newData.shiftDate &&
              item.branch === newData.branch &&
              (!editingShift || editingShift.key !== item.key)
          )
        ) {
          return form.setFields([
            {
              name: "shiftDate",
              errors: ["Shift already exists for this branch and date!"],
            },
          ]);
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
      });
  }, [editingShift, data, closeModal, form]);

  const promptDelete = useCallback((record) => {
    setShiftToDelete(record);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (!shiftToDelete) return;

    // Simulating an async delete operation
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
            <Text strong>Closing Time:</Text> {record.closingTime === "00-00-0000" ? "N/A" : record.closingTime}
          </p>
          <p>
            <Text strong>Status:</Text>
            <Tag color={record.status === "Opened" ? "green" : "orange"}>
              {record.status}
            </Tag>
          </p>
        </div>
      ),
    });
  }, []);

  // Check and update the status dynamically based on current time
  useEffect(() => {
    const updatedData = data.map((shift) => {
      const currentTime = dayjs();
      const openingTime = dayjs(shift.openingTime);
      const closingTime = shift.closingTime !== "00-00-0000" ? dayjs(shift.closingTime) : null;

      // Check if current time is within opening and closing time
      if (closingTime && currentTime.isAfter(closingTime)) {
        shift.status = "Closed";
      } else if (currentTime.isBetween(openingTime, closingTime, null, "[)")) {
        shift.status = "Opened";
      } else {
        shift.status = "Closed"; // if current time is before opening
      }

      return shift;
    });
    setData(updatedData);
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
        time === "00-00-0000" ? "N/A" : dayjs(time).format("DD-MM-YYYY HH:mm:ss"),
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

  const filteredData = data.filter(
    (item) =>
      item.branch.toLowerCase().includes(searchText) ||
      item.shiftDate.includes(searchText) ||
      item.status.toLowerCase().includes(searchText)
  );

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Search by branch | date | status"
          onChange={(e) => setSearchText(e.target.value.toLowerCase())}
          className="w-1/3"
          prefix={<SearchOutlined className="text-gray-400" />}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openEditModal(null)}
        >
          Add Shift
        </Button>
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
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="branch"
            label="Branch | Station"
            rules={[{ required: true, message: "Please enter branch name!" }]}
          >
            <Input placeholder="Enter branch | station" />
          </Form.Item>
          <Form.Item
            name="shiftDate"
            label="Shift Date"
            rules={[{ required: true, message: "Please select shift date!" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="openingTime"
            label="Opening Date | Time"
            rules={[{ required: true, message: "Please select opening time!" }]}
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
          >
            <DatePicker showTime format="DD-MM-YYYY HH:mm:ss" className="w-full" />
          </Form.Item>
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
