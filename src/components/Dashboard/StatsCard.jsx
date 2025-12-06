import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, change }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className={`text-sm font-medium ${
          change.includes('+') ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-gray-600 mt-1">{title}</p>
      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${
              title.includes('Revenue') ? 'bg-green-500' :
              title.includes('Orders') ? 'bg-blue-500' :
              title.includes('Products') ? 'bg-purple-500' :
              'bg-amber-500'
            }`}
            style={{ width: '75%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;