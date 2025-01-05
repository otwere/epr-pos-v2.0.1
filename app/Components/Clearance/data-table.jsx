import React from "react";
import { Table, Tag, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const DataTable = ({ data, loading }) => {
  const columns = [
    {
      title: "Sales Person",
      dataIndex: "salesPerson",
      key: "salesPerson",
      sorter: (a, b) => a.salesPerson.localeCompare(b.salesPerson),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Shift",
      dataIndex: "shift",
      key: "shift",
      filters: [
        { text: "Morning", value: "morning" },
        { text: "Evening", value: "evening" },
      ],
      onFilter: (value, record) => record.shift.toLowerCase().includes(value),
    },
    {
      title: "Expected",
      dataIndex: "expectedAmount",
      key: "expectedAmount",
      render: (amount) => `KES ${amount.toLocaleString()}`,
      sorter: (a, b) => a.expectedAmount - b.expectedAmount,
    },
    {
      title: "Collected",
      dataIndex: "availableAmount",
      key: "availableAmount",
      render: (amount) => `KES ${amount.toLocaleString()}`,
      sorter: (a, b) => a.availableAmount - b.availableAmount,
    },
    {
      title: "Difference",
      dataIndex: "difference",
      key: "difference",
      render: (diff) => {
        const color = diff === 0 ? "success" : diff > 0 ? "error" : "warning";
        const icon =
          diff === 0 ? (
            <CheckCircleOutlined />
          ) : diff > 0 ? (
            <CloseCircleOutlined />
          ) : (
            <WarningOutlined />
          );
        return (
          <Tag color={color} icon={icon}>
            KES : {Math.abs(diff).toLocaleString()}
            {diff !== 0 && (diff >0 ? " Short" : " Excess")}
          </Tag>
        );
      },
      sorter: (a, b) => a.difference - b.difference,
    },
    {
      title: "Payment Modes",
      key: "paymentModes",
      render: (_, record) => (
        <Tooltip
          title={
            <div>
              <p>Cash : KES : {record.paymentModes.cash.toLocaleString()}</p>
              <p>M-PESA : KES : {record.paymentModes.mpesa.toLocaleString()}</p>
              <p>
                PDQ | Bank | Cheque : KES :{" "}
                {record.paymentModes.pdq.toLocaleString()}
              </p>
            </div>
          }
        >
          <div className="cursor-help flex gap-1 justify-end">
            {record.paymentModes.cash > 0 && <Tag color="green">Cash</Tag>}
            {record.paymentModes.mpesa > 0 && <Tag color="blue">M-PESA</Tag>}
            {record.paymentModes.pdq > 0 && (
              <Tag color="purple">PDQ | Bank | Cheque</Tag>
            )}
          </div>
        </Tooltip>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      className="bg-white rounded-lg"
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} records`,
        className: "p-4",
      }}
    />
  );
};

export default DataTable;

