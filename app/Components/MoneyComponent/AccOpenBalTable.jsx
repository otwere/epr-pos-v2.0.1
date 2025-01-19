import React from "react";
import { Table } from "antd";
import dayjs from "dayjs";

const AccOpenBalTable = ({ accOpenBalData = [] }) => {
  return (
    <Table
      columns={[
        {
          title: "Created Date",
          dataIndex: "createdDate",
          key: "createdDate",
          sorter: (a, b) =>
            dayjs(a.createdDate).unix() - dayjs(b.createdDate).unix(),
        },
        {
          title: "Account Name",
          dataIndex: "accountName",
          key: "accountName",
          sorter: (a, b) => a.accountName.localeCompare(b.accountName),
        },
        {
          title: "Posted By",
          dataIndex: "postedBy",
          key: "postedBy",
          sorter: (a, b) => a.postedBy.localeCompare(b.postedBy),
        },
        {
          title: "Branch",
          dataIndex: "branch",
          key: "branch",
          sorter: (a, b) => a.branch.localeCompare(b.branch),
        },
        {
          title: "Amount",
          dataIndex: "amount",
          key: "amount",
          sorter: (a, b) => a.amount - b.amount,
        },
      ]}
      dataSource={accOpenBalData}
      pagination={{ pageSize: 10 }}
      locale={{ emptyText: "No data available in table" }}
      rowKey="id"
      footer={() => {
        const totalAmount = accOpenBalData.reduce(
          (sum, record) => sum + Number(record.amount),
          0
        );
        return (
          <div className="font-bold text-right">
            Total Amount : {totalAmount.toFixed(2)}
          </div>
        );
      }}
    />
  );
};

export default AccOpenBalTable;
