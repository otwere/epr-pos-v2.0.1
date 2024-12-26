import React from 'react'
import { Table, Tag, Button, Dropdown } from '@/components/ui'
import { EyeOutlined, DollarOutlined, ShoppingCartOutlined, FileSyncOutlined, MoreOutlined } from '@/components/icons'
import PropTypes from 'prop-types'

const SalesTable = ({ salesData, selectedRows, setSelectedRows }) => {
  const columns = [
    {
      title: 'SN',
      dataIndex: 'key',
      key: 'key',
      sorter: (a, b) => a.key.localeCompare(b.key),
    },
    {
      title: 'Sales Date',
      dataIndex: 'salesDate',
      key: 'salesDate',
      sorter: (a, b) => new Date(a.salesDate) - new Date(b.salesDate),
    },
    {
      title: 'Invoice No.',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      sorter: (a, b) => a.invoiceNo.localeCompare(b.invoiceNo),
    },
    {
      title: 'Sales Status',
      dataIndex: 'salesStatus',
      key: 'salesStatus',
      render: (status) => (
        <Tag color={status === 'Completed' ? 'green' : 'gold'}>{status}</Tag>
      ),
      sorter: (a, b) => a.salesStatus.localeCompare(b.salesStatus),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      sorter: (a, b) => a.createdBy.localeCompare(b.createdBy),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `KES ${total.toLocaleString()}`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Paid Amt',
      dataIndex: 'paidAmt',
      key: 'paidAmt',
      render: (paidAmt) => `KES ${paidAmt.toLocaleString()}`,
      sorter: (a, b) => a.paidAmt - b.paidAmt,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance) => `KES ${balance.toLocaleString()}`,
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: 'Pay Status',
      dataIndex: 'payStatus',
      key: 'payStatus',
      render: (status) => (
        <Tag
          color={
            status === 'Paid'
              ? 'green'
              : status === 'Unpaid'
              ? 'red'
              : 'orange'
          }
        >
          {status}
        </Tag>
      ),
      sorter: (a, b) => a.payStatus.localeCompare(b.payStatus),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      sorter: (a, b) => a.branch.localeCompare(b.branch),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: '1', icon: <EyeOutlined />, label: 'View Sales' },
              { key: '2', icon: <DollarOutlined />, label: 'View Payments' },
              record.payStatus === 'Unpaid' || record.payStatus === 'Partial'
                ? { key: '3', icon: <ShoppingCartOutlined />, label: 'Pay Now' }
                : null,
              { key: '4', icon: <FileSyncOutlined />, label: 'POS Invoice' },
            ].filter(Boolean),
          }}
          trigger={['click']}
        >
          <Button icon={<MoreOutlined />}>Actions</Button>
        </Dropdown>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys) => {
      setSelectedRows(selectedRowKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: record.payStatus === 'Paid',
    }),
  }

  return (
    <Table
      rowSelection={{
        type: 'checkbox',
        ...rowSelection,
      }}
      columns={columns}
      dataSource={salesData}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
    />
  )
}

SalesTable.propTypes = {
  salesData: PropTypes.array.isRequired,
  selectedRows: PropTypes.array.isRequired,
  setSelectedRows: PropTypes.func.isRequired,
}

export default SalesTable

