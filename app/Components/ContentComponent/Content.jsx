import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Typography, Card } from 'antd';
import CardsDashboard from '../CardsDashboardComponents/CardsDashboard';// Assuming the Cards export from CardsDashboard

const { Content: AntContent } = Layout;
const { Title } = Typography;

const Content = ({ collapsed }) => {
  return (
    <AntContent 
      className={`
        transition-all duration-300 p-6 
        ${collapsed ? 'ml-[60px] w-[calc(100% - 88px)]' : 'ml-0 w-full'} 
        bg-gray-50
      `}
    >
      <Card className="shadow-sm rounded-lg bg-gray-50 max-w-full mb-3">
        <div className="mb-4 flex justify-between items-center">
          <Title level={4} className="!mb-0 mt-0 text-blue-600">
            Dashboard Summary
          </Title>
        </div>
        
        <CardsDashboard />
      </Card>
    </AntContent>
  );
};

// Define PropTypes for validation
Content.propTypes = {
  collapsed: PropTypes.bool.isRequired,
};

// Define default props
Content.defaultProps = {
  collapsed: false,
};

export default Content;