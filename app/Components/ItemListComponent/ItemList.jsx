import React from 'react';
import { usePOS } from './POSContext';

const ItemList = () => {
  const { items, removeItem } = usePOS();

  return (
    <div className="bg-white border rounded-md">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Item</th>
            <th className="p-2">Price</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Subtotal</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className="border-b">
              <td className="p-2 text-center">{item.name}</td>
              <td className="p-2 text-center">${item.price.toFixed(2)}</td>
              <td className="p-2 text-center">{item.quantity}</td>
              <td className="p-2 text-center">${item.subtotal.toFixed(2)}</td>
              <td className="p-2 text-center">
                <button 
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;