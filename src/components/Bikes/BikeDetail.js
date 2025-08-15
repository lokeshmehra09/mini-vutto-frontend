import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  DirectionsBike as BikeIcon,
  LocationOn as LocationIcon,
  AttachMoney as PriceIcon,
  Speed as SpeedIcon,
  CalendarToday as YearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { bikesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BikeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isSeller, user } = useAuth();
  
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    fetchBikeDetails();
  }, [id]);

  const fetchBikeDetails = async () => {
    try {
      setLoading(true);
      const response = await bikesAPI.getBikeById(id);
      setBike(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching bike details:', err);
      if (err.response?.status === 404) {
        setError('Bike not found');
      } else {
        setError('Failed to fetch bike details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditBike = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteBike = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleUpdateBike = async (updatedData) => {
    try {
      await bikesAPI.updateBike(bike.id, updatedData);
      setEditDialogOpen(false);
      fetchBikeDetails(); // Refresh the data
    } catch (error) {
      console.error('Error updating bike:', error);
    }
  };

  const confirmDeleteBike = async () => {
    try {
      await bikesAPI.deleteBike(bike.id);
      setDeleteDialogOpen(false);
      navigate('/'); // Redirect to home after deletion
    } catch (error) {
      console.error('Error deleting bike:', error);
    }
  };

  const handleContactSeller = () => {
    setContactDialogOpen(true);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          startIcon={<ArrowBackIcon />}
        >
          Back to Browse Bikes
        </Button>
      </Container>
    );
  }

  if (!bike) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Bike not found
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          startIcon={<ArrowBackIcon />}
        >
          Back to Browse Bikes
        </Button>
      </Container>
    );
  }

  const isOwner = isAuthenticated && user && bike.user_id === user.id;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with back button */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          startIcon={<ArrowBackIcon />}
        >
          Back to Browse Bikes
        </Button>
        
        {/* Action menu for bike owner */}
        {isOwner && (
          <Box sx={{ ml: 'auto' }}>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditBike}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit Bike</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleDeleteBike} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Delete Bike</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Image and Basic Info */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardMedia
              component="img"
              image={bike.image_url || 'https://via.placeholder.com/600x400/1976d2/ffffff?text=No+Image'}
              alt={`${bike.brand} ${bike.model}`}
              sx={{ 
                height: 400, 
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                {bike.brand} {bike.model}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationIcon color="action" />
                <Typography variant="body1" color="textSecondary">
                  {bike.location}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip
                  icon={<YearIcon />}
                  label={`${bike.year}`}
                  variant="outlined"
                  color="primary"
                />
                <Chip
                  icon={<SpeedIcon />}
                  label={`${bike.kilometers_driven.toLocaleString()} km`}
                  variant="outlined"
                  color="secondary"
                />
              </Box>

              {isAuthenticated && !isOwner && (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleContactSeller}
                  startIcon={<PhoneIcon />}
                  sx={{ mb: 2 }}
                >
                  Contact Seller
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Detailed Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Bike Specifications
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Brand
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {bike.brand}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Model
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {bike.model}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Location
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {bike.location}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Price
                </Typography>
                <Typography variant="body1" fontWeight="medium" color="primary">
                  ₹{bike.price.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Additional Details */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Description
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" color="textSecondary">
              {bike.description || 'No description available for this bike.'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Bike Dialog */}
      <EditBikeDialog
        open={editDialogOpen}
        bike={bike}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdateBike}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        bike={bike}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteBike}
      />

      {/* Contact Seller Dialog */}
      <ContactSellerDialog
        open={contactDialogOpen}
        bike={bike}
        onClose={() => setContactDialogOpen(false)}
      />
    </Container>
  );
};

// Edit Bike Dialog Component
const EditBikeDialog = ({ open, bike, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    kilometers_driven: '',
    location: '',
    image_url: '',
    description: '',
  });

  useEffect(() => {
    if (bike) {
      setFormData({
        brand: bike.brand || '',
        model: bike.model || '',
        year: bike.year || '',
        price: bike.price || '',
        kilometers_driven: bike.kilometers_driven || '',
        location: bike.location || '',
        image_url: bike.image_url || '',
        description: bike.description || '',
      });
    }
  }, [bike]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  if (!bike) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Bike</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Brand"
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Model"
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Year"
            type="number"
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Kilometers Driven"
            type="number"
            value={formData.kilometers_driven}
            onChange={(e) => handleChange('kilometers_driven', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Image URL"
            value={formData.image_url}
            onChange={(e) => handleChange('image_url', e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update Bike
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({ open, bike, onClose, onConfirm }) => {
  if (!bike) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Bike</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the {bike.brand} {bike.model}?
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Contact Seller Dialog Component
const ContactSellerDialog = ({ open, bike, onClose }) => {
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (field, value) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Here you would typically send the contact information
    console.log('Contact info:', contactInfo);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Contact Seller</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Send a message to the seller about the {bike?.brand} {bike?.model}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Your Name"
            value={contactInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Your Email"
            type="email"
            value={contactInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Your Phone"
            value={contactInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            fullWidth
          />
          <TextField
            label="Message"
            value={contactInfo.message}
            onChange={(e) => handleChange('message', e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
            placeholder="Tell the seller why you're interested in this bike..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Send Message
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BikeDetail;
