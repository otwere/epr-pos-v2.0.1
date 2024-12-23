import React from 'react';
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = ({ collapsed }) => {
  return (
    <div className={`fixed top-0 right-0 z-10 search-bar p-2 ${collapsed ? 'ml-0' : 'ml-10'} rounded-none shadow-none`}>
      <form className="search-form flex items-center" method="POST" action="#">
        <input
          type="text"
          name="query"
          placeholder="Search..."
          title="Enter search keyword"
          className="flex-grow p-2 rounded-l-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          title="Search"
          className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition duration-300"
        >
          <SearchOutlined />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
