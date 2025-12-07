import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Coffee, Eye, EyeOff, Server, CheckCircle, XCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('11112222');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Check backend connection on mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      setBackendStatus('checking');
      const response = await fetch('https://coffee-backend-1.onrender.com/health', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      setBackendStatus('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    if (backendStatus === 'error') {
      toast.error('Cannot connect to backend server. Please make sure it is running.');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTestCredentials = () => {
    setEmail('admin@gmail.com');
    setPassword('11112222');
    toast.success('Demo credentials loaded!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg mb-4">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">BrewHaven Admin</h1>
          <p className="text-gray-600 mt-2">Sign in to manage your coffee shop</p>
        </div>

        {/* Backend Status */}
        <div className="mb-6 p-4 rounded-lg border bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Server className="h-5 w-5 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Backend Status</span>
            </div>
            <div className="flex items-center">
              {backendStatus === 'checking' && (
                <>
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm text-yellow-600">Checking...</span>
                </>
              )}
              {backendStatus === 'connected' && (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-green-600">Connected</span>
                </>
              )}
              {backendStatus === 'error' && (
                <>
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-red-600">Disconnected</span>
                </>
              )}
            </div>
          </div>
          
          {backendStatus === 'error' && (
            <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
              <p className="text-sm text-red-700">
                Cannot connect to backend server at https://coffee-backend-1.onrender.com
              </p>
              <p className="text-xs text-red-600 mt-1">
                Make sure the FastAPI server is running on port 8000
              </p>
              <button
                onClick={checkBackendConnection}
                className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Retry Connection
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              placeholder="admin@gmail.com"
              required
              disabled={loading || backendStatus === 'error'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                required
                disabled={loading || backendStatus === 'error'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={loading || backendStatus === 'error'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleTestCredentials}
              className="text-sm text-amber-600 hover:text-amber-800 font-medium"
              disabled={loading}
            >
              Load Demo Credentials
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || backendStatus === 'error'}
            className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Default Credentials</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center">
                <span className="text-gray-600 mr-2">Email:</span>
                <code className="bg-gray-100 px-2 py-1 rounded font-mono">admin@gmail.com</code>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-gray-600 mr-2">Password:</span>
                <code className="bg-gray-100 px-2 py-1 rounded font-mono">11112222</code>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} BrewHaven Coffee Shop. Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;