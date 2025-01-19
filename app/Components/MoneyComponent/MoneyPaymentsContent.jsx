// components/MoneyPaymentsContent.jsx
import React, { useState } from "react";
import { Breadcrumb, Typography, Tabs, Card, Space, Switch } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import PaymentsTab from "./PaymentsTab";
import MakePaymentForm from "../MoneyComponent/MakePaymentForm";
import ReceivePaymentTab from "./ReceivePaymentTab";
import AccOpenBalTab from "./AccOpenBalTab";
import FundsTransferTab from "./FundsTransferTab";
import PaymentRefundsTable from "../MoneyComponent/PaymentRefundsTable";

const { Title, Text } = Typography;

const MoneyPaymentsContent = () => {
  const [isMultiCurrencyEnabled, setIsMultiCurrencyEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="mt-0">
      <Breadcrumb
        className="mb-4"
        items={[
          {
            title: (
              <Link href="/">
                <HomeOutlined /> Home
              </Link>
            ),
          },
          { title: "Money | Payments Accounts" },
        ]}
      />
      <hr />
      <div className="mb-4 flex justify-between items-center">
        <Title level={4} className="text-blue-800 mt-2">
          Money & Payments
        </Title>
        <Space>
          <Switch
            checkedChildren="Multi-Currency"
            unCheckedChildren="Single Currency"
            checked={isMultiCurrencyEnabled}
            onChange={(checked) => setIsMultiCurrencyEnabled(checked)}
          />
          <Text type="secondary"> Manage Funds and Payments </Text>
        </Space>
      </div>
      <hr className="mb-4" />
      <Card className="shadow-sm rounded-lg bg-gray-50">
        <Tabs
          defaultActiveKey="1"
          onChange={handleTabChange}
          items={[
            {
              key: "1",
              label: "Payments",
              children: <PaymentsTab isMultiCurrencyEnabled={isMultiCurrencyEnabled} />,
            },
            {
              key: "2",
              label: "Make Payment (Supplier)",
              children: <MakePaymentForm />,
            },
            {
              key: "3",
              label: "Receive Payment (Customer)",
              children: <ReceivePaymentTab />,
            },
            {
              key: "4",
              label: "Account Open Balance",
              children: <AccOpenBalTab />,
            },
            {
              key: "5",
              label: "Funds Transfer",
              children: <FundsTransferTab />,
            },
            {
              key: "6",
              label: "Payment Refunds",
              children: <PaymentRefundsTable paymentRefundsData={[]} />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default MoneyPaymentsContent;