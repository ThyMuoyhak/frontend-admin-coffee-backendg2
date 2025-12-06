import React from 'react';
import { Menu, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = ({ setSidebarOpen }) => {
  const { admin } = useAuth();

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative">
            <div className="flex items-center gap-x-3">
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">
                  {admin?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">{admin?.role}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-amber-600 font-semibold">
                  {admin?.full_name?.charAt(0) || 'A'}
                </span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;