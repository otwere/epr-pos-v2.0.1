import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const PaymentHeader = () => (
  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
    <Title level={3}>Complete Your Payment</Title>
  </div>
);

export default PaymentHeader;
