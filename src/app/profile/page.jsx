'use client';
export const dynamic = 'force-dynamic';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPackage, FiCalendar, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../components/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import { ordersAPI } from '@/services/api';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const response = await ordersAPI.getMyOrders();
        setOrderHistory(response.data.orders || response.data.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrderHistory([]);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="flex-shrink-0">
              {user && user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-amber-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center border-4 border-amber-200">
                  <FiUser className="w-10 h-10 text-amber-600" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name || 'Guest'}</h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <FiMail className="w-4 h-4" />
                <span>{user?.email || 'Not available'}</span>
              </div>

              {user?.role && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {user.role}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <FiPackage className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
            </div>

            {loadingOrders ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                <span className="ml-3 text-gray-600">Loading orders...</span>
              </div>
            ) : orderHistory.length === 0 ? (
              <div className="text-center py-8">
                <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No orders found.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Your order history will appear here once you make purchases.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orderHistory.map(order => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          Order #{order._id.slice(-8)}
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600 text-sm mt-1">
                          <FiCalendar className="w-4 h-4" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-700 font-bold text-lg">
                          ${order.total || order.amount || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {order.status || 'Processing'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {order.items && order.items.length > 0 ? (
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-sm text-gray-700">
                              • {item.title} x {item.quantity}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No items details available</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
