import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, Truck } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      const response = await api.get('/api/v1/admin/orders/');
      console.log('Orders response:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Orders fetch error:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      console.log('Updating order status:', orderId, status);
      await api.put(`/api/v1/admin/orders/${orderId}`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      console.error('Update order error:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'delivering': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'preparing': return <Clock className="h-5 w-5" />;
      case 'delivering': return <Truck className="h-5 w-5" />;
      case 'cancelled': return <XCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.phone_number.includes(searchQuery);
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage customer orders and track their status</p>
      </div>

      <div className="bg-white rounded-xl shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number, customer name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="delivering">Delivering</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.order_number}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.phone_number}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${order.total_amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="text-amber-600 hover:text-amber-900"
                          title="Start Preparing"
                        >
                          Start
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivering')}
                          className="text-green-600 hover:text-green-900"
                          title="Mark as Delivering"
                        >
                          Deliver
                        </button>
                      )}
                      {order.status === 'delivering' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="text-green-600 hover:text-green-900"
                          title="Mark as Completed"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setSelectedOrder(null)}
            />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Details: {selectedOrder.order_number}
                </h3>
              </div>
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Customer Information</h4>
                      <p className="mt-1 text-gray-600">Name: {selectedOrder.customer_name}</p>
                      <p className="text-gray-600">Phone: {selectedOrder.phone_number}</p>
                      <p className="text-gray-600">Address: {selectedOrder.delivery_address}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Order Information</h4>
                      <p className="mt-1 text-gray-600">Date: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                      <p className="text-gray-600">Status: 
                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </p>
                      <p className="text-gray-600">Payment: 
                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          selectedOrder.payment_status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedOrder.payment_status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.product_name}
                                className="h-12 w-12 rounded-lg object-cover mr-3"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/48?text=☕';
                                }}
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{item.product_name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity} • Sugar: {item.sugar_level}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">${item.price} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Notes:</p>
                        <p className="text-gray-900">{selectedOrder.notes || 'No notes'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${selectedOrder.total_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                  {selectedOrder.payment_status !== 'paid' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'completed');
                        setSelectedOrder(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                    >
                      Mark as Paid & Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;