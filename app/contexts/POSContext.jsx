import React from 'react'
import { message } from '@/components/ui'
import PropTypes from 'prop-types'

const POSContext = React.createContext()

export const usePOSContext = () => {
  const context = React.useContext(POSContext)
  if (!context) {
    throw new Error('usePOSContext must be used within a POSProvider')
  }
  return context
}

export const POSProvider = ({ children }) => {
  const [salesData, setSalesData] = React.useState([])
  const [selectedRows, setSelectedRows] = React.useState([])
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false)

  const fetchSales = React.useCallback(async () => {
    // Implement the actual API call here
    // For now, we'll return mock data
    return [
      {
        key: '1',
        salesDate: '2024-01-20',
        invoiceNo: 'INV-001',
        salesStatus: 'Completed',
        createdBy: 'John Doe',
        total: 25000,
        paidAmt: 25000,
        balance: 0,
        payStatus: 'Paid',
        customerName: 'Customer 1',
        branch: 'Branch A',
      },
      {
        key: '2',
        salesDate: '2024-01-19',
        invoiceNo: 'INV-002',
        salesStatus: 'Pending',
        createdBy: 'Jane Smith',
        total: 15000,
        paidAmt: 5000,
        balance: 10000,
        payStatus: 'Partial',
        customerName: 'Customer 2',
        branch: 'Branch B',
      },
      {
        key: '3',
        salesDate: '2024-01-18',
        invoiceNo: 'INV-003',
        salesStatus: 'Pending',
        createdBy: 'Mike Johnson',
        total: 30000,
        paidAmt: 0,
        balance: 30000,
        payStatus: 'Unpaid',
        customerName: 'Customer 3',
        branch: 'Branch C',
      },
    ]
  }, [])

  const updateSale = React.useCallback(async (sale) => {
    // Implement the actual API call to update the sale in the database
    console.log('Updating sale:', sale)
    setSalesData((prevSales) =>
      prevSales.map((s) => (s.key === sale.key ? sale : s))
    )
  }, [])

  React.useEffect(() => {
    const loadSales = async () => {
      const sales = await fetchSales()
      setSalesData(sales)
    }
    loadSales()
  }, [fetchSales])

  const validateBulkPayment = React.useCallback(() => {
    const selectedInvoices = salesData.filter((item) =>
      selectedRows.includes(item.key)
    )
    const uniqueCustomers = new Set(selectedInvoices.map((item) => item.customerName))
    return uniqueCustomers.size === 1
  }, [salesData, selectedRows])

  const handleBulkPayment = React.useCallback(() => {
    if (validateBulkPayment()) {
      setPaymentModalOpen(true)
    } else {
      message.error('Bulk payment can only be made for invoices from the same customer.')
    }
  }, [validateBulkPayment])

  const handlePaymentComplete = React.useCallback(async (amount, paymentMode) => {
    setIsProcessingPayment(true)
    try {
      const updatedSales = salesData.map((sale) => {
        if (selectedRows.includes(sale.key)) {
          const paymentForInvoice = Math.min(amount, sale.balance)
          amount -= paymentForInvoice
          const newBalance = sale.balance - paymentForInvoice
          const newPayStatus = newBalance === 0 ? 'Paid' : 'Partial'
          return {
            ...sale,
            paidAmt: sale.paidAmt + paymentForInvoice,
            balance: newBalance,
            payStatus: newPayStatus,
          }
        }
        return sale
      })

      // Update sales in the database
      for (const sale of updatedSales) {
        if (selectedRows.includes(sale.key)) {
          await updateSale(sale)
        }
      }

      setSelectedRows([])
      message.success('Bulk payment processed successfully')
    } catch (error) {
      message.error('Failed to process bulk payment')
    } finally {
      setIsProcessingPayment(false)
      setPaymentModalOpen(false)
    }
  }, [salesData, selectedRows, updateSale])

  return (
    <POSContext.Provider
      value={{
        salesData,
        selectedRows,
        setSelectedRows,
        paymentModalOpen,
        setPaymentModalOpen,
        isProcessingPayment,
        handleBulkPayment,
        handlePaymentComplete,
        fetchSales,
        updateSale,
      }}
    >
      {children}
    </POSContext.Provider>
  )
}

POSProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default POSProvider

