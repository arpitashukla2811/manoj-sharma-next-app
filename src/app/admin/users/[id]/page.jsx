'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usersAPI } from '@/services/api';
import { AdminAuthProvider } from '../../../components/AdminAuthContext';
import AdminProtectedRoute from '../../../components/AdminProtectedRoute';
import AdminLayout from '../../../components/AdminLayout';

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
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <button onClick={() => router.back()} className="text-amber-600 hover:underline text-sm mb-4 inline-block">
            ← Back to Users
          </button>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <p className="mt-2 text-gray-600">Comprehensive information about this user</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Basic Information</h2>
            <div className="space-y-3">
              <div><span className="font-semibold">Name:</span> {user.name}</div>
              <div><span className="font-semibold">Email:</span> {user.email}</div>
              <div><span className="font-semibold">Role:</span> 
                <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role || 'user'}
                </span>
              </div>
              <div><span className="font-semibold">Status:</span> 
                <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div><span className="font-semibold">Email Verified:</span> {user.isEmailVerified ? 'Yes' : 'No'}</div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Contact Information</h2>
            <div className="space-y-3">
              {user.phone && <div><span className="font-semibold">Phone:</span> {user.phone}</div>}
              {user.address && <div><span className="font-semibold">Address:</span> {user.address}</div>}
              {user.city && <div><span className="font-semibold">City:</span> {user.city}</div>}
              {user.state && <div><span className="font-semibold">State:</span> {user.state}</div>}
              {user.zipCode && <div><span className="font-semibold">ZIP Code:</span> {user.zipCode}</div>}
              {!user.phone && !user.address && !user.city && !user.state && !user.zipCode && (
                <div className="text-gray-500 italic">No contact information provided</div>
              )}
            </div>
          </div>

          {/* Account Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Account Activity</h2>
            <div className="space-y-3">
              <div><span className="font-semibold">Joined:</span> {new Date(user.createdAt).toLocaleString()}</div>
              <div><span className="font-semibold">Last Updated:</span> {new Date(user.updatedAt).toLocaleString()}</div>
              {user.lastLogin && <div><span className="font-semibold">Last Login:</span> {new Date(user.lastLogin).toLocaleString()}</div>}
              <div><span className="font-semibold">Login Attempts:</span> {user.loginAttempts || 0}</div>
              {user.lockUntil && user.lockUntil > Date.now() && (
                <div><span className="font-semibold">Account Locked Until:</span> {new Date(user.lockUntil).toLocaleString()}</div>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Preferences</h2>
            <div className="space-y-3">
              <div><span className="font-semibold">Newsletter:</span> {user.preferences?.newsletter ? 'Subscribed' : 'Not subscribed'}</div>
              <div><span className="font-semibold">Notifications:</span> {user.preferences?.notifications ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>
        </div>

        {/* User ID */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">User ID:</span> {user._id}
          </div>
        </div>
      </div>
    </AdminLayout>
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