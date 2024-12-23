import React from 'react';
import { Card } from 'antd';

const POSPaymentSummary = ({ details }) => (
  <Card title="Payment Summary" style={{ maxWidth: '400px', margin: '0 auto' }}>
    <p><strong>Card Number:</strong> **** **** **** {details.cardNumber.slice(-4)}</p>
    <p><strong>Expiry Date:</strong> {details.expiryDate}</p>
    <p><strong>Payment Status:</strong> Successful</p>
  </Card>
);

export default POSPaymentSummary;
