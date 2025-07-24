'use client';
import React from 'react';
import { useAdminAuth } from '../../components/AdminAuthContext';

export default function AdminSettingsPage() {
  const { admin } = useAdminAuth();

  if (!admin) {
    return <div className="p-8 text-center">Loading admin info...</div>;
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
      <div className="mb-4"><span className="font-semibold">Name:</span> {admin.name}</div>
      <div className="mb-4"><span className="font-semibold">Email:</span> {admin.email}</div>
      {/* Add more settings here if needed */}
    </div>
  );
} 