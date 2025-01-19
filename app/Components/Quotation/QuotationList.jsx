import React, { useState } from "react";
import { Table, Button, Space, Tooltip, Popconfirm, message, Dropdown, Menu, Tag } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PrinterOutlined,
  EyeOutlined,
  CopyOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { useQuotationContext } from "./QuotationContext";
import SearchAndActions from "./SearchAndActions";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const QuotationList = ({ onAddNew, onEdit, onViewDetails, onDuplicate, onArchive }) => {
  const { quotations, loading, deleteQuotation } = useQuotationContext();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["ID", "Customer Name", "Date", "Total Amount", "Status", "Created By", "Number of Items"]],
      body: quotations.map((q) => [
        q.id,
        q.client?.name || "N/A",
        q.date,
        `KES : ${q.totalAmount}`,
        q.status,
        q.createdBy,
        q.numberOfItems,
      ]),
    });
    doc.save("quotations.pdf");
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      quotations.map((q) => ({
        ID: q.id,
        "Customer Name": q.client?.name || " ",
        Date: q.date,
        "Total Amount": `KES : ${q.totalAmount}`,
        Status: q.status,
        "Created By": q.createdBy,
        "Number of Items": q.numberOfItems,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quotations");
    XLSX.writeFile(workbook, "quotations.xlsx");
  };

  const handlePrintQuotation = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select a quotation to print.");
      return;
    }

    const selectedQuotation = quotations.find((q) => q.id === selectedRowKeys[0]);
    const doc = new jsPDF();
    doc.text(`Quotation ID: ${selectedQuotation.quotationId}`, 10, 10);
    doc.text(`Date: ${selectedQuotation.date}`, 10, 20);
    doc.text(`Client: ${selectedQuotation.client?.name || "N/A"}`, 10, 30);
    doc.text(`Total Amount: $${selectedQuotation.totalAmount}`, 10, 40);
    doc.text(`Status: ${selectedQuotation.status}`, 10, 50);
    doc.text(`Created By: ${selectedQuotation.createdBy}`, 10, 60);
    doc.text(`Number of Items: ${selectedQuotation.numberOfItems}`, 10, 70);
    doc.save(`quotation_${selectedQuotation.quotationId}.pdf`);
  };

  const handleDeleteQuotation = async (id) => {
    try {
      await deleteQuotation(id);
      message.success("Quotation deleted successfully");
    } catch (error) {
      message.error("Failed to delete quotation");
    }
  };

  const statusOptions = [
    { value: "Draft", color: "default" },
    { value: "Pending", color: "orange" },
    { value: "Sent", color: "blue" },
    { value: "Approved", color: "green" },
    { value: "Rejected", color: "red" },
    { value: "Expired", color: "gray" },
  ];

  const renderActionMenu = (record) => (
    <Menu>
      <Menu.Item key="view" onClick={() => onViewDetails(record)}>
        <EyeOutlined /> View Details
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => onEdit(record)}>
        <EditOutlined /> Edit
      </Menu.Item>
      <Menu.Item key="duplicate" onClick={() => onDuplicate(record)}>
        <CopyOutlined /> Duplicate
      </Menu.Item>
      <Menu.Item key="archive" onClick={() => onArchive(record)}>
        <FileDoneOutlined /> Archive
      </Menu.Item>
      <Menu.Item key="delete">
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDeleteQuotation(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <span>
            <DeleteOutlined /> Delete
          </span>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Customer Name",
      dataIndex: ["client", "name"],
      key: "customerName",
      render: (_, record) => record.client?.name || "N/A",
      sorter: (a, b) => (a.client?.name || "").localeCompare(b.client?.name || ""),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount) => `$${totalAmount}`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      sorter: (a, b) => a.createdBy.localeCompare(b.createdBy),
    },
    {
      title: "Number of Items",
      dataIndex: "numberOfItems",
      key: "numberOfItems",
      sorter: (a, b) => a.numberOfItems - b.numberOfItems,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusOption = statusOptions.find((option) => option.value === status);
        return <Tag color={statusOption?.color || "default"}>{status}</Tag>;
      },
      filters: statusOptions.map((status) => ({
        text: status.value,
        value: status.value,
      })),
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_text, record) => (
        <Dropdown overlay={renderActionMenu(record)} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const filteredQuotations = quotations.filter((quotation) =>
    quotation.client?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <SearchAndActions
          searchTerm={searchText}
          handleSearch={setSearchText}
          exportToPDF={handleExportToPDF}
          exportToExcel={handleExportToExcel}
        />
        <div className="flex justify-end space-x-2">
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={handlePrintQuotation}
            disabled={selectedRowKeys.length === 0}
          >
            Print Selected Quotation
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
            Add New Quotation
          </Button>
        </div>
      </div>

      <hr />

      <Table
        columns={columns}
        dataSource={filteredQuotations}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ width: "100%" }}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
      />
    </div>
  );
};

export default QuotationList;