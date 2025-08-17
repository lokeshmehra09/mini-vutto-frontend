import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  DirectionsBike as BikeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, isSeller } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Check if we're on the Browse Bikes page (home page)
  const isOnBrowseBikesPage = location.pathname === '/';
  
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
    navigate('/');
  };

  const handleProfile = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  const handleMyListings = () => {
    handleUserMenuClose();
    navigate('/my-listings');
  };



  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        {/* Logo/Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <BikeIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
            }}
          >
            Mini Vutto
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isOnBrowseBikesPage && (
            <Button
              color="inherit"
              component={Link}
              to="/"
            >
              Browse Bikes
            </Button>
            )}
            
            {isAuthenticated ? (
              <>
                {isSeller() && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/my-listings"
                >
                  My Listings
                </Button>
                )}
                <Button
                  color="inherit"
                  onClick={handleUserMenuOpen}
                  startIcon={<PersonIcon />}
                >
                  {user?.email}
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/register"
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {!isOnBrowseBikesPage && (
          <MenuItem
            component={Link}
            to="/"
            onClick={handleMobileMenuClose}
          >
            Browse Bikes
          </MenuItem>
          )}
          
          {isAuthenticated ? (
            <>
              {isSeller() && (
              <MenuItem
                component={Link}
                to="/my-listings"
                onClick={handleMobileMenuClose}
              >
                My Listings
              </MenuItem>
              )}
              <MenuItem onClick={handleProfile}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem
                component={Link}
                to="/login"
                onClick={handleMobileMenuClose}
              >
                Login
              </MenuItem>
              <MenuItem
                component={Link}
                to="/register"
                onClick={handleMobileMenuClose}
              >
                Register
              </MenuItem>
            </>
          )}
        </Menu>

        {/* User Menu (Desktop) */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
