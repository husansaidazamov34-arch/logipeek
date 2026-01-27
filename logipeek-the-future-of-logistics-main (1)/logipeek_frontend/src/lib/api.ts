import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
  (response) => response,
  (error) => {
    // Silently handle 404 errors for optional endpoints
    if (error.response?.status === 404) {
      console.debug('API endpoint not found:', error.config?.url);
      return Promise.reject(error);
    }
    
    // Silently handle 500 errors for mock data operations
    if (error.response?.status === 500 && error.config?.url?.includes('/notifications/')) {
      console.debug('Notification operation failed (likely mock data):', error.config?.url);
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: 'driver' | 'shipper';
    licensePlate?: string;
    licenseNumber?: string;
    companyName?: string;
    companyAddress?: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getMe: () => api.get('/auth/me'),
};

// Shipments API (for shippers)
export const shipmentsApi = {
  create: (data: any) => api.post('/shipments', data),
  getAll: () => api.get('/shipments'),
  getById: (id: string) => api.get(`/shipments/${id}`),
  updateStatus: (id: string, status: string) =>
    api.put(`/shipments/${id}/status`, { status }),
};

// Orders API (for drivers)
export const ordersApi = {
  getAvailable: () => api.get('/orders/available'),
  getActive: () => api.get('/orders/active'),
  getHistory: () => api.get('/orders/history'),
  accept: (id: string) => api.post(`/orders/${id}/accept`),
  markAsDelivered: (id: string) => api.post(`/orders/${id}/delivered`),
  confirmDelivery: (id: string, rating: number) => 
    api.post(`/orders/${id}/confirm`, { rating }),
};

// Drivers API
export const driversApi = {
  getAll: () => api.get('/drivers'),
  getById: (id: string) => api.get(`/drivers/${id}`),
  getOnlineDrivers: () => api.get('/drivers/online/all'),
  updateLocation: (data: { latitude: number; longitude: number }) =>
    api.put('/drivers/location', data),
  updateStatus: (status: 'online' | 'busy' | 'offline') =>
    api.put('/drivers/status', { status }),
  getStats: () => api.get('/drivers/stats/me'),
};

// Notifications API
export const notificationsApi = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

// Users API
export const usersApi = {
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  updateProfile: (id: string, data: {
    fullName?: string;
    phone?: string;
    email?: string;
    newPassword?: string;
    currentPassword?: string;
  }) => api.put(`/users/${id}/profile`, data),
};

// Admin API
export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getUsers: (page?: number, limit?: number, role?: string, search?: string) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (role && role !== 'all') params.append('role', role);
    if (search) params.append('search', search);
    return api.get(`/admin/users?${params.toString()}`);
  },
  getUserDetails: (userId: string) => api.get(`/admin/users/${userId}`),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
  getAdmins: () => api.get('/admin/admins'),
  createAdmin: (data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
  }) => api.post('/admin/admins', data),
  deleteAdmin: (adminId: string) => api.delete(`/admin/admins/${adminId}`),
  updateUserStatus: (userId: string, data: { isActive: boolean; reason?: string }) =>
    api.put(`/admin/users/${userId}/status`, data),
  getLogs: (page?: number, limit?: number, adminId?: string, action?: string) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (adminId) params.append('adminId', adminId);
    if (action) params.append('action', action);
    return api.get(`/admin/logs?${params.toString()}`);
  },
};
