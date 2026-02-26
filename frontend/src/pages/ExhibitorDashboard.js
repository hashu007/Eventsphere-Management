import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import logo from '../assets/logo with out background.png';
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
  Menu,
  MenuItem,
  IconButton,
  Paper,
  Avatar,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Store,
  AccountCircle,
  ExitToApp,
  EventAvailable,
  TrendingUp,
  Business,
  LocationOn,
  CalendarToday
} from '@mui/icons-material';

function ExhibitorDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expos, setExpos] = useState([]);
  const [stats, setStats] = useState({
    activeBooths: 0,
    availableExpos: 0,
    visitorEngagements: 0
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'exhibitor') {
      navigate('/dashboard');
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const statsRes = await axios.get('http://localhost:5000/api/dashboard/exhibitor-stats');
      setStats(statsRes.data);

      // Fetch available expos
      const exposRes = await axios.get('http://localhost:5000/api/expos');
      setExpos(exposRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img src={logo} alt="EventSphere Logo" style={{ width: '60px', height: '60px' }} />
          </Box>
          
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: 'white' }}>
            EventSphere Exhibitor
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }} color='white'>
                {user?.companyName || user?.name}
              </Typography>
              <Typography variant="caption" color="color='white'">
                Exhibitor
              </Typography>
            </Box>

            <IconButton onClick={handleMenu} sx={{ p: 0.5 }}>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                {(user?.companyName || user?.name)?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              <AccountCircle sx={{ mr: 1 }} /> Company Profile
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/my-bookings'); }}>
              <Store sx={{ mr: 1 }} /> My Bookings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Banner */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            color: 'white',
            p: 4,
            borderRadius: 3,
            mb: 4,
            boxShadow: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Business sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {user?.companyName}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Showcase your products and connect with thousands of attendees
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats Cards */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Active Booths */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  boxShadow: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {stats.activeBooths}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Active Booths
                      </Typography>
                    </Box>
                    <Store sx={{ fontSize: 50, opacity: 0.5 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Available Expos */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  boxShadow: 3,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {stats.availableExpos}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Available Expos
                      </Typography>
                    </Box>
                    <EventAvailable sx={{ fontSize: 50, color: 'success.light', opacity: 0.5 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Visitor Engagements */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  boxShadow: 3,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main' }}>
                        {stats.visitorEngagements}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Visitor Engagements
                      </Typography>
                    </Box>
                    <TrendingUp sx={{ fontSize: 50, color: 'warning.light', opacity: 0.5 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Company Info Card */}
        <Paper sx={{ p: 4, mb: 4, boxShadow: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Company Information
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => navigate('/profile')}
            >
              Edit Profile
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  COMPANY NAME
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {user?.companyName || 'Not provided'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  CONTACT EMAIL
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {user?.email}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  COMPANY DESCRIPTION
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {user?.companyDescription || 'No description provided'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Available Expos */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Available Expos - Book Your Booth
          </Typography>
          <Button 
            variant="outlined"
            onClick={() => navigate('/my-bookings')}
          >
            My Bookings ({stats.activeBooths})
          </Button>
        </Box>

        {expos.length === 0 ? (
          <Card sx={{ p: 6, textAlign: 'center', boxShadow: 2 }}>
            <EventAvailable sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No expos available for booking
            </Typography>
            <Typography variant="body2" color="text.secondary">
              New opportunities coming soon!
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
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        label={expo.status} 
                        size="small" 
                        color={getStatusColor(expo.status)}
                      />
                      {expo.theme && (
                        <Chip 
                          label={expo.theme} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
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
                          {expo.location?.city || 'Location TBA'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Store sx={{ fontSize: 16, color: 'success.main' }} />
                        <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                          {expo.totalBooths - expo.bookedBooths} booths available
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="contained" 
                        fullWidth
                        onClick={() => navigate(`/booths/${expo._id}`)}
                        sx={{
                          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                        }}
                      >
                        Book Booth
                      </Button>
                      <Button 
                        variant="outlined" 
                        fullWidth
                        onClick={() => navigate(`/sessions/${expo._id}`)}
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

export default ExhibitorDashboard;