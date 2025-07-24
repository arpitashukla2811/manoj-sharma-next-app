'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPackage, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../components/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import { ordersAPI } from '../services/api';

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
        setOrderHistory(response.data.orders || []);
      } catch (err) {
        setOrderHistory([]);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="mb-4 flex items-center space-x-4">
          <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full" />
          <div>
            <div className="font-semibold text-lg">{user.name}</div>
            <div className="text-gray-600 text-sm">{user.email}</div>
          </div>
        </div>
        <button onClick={logout} className="text-red-600 hover:underline text-sm mb-8">Logout</button>
        <h2 className="text-xl font-semibold mb-4 mt-8">Order History</h2>
        {loadingOrders ? (
          <div>Loading orders...</div>
        ) : orderHistory.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {orderHistory.map(order => (
              <li key={order._id} className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Order #{order._id}</div>
                    <div className="text-gray-600 text-sm">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-amber-700 font-bold">${order.total || order.amount || 'N/A'}</div>
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  {order.items && order.items.length > 0 ? (
                    <ul className="list-disc ml-6">
                      {order.items.map((item, idx) => (
                        <li key={idx}>{item.title} x {item.quantity}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>No items</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
} 