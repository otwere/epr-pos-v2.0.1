import React from "react";
import { Table, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";

export const QuotationTable = ({ quotations, loading }) => {
  const columns = [
    { title: "Quotation ID", dataIndex: "quotationId", key: "quotationId" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Client", dataIndex: "clientId", key: "clientId" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Button type="text" icon={<MoreOutlined />} />
      ),
    },
  ];

  return (
    
    <Table
      dataSource={quotations}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

