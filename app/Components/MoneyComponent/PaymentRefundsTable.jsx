import React from "react";
import { Table } from "antd";
import dayjs from "dayjs";

const PaymentRefundsTable = ({ paymentRefundsData = [] }) => {
  const { totalReceived, totalPaid } = paymentRefundsData.reduce(
    (acc, item) => {
      acc.totalReceived += item.received;
      acc.totalPaid += item.paid;
      return acc;
    },
    { totalReceived: 0, totalPaid: 0 }
  );

  return (
    <Table
      columns={[
        {
          title: "Transaction Date",
          dataIndex: "transactionDate",
          key: "transactionDate",
          sorter: (a, b) => dayjs(a.transactionDate).unix() - dayjs(b.transactionDate).unix(),
        },
        {
          title: "Debtor/Creditor",
          dataIndex: "debtorCreditor",
          key: "debtorCreditor",
          sorter: (a, b) => a.debtorCreditor.localeCompare(b.debtorCreditor),
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
          title: "Received",
          dataIndex: "received",
          key: "received",
          sorter: (a, b) => a.received - b.received,
        },
        {
          title: "Paid",
          dataIndex: "paid",
          key: "paid",
          sorter: (a, b) => a.paid - b.paid,
        },
      ]}
      dataSource={paymentRefundsData}
      pagination={{ pageSize: 10 }}
      locale={{ emptyText: "No data available in table" }}
      rowKey="id"
      footer={() => (
        <div style={{ fontWeight: "bold" }}>
          Totals: Received: {totalReceived.toFixed(2)} | Paid: {totalPaid.toFixed(2)}
        </div>
      )}
    />
  );
};

export default PaymentRefundsTable;