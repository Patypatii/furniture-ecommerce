import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('admin-token');
            localStorage.removeItem('admin-user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    logout: () =>
        api.post('/auth/logout'),

    getProfile: () =>
        api.get('/auth/me'),
};

// Product APIs
export const productAPI = {
    getAll: (params?: any) =>
        api.get('/products', { params }),

    getById: (id: string) =>
        api.get(`/products/id/${id}`),

    create: (data: any) =>
        api.post('/products', data),

    update: (id: string, data: any) =>
        api.put(`/products/${id}`, data),

    delete: (id: string) =>
        api.delete(`/products/${id}`),

    getFeatured: () =>
        api.get('/products/featured'),
};

// Order APIs
export const orderAPI = {
    getAll: (params?: any) =>
        api.get('/orders/all/orders', { params }).then(res => res.data),

    getById: (id: string) =>
        api.get(`/orders/${id}`).then(res => res.data.data),

    updateStatus: (id: string, data: { status: string; message?: string }) =>
        api.put(`/orders/${id}/status`, data).then(res => res.data),

    addNote: (id: string, data: { message: string }) =>
        api.post(`/orders/${id}/notes`, data).then(res => res.data),
};

// Customer/User APIs
export const userAPI = {
    getAll: (params?: any) =>
        api.get('/users', { params }),

    getById: (id: string) =>
        api.get(`/users/${id}`),

    update: (id: string, data: any) =>
        api.put(`/users/${id}`, data),

    delete: (id: string) =>
        api.delete(`/users/${id}`),
};

// Category APIs
export const categoryAPI = {
    getAll: () =>
        api.get('/categories'),

    create: (data: any) =>
        api.post('/categories', data),

    update: (id: string, data: any) =>
        api.put(`/categories/${id}`, data),

    delete: (id: string) =>
        api.delete(`/categories/${id}`),
};

// Analytics/Dashboard APIs
export const analyticsAPI = {
    getDashboardStats: () =>
        api.get('/analytics/dashboard'),

    getSalesData: (period: string = '6months') =>
        api.get('/analytics/sales', { params: { period } }),

    getTopProducts: (limit: number = 5) =>
        api.get('/analytics/top-products', { params: { limit } }),

    getRecentOrders: (limit: number = 5) =>
        api.get('/analytics/recent-orders', { params: { limit } }),
};

// Admin Management APIs (Superadmin only)
export const adminAPI = {
    // Get all admins
    getAll: () =>
        api.get('/admin/admins'),

    // Get single admin
    getById: (id: string) =>
        api.get(`/admin/admins/${id}`),

    // Create new admin
    create: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string; role: 'admin' | 'superadmin' }) =>
        api.post('/admin/admins', data),

    // Update admin
    update: (id: string, data: any) =>
        api.put(`/admin/admins/${id}`, data),

    // Delete admin
    delete: (id: string) =>
        api.delete(`/admin/admins/${id}`),

    // Change admin password
    changePassword: (id: string, newPassword: string) =>
        api.put(`/admin/admins/${id}/password`, { newPassword }),

    // Get admin stats
    getStats: () =>
        api.get('/admin/stats'),
};

// Upload APIs
export const uploadAPI = {
    // Upload image to ImageKit
    uploadImage: (file: File, folder: string = 'products') => {
        const formData = new FormData();
        formData.append('image', file);

        return api.post(`/upload/image?folder=${folder}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export default api;

