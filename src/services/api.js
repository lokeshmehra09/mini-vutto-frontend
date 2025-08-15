import axios from 'axios';
import { tokenManager } from '../utils/tokenManager';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token && !tokenManager.isTokenExpired()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for non-profile API calls to avoid redirect loops
    if ((error.response?.status === 401 || error.response?.status === 403) && 
        !error.config?.url?.includes('/profile')) {
      // Clear expired/invalid token
      tokenManager.clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/profile'),
  // For OTP verification, we use the same endpoint but with OTP included
  verifyOTP: (otpData) => api.post('/auth/register', otpData),
  // For resending OTP, we use the same endpoint but without OTP
  resendOTP: (emailData) => api.post('/auth/register', emailData),
};

// Bikes API calls
export const bikesAPI = {
  getAllBikes: (filters = {}) => api.get('/bikes', { params: filters }),
  getBikeById: (id) => api.get(`/bikes/${id}`),
  addBike: (bikeData) => api.post('/bikes', bikeData),
  updateBike: (id, bikeData) => api.put(`/bikes/${id}`, bikeData),
  deleteBike: (id) => api.delete(`/bikes/${id}`),
  getMyBikes: () => api.get('/bikes/my/listings'),
};

export default api;
