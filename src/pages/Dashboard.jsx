import React, { useState, useEffect } from 'react';
import StatsCard from '../components/Dashboard/StatsCard';
import SalesChart from '../components/Dashboard/SalesChart';
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  Clock,
  Users,
} from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_orders: 0,
    total_revenue: 0,
    total_products: 0,
    pending_orders: 0,
    completed_orders: 0,
    today_orders: 0,
    today_revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      const [statsRes, ordersRes] = await Promise.all([
        api.get('/api/v1/admin/dashboard/stats'),
        api.get('/api/v1/admin/orders?limit=5'),
      ]);
      
      console.log('Dashboard stats:', statsRes.data);
      console.log('Recent orders:', ordersRes.data);
      
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.total_revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12%',
    },
    {
      title: 'Total Orders',
      value: stats.total_orders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      change: '+8%',
    },
    {
      title: 'Products',
      value: stats.total_products,
      icon: Package,
      color: 'bg-purple-500',
      change: '+5%',
    },
    {
      title: 'Today\'s Orders',
      value: stats.today_orders,
      icon: TrendingUp,
      color: 'bg-amber-500',
      change: `$${stats.today_revenue.toFixed(2)} revenue`,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
              <select className="text-sm border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <SalesChart />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.order_number}</p>
                  <p className="text-sm text-gray-500">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${order.total_amount.toFixed(2)}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Order Status</h3>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="font-semibold">{stats.completed_orders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold">{stats.pending_orders}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Today's Activity</h3>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Orders Today</span>
              <span className="font-semibold">{stats.today_orders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Today's Revenue</span>
              <span className="font-semibold">${stats.today_revenue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/products'}
              className="w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 transition"
            >
              Add New Product
            </button>
            <button 
              onClick={() => window.location.href = '/orders'}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;