import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Coffee,
  X,
  BarChart3,
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { admin, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-gray-600 bg-opacity-75 transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={`fixed inset-y-0 left-0 flex w-64 transform transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative flex-1 flex flex-col bg-white">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Coffee className="h-8 w-8 text-amber-600" />
                <span className="ml-3 text-xl font-bold text-gray-900">
                  BrewHaven
                </span>
                <button
                  className="ml-auto lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>
              <nav className="mt-8 px-2 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-3 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {admin?.full_name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">{admin?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="ml-auto p-2 text-gray-400 hover:text-gray-500"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Coffee className="h-8 w-8 text-amber-600" />
            <span className="ml-3 text-xl font-bold text-gray-900">
              BrewHaven
            </span>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-3 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {admin?.full_name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="ml-auto p-2 text-gray-400 hover:text-gray-500"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;