import { notification } from 'antd'; // Ant Design for notifications

// Save Payment History Function
export const savePaymentHistory = async (paymentData, resetForm) => {
  try {
    // Mock API call or saving logic
    const response = await mockApiSave(paymentData); // Replace with actual API call

    if (response.success) {
      notification.success({
        message: 'Payment History Saved',
        description: `Payment history for ${paymentData.customerName} has been successfully saved.`,
        placement: 'bottomRight',
      });
      console.log("Payment history saved:", paymentData);

      // Clear form or reset state
      resetForm();
    } else {
      throw new Error('Failed to save payment history.');
    }
  } catch (error) {
    notification.error({
      message: 'Error Saving Payment History',
      description: error.message,
      placement: 'bottomRight',
    });
    console.error("Error saving payment history:", error);
  }
};

// Generate Receipt Function
export const generateReceipt = (paymentData, clearReceiptData) => {
  try {
    // Logic to generate a receipt
    const receiptContent = `
      Receipt
      --------------------
      Customer: ${paymentData.customerName}
      Amount: ${paymentData.amount}
      Date: ${new Date().toLocaleDateString()}
      --------------------
      Thank you for your payment!
    `;

    notification.info({
      message: 'Receipt Generated',
      description: `Receipt for ${paymentData.customerName} has been generated.`,
      placement: 'bottomRight',
    });

    console.log("Receipt generated for:", paymentData);

    // Clear receipt data or reset state
    clearReceiptData();

    return receiptContent;
  } catch (error) {
    notification.error({
      message: 'Error Generating Receipt',
      description: error.message,
      placement: 'bottomRight',
    });
    console.error("Error generating receipt:", error);
    return null;
  }
};

// Mock API call function
const mockApiSave = async (paymentData) => {
  // Simulate a successful save with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};
