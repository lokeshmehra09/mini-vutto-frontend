import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OTPVerification from './components/Auth/OTPVerification';
import BikeList from './components/Bikes/BikeList';
import BikeDetail from './components/Bikes/BikeDetail';
import MyListings from './components/Bikes/MyListings';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Seller Route Component - Only accessible to sellers
const SellerRoute = ({ children }) => {
  const { isAuthenticated, loading, isSeller } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isSeller()) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Main App Component
const AppContent = () => {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<BikeList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/bike/:id" element={<BikeDetail />} />
        
        {/* Protected Routes - Add these components later */}
        <Route 
          path="/add-bike" 
          element={
            <SellerRoute>
              <div>Add Bike Form (Coming Soon)</div>
            </SellerRoute>
          } 
        />
        <Route 
          path="/my-listings" 
          element={
            <SellerRoute>
              <MyListings />
            </SellerRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <div>Profile (Coming Soon)</div>
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

// App Component with Providers
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
