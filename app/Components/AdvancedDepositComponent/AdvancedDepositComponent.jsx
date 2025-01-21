import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Select,
  Form,
  Input,
  Button,
  DatePicker,
  Modal,
  Space,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "tailwindcss/tailwind.css";

const { Option } = Select;

const AdvanceDepositComponent = () => {
  const [modeFilter, setModeFilter] = useState("All");
  const [data, setData] = useState([
    {
      key: "1",
      sn: "1",
      customerName: "Praise & Lord Church",
      phoneNumber: "0700520008",
      receivedDate: "05-07-2024",
      receivedBy: "Alice Paul",
      paymentMode: "Cash",
      transactionId: "TRX12345",
      advanceAmount: 5000,
      balance: 5000,
    },
    {
      key: "2",
      sn: "2",
      customerName: "Shule Yetu High",
      phoneNumber: "0733443224",
      receivedDate: "06-07-2024",
      receivedBy: "Bob",
      paymentMode: "Cheque",
      transactionId: "TRX67890",
      advanceAmount: 26800,
      balance: 26800,
    },
    // Add more sample data connected to DB
  ]);

  const [customers] = useState([
    "Phenabo Enterprises Limited",
    "Beata Enterprises",
    "Majanja Suppliers Ltd",
    "Sizonje Mjomba",
    "Charlie Paul",
    "David Okello",
    "High Kings School",
  ]);

  const [receivers] = useState([
    "Alice Owiti",
    "Bob & Bobby",
    "Charlie Charlie",
    "David David",
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const total = filteredData.reduce((acc, item) => acc + item.balance, 0);
    setGrandTotal(total);
  }, [filteredData]);

  useEffect(() => {
    filterData(modeFilter, searchText);
  }, [data, modeFilter, searchText]);

  const columns = [
    {
      title: <span style={{ whiteSpace: "nowrap" }}>SN</span>,
      dataIndex: "sn",
      key: "sn",
      width: 40,
    },
    {
      title: <span style={{ whiteSpace: "nowrap" }}>Customer Name</span>,
      dataIndex: "customerName",
      key: "customerName",
      width: 230,
    },
    {
      title: <span style={{ whiteSpace: "nowrap" }}>Phone Number</span>,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 140,
    },
    {
      title: <span style={{ whiteSpace: "nowrap" }}>Received Date</span>,
      dataIndex: "receivedDate",
      key: "receivedDate",
      width: 120,
    },
    {
      title: <span style={{ whiteSpace: "nowrap" }}>Received By</span>,
      dataIndex: "receivedBy",
      key: "receivedBy",
      width: 140,
    },
    {
      title: <span style={{ whiteSpace: "nowrap" }}>Pay Mode</span>,
      dataIndex: "paymentMode",
      key: "paymentMode",
      width: 100,
      render: (mode) => {
        const color =
          mode === "Cash"
            ? "cyan"
            : mode === "Mpesa"
            ? "green"
            : mode === "Cheque"
            ? "blue"
            : mode === "PDQ"
            ? "purple"
            : mode === "Bank Transfer"
            ? "geekblue"
            : "default";
        return (
          <Tag color={color} style={{ whiteSpace: "nowrap" }}>
            {mode}
          </Tag>
        );
      },
    },
    {
      title: <span style={{ whiteSpace: "nowrap" }}>Transaction ID</span>,
      dataIndex: "transactionId",
      key: "transactionId",
      width: 140,
    },
    {
      title: <span style={{ whiteSpace: "nowrap" }}>Advance Paid</span>,
      dataIndex: "advanceAmount",
      key: "advanceAmount",
      width: 140,
      align: "right",
      render: (text) => (
        <span>
          {text.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      title: <span style={{ whiteSpace: "nowrap" }}>Account Balance</span>,
      dataIndex: "balance",
      key: "balance",
      width: 140,
      align: "right",
      render: (text) => (
        <span>
          {text.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      title: <span style={{ whiteSpace: "nowrap" }}>Actions</span>,
      key: "actions",
      width: 100,
      render: (text, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          <Popconfirm
            title="Are you sure to delete this record?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleModeFilterChange = (value) => {
    setModeFilter(value);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filterData = (mode, searchText) => {
    let filteredItems = [...data];

    if (mode !== "All") {
      filteredItems = filteredItems.filter((item) => item.paymentMode === mode);
    }

    if (searchText) {
      const lowercasedValue = searchText.toLowerCase().trim();
      filteredItems = filteredItems.filter(
        (item) =>
          item.customerName.toLowerCase().includes(lowercasedValue) ||
          item.transactionId.toLowerCase().includes(lowercasedValue) ||
          item.phoneNumber.toLowerCase().includes(lowercasedValue)
      );
    }

    setFilteredData(filteredItems);
  };

  const showModal = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
    form.setFieldsValue({
      customerName: record.customerName,
      phoneNumber: record.phoneNumber,
      receivedDate: moment(record.receivedDate, "DD-MM-YYYY"),
      receivedBy: record.receivedBy,
      paymentMode: record.paymentMode,
      transactionId: record.transactionId,
      advanceAmount: record.advanceAmount.toString(),
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFormSubmit = (values) => {
    const newPayment = {
      key: editingRecord ? editingRecord.key : (data.length + 1).toString(),
      sn: editingRecord ? editingRecord.sn : (data.length + 1).toString(),
      customerName: values.customerName,
      phoneNumber: values.phoneNumber,
      receivedDate: values.receivedDate.format("DD-MM-YYYY"),
      receivedBy: values.receivedBy,
      paymentMode: values.paymentMode,
      transactionId: values.transactionId,
      advanceAmount: parseFloat(values.advanceAmount),
      balance: Math.min(
        parseFloat(values.advanceAmount),
        editingRecord ? editingRecord.balance : parseFloat(values.advanceAmount)
      ),
    };

    if (editingRecord) {
      setData(
        data.map((item) => (item.key === editingRecord.key ? newPayment : item))
      );
    } else {
      setData([...data, newPayment]);
    }

    form.resetFields();
    setIsModalOpen(false);
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setProperties({
      title: "Advance Deposit Report",
      subject: "Summary of advance deposits",
      author: "Your Company Name",
      keywords: "advance, deposit, report",
      creator: "Your Company Name",
    });

    const date = new Date().toLocaleDateString();
    doc.text(`Advance Deposit Report - ${date}`, 14, 16);

    const tableColumn = [
      "SN",
      "Customer Name",
      "Phone Number",
      "Received Date",
      "Received By",
      "Payment Mode",
      "Transaction ID",
      "Advance Paid",
      "Account Balance",
    ];
    const tableRows = [];

    data.forEach((item) => {
      const rowData = [
        item.sn,
        item.customerName,
        item.phoneNumber,
        item.receivedDate,
        item.receivedBy,
        item.paymentMode,
        item.transactionId,
        item.advanceAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        item.balance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      ];
      tableRows.push(rowData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 25 });

    doc.setFontSize(10);
    doc.text(
      `Total Account Balance: ${grandTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      14,
      doc.autoTable.previous.finalY + 10
    );

    doc.save(`Advance_Deposit_Report_${date}.pdf`);
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 bg-gray-100 ">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-blue-600">
          Advance Deposit Management
        </h1>
      </div>
      <div className="flex ml-3  items-center max-w-7xl">
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Receive Advance Payment
        </Button>
        <Button type="default" className="ml-2" onClick={exportPDF}>
          Export PDF
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4 w-full max-w-7xl">
        <div className="flex items-center space-x-2">
          <span>Filter by Payment Mode :</span>
          <Select
            value={modeFilter}
            onChange={handleModeFilterChange}
            className="w-48"
          >
            <Option value="All">All Payment Mode</Option>
            <Option value="Cash">Cash</Option>
            <Option value="Mpesa">Mpesa</Option>
            <Option value="Cheque">Cheque</Option>
            <Option value="PDQ">PDQ</Option>
            <Option value="Bank Transfer">Bank Transfer | Deposit</Option>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <span>Search :</span>
          <Input.Search
            placeholder="Search by Name, Transaction ID, or Phone Number"
            onSearch={handleSearch}
            allowClear
            className="w-96"
          />
        </div>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: handlePageChange,
          total: filteredData.length,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={8}>
              <span className="font-bold">Total Account Balance (KES) :</span>
            </Table.Summary.Cell>
            <Table.Summary.Cell align="right">
              <span className="font-bold">
                {grandTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
        className="w-full max-w-[83rem]"
        bordered
        scroll={{ x: 1308 }}
      />
      <Modal
        title={
          <span className="text-blue-600 text-lg">
            {editingRecord ? "Edit Advance Payment" : "Receive Advance Payment"}
          </span>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {editingRecord ? "Update" : "Add"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="flex flex-col space-y-4"
        >
          <Form.Item
            label="Customer Name"
            name="customerName"
            rules={[
              { required: true, message: "Please select the customer name" },
            ]}
          >
            <Select showSearch>
              {customers.map((customer) => (
                <Option key={customer} value={customer}>
                  {customer}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input the phone number" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Received Date"
            name="receivedDate"
            rules={[
              { required: true, message: "Please select the received date" },
            ]}
          >
            <DatePicker format="DD-MM-YYYY" disabledDate={disabledDate} />
          </Form.Item>

          <Form.Item
            label="Received By"
            name="receivedBy"
            rules={[
              {
                required: true,
                message: "Please select the person who received",
              },
            ]}
          >
            <Select showSearch>
              {receivers.map((receiver) => (
                <Option key={receiver} value={receiver}>
                  {receiver}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Payment Mode"
            name="paymentMode"
            rules={[
              { required: true, message: "Please select the payment mode" },
            ]}
          >
            <Select>
              <Option value="Cash">Cash</Option>
              <Option value="Mpesa">Mpesa</Option>
              <Option value="Cheque">Cheque</Option>
              <Option value="PDQ">PDQ</Option>
              <Option value="Bank Transfer">Bank Transfer | Deposit</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Transaction ID"
            name="transactionId"
            rules={[
              { required: true, message: "Please input the transaction ID" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Advance Amount"
            name="advanceAmount"
            rules={[
              { required: true, message: "Please input the advance amount" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdvanceDepositComponent;
