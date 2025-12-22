'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ordersAPI } from '@/services/api';
import { AdminAuthProvider } from '../../../../components/AdminAuthContext';
import { AdminProtectedRoute } from '../../../../components/AdminProtectedRoute';
import AdminLayout from '../../../../components/AdminLayout';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await ordersAPI.getOrderById(params.id);
        setOrder(response.data.data);
      } catch (err) {
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchOrder();
  }, [params.id]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: FiXCircle },
      'Processing': { color: 'bg-blue-100 text-blue-800', icon: FiPackage },
      'Shipped': { color: 'bg-purple-100 text-purple-800', icon: FiTruck },
      'Delivered': { color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
      'Cancelled': { color: 'bg-red-100 text-red-800', icon: FiXCircle }
    };

    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {status}
      </span>
    );
  };

  if (loading) return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    </AdminLayout>
  );

  if (!order) return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Order not found.</div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <button onClick={() => router.back()} className="text-amber-600 hover:underline text-sm mb-4 inline-block">
            ← Back to Orders
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="mt-2 text-gray-600">Order #{order.orderId || order._id.slice(-8).toUpperCase()}</p>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ${item.price?.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${(item.price * item.quantity)?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-amber-600">${order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Customer Information</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FiUser className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm">{order.user?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <FiMail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm">{order.user?.email || 'N/A'}</span>
                </div>
                {order.user?.phone && (
                  <div className="flex items-center">
                    <FiPhone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">{order.user.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Shipping Address</h2>
              <div className="space-y-2">
                <div className="flex items-start">
                  <FiMapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                    <p>{order.shippingAddress?.address}</p>
                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                    <p>{order.shippingAddress?.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Order Details</h2>
              <div className="space-y-3">
                <div><span className="font-semibold">Order ID:</span> {order.orderId || order._id}</div>
                <div><span className="font-semibold">Payment Method:</span> {order.paymentMethod?.type || 'N/A'}</div>
                <div><span className="font-semibold">Order Date:</span> {new Date(order.createdAt).toLocaleString()}</div>
                {order.shippedAt && <div><span className="font-semibold">Shipped At:</span> {new Date(order.shippedAt).toLocaleString()}</div>}
                {order.deliveredAt && <div><span className="font-semibold">Delivered At:</span> {new Date(order.deliveredAt).toLocaleString()}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function OrderDetailsPageWrapper() {
  return (
    <AdminAuthProvider>
      <AdminProtectedRoute>
        <OrderDetailsPage />
      </AdminProtectedRoute>
    </AdminAuthProvider>
  );
}