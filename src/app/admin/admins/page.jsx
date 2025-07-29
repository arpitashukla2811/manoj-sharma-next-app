'use client';
import React, { useEffect, useState } from 'react';
import { adminAPI } from '@/services/api';
import Link from 'next/link';
import { AdminAuthProvider } from '../../components/AdminAuthContext';
import AdminProtectedRoute from '../../components/AdminProtectedRoute';

function AdminsListPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await adminAPI.getAll();
        setAdmins(response.data.admins || []);
      } catch (err) {
        setError('Failed to load admins.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading admins...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">All Admins</h1>
      <ul className="divide-y divide-gray-200">
        {admins.map(admin => (
          <li key={admin._id} className="py-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">{admin.name}</div>
              <div className="text-gray-600 text-sm">{admin.email}</div>
            </div>
            <Link href={`/admin/admins/${admin._id}`} className="text-amber-600 hover:underline text-sm">View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminsListPageWrapper() {
  return (
    <AdminAuthProvider>
      <AdminProtectedRoute>
        <AdminsListPage />
      </AdminProtectedRoute>
    </AdminAuthProvider>
  );
} 