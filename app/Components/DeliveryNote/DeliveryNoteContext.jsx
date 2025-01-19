import React, { createContext, useContext, useState, useEffect } from "react";

// Mock data for delivery notes
const mockDeliveryNotes = [
  {
    id: 1,
    slNo: 1,
    deliveryNoteId: "DN001",
    deliveryDate: "2023-10-01",
    customerName: "Customer A",
    customerAddress: "123 Main St, City A",
    products: [
      { productName: "Product 1", quantity: 10, unitPrice: 100, totalAmount: 1000 },
      { productName: "Product 2", quantity: 5, unitPrice: 200, totalAmount: 1000 },
    ],
    paymentTerms: "Net 30",
    status: "Pending",
  },
  {
    id: 2,
    slNo: 2,
    deliveryNoteId: "DN002",
    deliveryDate: "2023-10-02",
    customerName: "Customer B",
    customerAddress: "456 Elm St, City B",
    products: [
      { productName: "Product 3", quantity: 15, unitPrice: 150, totalAmount: 2250 },
    ],
    paymentTerms: "Net 15",
    status: "Delivered",
  },
];

// Mock data for customers
const mockCustomers = [
  { id: 1, name: "Customer A", address: "123 Main St, City A" },
  { id: 2, name: "Customer B", address: "456 Elm St, City B" },
  { id: 3, name: "Customer C", address: "789 Oak St, City C" },
];

// Mock data for products
const mockProducts = [
  { id: 1, name: "Product 1", unitPrice: 100 },
  { id: 2, name: "Product 2", unitPrice: 200 },
  { id: 3, name: "Product 3", unitPrice: 150 },
];

const DeliveryNoteContext = createContext();

const isValidDate = (date) => {
  return !isNaN(Date.parse(date));
};

const isValidDeliveryNote = (note) => {
  return note.deliveryNoteId && isValidDate(note.deliveryDate) && note.customerName && note.products.length > 0;
};

export const DeliveryNoteProvider = ({ children }) => {
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchCustomersError, setFetchCustomersError] = useState(null);
  const [fetchProductsError, setFetchProductsError] = useState(null);
  const [fetchDeliveryNotesError, setFetchDeliveryNotesError] = useState(null);
  const [crudLoading, setCrudLoading] = useState(false);
  const [crudError, setCrudError] = useState(null);
  const [selectedDeliveryNotes, setSelectedDeliveryNotes] = useState([]);

  useEffect(() => {
    fetchDeliveryNotes();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchDeliveryNotes = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      setTimeout(() => {
        const validDeliveryNotes = mockDeliveryNotes.filter(note => isValidDate(note.deliveryDate));
        setDeliveryNotes(validDeliveryNotes); // Use mock data
        setFetchDeliveryNotesError(null);
        setLoading(false);
      }, 500); // 1 second delay
    } catch (error) {
      console.error("Error fetching delivery notes:", error);
      setFetchDeliveryNotesError(error);
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      // Simulate API call delay
      setTimeout(() => {
        setCustomers(mockCustomers); // Use mock data
        setFetchCustomersError(null);
      }, 1000); // 1 second delay
    } catch (error) {
      console.error("Error fetching customers:", error);
      setFetchCustomersError(error);
    }
  };

  const fetchProducts = async () => {
    try {
      // Simulate API call delay
      setTimeout(() => {
        setProducts(mockProducts); // Use mock data
        setFetchProductsError(null);
      }, 500); // 1 second delay
    } catch (error) {
      console.error("Error fetching products:", error);
      setFetchProductsError(error);
    }
  };

  const addDeliveryNote = async (note) => {
    setCrudLoading(true);
    try {
      if (!isValidDeliveryNote(note)) {
        throw new Error("Invalid delivery note data");
      }
      const newNote = { ...note, id: deliveryNotes.length + 1 };
      setDeliveryNotes([...deliveryNotes, newNote]);
      setCrudError(null);
    } catch (error) {
      console.error("Error adding delivery note:", error);
      setCrudError(error);
    } finally {
      setCrudLoading(false);
    }
  };

  const updateDeliveryNote = async (id, updatedNote) => {
    setCrudLoading(true);
    try {
      if (!isValidDeliveryNote(updatedNote)) {
        throw new Error("Invalid delivery note data");
      }
      setDeliveryNotes(deliveryNotes.map(note => note.id === id ? { ...note, ...updatedNote } : note));
      setCrudError(null);
    } catch (error) {
      console.error("Error updating delivery note:", error);
      setCrudError(error);
    } finally {
      setCrudLoading(false);
    }
  };

  const deleteDeliveryNote = async (id) => {
    setCrudLoading(true);
    try {
      setDeliveryNotes(deliveryNotes.filter(note => note.id !== id));
      setCrudError(null);
    } catch (error) {
      console.error("Error deleting delivery note:", error);
      setCrudError(error);
    } finally {
      setCrudLoading(false);
    }
  };

  const toggleSelectDeliveryNote = (id) => {
    setSelectedDeliveryNotes((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((noteId) => noteId !== id)
        : [...prevSelected, id]
    );
  };

  const viewDeliveryNote = (id) => {
    const note = deliveryNotes.find(note => note.id === id);
    if (note) {
      console.log("Viewing delivery note:", note);
      // Implement the logic to view the delivery note
    } else {
      console.error("Delivery note not found");
    }
  };

  const printDeliveryNote = (id) => {
    const note = deliveryNotes.find(note => note.id === id);
    if (note) {
      console.log("Printing delivery note:", note);
      // Implement the logic to print the delivery note
    } else {
      console.error("Delivery note not found");
    }
  };

  return (
    <DeliveryNoteContext.Provider
      value={{
        deliveryNotes,
        customers,
        products,
        loading,
        addDeliveryNote,
        updateDeliveryNote,
        deleteDeliveryNote,
        fetchCustomersError,
        fetchProductsError,
        fetchDeliveryNotesError,
        crudLoading,
        crudError,
        selectedDeliveryNotes,
        toggleSelectDeliveryNote,
        viewDeliveryNote,
        printDeliveryNote,
      }}
    >
      {children}
    </DeliveryNoteContext.Provider>
  );
};

export const useDeliveryNoteContext = () => useContext(DeliveryNoteContext);