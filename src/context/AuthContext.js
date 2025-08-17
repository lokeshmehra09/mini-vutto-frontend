import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { tokenManager } from '../utils/tokenManager';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(tokenManager.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = tokenManager.getToken();
      const storedUser = tokenManager.getUser();
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      
      if (storedToken && storedUser && !tokenManager.isTokenExpired()) {
        try {
          // Verify token is still valid with a timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
          
          const response = await authAPI.getProfile();
          clearTimeout(timeoutId);
          
          setUser(response.data.user);
          setToken(storedToken);
        } catch (error) {
          // Only clear auth if it's a real auth error, not network issues
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('Token validation failed, clearing auth data');
            tokenManager.clearAuth();
            localStorage.removeItem('rememberMe');
          } else {
            // For network errors or other issues, keep the stored auth data
            // but set the user and token from storage
            console.log('Network error during token validation, using stored data');
            setUser(storedUser);
            setToken(storedToken);
          }
        }
      } else if (storedToken && storedUser && rememberMe) {
        // If token is expired but remember me is enabled, try to refresh
        try {
          const response = await authAPI.getProfile();
          if (response.data.user) {
            setUser(response.data.user);
            setToken(response.data.token || storedToken);
            // Update stored data
            tokenManager.setToken(response.data.token || storedToken);
            tokenManager.setUser(response.data.user);
          }
        } catch (error) {
          console.log('Token refresh failed, clearing auth data');
          tokenManager.clearAuth();
          localStorage.removeItem('rememberMe');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user: userData, token: authToken } = response.data;
      
      setUser(userData);
      setToken(authToken);
      
      // Store token and user data using tokenManager
      tokenManager.setToken(authToken);
      tokenManager.setUser(userData);
      
      // If remember me is enabled, store additional flag
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (email, password, firstName, lastName, role) => {
    try {
      const response = await authAPI.register({ email, password, first_name: firstName, last_name: lastName, role });
      
      // Check if response indicates OTP verification is needed
      if (response.data.message && response.data.message.includes('OTP')) {
        // Registration successful, but OTP verification needed
        return { 
          success: true, 
          requiresOTP: true,
          message: response.data.message,
          email: response.data.email
        };
      }
      
      // If no OTP required, proceed with normal login
      const { user: userData, token: authToken } = response.data;
      
      setUser(userData);
      setToken(authToken);
      
      // Store token and user data using tokenManager
      tokenManager.setToken(authToken);
      tokenManager.setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const verifyOTP = async (email, otp, registrationData) => {
    try {
      // Send the complete registration data along with OTP
      const response = await authAPI.verifyOTP({ 
        email, 
        otp, 
        ...registrationData 
      });
      const { user: userData, token: authToken } = response.data;
      
      setUser(userData);
      setToken(authToken);
      
      // Store token and user data using tokenManager
      tokenManager.setToken(authToken);
      tokenManager.setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'OTP verification failed' 
      };
    }
  };

  const resendOTP = async (email, registrationData) => {
    try {
      // Send the complete registration data for resending OTP
      await authAPI.resendOTP({ 
        email, 
        ...registrationData 
      });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to resend OTP' 
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      // Clear auth data using tokenManager
      tokenManager.clearAuth();
      // Clear remember me flag
      localStorage.removeItem('rememberMe');
    }
  };

  // Helper function to check if user is a seller
  const isSeller = () => {
    return user && user.role === 'seller';
  };

  // Silent token refresh to extend session
  useEffect(() => {
    if (token && user) {
      const refreshInterval = setInterval(async () => {
        try {
          // Only refresh if token is close to expiring (within 10 minutes)
          const expiration = tokenManager.getTokenExpiration();
          if (expiration && new Date() > new Date(expiration.getTime() - 10 * 60 * 1000)) {
            const response = await authAPI.getProfile();
            if (response.data.user) {
              setUser(response.data.user);
              // Update stored user data
              tokenManager.setUser(response.data.user);
            }
          }
        } catch (error) {
          console.log('Silent token refresh failed:', error);
          // Don't clear auth on silent refresh failure
        }
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [token, user]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    verifyOTP,
    resendOTP,
    isAuthenticated: !!token && !tokenManager.isTokenExpired(),
    isSeller,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
