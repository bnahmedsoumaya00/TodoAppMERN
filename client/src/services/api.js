import axios from 'axios';
import { parseApiError, isAuthError } from '../utils/errorHandler';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// Request interceptor
api. interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response. use(
  (response) => response,
  (error) => {
    // Log error for debugging
    console.error('API Error:', error);

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      error.response = {
        status: 408,
        data: {
          error: 'Request timeout.  Please try again.'
        }
      };
    }

    // Handle network error
    if (!error.response) {
      error.response = {
        status: 0,
        data: {
          error: 'Network error. Please check your internet connection.'
        }
      };
    }

    // Handle authentication errors
    if (isAuthError(error)) {
      const currentPath = window.location.pathname;
      
      // Only redirect if not already on login page
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Store intended destination
        localStorage.setItem('redirectAfterLogin', currentPath);
        
        window.location.href = '/login';
      }
    }

    // Parse and attach formatted error
    const parsedError = parseApiError(error);
    error.parsedError = parsedError;

    return Promise.reject(error);
  }
);

export default api;