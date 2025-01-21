import React, { useState } from "react";
import { Table, Tag, Select, Button, Input, message, Row, Col } from "antd";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const { Option } = Select;
const { Search } = Input;

const PaymentSummaryComponent = () => {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [data] = useState([
    {
      key: "1",
      sn: "1",
      customerName: "John Doe",
      receivedDate: "2024-07-07",
      receivedTime: "10:30 AM",
      receivedBy: "Alice",
      paymentMode: "Cash",
      transactionId: "Cash",
      invoiceReceiptNo: "TRX12345",
      advanceAmount: 500,
      phoneNumber: "123-456-7890",
    },
    {
      key: "2",
      sn: "2",
      customerName: "Jane Smith",
      receivedDate: "03-08-2024",
      receivedTime: "02:15 PM",
      receivedBy: "Bob",
      paymentMode: "Cheque",
      transactionId: "TRX67890",
      invoiceReceiptNo: "RCP456",
      advanceAmount: 26800,
      phoneNumber: "987-654-3210",
    },
    {
      key: "3",
      sn: "3",
      customerName: "Phenabo Enterprises Limited",
      receivedDate: "11-08-2024",
      receivedTime: "02:15 PM",
      receivedBy: "Sale Rep-2",
      paymentMode: "Mpesa",
      transactionId: "DE45RFER5T",
      invoiceReceiptNo: "RCP456",
      advanceAmount: 21400,
      phoneNumber: "987-654-3210",
    },
  ]);

  const columns = [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
      width: "3%",
      render: (text) => <span style={{ whiteSpace: "nowrap" }}>{text}</span>,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      width: "12%",
      render: (text) => <span style={{ whiteSpace: "nowrap" }}>{text}</span>,
    },
    {
      title: "Date",
      dataIndex: "receivedDate",
      key: "receivedDate",
      width: "12%",
      render: (date) => moment(date).format("DD-MM-YYYY"),
    },
    {
      title: "Time",
      dataIndex: "receivedTime",
      key: "receivedTime",
      width: "10%",
      render: (time) => moment(time, "HH:mm A").format("hh:mm A"),
    },
    {
      title: "Received By",
      dataIndex: "receivedBy",
      key: "receivedBy",
      width: "12%",
      render: (text) => <span style={{ whiteSpace: "nowrap" }}>{text}</span>,
    },
    {
      title: "Pay Mode",
      dataIndex: "paymentMode",
      key: "paymentMode",
      width: "10%",
      render: (mode) => {
        let color =
          mode === "Cash"
            ? "cyan"
            : mode === "Cheque"
            ? "blue"
            : mode === "Mpesa"
            ? "green"
            : mode === "PDQ"
            ? "purple"
            : "geekblue";
        return <Tag color={color}>{mode}</Tag>;
      },
    },
    {
      title: "Invoice Number",
      dataIndex: "invoiceReceiptNo",
      key: "invoiceReceiptNo",
      width: "15%",
      render: (text) => <span style={{ whiteSpace: "nowrap" }}>{text}</span>,
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      width: "12%",
      render: (text) => <span style={{ whiteSpace: "nowrap" }}>{text}</span>,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "18%",
      align: "left",
      render: (text) => <span style={{ whiteSpace: "nowrap" }}>{text}</span>,
    },
    {
      title: "Amount(KES)",
      dataIndex: "advanceAmount",
      key: "advanceAmount",
      width: "15%",
      align: "right",
      render: (number) => (
        <span style={{ whiteSpace: "nowrap" }}>
          {new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(number)}
        </span>
      ),
    },
  ];

  const filteredData = data.filter((item) => {
    const matchesPaymentMode =
      selectedPaymentMode === "All" || item.paymentMode === selectedPaymentMode;
    const matchesSearchText =
      item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.transactionId.toLowerCase().includes(searchText.toLowerCase()) ||
      item.phoneNumber.includes(searchText);

    return matchesPaymentMode && matchesSearchText;
  });

  const totalAdvanceAmount = filteredData.reduce(
    (acc, current) => acc + current.advanceAmount,
    0
  );

  const handleModeFilterChange = (value) => {
    setSelectedPaymentMode(value);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const generatePDF = async () => {
    try {
      const canvas = await html2canvas(document.getElementById("pdf-table"));
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("payment_summary.pdf");
    } catch (error) {
      message.error("Failed to generate PDF. Please try again later.");
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={8}>
          <Select
            defaultValue="All Payments Mode"
            style={{ width: "60%" }}
            onChange={handleModeFilterChange}
          >
            <Option value="All">All Payments Mode</Option>
            <Option value="Cash">Cash</Option>
            <Option value="Mpesa">Mpesa</Option>
            <Option value="Cheque">Cheque</Option>
            <Option value="PDQ">PDQ</Option>
            <Option value="Bank Transfer | Deposit">
              Bank Transfer | Deposit
            </Option>
          </Select>
        </Col>
        <Col xs={24} sm={12}>
          <Search
            placeholder="Search by Customer's Name  | Transaction ID | or Phone"
            onSearch={handleSearch}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} sm={4}>
          <Button
            type="primary"
            onClick={generatePDF}
            style={{ width: "100%" }}
          >
            Export PDF
          </Button>
        </Col>
      </Row>
      <div id="pdf-table" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          footer={() => (
            <div style={{ textAlign: "right", fontWeight: "bold" }}>
              Total : KES{" "}
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(totalAdvanceAmount)}
            </div>
          )}
          className="w-full max-w-[83rem]"
          bordered
          scroll={{ x: 1308 }}
        />
      </div>
    </div>
  );
};

export default PaymentSummaryComponent;
