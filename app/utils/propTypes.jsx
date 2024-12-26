import PropTypes from 'prop-types'
import { PaymentStatus, SalesStatus } from './constants'

export const SalePropType = PropTypes.shape({
  key: PropTypes.string.isRequired,
  salesDate: PropTypes.string.isRequired,
  invoiceNo: PropTypes.string.isRequired,
  salesStatus: PropTypes.oneOf(Object.values(SalesStatus)).isRequired,
  createdBy: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  paidAmt: PropTypes.number.isRequired,
  balance: PropTypes.number.isRequired,
  payStatus: PropTypes.oneOf(Object.values(PaymentStatus)).isRequired,
  customerName: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
})

export const SalesListPropTypes = {
  salesData: PropTypes.arrayOf(SalePropType).isRequired,
  onUpdateSale: PropTypes.func.isRequired,
}

export const PaymentModalPropTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onPaymentComplete: PropTypes.func.isRequired,
  selectedInvoices: PropTypes.arrayOf(SalePropType).isRequired,
  isProcessing: PropTypes.bool.isRequired,
}

