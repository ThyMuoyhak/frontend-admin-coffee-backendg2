import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          setAdmin(storedUser);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setAdmin(response.admin);
      return { success: true, ...response };
    } catch (error) {
      console.error('Login error in context:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAdmin(null);
    toast.success('Logged out successfully');
  }, []);

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!authService.getToken()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};