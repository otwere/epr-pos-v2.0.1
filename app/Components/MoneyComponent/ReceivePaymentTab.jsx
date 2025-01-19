// components/ReceivePaymentTab.jsx
import React, { useState } from "react";
import { Button } from "antd";
import ReceivePaymentForm from "../MoneyComponent/ReceivePaymentForm";

const ReceivePaymentTab = () => {
  const [showReceivePaymentForm, setShowReceivePaymentForm] = useState(false);

  return (
    <>
      <div className="text-right">
        <Button
          type="primary"
          onClick={() => setShowReceivePaymentForm(!showReceivePaymentForm)}
          style={{ marginBottom: 16 }}
        >
          {showReceivePaymentForm ? "Close Form" : "Receive Payment"}
        </Button>
      </div>
      {showReceivePaymentForm && <ReceivePaymentForm />}
    </>
  );
};

export default ReceivePaymentTab;