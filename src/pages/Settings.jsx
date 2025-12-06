import React, { useState } from 'react';
import { Save, Bell, Lock, User, Globe, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { admin } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    full_name: admin?.full_name || '',
    email: admin?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    order_alerts: true,
    payment_alerts: true,
    low_stock_alerts: true,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'store', label: 'Store Settings', icon: Globe },
  ];

  const handleProfileSave = async () => {
    try {
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordSave = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      toast.success('Password changed successfully');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and store preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Information</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Role</p>
                      <p className="font-medium">{admin?.role || 'Admin'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Login</p>
                      <p className="font-medium">
                        {admin?.last_login 
                          ? new Date(admin.last_login).toLocaleString()
                          : 'Never logged in'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Account Created</p>
                      <p className="font-medium">
                        {admin?.created_at 
                          ? new Date(admin.created_at).toLocaleDateString()
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleProfileSave}
                  className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handlePasswordSave}
                  className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition"
                >
                  <Lock className="h-5 w-5 mr-2" />
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-500">
                          {key.includes('email') && 'Receive email notifications'}
                          {key.includes('order') && 'Get notified for new orders'}
                          {key.includes('payment') && 'Receive payment alerts'}
                          {key.includes('stock') && 'Get alerts for low stock items'}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          value ? 'bg-amber-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => toast.success('Notification preferences saved')}
                  className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition"
                >
                  <Bell className="h-5 w-5 mr-2" />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Store Settings Tab */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      defaultValue="BrewHaven Coffee Shop"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Currency
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                      <option>USD ($)</option>
                      <option>KHR (៛)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Zone
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                      <option>Asia/Phnom_Penh (GMT+7)</option>
                      <option>UTC</option>
                      <option>America/New_York (GMT-5)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">KHQR Payment</p>
                      <p className="text-sm text-gray-500">Enable Bakong KHQR payments</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-amber-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  </div>
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Accept cash payments on delivery</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => toast.success('Store settings saved')}
                  className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition"
                >
                  <Globe className="h-5 w-5 mr-2" />
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;