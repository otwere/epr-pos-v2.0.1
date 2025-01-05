const data = [
    {
      key: '1',
      salesDate: '17-12-2024',
      invoiceNo: '0005',
      salesStatus: 'Order',
      createdBy: 'Admin',
      total: 545.00,
      paidAmt: 400.00,
      balance: 145.00,
      payStatus: 'Cancelled',
      customerName: 'WALK-IN',
      branch: 'REOPRIME SOLUTIONS LIMITED THIKA ROAD'
    },
    {
      key: '2',
      salesDate: '15-12-2024',
      invoiceNo: '0003',
      salesStatus: 'Final',
      createdBy: 'Admin',
      total: 1200.00,
      paidAmt: 1200.00,
      balance: 0.00,
      payStatus: 'Cancelled',
      customerName: 'WALK-IN',
      branch: 'REOPRIME SOLUTIONS LIMITED THIKA ROAD'
    }
  ]

  const columns = [
    {
      title: 'SN',
      dataIndex: 'key',
      key: 'key',
      width: 60
    },
    {
      title: 'Sales Date',
      dataIndex: 'salesDate',
      key: 'salesDate',
    },
    {
      title: 'Invoice No.',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
    },
    {
      title: 'Sales Status',
      dataIndex: 'salesStatus',
      key: 'salesStatus',
      render: (status) => (
        <Tag color={status === 'Final' ? 'green' : 'blue'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (amount) => amount.toFixed(2)
    },
    {
      title: 'Paid Amt',
      dataIndex: 'paidAmt',
      key: 'paidAmt',
      render: (amount) => amount.toFixed(2)
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (amount) => amount.toFixed(2)
    },
    {
      title: 'Pay Status',
      dataIndex: 'payStatus',
      key: 'payStatus',
      render: (status) => (
        <Tag color="red">
          {status}
        </Tag>
      )
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="primary" size="small">
          Action
        </Button>
      )
    }
  ]

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      val.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  )

  return (
    <Card title="Cancelled Sales List" className="w-full">
      <div className="mb-4">
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          onChange={e => setSearchText(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table 
        columns={columns} 
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
        className="w-full"
      />
    </Card>
  )
