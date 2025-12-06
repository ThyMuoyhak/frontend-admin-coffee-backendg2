import React from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const Alert = ({ type = 'info', title, message, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const Icon = icons[type];

  return (
    <div className={`rounded-lg border p-4 ${colors[type]}`}>
      <div className="flex items-start">
        <Icon className={`h-5 w-5 mt-0.5 ${type === 'success' ? 'text-green-400' : type === 'error' ? 'text-red-400' : type === 'warning' ? 'text-yellow-400' : 'text-blue-400'}`} />
        <div className="ml-3 flex-1">
          {title && <h3 className="font-medium">{title}</h3>}
          <p className="mt-1 text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 -mt-0.5 -mr-0.5 p-1 rounded hover:bg-white/20 transition"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;