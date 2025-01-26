import React, { useState } from "react";
import DateOnlyComponent from "../DateOnlyComponent/DateOnlyComponent";
import { Table, Input } from 'antd'; 
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons'; 

const SalesSummaryBoardComponent = () => {
  // State for search input
  const [searchTerm, setSearchTerm] = useState('');

  // Function to format numbers as currency with thousand separators
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const data = [
    { label: "Cash Sales", value: 46000.00 },
    { label: "Mpesa Payment", value: 90000.00 },
    { label: "Invoice Sales", value: 45600.00 },
    { label: "Cheque Payment", value: 60000.00 },
    { label: "Bank Transfer", value: 20100.00 },
    { label: "PDQ Payment", value: 1300.00 },
  ];

  // Calculate total sales
  const totalSales = data.reduce((acc, item) => acc + item.value, 0);

  // Filter data based on search term
  const filteredData = data.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'Sales Category',
      dataIndex: 'label',
      key: 'label',
      sorter: (a, b) => a.label.localeCompare(b.label),
    },
    {
      title: 'Amount (KES)',
      dataIndex: 'value',
      key: 'value',
      render: (text) => (
        <span className="text-right">{formatCurrency(text)}</span> 
      ),
      sorter: (a, b) => a.value - b.value,
      align: 'right', 
    },
  ];

  return (
    <div className="bg-gray-50 rounded-md shadow-none p-8 max-w-full sm:max-w-xl lg:max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="flex items-center space-x-8 border-b-2 border-gray-300 pb-2 w-full text-gray-600 ">
          <ShoppingCartOutlined  className="text-blue-600 text-3xl mr-[-1rem]"/>          
          <h2 className="text-lg font-semibold text-gray-500 flex-shrink-0 mr-1">
             Sales Summary & Payment
          </h2>
          <div className="text-lg font-semibold text-gray-500 ml-auto flex-shrink-0">
          <DateOnlyComponent />
        </div>
        </div>       
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <Input
          placeholder="Search by category"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          rowKey="label"
          className="border rounded-md"
          rowClassName={(_record, index) => index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} 
        />
        {/* Total Sales Row */}
        <div className="flex justify-between mt-4 font-semibold bg-gray-200 p-2 rounded-md">
          <span>Total Sales</span>
          <span className="text-right">{formatCurrency(totalSales)}</span>
        </div>
      </div>
    </div>
  );
};

export default SalesSummaryBoardComponent;
