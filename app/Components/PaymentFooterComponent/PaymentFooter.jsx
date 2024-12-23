import React from 'react';
import { Button, Space } from 'antd';

const PaymentFooter = ({ isPaymentComplete, onCancel, onReset }) => (
  <div style={{ textAlign: 'right', marginTop: '20px' }}>
    <Space>
      <Button onClick={onCancel}>Cancel</Button>
      {isPaymentComplete && (
        <Button type="primary" onClick={onReset}>
          Reset
        </Button>
      )}
    </Space>
  </div>
);

export default PaymentFooter;
