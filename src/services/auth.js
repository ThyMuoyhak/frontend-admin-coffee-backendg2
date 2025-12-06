// src/services/auth.js
import { api } from './api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/api/v1/admin/login', {
        email: email,
        password: password,
      });
      
      if (response.data && response.data.access_token) {
        // Store token and user data
        localStorage.setItem('admin_token', response.data.access_token);
        localStorage.setItem('admin_user', JSON.stringify(response.data.admin));
        
        return {
          success: true,
          access_token: response.data.access_token,
          admin: response.data.admin
        };
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login error:', error);
      
      // Return error message
      let errorMessage = 'Login failed.';
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          errorMessage = 'Invalid email or password.';
        } else if (status === 400) {
          errorMessage = data.detail || 'Invalid request.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data.detail || `Error ${status}`;
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check if backend is running.';
      }
      
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    // Use window.location for reliable redirect
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('admin_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('admin_token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('admin_token');
    return !!token;
  },

  // Test connection to backend
  testConnection: async () => {
    try {
      const response = await api.get('/health');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};