'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminAPI } from '../../../services/api';

export default function AdminDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await adminAPI.getById(params.id);
        setAdmin(response.data.admin);
      } catch (err) {
        setError('Failed to load admin details.');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchAdmin();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">Loading admin details...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!admin) return <div className="p-8 text-center">Admin not found.</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Details</h1>
      <div className="mb-4"><span className="font-semibold">Name:</span> {admin.name}</div>
      <div className="mb-4"><span className="font-semibold">Email:</span> {admin.email}</div>
      <div className="mb-4"><span className="font-semibold">Created At:</span> {new Date(admin.createdAt).toLocaleString()}</div>
      <button onClick={() => router.back()} className="text-amber-600 hover:underline text-sm">Back</button>
    </div>
  );
} 