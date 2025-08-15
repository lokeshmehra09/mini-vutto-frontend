import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  DirectionsBike as BikeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { bikesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BikeCard from './BikeCard';

const BikeList = () => {
  const { isAuthenticated, isSeller, user } = useAuth();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    year: '',
  });
  const [searchInput, setSearchInput] = useState(''); // Separate state for search input
  const [showFilters, setShowFilters] = useState(false);
  const [editBike, setEditBike] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bikeToDelete, setBikeToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBike, setSelectedBike] = useState(null);
  const [addBikeDialogOpen, setAddBikeDialogOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchBikes();
  }, []); // Only fetch on component mount

  // Debounced search effect - waits 2 seconds after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchInput }));
        // Trigger API call after updating filters
        fetchBikesWithFilters({ ...filters, search: searchInput });
      }
    }, 1000); // 2 second delay

    return () => clearTimeout(timer);
  }, [searchInput, filters.search]);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      console.log('Fetching bikes with filters:', filters);
      const response = await bikesAPI.getAllBikes(filters);
      console.log('API Response:', response);
      
      let bikesData = response.data || [];
      
      // If user is a seller, filter out their own bikes from browse results
      if (isSeller() && user) {
        bikesData = bikesData.filter(bike => bike.seller_id !== user.id);
        console.log('Filtered out seller\'s own bikes. Remaining bikes:', bikesData.length);
      }
      
      setBikes(bikesData);
      setError('');
    } catch (err) {
      console.error('Error fetching bikes:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
        if (err.response.status === 401) {
          setError('Authentication required. Please login first.');
        } else {
          setError(`Failed to fetch bikes: ${err.response.data?.message || 'Unknown error'}`);
        }
      } else {
        setError('Failed to fetch bikes. Please check your connection.');
      }
      // Set empty array on error to prevent undefined issues
      setBikes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBikesWithFilters = async (filterParams) => {
    try {
      setLoading(true);
      console.log('Fetching bikes with filters:', filterParams);
      const response = await bikesAPI.getAllBikes(filterParams);
      console.log('API Response:', response);
      
      let bikesData = response.data || [];
      
      // If user is a seller, filter out their own bikes from browse results
      if (isSeller() && user) {
        bikesData = bikesData.filter(bike => bike.seller_id !== user.id);
        console.log('Filtered out seller\'s own bikes. Remaining bikes:', bikesData.length);
      }
      
      setBikes(bikesData);
      setError('');
    } catch (err) {
      console.error('Error fetching bikes:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
        if (err.response.status === 401) {
          setError('Authentication required. Please login first.');
        } else {
          setError(`Failed to fetch bikes: ${err.response.data?.message || 'Unknown error'}`);
        }
      } else {
        setError('Failed to fetch bikes. Please check your connection.');
      }
      // Set empty array on error to prevent undefined issues
      setBikes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field]: value,
    };
    setFilters(newFilters);
    // Trigger API call for non-search filters immediately
    if (field !== 'search') {
      fetchBikesWithFilters(newFilters);
    }
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
  };

  const clearFilters = () => {
    setSearchInput(''); // Clear search input
    const clearedFilters = {
      search: '',
      brand: '',
      model: '',
      minPrice: '',
      maxPrice: '',
      year: '',
    };
    setFilters(clearedFilters);
    // Fetch all bikes when filters are cleared
    fetchBikesWithFilters(clearedFilters);
  };

  const handleBikeClick = (bikeId) => {
    navigate(`/bike/${bikeId}`);
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
      fetchBikes(); // Refresh the list
    } catch (error) {
      console.error('Error updating bike:', error);
    }
  };

  const confirmDeleteBike = async () => {
    try {
      await bikesAPI.deleteBike(bikeToDelete.id);
      setDeleteDialogOpen(false);
      setBikeToDelete(null);
      fetchBikes(); // Refresh the list
    } catch (error) {
      console.error('Error deleting bike:', error);
    }
  };

  const handleAddBike = async (bikeData) => {
    try {
      await bikesAPI.addBike(bikeData);
      setAddBikeDialogOpen(false);
      fetchBikes(); // Refresh the list
    } catch (error) {
      console.error('Error adding bike:', error);
    }
  };

  const getBrands = () => {
    // Ensure bikes is an array before calling map
    if (!Array.isArray(bikes)) return [];
    const uniqueBrands = [...new Set(bikes.map(bike => bike.brand))];
    return uniqueBrands.sort();
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 10; year--) {
      years.push(year);
    }
    return years;
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
          Find Your Perfect Bike
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Browse through our collection of quality bikes
        </Typography>
        {isAuthenticated && isSeller() && (
          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setAddBikeDialogOpen(true)}
            >
              Add Your Bike
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/my-listings')}
            >
              View My Listings
            </Button>
          </Box>
        )}
      </Box>

            {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1, sm: 2 }, 
          mb: 1.5, 
          flexWrap: 'wrap',
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <TextField
            placeholder="Search bikes..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ 
              minWidth: { xs: '100%', sm: 250 },
              flex: { xs: '1 1 100%', sm: '0 1 auto' }
            }}
          />
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: 'row', sm: 'row' },
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Button
              variant="outlined"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<FilterIcon />}
              fullWidth={false}
              sx={{ flex: { xs: '1 1 auto', sm: '0 1 auto' } }}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            <Button 
              variant="text" 
              onClick={clearFilters}
              sx={{ flex: { xs: '1 1 auto', sm: '0 1 auto' } }}
            >
              Clear All
            </Button>
          </Box>
        </Box>

        {showFilters && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Brand</InputLabel>
                <Select
                  value={filters.brand}
                  label="Brand"
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                >
                  <MenuItem value="">All Brands</MenuItem>
                  {getBrands().map(brand => (
                    <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={filters.year}
                  label="Year"
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <MenuItem value="">All Years</MenuItem>
                  {getYears().map(year => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Min Price"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="0"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Max Price"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="100000"
              />
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">
            {Array.isArray(bikes) ? bikes.length : 0} bike{Array.isArray(bikes) && bikes.length !== 1 ? 's' : ''} found
          </Typography>
          {isSeller() && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              Your own bikes are not shown here. View them in "My Listings".
            </Typography>
          )}
        </Box>
        {Object.values(filters).some(filter => filter !== '') && (
          <Chip
            label="Filters Applied"
            color="primary"
            variant="outlined"
            onDelete={clearFilters}
          />
        )}
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Bikes Grid */}
      {!Array.isArray(bikes) || bikes.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <BikeIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No bikes found
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Try adjusting your filters or check back later for new listings.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {bikes.map((bike) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={bike.id}>
              <BikeCard
                bike={bike}
                onCardClick={handleBikeClick}
                onMenuClick={handleMenuOpen}
                showMenu={isSeller()}
                isSeller={isSeller()}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Action Menu */}
      {isSeller() && (
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
      )}

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
    description: '',
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
        description: '',
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
      price: '',
      year: '',
      kilometers_driven: '',
      location: '',
      image_url: '',
      description: '',
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
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            fullWidth
            multiline
            rows={3}
            placeholder="Describe the bike's condition, features, and any additional details..."
            helperText="Optional: Add details about the bike's condition and features"
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

export default BikeList;
