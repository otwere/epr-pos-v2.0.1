import React from "react";
import { Input, Button } from "antd";
import { SearchOutlined, FilePdfOutlined, FileExcelOutlined, PlusOutlined } from "@ant-design/icons";

export const SearchAndActions = ({ searchTerm, handleSearch, exportToPDF, exportToExcel, handleAddNewNote }) => (
  <div className="mb-4 flex justify-between items-center">
    <div className="flex items-center space-x-4">
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search Delivery Notes by ID, Customer Name, Product, etc."
        value={searchTerm}
        onChange={handleSearch}
        style={{ width: 750 }}
      />
    </div>
    <div className="flex space-x-4">
      <Button icon={<FilePdfOutlined />} onClick={exportToPDF}>
        Export to PDF
      </Button>
      <Button icon={<FileExcelOutlined />} onClick={exportToExcel}>
        Export to Excel
      </Button>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNewNote}>
        Add New Delivery Note
      </Button>
    </div>
  </div>
);