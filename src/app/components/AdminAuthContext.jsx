'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '../services/api';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if token is valid
  const validateToken = async (token) => {
    try {
      // Temporarily set the token for this request
      localStorage.setItem('adminToken', token);
      const response = await adminAPI.validate();
      
      if (response.data.success) {
        return response.data.admin;
      }
      return null;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const savedAdmin = localStorage.getItem('admin');
        
        if (token && savedAdmin) {
          // Validate token with backend
          const validAdmin = await validateToken(token);
          if (validAdmin) {
            setAdmin(validAdmin);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('admin');
            localStorage.removeItem('adminToken');
            setAdmin(null);
          }
        } else {
          setAdmin(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (adminData, token) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('adminToken', token);
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const value = { admin, login, logout, loading };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}; 