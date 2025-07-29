'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiClock, 
  FiMapPin, 
  FiDollarSign, 
  FiEye, 
  FiCalendar,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle
} from 'react-icons/fi';
import Link from 'next/link';
import { ordersAPI } from '@/services/api';

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    book: {
      _id: string;
      title: string;
      coverImage?: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersAPI.getMyOrders();
      console.log('Orders response:', response);
      
      if (response.data && response.data.success) {
        setOrders(response.data.data || []);
      } else if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      case 'processing':
        return <FiPackage className="w-4 h-4" />;
      case 'shipped':
        return <FiTruck className="w-4 h-4" />;
      case 'delivered':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <FiXCircle className="w-4 h-4" />;
      default:
        return <FiAlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-light)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--saffron-primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--text-secondary)]">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-light)]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchOrders} className="btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background-light)] py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center text-[var(--text-primary)] mb-4">
            My Orders
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-[var(--saffron-primary)] to-[var(--saffron-dark)] mx-auto mb-8"
          />
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FiPackage className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              No orders yet
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Start shopping to see your orders here!
            </p>
            <Link href="/published-book" className="btn-primary">
              Browse Books
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {orders.map((order) => (
              <motion.div
                key={order._id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-[var(--text-secondary)] flex items-center gap-2">
                        <FiCalendar className="w-4 h-4" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-lg font-bold text-[var(--saffron-primary)]">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-20 bg-gradient-to-br from-[var(--saffron-light)] to-[var(--saffron-primary)] rounded-lg flex items-center justify-center overflow-hidden">
                          {item.book.coverImage ? (
                            <img 
                              src={item.book.coverImage} 
                              alt={item.book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FiPackage className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-[var(--text-primary)]">{item.book.title}</h4>
                          <p className="text-[var(--text-secondary)] text-sm">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[var(--text-primary)]">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      <FiEye className="w-4 h-4" />
                      {selectedOrder?._id === order._id ? 'Hide Details' : 'View Details'}
                    </button>
                    {order.status === 'pending' && (
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to cancel this order?')) {
                            try {
                              await ordersAPI.cancelOrder(order._id);
                              // Refresh orders after cancellation
                              fetchOrders();
                            } catch (error: any) {
                              console.error('Error cancelling order:', error);
                              alert(error.response?.data?.message || 'Failed to cancel order');
                            }
                          }
                        }}
                        className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <FiXCircle className="w-4 h-4" />
                        Cancel Order
                      </button>
                    )}
                  </div>

                  {/* Order Details (Expandable) */}
                  {selectedOrder?._id === order._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Shipping Address */}
                        <div>
                          <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                            <FiMapPin className="w-4 h-4" />
                            Shipping Address
                          </h4>
                          <div className="text-[var(--text-secondary)] space-y-1">
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                        </div>

                        {/* Payment Information */}
                        <div>
                          <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                            <FiDollarSign className="w-4 h-4" />
                            Payment Status
                          </h4>
                          <div className="space-y-2">
                            <p className="text-[var(--text-secondary)]">
                              Status: <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                              </span>
                            </p>
                            <p className="text-[var(--text-secondary)]">
                              Total: <span className="font-semibold text-[var(--text-primary)]">${order.totalAmount.toFixed(2)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 