"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const POSContext = createContext(undefined);

export const POSProvider = ({ children }) => {
  const [branch, setBranch] = useState("");
  const [customer, setCustomer] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);

  // New state for discount functionality
  const [discount, setDiscount] = useState(0);
  const [isPercentage, setIsPercentage] = useState(true);

  // Calculate totals dynamically
  const totals = {
    totalAmt: items.reduce((sum, item) => sum + item.subtotal, 0),
    grandTotal:
      items.reduce((sum, item) => sum + item.subtotal, 0) -
      (isPercentage
        ? (items.reduce((sum, item) => sum + item.subtotal, 0) * discount) / 100
        : discount),
  };

  const handleAddItem = (newItem) => {
    // Check if item already exists
    const existingItemIndex = items.findIndex(item => item.id === newItem.id);
    
    if (existingItemIndex > -1) {
      // Update existing item
      const updatedItems = [...items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1,
        subtotal: (updatedItems[existingItemIndex].quantity + 1) * newItem.price
      };
      setItems(updatedItems);
    } else {
      // Add new item
      setItems([...items, {
        ...newItem,
        quantity: 1,
        subtotal: newItem.price
      }]);
    }
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItemQuantity = (index, newQuantity) => {
    const newItems = [...items];
    if (newQuantity > 0) {
      newItems[index] = {
        ...newItems[index],
        quantity: newQuantity,
        subtotal: newItems[index].price * newQuantity
      };
      setItems(newItems);
    } else {
      // Remove item if quantity is 0
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const clearItems = () => {
    setItems([]);
    setDiscount(0);
    setIsPercentage(true);
  };

  return (
    <POSContext.Provider
      value={{
        branch,
        setBranch,
        customer,
        setCustomer,
        searchQuery,
        setSearchQuery,
        items,
        handleAddItem,
        removeItem,
        updateItemQuantity,
        clearItems,
        totals,
        discount,
        setDiscount,
        isPercentage,
        setIsPercentage,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error("usePOS must be used within a POSProvider");
  }
  return context;
};