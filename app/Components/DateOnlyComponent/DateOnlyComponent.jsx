import React from 'react';

const getDateOnly = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};

const DateOnlyComponent = () => {
  const currentDate = getDateOnly();

  return (
    <div>
      {currentDate}
    </div>
  );
};

export default DateOnlyComponent;
