import React, { createContext, useState } from "react";

export const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([
    {
      key: "1",
      supplierName: "Supplier 1",
      phoneNo: "123456789",
      email: "supplier1@example.com",
      address: "Address 1",
      curBalance: 5000,
      branch: "Branch A",
      lastSupplyDate: "2023-01-20",
      recentSupply: true,
    },
    // ...other initial suppliers...
  ]);

  return (
    <SupplierContext.Provider value={{ suppliers, setSuppliers }}>
      {children}
    </SupplierContext.Provider>
  );
};
