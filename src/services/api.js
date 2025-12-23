import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('adminToken') ||
                  getCookie('token') ||
                  getCookie('adminToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirect to appropriate login page
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to get cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Helper function to set cookie
function setCookie(name, value, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Authentication API calls
export const authAPI = {
  // User authentication
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCookie('token', '', -1);
  },
  
  // Admin authentication
  adminLogin: (credentials) => api.post('/admin/login', credentials),
  adminLogout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setCookie('adminToken', '', -1);
  },
  
  // Profile management
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  
  // Password management
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  changePassword: (passwords) => api.put('/users/change-password', passwords),
};

// Books API calls
export const booksAPI = {
  // Get books with filters
  getAll: (params = {}) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  getBySlug: (slug) => api.get(`/books/slug/${slug}`),
  

  
  // Admin operations
  create: (bookData) => api.post('/books', bookData),
  update: (id, bookData) => api.put(`/books/${id}`, bookData),
  delete: (id) => api.delete(`/books/${id}`),
  getStats: () => api.get('/books/admin/stats'),
};

// Upload API calls
export const uploadAPI = {
  // Single file upload
  uploadSingle: (file, onProgress) => {
    const formData = new FormData();
    formData.append('image', file);
    
    return api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
  },
  
  // Multiple files upload
  uploadMultiple: (files, onProgress) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file);
    });
    
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
  },
  
  // Book images upload (cover + gallery)
  uploadBookImages: (coverImage, galleryImages = [], onProgress) => {
    const formData = new FormData();
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }
    galleryImages.forEach((image, index) => {
      formData.append('galleryImages', image);
    });
    
    return api.post('/upload/book-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
  },
  
  // File management
  deleteFile: (filename) => api.delete(`/upload/files/${filename}`),
  getFileInfo: (filename) => api.get(`/upload/files/${filename}`),
  listFiles: (directory) => api.get('/upload/files', { params: { directory } }),
};

// Cart API calls
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (bookId, quantity = 1) => api.post('/cart/add', { bookId, quantity }),
  updateQuantity: (bookId, quantity) => api.put(`/cart/update/${bookId}`, { quantity }),
  removeFromCart: (bookId) => api.delete(`/cart/remove/${bookId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// Orders API calls
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: (params = {}) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  getMyOrders: () => api.get('/orders/my-orders'),
  
  // Admin order management
  getAll: (params = {}) => api.get('/orders/admin/all', { params }),
  getStats: () => api.get('/orders/admin/stats'),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Users API calls
export const usersAPI = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  
  // Admin user management
  getAllUsers: (params = {}) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deactivateUser: (id) => api.put(`/admin/users/${id}/deactivate`),
  activateUser: (id) => api.put(`/admin/users/${id}/activate`),
};

// Admin API calls
export const adminAPI = {
  // Authentication
  login: (credentials) => api.post('/admin/login', credentials),
  validate: () => api.get('/admin/validate'),
  
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  getStats: () => api.get('/admin/stats'),
  
  // Admin management
  getAllAdmins: () => api.get('/admin/admins'),
  createAdmin: (adminData) => api.post('/admin/admins', adminData),
  updateAdmin: (id, adminData) => api.put(`/admin/admins/${id}`, adminData),
  deleteAdmin: (id) => api.delete(`/admin/admins/${id}`),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settings) => api.put('/admin/settings', settings),
};

// Utility functions
export const apiUtils = {
  // Error handling
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      const status = error.response.status;
      return { message, status, data: error.response.data };
    } else if (error.request) {
      // Request was made but no response received
      return { message: 'Network error. Please check your connection.', status: 0 };
    } else {
      // Something else happened
      return { message: error.message || 'An unexpected error occurred', status: 0 };
    }
  },
  
  // Success response handling
  handleSuccess: (response) => {
    return {
      success: true,
      data: response.data?.data || response.data,
      message: response.data?.message || 'Operation successful',
    };
  },
  
  // File upload progress
  createProgressHandler: (setProgress) => {
    return (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setProgress(percentCompleted);
    };
  },
  
  // Token management
  setToken: (token, isAdmin = false) => {
    const key = isAdmin ? 'adminToken' : 'token';
    localStorage.setItem(key, token);
    setCookie(key, token);
  },
  
  getToken: (isAdmin = false) => {
    const key = isAdmin ? 'adminToken' : 'token';
    return localStorage.getItem(key) || getCookie(key);
  },
  
  removeToken: (isAdmin = false) => {
    const key = isAdmin ? 'adminToken' : 'token';
    localStorage.removeItem(key);
    setCookie(key, '', -1);
  },
  
  // User data management
  setUser: (user, isAdmin = false) => {
    const key = isAdmin ? 'admin' : 'user';
    localStorage.setItem(key, JSON.stringify(user));
  },
  
  getUser: (isAdmin = false) => {
    const key = isAdmin ? 'admin' : 'user';
    const user = localStorage.getItem(key);
    return user ? JSON.parse(user) : null;
  },
  
  removeUser: (isAdmin = false) => {
    const key = isAdmin ? 'admin' : 'user';
    localStorage.removeItem(key);
  },
};

// Export default api instance
export default api; 