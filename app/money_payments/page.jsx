// page.jsx
"use client";
import React from "react";
import MoneyPaymentsLayout from "../components/MoneyComponent/MoneyPaymentsLayout";
import MoneyPaymentsContent from "../components/MoneyComponent/MoneyPaymentsContent";

const Money_Payments = () => {
  return (
    <MoneyPaymentsLayout>
      <MoneyPaymentsContent />
    </MoneyPaymentsLayout>
  );
};

export default Money_Payments;