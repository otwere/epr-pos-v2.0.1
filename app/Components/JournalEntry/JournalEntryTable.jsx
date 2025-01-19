import React from "react";
import { Table, Input, Button, Card, Spin, Tooltip } from "antd";
import { SearchOutlined, PlusOutlined, ExportOutlined, DeleteOutlined } from "@ant-design/icons";
import { handleExport } from "./exportUtils";

const JournalEntryTable = ({
  items,
  loading,
  selectedRowKeys,
  setSelectedRowKeys,
  handleSearch,
  searchTerm,
  setIsFormOpen,
  handleBulkDelete,
}) => {
  const columns = [
    { 
      title: "#", 
      dataIndex: "journalEntryNumber", 
      key: "journalEntryNumber", 
      width: 100, 
      sorter: (a, b) => a.journalEntryNumber.localeCompare(b.journalEntryNumber),
      render: (text) => <Tooltip title={text}>{text}</Tooltip>
    },
    { 
      title: "Account Name", 
      dataIndex: "accountName", 
      key: "accountName", 
      sorter: (a, b) => a.accountName.localeCompare(b.accountName),
      render: (text) => <Tooltip title={text}>{text}</Tooltip>
    },
    { 
      title: "Transaction Date", 
      dataIndex: "transactionDate", 
      key: "transactionDate", 
      sorter: (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate),
      render: (text) => <Tooltip title={text}>{text}</Tooltip>
    },
    { 
      title: "Credit", 
      dataIndex: "credit", 
      key: "credit", 
      render: (value) => <Tooltip title={value.toLocaleString()}>{value.toLocaleString()}</Tooltip>, 
      sorter: (a, b) => a.credit - b.credit 
    },
    { 
      title: "Debit", 
      dataIndex: "debit", 
      key: "debit", 
      render: (value) => <Tooltip title={value.toLocaleString()}>{value.toLocaleString()}</Tooltip>, 
      sorter: (a, b) => a.debit - b.debit 
    },
    { 
      title: "Amount", 
      dataIndex: "amount", 
      key: "amount", 
      render: (value) => <Tooltip title={value.toLocaleString()}>{value.toLocaleString()}</Tooltip>, 
      sorter: (a, b) => a.amount - b.amount 
    },
    { 
      title: "Narration", 
      dataIndex: "narration", 
      key: "narration", 
      sorter: (a, b) => a.narration.localeCompare(b.narration),
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate max-w-xs">{text}</div>
        </Tooltip>
      )
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
  };

  return (
    <Card className="shadow-sm rounded-lg bg-gray-50">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by account name, narration..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: 750 }}
          />
        </div>
        <div className="flex space-x-4">
          <Tooltip title="Add New Journal Entry">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsFormOpen(true)}>
              Add New Journal
            </Button>
          </Tooltip>
          <Tooltip title="Export to PDF">
            <Button type="default" icon={<ExportOutlined />} onClick={() => handleExport(items)}>
              Export to PDF
            </Button>
          </Tooltip>
          {selectedRowKeys.length > 0 && (
            <Tooltip title="Delete Selected Entries">
              <Button type="danger" icon={<DeleteOutlined />} onClick={handleBulkDelete}>
                Delete Selected
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
      <hr />
      <Spin spinning={loading}>
        <Table
          rowSelection={rowSelection}
          dataSource={items}
          columns={columns}
          rowKey="id"
          pagination={{
            total: items.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Spin>
    </Card>
  );
};

export default JournalEntryTable;

