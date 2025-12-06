import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const data = [
  { name: 'Mon', orders: 12, revenue: 240 },
  { name: 'Tue', orders: 19, revenue: 380 },
  { name: 'Wed', orders: 15, revenue: 300 },
  { name: 'Thu', orders: 25, revenue: 500 },
  { name: 'Fri', orders: 32, revenue: 640 },
  { name: 'Sat', orders: 28, revenue: 560 },
  { name: 'Sun', orders: 20, revenue: 400 },
];

const SalesChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280' }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          formatter={(value) => [`$${value}`, 'Revenue']}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#f59e0b"
          fill="url(#colorRevenue)"
          strokeWidth={2}
        />
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;