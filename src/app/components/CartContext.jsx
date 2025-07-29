'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '@/services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from API when user is authenticated
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (book, quantity = 1) => {
    if (!user) {
      // If not logged in, redirect to login
      window.location.href = '/auth/login';
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.addToCart(book._id || book.id, quantity);
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (bookId) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await cartAPI.removeFromCart(bookId);
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await cartAPI.updateQuantity(bookId, quantity);
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await cartAPI.clearCart();
      if (response.data.success) {
        setCart([]);
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const validateCart = async () => {
    if (!user) return { isValid: false, errors: ['User not authenticated'] };

    // Simple local validation
    const errors = [];
    
    if (cart.length === 0) {
      errors.push('Cart is empty');
    }
    
    // Check if all items have valid prices
    for (const item of cart) {
      if (!item.price || parseFloat(item.price.replace('$', '')) <= 0) {
        errors.push(`Invalid price for ${item.title}`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Invalid quantity for ${item.title}`);
      }
    }
    
    return { 
      isValid: errors.length === 0, 
      errors 
    };
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    validateCart,
    isCartOpen,
    openCart,
    closeCart,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 