'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usersAPI } from '@/services/api';
import { AdminAuthProvider } from '../../../components/AdminAuthContext';
import AdminProtectedRoute from '../../../components/AdminProtectedRoute';

function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await usersAPI.getById(params.id);
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchUser();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">Loading user details...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!user) return <div className="p-8 text-center">User not found.</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">User Details</h1>
      <div className="mb-4"><span className="font-semibold">Name:</span> {user.name}</div>
      <div className="mb-4"><span className="font-semibold">Email:</span> {user.email}</div>
      <div className="mb-4"><span className="font-semibold">Created At:</span> {new Date(user.createdAt).toLocaleString()}</div>
      <button onClick={() => router.back()} className="text-amber-600 hover:underline text-sm">Back</button>
    </div>
  );
}

export default function UserDetailsPageWrapper() {
  return (
    <AdminAuthProvider>
      <AdminProtectedRoute>
        <UserDetailsPage />
      </AdminProtectedRoute>
    </AdminAuthProvider>
  );
} 