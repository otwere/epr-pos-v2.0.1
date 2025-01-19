import React, { useState, useEffect } from "react";
import {
  Modal,
  Steps,
  Card,
  Button,
  Typography,
  Form,
  InputNumber,
  Input,
  notification,
  Space,
  Badge,
  Progress,
  Tag,
  Tooltip,
  Row,
  Col,
  Alert,
} from "antd";
import {
  CreditCardOutlined,
  WalletOutlined,
  BankOutlined,
  MobileOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { usePOS } from "../POSContextComponent/POSContext";

const { Title, Text } = Typography;
const { Step } = Steps;

const PAYMENT_METHODS = [
  {
    value: "cash",
    label: "Cash Payment",
    icon: <WalletOutlined className="text-2xl" />,
    color: "#1890ff",
    description: "Pay with physical currency",
    details: "Immediate settlement, perfect for instant transactions",
    processingTime: "Instant",
    availableHours: "24/7",
  },
  {
    value: "mpesa",
    label: "Mobile Money Payment",
    icon: <MobileOutlined className="text-2xl" />,
    color: "#52c41a",
    description: "Instant mobile payment",
    details: "Quick and secure mobile transaction via M-Pesa",
    processingTime: "1-2 minutes",
    availableHours: "24/7",
  },
  {
    value: "credit_card",
    label: "Card | PDQ Payment",
    icon: <CreditCardOutlined className="text-2xl" />,
    color: "#faad14",
    description: "Credit or Debit card",
    details: "Secure electronic payment with instant verification",
    processingTime: "1-2 business days",
    availableHours: "24/7",
  },
  {
    value: "bank_transfer",
    label: "Bank Transfer | Cheque Payment",
    icon: <BankOutlined className="text-2xl" />,
    color: "#722ed1",
    description: "Direct bank transaction",
    details: "Seamless transfer from your bank account",
    processingTime: "1-3 business days",
    availableHours: "24/7",
  },
];

const PaymentModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const { totals, clearItems, discount } = usePOS();
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactionId, setTransactionId] = useState("");
  const [totalPaid, setTotalPaid] = useState(0);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fieldsToReset, setFieldsToReset] = useState([]);

  useEffect(() => {
    if (open) {
      resetPaymentState();
    }
  }, [open]);

  useEffect(() => {
    if (fieldsToReset.length > 0) {
      form.resetFields(fieldsToReset);
      setFieldsToReset([]);
    }
  }, [fieldsToReset, form]);

  const resetPaymentState = () => {
    setCurrentStep(0);
    setPaymentMethods([]);
    setTotalPaid(0);
    form.resetFields();
    setTransactionId(`TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
    setError(null);
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethods((prev) => {
      if (prev.some((pm) => pm.method === method)) {
        return prev.filter((pm) => pm.method !== method);
      }
      return [...prev, { method, amount: 0 }];
    });
  };

  const handleAmountChange = (method, value) => {
    setPaymentMethods((prev) => {
      const updated = prev.map((pm) =>
        pm.method === method ? { ...pm, amount: value || 0 } : pm
      );
      const newTotalPaid = updated.reduce((sum, pm) => sum + pm.amount, 0);
      setTotalPaid(newTotalPaid);

      if (newTotalPaid > totals.grandTotal) {
        setError(
          `Total paid amount (${formatAmount(
            newTotalPaid
          )}) exceeds the invoice total (${formatAmount(totals.grandTotal)})`
        );
      } else {
        setError(null);
      }

      return updated;
    });
  };

  const handlePaymentMethodRemove = (methodToRemove) => {
    setPaymentMethods((prev) => {
      const updated = prev.filter((pm) => pm.method !== methodToRemove);
      const newTotalPaid = updated.reduce((sum, pm) => sum + pm.amount, 0);
      setTotalPaid(newTotalPaid);
      setFieldsToReset([`amount_${methodToRemove}`]);

      if (newTotalPaid > totals.grandTotal) {
        setError(
          `Total paid amount (${formatAmount(
            newTotalPaid
          )}) exceeds the invoice total (${formatAmount(totals.grandTotal)})`
        );
      } else {
        setError(null);
      }

      return updated;
    });
  };

  const processPayment = async () => {
    if (isProcessing || totalPaid < totals.grandTotal) return;
    setIsProcessing(true);

    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      notification.success({
        message: "Payment Successful!",
        description: (
          <div className="space-y-2">
            <p className="text-gray-700">Transaction ID: {transactionId}</p>
            <p className="text-green-600 font-medium">
              Total Paid : KES {formatAmount(totalPaid)}
            </p>
            <p className="text-gray-600">
              Date : {new Date().toLocaleString()}
            </p>
          </div>
        ),
        duration: 0,
      });
      clearItems();
      setCurrentStep(3);
    } catch (error) {
      notification.error({ message: "Payment Failed. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentMethodSelection = () => (
    <Card className="bg-gray-50 rounded-lg shadow-sm">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Title level={4} className="text-xl font-bold text-blue-600 m-0">
            Select Payment Method(s)
          </Title>
          <Badge
            count={`${paymentMethods.length} selected`}
            className="ml-2"
            style={{ backgroundColor: "#1890ff" }}
          />
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-2 gap-4">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = paymentMethods.some(
              (pm) => pm.method === method.value
            );
            return (
              <Card
                key={method.value}
                hoverable
                className={`border-l-4 hover:scale-95 hover:bg-gray-100 transition-all duration-300 ${
                  isSelected ? "border-green-500 bg-green-50" : ""
                }`}
                style={{ borderLeftColor: method.color }}
                onClick={() => handlePaymentMethodSelect(method.value)}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-full text-white ${
                      isSelected ? "bg-green-500" : ""
                    }`}
                    style={{
                      backgroundColor: isSelected ? undefined : method.color,
                    }}
                  >
                    {method.icon}
                  </div>
                  <div>
                    <Text strong className="text-lg">
                      {method.label}
                    </Text>
                    <Text type="secondary" className="block text-sm">
                      {method.description}
                    </Text>
                  </div>
                  {isSelected && (
                    <CheckCircleOutlined className="ml-auto text-green-500 text-xl" />
                  )}
                </div>

                <Tooltip title={method.details} placement="bottom">
                  <InfoCircleOutlined className="text-gray-400 mt-2" />
                </Tooltip>
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );

  const renderPaymentDetails = () => (
    <Form.Provider>
      <Card className="bg-gray-50 rounded-lg shadow-sm">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Title level={4} className="text-xl font-bold text-blue-600 m-0">
              Payment Details
            </Title>
            <Badge
              count={`${paymentMethods.length} method${
                paymentMethods.length !== 1 ? "s" : ""
              }`}
              className="ml-2"
              style={{ backgroundColor: "#1890ff" }}
            />
          </div>
          <hr className="my-4" />

          <Form form={form} layout="vertical" className="space-y-4">
            {paymentMethods.map(({ method }) => {
              const methodInfo = PAYMENT_METHODS.find(
                (m) => m.value === method
              );
              return (
                <div key={method} className="flex items-center space-x-4">
                  <Form.Item
                    name={`amount_${method}`}
                    label={
                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium">
                          {methodInfo?.label}
                        </span>
                        <Tooltip
                          title={`Processing Time: ${methodInfo?.processingTime}`}
                        >
                          <InfoCircleOutlined className="ml-2 text-gray-400" />
                        </Tooltip>
                      </div>
                    }
                    rules={[
                      { required: true, message: "Please enter the amount" },
                    ]}
                    className="flex-grow"
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      max={totals.grandTotal}
                      onChange={(value) => handleAmountChange(method, value)}
                      formatter={(value) =>
                        `KES ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/KES\s?|(,*)/g, "")}
                      className="text-right"
                      addonBefore={methodInfo?.icon}
                    />
                  </Form.Item>
                  <Button
                    type="text"
                    icon={<CloseCircleOutlined />}
                    onClick={() => handlePaymentMethodRemove(method)}
                    className="self-end mb-4 px-6 py-2 text-sm rounded-md hover:bg-gray-100 transition-all"
                  ></Button>
                </div>
              );
            })}

            <Form.Item name="reference" label="Payment Reference">
              <Input
                placeholder="Enter payment reference (optional)"
                className="bg-white"
                suffix={
                  <Tooltip title="Add any additional reference for this transaction">
                    <InfoCircleOutlined className="text-gray-400" />
                  </Tooltip>
                }
              />
            </Form.Item>
          </Form>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Text className="text-gray-600 mr-2">Subtotal:</Text>
                <Text strong className="text-blue-600">
                  KES : {formatAmount(totals.totalAmt)}
                </Text>
              </div>
              <div className="flex items-center">
                <Text className="text-gray-600 mr-2">Discount:</Text>
                <Text strong className="text-orange-600">
                  KES : {formatAmount(discount)}
                </Text>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <Text strong className="text-lg text-gray-700">
                Amount Due:
              </Text>
              <Text strong className="text-xl text-green-600">
                KES : {formatAmount(totals.grandTotal)}
              </Text>
            </div>
            <div className="mt-4">
              <Text className="text-gray-600">Amount Paid:</Text>
              <Text strong className="ml-2 text-blue-600">
                KES : {formatAmount(totalPaid)}
              </Text>
              <Progress
                percent={Math.min(100, (totalPaid / totals.grandTotal) * 100)}
                status={totalPaid >= totals.grandTotal ? "success" : "active"}
                size="small"
                className="mt-2"
              />
            </div>
          </div>

          {error && (
            <Alert
              message="Payment Error"
              description={error}
              type="error"
              showIcon
              className="mt-4"
            />
          )}
        </div>
      </Card>
    </Form.Provider>
  );

  const renderPaymentConfirmation = () => (
    <Card className="bg-gray-50 rounded-lg shadow-sm">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Title level={4} className="text-xl font-bold text-blue-600 m-0">
            Confirm Payment
          </Title>
          <Badge
            count="Final Step"
            className="ml-2"
            style={{ backgroundColor: "#52c41a" }}
          />
        </div>
        <hr className="my-4" />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card className="bg-white">
              <Text strong className="block mb-2">
                Transaction ID
              </Text>
              <Text className="text-lg">{transactionId}</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card className="bg-white">
              <Text strong className="block mb-2">
                Date
              </Text>
              <Text className="text-lg">{new Date().toLocaleString()}</Text>
            </Card>
          </Col>
        </Row>

        <div className="bg-blue-50 p-4 rounded-lg">
          <Title level={5} className="text-lg font-semibold text-blue-800 mb-4">
            Payment Method(s)
          </Title>
          <Space direction="vertical" className="w-full">
            {paymentMethods.map(({ method, amount }) => {
              const methodInfo = PAYMENT_METHODS.find(
                (m) => m.value === method
              );
              return (
                <div
                  key={method}
                  className="flex justify-between items-center py-2 border-b border-blue-200"
                >
                  <div className="flex items-center">
                    {React.cloneElement(methodInfo?.icon, {
                      style: { color: methodInfo?.color },
                    })}
                    <Text className="ml-2 text-base">{methodInfo?.label}</Text>
                  </div>
                  <Tag
                    color={methodInfo?.color}
                    className="text-base px-3 py-1"
                  >
                    KES : {formatAmount(amount)}
                  </Tag>
                </div>
              );
            })}
          </Space>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between items-center font-bold">
            <div>
              <Text className="text-gray-600">Subtotal Amount</Text>
              <Text strong className="block text-lg text-blue-600">
                KES : {formatAmount(totals.totalAmt)}
              </Text>
            </div>
            <div>
              <Text className="text-gray-600">Discount Amount</Text>
              <Text strong className="block text-lg text-orange-600">
                KES : {formatAmount(discount)}
              </Text>
            </div>
            <div>
              <div>
                <Text className="text-gray-600">Amount Paid</Text>
                <Text strong className="block text-lg text-green-600">
                  KES : {formatAmount(totalPaid)}
                </Text>
              </div>
              <div>
                <Text className="text-gray-600">Amount Due</Text>
                <Text strong className="block text-lg text-red-600">
                  KES :{" "}
                  {formatAmount(Math.max(0, totals.grandTotal - totalPaid))}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      className="payment-modal"
    >
      <Steps current={currentStep} className="mb-4 pt-4">
        <Step title="Select Method(s)" />
        <Step title="Enter Details" />
        <Step title="Confirm Payment" />
      </Steps>
      {currentStep === 0 && renderPaymentMethodSelection()}
      {currentStep === 1 && renderPaymentDetails()}
      {currentStep === 2 && renderPaymentConfirmation()}
      {currentStep === 3 && renderPaymentConfirmation()}

      <div className="flex justify-between mt-6">
        <Button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        {currentStep < 2 ? (
          <Button
            type="primary"
            onClick={() =>
              setCurrentStep(
                currentStep === 0 && paymentMethods.length === 0
                  ? 0
                  : currentStep + 1
              )
            }
            disabled={currentStep === 0 && paymentMethods.length === 0}
          >
            Next
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={processPayment}
            disabled={
              totalPaid < totals.grandTotal || isProcessing || error !== null
            }
          >
            {isProcessing ? "Processing..." : "Complete Payment"}
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;
