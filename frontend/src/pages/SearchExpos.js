import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  InputAdornment,
  alpha
} from '@mui/material';
import { 
  ArrowBack, 
  Search, 
  FilterList, 
  Event,
  LocationOn,
  CalendarToday,
  Business,
  Clear
} from '@mui/icons-material';

function SearchExpos() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    theme: '',
    status: ''
  });
  const [expos, setExpos] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    cities: [],
    themes: []
  });

  useEffect(() => {
    fetchFilterOptions();
    handleSearch();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/search/filters');
      setFilterOptions(res.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const params = {
        query: searchQuery,
        ...filters
      };

      const res = await axios.get('http://localhost:5000/api/search/expos', { params });
      setExpos(res.data.expos);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      city: '',
      theme: '',
      status: ''
    });
    handleSearch();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'success';
      case 'ongoing': return 'warning';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ bgcolor: 'white', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate(-1)}>
            <ArrowBack color='white'/>
          </IconButton>
          <Search sx={{ ml: 2, mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Search Expos
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Search Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 4,
            borderRadius: 3,
            mb: 4,
            boxShadow: 3
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            🔍 Find Your Perfect Expo
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Search through hundreds of expos and events happening worldwide
          </Typography>
        </Box>

        {/* Search Bar */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                placeholder="Search expos by name, description, or theme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery('')}>
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSearch}
                startIcon={<Search />}
                sx={{
                  py: 1.8,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600
                }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FilterList sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Filters
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <Select
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  label="City"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All Cities</MenuItem>
                  {filterOptions.cities.map((city) => (
                    <MenuItem key={city} value={city}>{city}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  name="theme"
                  value={filters.theme}
                  onChange={handleFilterChange}
                  label="Theme"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All Themes</MenuItem>
                  {filterOptions.themes.map((theme) => (
                    <MenuItem key={theme} value={theme}>{theme}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  label="Status"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={clearFilters}
                startIcon={<Clear />}
                sx={{ py: 1.8, borderRadius: 2 }}
              >
                Clear All
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Results */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Search Results ({expos.length})
          </Typography>
        </Box>

        {expos.length === 0 ? (
          <Card sx={{ p: 6, textAlign: 'center', boxShadow: 2 }}>
            <Search sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No expos found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {expos.map((expo) => (
              <Grid item xs={12} md={6} key={expo._id}>
                <Card 
                  sx={{ 
                    boxShadow: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: 120,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 50
                    }}
                  >
                    🎪
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip label={expo.status} size="small" color={getStatusColor(expo.status)} />
                      {expo.theme && <Chip label={expo.theme} size="small" variant="outlined" />}
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {expo.title}
                    </Typography>

                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {expo.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {expo.location?.city}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Business sx={{ fontSize: 16, color: 'success.main' }} />
                        <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                          {expo.totalBooths - expo.bookedBooths} booths available
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate(`/booths/${expo._id}`)}
                      >
                        View Booths
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        fullWidth
                        onClick={() => navigate(`/sessions/${expo._id}`)}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                      >
                        View Sessions
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default SearchExpos;