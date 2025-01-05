import React, { createContext, useContext, useState } from 'react';

const SupplierContext = createContext(undefined);

export { SupplierContext };

export const useSupplierContext = () => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSupplierContext must be used within a SupplierProvider');
  }
  return context;
};

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);

  const addSupplier = (supplier) => {
    setSuppliers((prevSuppliers) => [...prevSuppliers, supplier]);
  };

  const updateSupplier = (key, updatedSupplier) => {
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier.key === key ? { ...supplier, ...updatedSupplier } : supplier
      )
    );
  };

  const deleteSupplier = (key) => {
    setSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier.key !== key));
  };

  return (
    <SupplierContext.Provider value={{ suppliers, addSupplier, updateSupplier, deleteSupplier }}>
      {children}
    </SupplierContext.Provider>
  );
};

export const addSupplier = (supplier) => {
  const { addSupplier: contextAddSupplier } = useSupplierContext();
  contextAddSupplier(supplier);
};

