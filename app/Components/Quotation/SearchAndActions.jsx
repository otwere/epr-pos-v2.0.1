import React from "react";
import { Input, Button } from "antd";
import { SearchOutlined, FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons";

const SearchAndActions = ({
  searchTerm,
  handleSearch,
  exportToPDF,
  exportToExcel
}) => (
  <div className="flex justify-between mb-4">
    <Input
      prefix={<SearchOutlined />}
      placeholder="Search Quotations"
      value={searchTerm}
      onChange={(e) => handleSearch(e.target.value)}
      className="w-[500px]"
    />
    <div className="flex justify-end space-x-2">
      <Button
        icon={<FilePdfOutlined />}
        onClick={exportToPDF}
        className="mx-4"
      >
        Export to PDF
      </Button>
      <Button
        icon={<FileExcelOutlined />}
        onClick={exportToExcel}
        className="mr-2"
      >
        Export to Excel
      </Button>
    </div>
  </div>
);

export default SearchAndActions;