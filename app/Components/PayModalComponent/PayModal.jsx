import React from 'react'
import { Modal, Form, InputNumber, Select, Button } from '@/components/ui'
import PropTypes from 'prop-types'

const PaymentModal = ({
  open,
  onClose,
  onPaymentComplete,
  selectedInvoices,
  isProcessing,
}) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    form.submit()
  }

  const onFinish = (values) => {
    onPaymentComplete(values.amount, values.paymentMode)
  }

  const totalBalance = selectedInvoices.reduce((sum, invoice) => sum + invoice.balance, 0)

  return (
    <Modal
      title="Process Bulk Payment"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isProcessing}
          onClick={handleOk}
          className="bg-primary-500 hover:bg-primary-600"
        >
          Process Payment
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ amount: totalBalance }}
      >
        <Form.Item
          name="amount"
          label="Payment Amount"
          rules={[{ required: true, message: 'Please enter the payment amount' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={(value) => `KES ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/KES\s?|(,*)/g, '')}
            min={0}
            max={totalBalance}
          />
        </Form.Item>
        <Form.Item
          name="paymentMode"
          label="Payment Method"
          rules={[{ required: true, message: 'Please select a payment method' }]}
        >
          <Select>
            <Select.Option value="cash">Cash</Select.Option>
            <Select.Option value="card">Card</Select.Option>
            <Select.Option value="mpesa">M-Pesa</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

PaymentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onPaymentComplete: PropTypes.func.isRequired,
  selectedInvoices: PropTypes.array.isRequired,
  isProcessing: PropTypes.bool.isRequired,
}

export default PaymentModal

