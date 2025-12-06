// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000,
});

// Request interceptor to add token and fix URLs
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log('Making request to:', config.url);
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response from:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.message);
    
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.');
    } else if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
        }
      } else if (status === 403) {
        toast.error('Access denied. You do not have permission.');
      } else if (status === 404) {
        toast.error(`Endpoint not found: ${error.config.url}`);
      } else if (status === 500) {
        toast.error('Server error. Please try again later.');
      } else if (status === 400) {
        const message = data.detail || 'Bad request';
        toast.error(message);
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await api.get('/health');
    return { connected: true, data: response.data };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};

export { api };