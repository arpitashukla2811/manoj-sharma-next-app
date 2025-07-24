'use client';
import React, { useEffect, useState } from 'react';
import { usersAPI } from '../../services/api';
import Link from 'next/link';

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await usersAPI.getAll();
        setUsers(response.data || []);
      } catch (err) {
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading users...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      <ul className="divide-y divide-gray-200">
        {users.map(user => (
          <li key={user._id} className="py-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-gray-600 text-sm">{user.email}</div>
            </div>
            <Link href={`/admin/users/${user._id}`} className="text-amber-600 hover:underline text-sm">View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 