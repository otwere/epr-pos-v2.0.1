import React from "react";
import { Table } from "antd";
import moment from "moment";

const FundsTransferTable = ({ fundsTransferData = [] }) => {
  const { totalIn, totalOut } = fundsTransferData.reduce(
    (acc, item) => {
      acc.totalIn += Number(item.in) || 0;
      acc.totalOut += Number(item.out) || 0;
      return acc;
    },
    { totalIn: 0, totalOut: 0 }
  );

  const filteredData = fundsTransferData.filter(item => {
    const transferDate = moment(item.transferDate);
    return transferDate.isValid() && !transferDate.isAfter(moment(), 'day');
  });

  return (
    <Table
      columns={[
        {
          title: "Transfer Date",
          dataIndex: "transferDate",
          key: "transferDate",
          sorter: (a, b) => moment(a.transferDate).unix() - moment(b.transferDate).unix(),
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
          title: "Description",
          dataIndex: "description",
          key: "description",
          sorter: (a, b) => a.description.localeCompare(b.description),
        },
        {
          title: "In",
          dataIndex: "in",
          key: "in",
          sorter: (a, b) => a.in - b.in,
        },
        {
          title: "Out",
          dataIndex: "out",
          key: "out",
          sorter: (a, b) => a.out - b.out,
        },
      ]}
      dataSource={filteredData}
      pagination={{ pageSize: 10 }}
      locale={{ emptyText: "No data available in table" }}
      rowKey="id"
      footer={() => (
        <div className="font-bold text-right ">
          Totals : In : {totalIn.toFixed(2)} | Out : {totalOut.toFixed(2)}
        </div>
      )}
    />
  );
};

export default FundsTransferTable;