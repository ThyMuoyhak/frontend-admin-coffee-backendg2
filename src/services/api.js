// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'https://coffee-backend-1.onrender.com/';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000,
});

// Debug log
console.log('🔧 API Service Initialized');
console.log('🌐 API Base URL:', API_URL);
console.log('📱 Current Origin:', window.location.origin);

// Request interceptor to add token and fix URLs
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log('📤 Making request to:', config.method?.toUpperCase(), config.url);
    console.log('📊 Full config:', {
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response from:', response.config.url, 'Status:', response.status);
    console.log('📦 Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:');
    console.error('URL:', error.config?.url);
    console.error('Method:', error.config?.method);
    console.error('Full Error:', error);
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('Response Status:', error.response?.status);
    console.error('Response Data:', error.response?.data);
    console.error('No Response?', !error.response ? 'Yes' : 'No');
    
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. The server is taking too long to respond.');
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
      console.error('No response received. This could be:');
      console.error('- CORS issue');
      console.error('- Server not running');
      console.error('- Network firewall');
      console.error('- Server timeout');
      toast.error('Cannot connect to server. Please check if the backend is running.');
    } else {
      console.error('Request setup error:', error.message);
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// Enhanced test backend connection
export const testBackendConnection = async () => {
  console.log('🔄 Testing backend connection...');
  console.log('Target URL:', API_URL + 'health');
  
  try {
    console.log('⏳ Making health check request...');
    const startTime = Date.now();
    
    const response = await api.get('/health', {
      timeout: 10000, // 10 seconds
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('✅ Connection successful!');
    console.log('Response time:', duration + 'ms');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return { 
      connected: true, 
      data: response.data,
      responseTime: duration,
      message: `Connected to ${API_URL} in ${duration}ms`
    };
    
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error type:', error.name);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    let errorMessage = `Cannot connect to ${API_URL}`;
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Connection timeout. Server may be starting up or overloaded.';
    } else if (error.message.includes('Network Error')) {
      errorMessage = 'Network error. Check CORS configuration on server.';
    } else if (error.response) {
      errorMessage = `Server responded with ${error.response.status}: ${error.response.statusText}`;
    }
    
    return { 
      connected: false, 
      error: errorMessage,
      details: {
        url: API_URL,
        code: error.code,
        message: error.message,
        status: error.response?.status
      }
    };
  }
};

export { api };