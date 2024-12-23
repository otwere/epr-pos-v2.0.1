import React, { useState } from 'react';
import { usePOS } from './POSContext';

const ItemSearch = () => {
  const { searchQuery, setSearchQuery, handleAddItem } = usePOS();
  const [items] = useState([
    { id: 1, name: 'Apple', price: 0.5, stock: 100 },
    { id: 2, name: 'Banana', price: 0.3, stock: 150 },
    // Add more items
  ]);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <input 
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      <div className="grid grid-cols-4 gap-2 mt-4">
        {filteredItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleAddItem({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: 1,
              subtotal: item.price
            })}
            className="p-2 border rounded-md hover:bg-gray-100"
          >
            {item.name} - ${item.price}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ItemSearch;