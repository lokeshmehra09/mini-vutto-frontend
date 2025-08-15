import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

const BikeCard = ({ 
  bike, 
  onCardClick, 
  onMenuClick, 
  showMenu = false, 
  isSeller = false 
}) => {
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(bike.id);
    }
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    if (onMenuClick) {
      onMenuClick(e, bike);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out',
        }
      }}
      onClick={handleCardClick}
    >
      {/* Image Section - Fixed Height */}
      <Box sx={{ 
        position: 'relative', 
        width: '100%', 
        height: '200px',
        overflow: 'hidden'
      }}>
        <CardMedia
          component="img"
          image={bike.image_url || 'https://via.placeholder.com/300x200/1976d2/ffffff?text=No+Image'}
          alt={`${bike.brand} ${bike.model}`}
          sx={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        {/* Menu Button for Sellers */}
        {isSeller && showMenu && (
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
              zIndex: 1
            }}
            onClick={handleMenuClick}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>

      {/* Content Section - Flexible Height */}
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        p: 2,
        minHeight: '140px' // Ensure minimum height for consistency
      }}>
        {/* Brand and Model - Split to two lines if needed */}
        <Box sx={{ mb: 1, minHeight: '48px' }}>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              fontSize: '1rem',
              fontWeight: 600,
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {bike.brand}
          </Typography>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              fontSize: '1rem',
              fontWeight: 600,
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {bike.model}
          </Typography>
        </Box>

        {/* Specifications */}
        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ mb: 1, fontSize: '0.875rem' }}
        >
          Year: {bike.year} • {typeof bike.kilometers_driven === 'string' ? parseInt(bike.kilometers_driven).toLocaleString() : bike.kilometers_driven?.toLocaleString() || 0} km
        </Typography>

        {/* Location */}
        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ mb: 2, fontSize: '0.875rem' }}
        >
          📍 {bike.location}
        </Typography>

        {/* Price and Button Section - Fixed at Bottom */}
        <Box sx={{ mt: 'auto' }}>
          <Typography 
            variant="h6" 
            color="primary" 
            fontWeight="bold" 
            sx={{ mb: 1, fontSize: '1.1rem' }}
          >
            ₹{typeof bike.price === 'string' ? parseFloat(bike.price).toLocaleString() : bike.price?.toLocaleString() || 0}
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            sx={{ fontSize: '0.875rem' }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BikeCard;
