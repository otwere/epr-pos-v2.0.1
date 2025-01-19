import React, { useState } from "react";
import { Table, Space, Button, Input, Badge, Typography, notification } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

const PaymentsTable = ({
  filteredPayments,
  loading,
  selectedRowKeys,
  setSelectedRowKeys,
  paymentStatus,
  rejectionReasons,
  submittedReasons,
  handleApprovePayment,
  handleRejectPayment,
  handleRejectionReasonSubmit,
  isMultiCurrencyEnabled,
  renderCurrencyConversion,
  renderStatusBadge,
  setRejectionReasons,
}) => {
  const columns = [
    {
      title: "Transaction By",
      dataIndex: "transBy",
      key: "transBy",
      sorter: (a, b) => a.transBy.localeCompare(b.transBy),
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      sorter: (a, b) => dayjs(a.paymentDate).unix() - dayjs(b.paymentDate).unix(),
    },
    {
      title: "Payment Mode",
      dataIndex: "payMode",
      key: "payMode",
      sorter: (a, b) => a.payMode.localeCompare(b.payMode),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      sorter: (a, b) => a.branch.localeCompare(b.branch),
    },
    {
      title: "Account",
      dataIndex: "account",
      key: "account",
      sorter: (a, b) => a.account.localeCompare(b.account),
    },
    {
      title: "Amount",
      dataIndex: "in",
      key: "amount",
      render: (_, record) =>
        isMultiCurrencyEnabled
          ? renderCurrencyConversion(record.in || record.out, record.currency)
          : `${record.in || record.out} ${record.currency}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => renderStatusBadge(paymentStatus[record.id] || record.status),
    },
    {
      title: "Reject Reason",
      dataIndex: "rejectReason",
      key: "rejectReason",
      render: (_, record) =>
        paymentStatus[record.id] === "Rejected" && rejectionReasons[record.id] ? (
          <Text type="secondary">{rejectionReasons[record.id]}</Text>
        ) : null,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprovePayment(record.id)}
            disabled={paymentStatus[record.id] === "Approved"}
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => handleRejectPayment(record.id)}
            disabled={paymentStatus[record.id] === "Rejected"}
          >
            Reject
          </Button>
          {paymentStatus[record.id] === "Rejected" && !submittedReasons[record.id] && (
            <div>
              <Input.TextArea
                placeholder="Enter reason for rejection"
                value={rejectionReasons[record.id] || ""}
                onChange={(e) =>
                  setRejectionReasons((prev) => ({
                    ...prev,
                    [record.id]: e.target.value,
                  }))
                }
              />
              <Button
                type="primary"
                onClick={() => handleRejectionReasonSubmit(record.id)}
              >
                Submit Reason
              </Button>
            </div>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredPayments}
      rowSelection={{
        selectedRowKeys,
        onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
      }}
      pagination={{ pageSize: 10 }}
      rowKey="id"
      loading={loading}
    />
  );
};

// Mock data for the PaymentsTable
const mockPayments = [
  {
    id: 1,
    transBy: "John Doe",
    paymentDate: "2023-10-01",
    payMode: "Credit Card",
    description: "Monthly Subscription",
    branch: "New York",
    account: "123456789",
    in: 100,
    out: 0,
    currency: "USD",
    status: "Pending",
  },
  {
    id: 2,
    transBy: "Jane Smith",
    paymentDate: "2023-10-02",
    payMode: "Bank Transfer",
    description: "Office Supplies",
    branch: "San Francisco",
    account: "987654321",
    in: 200,
    out: 0,
    currency: "USD",
    status: "Pending",
  },
  {
    id: 3,
    transBy: "Alice Johnson",
    paymentDate: "2023-10-03",
    payMode: "PayPal",
    description: "Software License",
    branch: "Chicago",
    account: "456123789",
    in: 150,
    out: 0,
    currency: "USD",
    status: "Pending",
  },
  {
    id: 4,
    transBy: "Bob Brown",
    paymentDate: "2023-10-04",
    payMode: "Debit Card",
    description: "Marketing Services",
    branch: "Los Angeles",
    account: "789456123",
    in: 300,
    out: 0,
    currency: "USD",
    status: "Pending",
  },
  {
    id: 5,
    transBy: "Charlie Davis",
    paymentDate: "2023-10-05",
    payMode: "Cash",
    description: "Travel Expenses",
    branch: "Miami",
    account: "321654987",
    in: 250,
    out: 0,
    currency: "USD",
    status: "Pending",
  },
];

// Main App Component
const App = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState({});
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [submittedReasons, setSubmittedReasons] = useState({});

  // Notification for approval
  const notifyApproval = (id) => {
    notification.success({
      message: "Payment Approved",
      description: `Payment with ID ${id} has been approved.`,
      placement: "topRight",
    });
  };

  // Notification for rejection
  const notifyRejection = (id) => {
    notification.error({
      message: "Payment Rejected",
      description: `Payment with ID ${id} has been rejected.`,
      placement: "topRight",
    });
  };

  const handleApprovePayment = (id) => {
    setPaymentStatus((prev) => ({ ...prev, [id]: "Approved" }));
    notifyApproval(id); // Show approval notification
    console.log(`Approved payment with id: ${id}`);
  };

  const handleRejectPayment = (id) => {
    setPaymentStatus((prev) => ({ ...prev, [id]: "Rejected" }));
    notifyRejection(id); // Show rejection notification
    console.log(`Rejected payment with id: ${id}`);
  };

  const handleRejectionReasonSubmit = (id) => {
    setSubmittedReasons((prev) => ({ ...prev, [id]: true }));
    console.log(`Submitted rejection reason for payment with id: ${id}`);
  };

  const renderCurrencyConversion = (amount, currency) => {
    return `${amount} ${currency}`;
  };

  const renderStatusBadge = (status) => {
    return (
      <Badge
        status={status === "Approved" ? "success" : status === "Rejected" ? "error" : "default"}
        text={status}
      />
    );
  };

  return (
    <PaymentsTable
      filteredPayments={mockPayments}
      loading={false}
      selectedRowKeys={selectedRowKeys}
      setSelectedRowKeys={setSelectedRowKeys}
      paymentStatus={paymentStatus}
      rejectionReasons={rejectionReasons}
      submittedReasons={submittedReasons}
      handleApprovePayment={handleApprovePayment}
      handleRejectPayment={handleRejectPayment}
      handleRejectionReasonSubmit={handleRejectionReasonSubmit}
      isMultiCurrencyEnabled={false}
      renderCurrencyConversion={renderCurrencyConversion}
      renderStatusBadge={renderStatusBadge}
      setRejectionReasons={setRejectionReasons}
    />
  );
};

export default App;