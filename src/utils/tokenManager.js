// Token management utilities for JWT storage and retrieval

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const tokenManager = {
  // Store JWT token in localStorage
  setToken: (token) => {
    try {
      if (token && typeof token === 'string') {
        localStorage.setItem(TOKEN_KEY, token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error storing token:', error);
      return false;
    }
  },

  // Get JWT token from localStorage
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  },

  // Remove JWT token from localStorage
  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      return true;
    } catch (error) {
      console.error('Error removing token:', error);
      return false;
    }
  },

  // Check if token exists and is valid
  hasValidToken: () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      return token && token.length > 0;
    } catch (error) {
      console.error('Error checking token:', error);
      return false;
    }
  },

  // Store user data in localStorage
  setUser: (userData) => {
    try {
      if (userData && typeof userData === 'object') {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error storing user data:', error);
      return false;
    }
  },

  // Get user data from localStorage
  getUser: () => {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  },

  // Remove user data from localStorage
  removeUser: () => {
    try {
      localStorage.removeItem(USER_KEY);
      return true;
    } catch (error) {
      console.error('Error removing user data:', error);
      return false;
    }
  },

  // Clear all auth data
  clearAuth: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  },

  // Get token expiration time (if token is JWT)
  getTokenExpiration: () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return null;

      // Decode JWT payload (without verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? new Date(payload.exp * 1000) : null;
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: () => {
    try {
      const expiration = tokenManager.getTokenExpiration();
      if (!expiration) return true;
      
      // Add 5 minute grace period to prevent premature logout
      const gracePeriod = 5 * 60 * 1000; // 5 minutes in milliseconds
      return new Date() > new Date(expiration.getTime() - gracePeriod);
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
};

export default tokenManager;
