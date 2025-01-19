// components/PaymentsTab.jsx
import React, { useState } from "react";
import { Input, Button, Space } from "antd";
import { SearchOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import PaymentsTable from "../MoneyComponent/PaymentsTable";

const PaymentsTab = ({ isMultiCurrencyEnabled }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    // Implement search logic here
  };

  const handleBulkAction = (action) => {
    if (action === "delete") {
      // Implement bulk delete logic here
    } else if (action === "export") {
      // Implement bulk export logic here
    }
  };

  const handleBulkExport = () => {
    // Implement the bulk export functionality here
    console.log("Bulk export triggered");
  };

  return (
    <>
      <Space className="mb-4">
        <Input
          placeholder="Search payments..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button onClick={() => handleBulkAction("delete")} danger>
          <DeleteOutlined /> Delete Selected
        </Button>
        <Button onClick={handleBulkExport}>
          <DownloadOutlined /> Export Selected
        </Button>
      </Space>
      <PaymentsTable
        isMultiCurrencyEnabled={isMultiCurrencyEnabled}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </>
  );
};

export default PaymentsTab;