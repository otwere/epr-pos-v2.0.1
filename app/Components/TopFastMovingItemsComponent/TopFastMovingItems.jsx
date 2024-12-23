import React from "react";
import { Table } from "antd";
import "../TopFastMovingItemsComponent/TopFastMovingItems.css";

const TopFastMovingItems = () => {
  // Sample data for demonstration (replace with data from your DB)
  const data = [
    { key: "1", sn: 1, itemName: "Item A", quantity: 150 },
    { key: "2", sn: 2, itemName: "Item B", quantity: 120 },
    { key: "3", sn: 3, itemName: "Item C", quantity: 110 },
    { key: "4", sn: 4, itemName: "Item D", quantity: 100 },
  ];

  const columns = [
    {
      title: "#",
      dataIndex: "sn",
      key: "sn",
      align: "left",
      className: "column-slim",
    },
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      className: "column-wide",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "right",
      className: "column-slim",
    },
  ];

  return (
    <div className="top-fast-moving-items-container">
      
      <Table
        columns={columns}
        dataSource={data}
        pagination={false} // Disable pagination if only showing top 4
        bordered
        size="middle" // Adjust table size
        className="custom-table"
      />
    </div>
  );
};

export default TopFastMovingItems;
