import React, { useState } from 'react';
import { Modal, Form, Input, Select, Row, Col, Button, Tooltip } from 'antd';
import { InfoCircleOutlined, DollarOutlined } from '@ant-design/icons';

const { Option } = Select;

const ClearBillModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    user: '',
    shift: '',
    expectedAmount: '',
    paymentModes: {
      cash: '0',
      mpesa: '0',
      pdq: '0'
    }
  });

  const [totalAmount, setTotalAmount] = useState(0);

  const calculateTotal = (modes) => {
    return Object.values(modes).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (field.includes('paymentModes.')) {
        const mode = field.split('.')[1];
        newData.paymentModes = {
          ...newData.paymentModes,
          [mode]: value
        };
        setTotalAmount(calculateTotal(newData.paymentModes));
      } else {
        newData[field] = value;
      }
      return newData;
    });
  };

  const handleSubmit = () => {
    const total = calculateTotal(formData.paymentModes);
    const expected = parseFloat(formData.expectedAmount);
    const difference = expected - total;

    Modal.confirm({
      title: difference !== 0 ? 'Confirm Submission' : 'Balance Verified',
      content: (
        <div>
          <p>Expected Amount: KES {expected.toLocaleString()}</p>
          <p>Total Collected: KES {total.toLocaleString()}</p>
          <p className={`font-medium ${difference === 0 ? 'text-green-500' : 'text-red-500'}`}>
            Difference: KES {Math.abs(difference).toLocaleString()} 
            {difference > 0 ? ' (Shortage)' : difference < 0 ? ' (Excess)' : ''}
          </p>
        </div>
      ),
      onOk: () => {
        onSubmit({
          ...formData,
          date: new Date().toISOString().split('T')[0],
          availableAmount: total,
          difference,
          status: difference === 0 ? 'balanced' : difference > 0 ? 'shortage' : 'excess'
        });
        setFormData({
          user: '',
          shift: '',
          expectedAmount: '',
          paymentModes: {
            cash: '0',
            mpesa: '0',
            pdq: '0'
          }
        });
        onClose();
      }
    });
  };

  return (
    <Modal
      title="Clear Bills"
      open={open}
      onCancel={onClose}
      footer={null}
      width={950}
    >
      <Form layout="vertical" onFinish={handleSubmit} className="mt-4 bg-gray-50 p-4">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Sales Person"
              rules={[{ required: true, message: 'Please select a sales person' }]}
            >
              <Select
                value={formData.user}
                onChange={(value) => handleInputChange('user', value)}
                placeholder="Select Sales Person"
                showSearch
              >
                <Option value="john">John Doe</Option>
                <Option value="jane">Jane Smith</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Shift"
              rules={[{ required: true, message: 'Please select a shift' }]}
            >
              <Select
                value={formData.shift}
                onChange={(value) => handleInputChange('shift', value)}
                placeholder="Select Shift"
              >
                <Option value="morning">Morning - 09:00 AM</Option>
                <Option value="evening">Evening - 06:00 PM</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={
            <span>
              Expected Amount{' '}
              <Tooltip title="The total amount expected from sales during the shift">
                <InfoCircleOutlined className="text-gray-400" />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: 'Please enter the expected amount' }]}
        >
          <Input
            prefix={<DollarOutlined />}
            type="number"
            placeholder="0"
            value={formData.expectedAmount}
            onChange={(e) => handleInputChange('expectedAmount', e.target.value)}
          />
        </Form.Item>

        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="mb-4 text-base font-medium">Payment Modes</h3>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Cash">
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.paymentModes.cash}
                  onChange={(e) => handleInputChange('paymentModes.cash', e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="M-PESA">
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.paymentModes.mpesa}
                  onChange={(e) => handleInputChange('paymentModes.mpesa', e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="PDQ | Cheque | Bank Transfer">
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.paymentModes.pdq}
                  onChange={(e) => handleInputChange('paymentModes.pdq', e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-medium">
              Total Amount Collected :
            </span>
            <span className="text-xl font-bold text-blue-600">
              KES {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>
            Submit Clearance
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ClearBillModal;

