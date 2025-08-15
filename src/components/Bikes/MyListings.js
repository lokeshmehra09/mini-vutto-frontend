import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import {
  DirectionsBike as BikeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { bikesAPI } from '../../services/api';
import BikeCard from './BikeCard';

const MyListings = () => {
  const [myBikes, setMyBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editBike, setEditBike] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bikeToDelete, setBikeToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBike, setSelectedBike] = useState(null);
  const [addBikeDialogOpen, setAddBikeDialogOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBikes();
  }, []);

  const fetchMyBikes = async () => {
    try {
      setLoading(true);
      console.log('Fetching my bikes...');
      const response = await bikesAPI.getMyBikes();
      console.log('My bikes response:', response);
      setMyBikes(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching my bikes:', err);
      if (err.response?.status === 401) {
        setError('Please login to view your listings.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view listings. Please contact support.');
      } else if (err.response?.status === 404) {
        setError('Listings endpoint not found. Please contact support.');
      } else if (err.message === 'Network Error') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Failed to fetch your bikes: ${err.response?.data?.message || err.message || 'Unknown error'}`);
      }
      setMyBikes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBike = (bike) => {
    setEditBike(bike);
    setEditDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteBike = (bike) => {
    setBikeToDelete(bike);
    setDeleteDialogOpen(true);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, bike) => {
    setAnchorEl(event.currentTarget);
    setSelectedBike(bike);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBike(null);
  };

  const handleUpdateBike = async (updatedData) => {
    try {
      await bikesAPI.updateBike(editBike.id, updatedData);
      setEditDialogOpen(false);
      setEditBike(null);
      fetchMyBikes(); // Refresh the list
    } catch (error) {
      console.error('Error updating bike:', error);
    }
  };

  const confirmDeleteBike = async () => {
    try {
      await bikesAPI.deleteBike(bikeToDelete.id);
      setDeleteDialogOpen(false);
      setBikeToDelete(null);
      fetchMyBikes(); // Refresh the list
    } catch (error) {
      console.error('Error deleting bike:', error);
    }
  };

  const handleAddBike = async (bikeData) => {
    try {
      await bikesAPI.addBike(bikeData);
      setAddBikeDialogOpen(false);
      fetchMyBikes(); // Refresh the list
    } catch (error) {
      console.error('Error adding bike:', error);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          My Bike Listings
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Manage your bike listings
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setAddBikeDialogOpen(true)}
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
        >
          Add New Bike
        </Button>
      </Box>

      {/* Results Count */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {myBikes.length} bike{myBikes.length !== 1 ? 's' : ''} listed
        </Typography>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* My Bikes Grid */}
      {myBikes.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <BikeIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No bikes listed yet
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Start by adding your first bike listing!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {myBikes.map((bike) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={bike.id}>
              <BikeCard
                bike={bike}
                onCardClick={(bikeId) => navigate(`/bike/${bikeId}`)}
                onMenuClick={handleMenuOpen}
                showMenu={true}
                isSeller={true}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleEditBike(selectedBike)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Bike</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDeleteBike(selectedBike)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Bike</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Bike Dialog */}
      <EditBikeDialog
        open={editDialogOpen}
        bike={editBike}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdateBike}
      />

      {/* Add Bike Dialog */}
      <AddBikeDialog
        open={addBikeDialogOpen}
        onClose={() => setAddBikeDialogOpen(false)}
        onSave={handleAddBike}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        bike={bikeToDelete}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteBike}
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

// Add Bike Dialog Component
const AddBikeDialog = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    kilometers_driven: '',
    location: '',
    image_url: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.kilometers_driven) newErrors.kilometers_driven = 'Kilometers driven is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      // Reset form
      setFormData({
        brand: '',
        model: '',
        year: '',
        price: '',
        kilometers_driven: '',
        location: '',
        image_url: '',
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setFormData({
      brand: '',
      model: '',
      year: '',
      price: '',
      kilometers_driven: '',
      location: '',
      image_url: '',
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Bike</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Brand *"
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            fullWidth
            error={!!errors.brand}
            helperText={errors.brand}
            required
          />
          <TextField
            label="Model *"
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            fullWidth
            error={!!errors.model}
            helperText={errors.model}
            required
          />
          <TextField
            label="Year *"
            type="number"
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
            fullWidth
            error={!!errors.year}
            helperText={errors.year}
            required
            inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
          />
          <TextField
            label="Price (₹) *"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            fullWidth
            error={!!errors.price}
            helperText={errors.price}
            required
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Kilometers Driven *"
            type="number"
            value={formData.kilometers_driven}
            onChange={(e) => handleChange('kilometers_driven', e.target.value)}
            fullWidth
            error={!!errors.kilometers_driven}
            helperText={errors.kilometers_driven}
            required
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Location *"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            fullWidth
            error={!!errors.location}
            helperText={errors.location}
            required
          />
          <TextField
            label="Image URL"
            value={formData.image_url}
            onChange={(e) => handleChange('image_url', e.target.value)}
            fullWidth
            placeholder="https://example.com/image.jpg"
            helperText="Leave empty to use a placeholder image"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Bike
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

export default MyListings;
