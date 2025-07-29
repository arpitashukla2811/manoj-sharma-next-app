
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiUsers, FiTrendingUp, FiSettings, FiPlus, FiEdit, FiTrash2, FiShoppingCart, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import AdminLayout from '../components/AdminLayout';
import { booksAPI, ordersAPI } from '@/services/api';
import { AdminAuthProvider } from '../components/AdminAuthContext';
import AdminProtectedRoute from '../components/AdminProtectedRoute';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch books stats
      const booksResponse = await booksAPI.getStats();
      const booksData = booksResponse.data.data;
      
      // Fetch orders stats
      const ordersResponse = await ordersAPI.getStats();
      const ordersData = ordersResponse.data.data;
      
      // Fetch recent books
      const recentBooksResponse = await booksAPI.getAll({ limit: 5 });
      const books = recentBooksResponse.data.data;
      
      // Fetch recent orders
      const recentOrdersResponse = await ordersAPI.getAll({ limit: 5 });
      const orders = recentOrdersResponse.data.data;

      setStats({
        totalBooks: booksData.totalBooks || 0,
        totalOrders: ordersData.totalOrders || 0,
        totalRevenue: ordersData.totalRevenue || 0,
        totalCustomers: 0 // This would need a separate API call
      });
      
      setRecentBooks(books || []);
      setRecentOrders(orders || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Add New Book",
      description: "Create a new book entry",
      icon: FiPlus,
      href: "/admin/books/add",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Manage Books",
      description: "View and edit all books",
      icon: FiBookOpen,
      href: "/admin/books",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "View Orders",
      description: "Check customer orders",
      icon: FiShoppingCart,
      href: "/admin/orders",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Customer Management",
      description: "Manage user accounts",
      icon: FiUsers,
      href: "/admin/users",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600">Welcome to your book management system</p>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FiBookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <FiUsers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm p-6 flex flex-col justify-between"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={action.title} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`${action.color} text-white p-4 rounded-lg cursor-pointer transition-colors flex items-center gap-3`}
                    >
                      <action.icon className="w-6 h-6" />
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <Link href="/admin/orders">
                  <span className="text-amber-600 hover:text-amber-700 text-sm font-medium">View All</span>
                </Link>
              </div>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, index) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mr-3">
                          <FiShoppingCart className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Order #{order._id.slice(-6)}</h4>
                          <p className="text-xs text-gray-500">
                            {order.items?.length || 0} items • ${order.total?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                        <Link href={`/admin/orders/${order._id}`}>
                          <button className="p-1 text-blue-500 hover:text-blue-700">
                            <FiEye className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No orders yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Recent Books */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Books</h2>
              <Link href="/admin/books">
                <span className="text-amber-600 hover:text-amber-700 text-sm font-medium">View All</span>
              </Link>
            </div>
            <div className="space-y-4">
              {recentBooks.length > 0 ? (
                recentBooks.map((book, index) => (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-amber-800 font-semibold text-sm">
                          {book.title?.charAt(0) || 'B'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{book.title}</h4>
                        <p className="text-xs text-gray-500">{book.author} • {book.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Stock: {book.stock || 0}</span>
                      <span className="text-xs text-amber-600 font-semibold">${book.price?.toFixed(2) || '0.00'}</span>
                      <Link href={`/admin/books/edit/${book._id}`}>
                        <button className="ml-2 p-1 text-blue-500 hover:text-blue-700">
                          <FiEdit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button className="p-1 text-red-500 hover:text-red-700">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiBookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No books added yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default function AdminPageWrapper() {
  return (
    <AdminAuthProvider>
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    </AdminAuthProvider>
  );
} 