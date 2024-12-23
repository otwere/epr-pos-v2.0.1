import React, { memo } from 'react';
import Link from 'next/link';
import { DesktopOutlined } from '@ant-design/icons';

// Use memo to prevent unnecessary re-renders
const DesktopIcon = memo(() => {
  return (
    <Link href="/" passHref>
      <DesktopOutlined className="text-blue-600 text-[33px] -ml-20" />
    </Link>
  );
});

export default DesktopIcon;

