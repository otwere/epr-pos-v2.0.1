import React, { useEffect, useState } from "react";
import { usePOS } from "../POSContextComponent/POSContext";
import { Input, message, Switch, Card, Space, Badge } from "antd";
import { PercentageOutlined, DollarOutlined } from "@ant-design/icons";

const DiscountSection = () => {
  const {
    totals,
    items,
    discount,
    setDiscount,
    isPercentage,
    setIsPercentage,
  } = usePOS();

  const [localDiscount, setLocalDiscount] = useState(discount);
  const [previousDiscount, setPreviousDiscount] = useState(0);
  const [savingsAmount, setSavingsAmount] = useState(0);

  useEffect(() => {
    setLocalDiscount(discount);
    calculateSavings(discount);
  }, [discount]);

  // Format numbers with thousands separator
  const formatAmount = (amount) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Calculate savings and percentage off
  const calculateSavings = (discountValue) => {
    if (isPercentage) {
      const savings = (totals.totalAmt * discountValue) / 100;
      setSavingsAmount(savings);
    } else {
      setSavingsAmount(discountValue);
    }
  };

  const handleDiscountChange = (value) => {
    const numericValue = parseFloat(value) || 0;
    setPreviousDiscount(localDiscount); // Store previous value for undo functionality

    // Validation to prevent negative discounts
    if (numericValue < 0) {
      message.error({
        content: "Discount cannot be negative. Resetting to previous value.",
        duration: 2,
      });
      setLocalDiscount(previousDiscount);
      setDiscount(previousDiscount);
      return;
    }

    // Percentage discount validation
    if (isPercentage && numericValue > 100) {
      message.warning({
        content: "Discount percentage cannot exceed 100%. Resetting to 0.",
        duration: 3,
      });
      setLocalDiscount(0);
      setDiscount(0);
      return;
    }

    // Fixed amount discount validation
    if (!isPercentage && numericValue > totals.totalAmt) {
      message.error({
        content: `Maximum discount allowed is KES ${formatAmount(
          totals.totalAmt
        )}. Adjusting to maximum.`,
        duration: 2,
      });
      setLocalDiscount(totals.totalAmt);
      setDiscount(totals.totalAmt);
      return;
    }

    // Update discount and calculate savings
    setLocalDiscount(numericValue);
    setDiscount(numericValue);
    calculateSavings(numericValue);
  };

  const handleDiscountTypeChange = (checked) => {
    const currentValue = localDiscount;
    let newValue = "";

    if (checked) {
      // Converting to percentage
      newValue = ((currentValue / totals.totalAmt) * 100).toFixed(2);
    } else {
      // Converting to fixed amount
      newValue = ((currentValue / 100) * totals.totalAmt).toFixed(2);
    }

    // Validation to prevent negative values during conversion
    if (parseFloat(newValue) < 0) {
      message.error({
        content: "Converted discount value cannot be negative. Resetting to 0.",
        duration: 3,
      });
      newValue = 0;
    }

    setIsPercentage(checked);
    setLocalDiscount(parseFloat(newValue));
    setDiscount(parseFloat(newValue));

    message.success({
      content: `Switched to ${checked ? "percentage" : "amount"} discount. Value converted automatically.`,
      icon: checked ? <PercentageOutlined /> : <DollarOutlined />,
    });
  };

  const numberOfItems = items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const uniqueItems = items?.length || 0;

  const subtotal = formatAmount(totals.totalAmt);
  const grandTotal = formatAmount(totals.grandTotal);
  const savings = formatAmount(savingsAmount);
  const savingsPercentage = ((savingsAmount / totals.totalAmt) * 100).toFixed(1);

  return (
    <Card className="mt-4 bg-gray-50 rounded-lg shadow-sm">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-xl font-bold text-orange-600">Order Summary</h4>
          <Badge
            count={`${uniqueItems} ${uniqueItems === 1 ? "type" : "types"}`}
            className="ml-2"
            style={{ backgroundColor: "#1890ff" }}
          />
        </div>
        <hr className="mt-0" />

        <div className="flex items-center justify-between space-x-6">
          <div className="flex items-center">
            <p className="text-gray-600 font-medium mr-2 text-lg">Subtotal :</p>
            <p className="text-blue-600 text-lg font-bold">KES : {subtotal}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={localDiscount}
                onChange={(e) => handleDiscountChange(e.target.value)}
                placeholder="Enter Discount as % or KES"
                className="w-33 items-center"
                suffix={<Space>{isPercentage ? "%" : "KES"}</Space>}
              />
              <Switch
                checked={isPercentage}
                onChange={handleDiscountTypeChange}
                checkedChildren="Percentage"
                unCheckedChildren="Amount"
                className="bg-blue-600"
                style={{ width: 134, height: 23 }}
              />
            </div>
          </div>

          <div className="flex items-center">
            <p className="text-gray-600 font-medium mr-2 text-lg">Discounted Total :</p>
            <p className="text-orange-600 text-lg font-bold">KES : {grandTotal}</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <p className="text-sm text-gray-600 mr-2">Total Items :</p>
              <p className="font-medium">
                {numberOfItems} {numberOfItems === 1 ? "item" : "items"}
              </p>
            </div>

            <div className="flex items-center">
              <p className="text-sm text-gray-600 mr-2">Discount Approved :</p>
              <p className="font-medium text-green-600">
                KES : {savings} ({savingsPercentage}% off)
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-700 font-bold text-lg">Grand Total :</p>
          <p className="text-green-600 text-xl font-bold">KES : {grandTotal}</p>
        </div>
      </div>
    </Card>
  );
};

export default DiscountSection;
