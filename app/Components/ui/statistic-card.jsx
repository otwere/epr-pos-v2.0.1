import React from 'react';
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const StatisticCard = ({ 
  title, 
  value, 
  prefix, 
  suffix,
  trend,
  trendLabel,
  loading = false,
  className = ""
}) => {
  const valueStyle = trend > 0 ? { color: '#3f8600' } :
                     trend < 0 ? { color: '#cf1322' } : {};

  return (
    <Card 
      loading={loading}
      className={`transform transition-all duration-300 hover:scale-95 ${className}`}
    >
      <Statistic
        title={
          <div className="flex items-center gap-2">          
            <span className="text-base font-semibold mt-0">{title}</span>
          </div>
        }
        value={value}
        precision={0}
        valueStyle={valueStyle}
        prefix={prefix}
        suffix={suffix}
      />
      {trend !== undefined && (
        <div className={`mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          <span className="ml-1">{Math.abs(trend)}%</span>
          {trendLabel && <span className="text-gray-600 ml-1">vs {trendLabel}</span>}
        </div>
      )}
    </Card>
  );
};

export default StatisticCard;

