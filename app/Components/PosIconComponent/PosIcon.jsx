import React, { memo } from 'react';
import Link from 'next/link';
import { ShoppingCartOutlined } from '@ant-design/icons';

// Wrap the component with React.memo to avoid re-renders
const PosIcon = memo(() => {
  return (
    <Link href="/pos" passHref>
      <ShoppingCartOutlined className="text-blue-600 text-4xl ml-[-3rem]" />
    </Link>
  );
});

export default PosIcon;
