import React from "react";
import { Table, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import moment from "moment"; // Correct import for moment

export const DeliveryNoteTable = ({ filteredNotes, loading, actionsMenu }) => {
  const columns = [
    { title: "#", dataIndex: "slNo", key: "slNo", sorter: (a, b) => a.slNo - b.slNo, className: "whitespace-nowrap" },
    { title: "Delivery Note ID", dataIndex: "deliveryNoteId", key: "deliveryNoteId", sorter: (a, b) => a.deliveryNoteId.localeCompare(b.deliveryNoteId), className: "whitespace-nowrap" },
    { 
      title: "Delivery Note Date", 
      dataIndex: "deliveryNoteDate", 
      key: "deliveryNoteDate", 
      sorter: (a, b) => moment(a.deliveryDate).unix() - moment(b.deliveryDate).unix(), 
      className: "whitespace-nowrap",
      render: (text) => moment(text).isValid() ? moment(text).format("DD-MM-YYYY") : "Invalid Date"
    },
    { 
      title: "Customer Name", 
      dataIndex: "customerName", 
      key: "customerName", 
      sorter: (a, b) => String(a.customerName).localeCompare(String(b.customerName)), 
      className: "whitespace-nowrap" 
    },
    { title: "Customer Address", dataIndex: "customerAddress", key: "customerAddress", className: "whitespace-nowrap" },
    { title: "Products | items", dataIndex: "products", key: "products", render: (products) => (
      <ul>
        {products.map((product, index) => (
          <li key={index}>{product.productName} - {product.quantity} x {product.unitPrice} = {product.totalAmount}</li>
        ))}
      </ul>
    ), className: "whitespace-nowrap" },
    { title: "Payment Terms", dataIndex: "paymentTerms", key: "paymentTerms", className: "whitespace-nowrap" },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status", 
      sorter: (a, b) => a.status.localeCompare(b.status), 
      className: "whitespace-nowrap",
      render: (status) => {
        let color;
        switch (status) {
          case "Delivered":
            color = "green";
            break;
          case "Pending":
            color = "orange";
            break;
          case "Cancelled":
            color = "red";
            break;
          default:
            color = "blue";
        }
        return <span style={{ color }}>{status}</span>;
      }
    },
    {
      title: "Actions",
      key: "actions",
      className: "whitespace-nowrap",
      render: (_text, record) => (
        <Dropdown menu={{ items: actionsMenu(record) }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <Table
      dataSource={filteredNotes}
      columns={columns}
      rowKey="deliveryNoteId"
      pagination={{
        total: filteredNotes.length,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50"],
        defaultPageSize: 10,
      }}
      loading={loading}
      scroll={{ x: true }}
    />
  );
};