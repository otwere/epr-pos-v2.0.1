import React from 'react';
import { Table, Button } from 'antd';
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePOS } from '../POSContextComponent/POSContext';

const ItemTable = () => {
  const { filteredItems, handleQuantityChange, handleDelete } = usePOS();

  const columns = [
    {
      title: 'ITEM CODE',
      dataIndex: 'code',
      key: 'code',
      align: 'left',
    },
    {
      title: 'ITEM NAME',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'SALE QTY',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'left',
      render: (text, _record, index) => (
        <div className="flex items-center">
          <Button
            onClick={() => handleQuantityChange(index, -1)}
            icon={<MinusOutlined />}
            size="small"
            className="mr-1"
          />
          <span className="mx-2">{text}</span>
          <Button
            onClick={() => handleQuantityChange(index, 1)}
            icon={<PlusOutlined />}
            size="small"
            className="ml-1"
          />
        </div>
      ),
    },
    {
      title: 'UNIT PRICE INC. TAX',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (text) =>
        text.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      title: 'TYPE OF PRICING',
      dataIndex: 'type',
      key: 'type',
      align: 'left',
    },
    {
      title: 'SUB-TOTAL (KES)',
      dataIndex: 'subtotal',
      key: 'subtotal',
      align: 'right',
      render: (text) =>
        text.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      title: 'TAX %',
      key: 'tax',
      render: () => '16',
      align: 'right',
    },
    {
      title: 'ACTION',
      key: 'action',
      align: 'right',
      render: (_text, _record, index) => (
        <Button
          onClick={() => handleDelete(index)}
          icon={<DeleteOutlined />}
          size="small"
          danger
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredItems}
      pagination={false}
      rowKey="code"
      className="mb-6"
      bordered
    />
  );
};

export default ItemTable;
