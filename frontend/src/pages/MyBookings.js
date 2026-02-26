import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Chip,
  Paper
} from '@mui/material';
import { ArrowBack, Store, Event, LocationOn } from '@mui/icons-material';

function MyBookings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'exhibitor') {
      navigate('/dashboard');
      return;
    }
    fetchMyBookings();
  }, [user, navigate]);

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/booths/my-bookings');
      setBookings(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleCancelBooking = async (boothId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.put(`http://localhost:5000/api/booths/${boothId}/cancel`);
        alert('Booking cancelled successfully');
        fetchMyBookings(); // Refresh list
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/exhibitor/dashboard')}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            My Booth Bookings
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Booked Booths
        </Typography>

        {loading ? (
          <Typography>Loading your bookings...</Typography>
        ) : bookings.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Store sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Bookings Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You haven't booked any booths yet. Browse available expos to get started!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/exhibitor/dashboard')}
            >
              Browse Expos
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {bookings.map((booth) => (
              <Grid item xs={12} md={6} key={booth._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Typography variant="h5">
                        Booth {booth.boothNumber}
                      </Typography>
                      <Chip label="Booked" color="success" />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        <Event sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                        {booth.expoId?.title}
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          📅 Event Date
                        </Typography>
                        <Typography variant="body1">
                          {new Date(booth.expoId?.startDate).toLocaleDateString()} - {new Date(booth.expoId?.endDate).toLocaleDateString()}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          📍 Location
                        </Typography>
                        <Typography variant="body1">
                          {booth.expoId?.location?.venue}, {booth.expoId?.location?.city}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Booth Size
                        </Typography>
                        <Typography variant="body1">
                          {booth.size}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Price
                        </Typography>
                        <Typography variant="body1">
                          ${booth.price}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Section
                        </Typography>
                        <Typography variant="body1">
                          {booth.location?.floor} - {booth.location?.section}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => handleCancelBooking(booth._id)}
                      >
                        Cancel Booking
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}

export default MyBookings;