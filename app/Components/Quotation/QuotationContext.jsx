import React, { createContext, useContext, useState, useEffect } from 'react';

const QuotationContext = createContext();

export const QuotationProvider = ({ children }) => {
  const [quotations, setQuotations] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuotations();
    fetchClients();
    fetchProducts();
  }, []);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setQuotations(mockQuotations);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setClients(mockClients);
      }, 1000);
    } catch (err) {
      setError(err);
    }
  };

  const fetchProducts = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setProducts(mockProducts);
      }, 1000);
    } catch (err) {
      setError(err);
    }
  };

  const addQuotation = async (quotation) => {
    try {
      const newQuotation = {
        ...quotation,
        id: quotations.length + 1,
        totalAmount: calculateTotalAmount(quotation.items),
        createdBy: "Admin", // Hardcoded for now, can be dynamic
        numberOfItems: quotation.items.length, // Add number of items
      };
      setQuotations([...quotations, newQuotation]);
    } catch (err) {
      setError(err);
    }
  };

  const updateQuotation = async (id, updatedQuotation) => {
    try {
      const updatedQuotations = quotations.map((q) =>
        q.id === id
          ? { ...q, ...updatedQuotation, totalAmount: calculateTotalAmount(updatedQuotation.items), numberOfItems: updatedQuotation.items.length }
          : q
      );
      setQuotations(updatedQuotations);
    } catch (err) {
      setError(err);
    }
  };

  const deleteQuotation = async (id) => {
    try {
      setQuotations(quotations.filter((q) => q.id !== id));
    } catch (err) {
      setError(err);
    }
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  };

  return (
    <QuotationContext.Provider
      value={{
        quotations,
        clients,
        products,
        loading,
        error,
        addQuotation,
        updateQuotation,
        deleteQuotation,
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
};

export const useQuotationContext = () => {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error('useQuotationContext must be used within a QuotationProvider');
  }
  return context;
};

const mockQuotations = [
  {
    id: 1,
    quotationId: 'Q001',
    date: '2023-10-01',
    clientId: 1,
    client: { id: 1, name: 'Client A' },
    items: [{ productId: 1, quantity: 2, unitPrice: 100 }],
    totalAmount: 200,
    terms: 'Net 30',
    status: 'Pending',
    createdBy: 'Admin', // Added createdBy field
    numberOfItems: 1, // Added number of items
  },
  // Add more mock quotations here
];

const mockClients = [
  { id: 1, name: 'Client A' },
  { id: 2, name: 'Client B' },
  // Add more mock clients here
];

const mockProducts = [
  { id: 1, name: 'Product 1', price: 100 },
  { id: 2, name: 'Product 2', price: 200 },
  // Add more mock products here
];

export default QuotationContext;