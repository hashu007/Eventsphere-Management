import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Paper,
  Alert
} from '@mui/material';
import { ArrowBack, Store, CheckCircle, Cancel } from '@mui/icons-material';

function BoothList() {
  const { expoId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [booths, setBooths] = useState([]);
  const [expo, setExpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExpoDetails();
    fetchBooths();
  }, [expoId]);

  const fetchExpoDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/expos/${expoId}`);
      setExpo(res.data);
    } catch (error) {
      console.error('Error fetching expo:', error);
    }
  };

  const fetchBooths = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/booths/expo/${expoId}`);
      setBooths(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching booths:', error);
      setLoading(false);
    }
  };

  const handleBookBooth = async (boothId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'exhibitor') {
      setMessage('Only exhibitors can book booths. Please register as an exhibitor.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/booths/${boothId}/book`);
      setMessage('Booth booked successfully!');
      fetchBooths(); // Refresh booth list
      fetchExpoDetails(); // Update expo stats
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to book booth');
    }
  };

  const getBoothColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'booked':
        return 'error';
      case 'reserved':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            Book Booth - {expo?.title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Expo Information */}
        {expo && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              {expo.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {expo.description}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  📅 Date
                </Typography>
                <Typography variant="body1">
                  {new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  📍 Location
                </Typography>
                <Typography variant="body1">
                  {expo.location?.venue}, {expo.location?.city}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  🏢 Available Booths
                </Typography>
                <Typography variant="body1">
                  {expo.totalBooths - expo.bookedBooths} / {expo.totalBooths}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        {message && (
          <Alert 
            severity={message.includes('success') ? 'success' : 'error'} 
            sx={{ mb: 3 }}
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}

        {/* Legend */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip icon={<CheckCircle />} label="Available" color="success" />
          <Chip icon={<Cancel />} label="Booked" color="error" />
          <Chip icon={<Store />} label="Reserved" color="warning" />
        </Box>

        {/* Booths Grid */}
        <Typography variant="h5" gutterBottom>
          Select Your Booth
        </Typography>

        {loading ? (
          <Typography>Loading booths...</Typography>
        ) : (
          <Grid container spacing={2}>
            {booths.map((booth) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={booth._id}>
                <Card
                  sx={{
                    bgcolor: booth.isBooked ? 'grey.300' : 'white',
                    border: booth.isBooked ? '2px solid #d32f2f' : '2px solid #4caf50',
                    cursor: booth.isBooked ? 'not-allowed' : 'pointer',
                    '&:hover': {
                      boxShadow: booth.isBooked ? 'none' : 3
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Store 
                      sx={{ 
                        fontSize: 40, 
                        color: booth.isBooked ? 'grey.500' : 'primary.main',
                        mb: 1
                      }} 
                    />
                    <Typography variant="h6" gutterBottom>
                      {booth.boothNumber}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom>
                      {booth.location?.section}
                    </Typography>
                    <Chip
                      label={booth.status}
                      color={getBoothColor(booth.status)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      ${booth.price}
                    </Typography>
                    {!booth.isBooked && user?.role === 'exhibitor' && (
                      <Button
                        size="small"
                        variant="contained"
                        fullWidth
                        onClick={() => handleBookBooth(booth._id)}
                      >
                        Book
                      </Button>
                    )}
                    {booth.isBooked && (
                      <Typography variant="caption" color="error">
                        Booked
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {booths.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', mt: 4, p: 4, bgcolor: 'grey.100', borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary">
              No booths available yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Contact the organizer for booth information
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
}

export default BoothList;