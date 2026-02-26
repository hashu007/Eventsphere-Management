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
  CardActions,
  Button,
  Box,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  LinearProgress,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Event,
  AccountCircle,
  ExitToApp,
  Search,
  Schedule,
  LocationOn,
  Business,
  CalendarToday
} from '@mui/icons-material';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expos, setExpos] = useState([]);
  const [stats, setStats] = useState({
    availableExpos: 0,
    registeredEvents: 0,
    bookmarkedSessions: 0
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch statistics
      const statsRes = await axios.get('http://localhost:5000/api/dashboard/attendee-stats');
      setStats(statsRes.data);

      // Fetch expos
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
            EventSphere
          </Typography>

          <Button 
  onClick={() => navigate('/search')} 
  startIcon={<Search />}
  sx={{ 
    mr: 2,
    color: 'white',
    borderColor: 'white',
    '&:hover': {
      bgcolor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'white'
    }
  }}
  variant="outlined"
>
  Search
</Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }} color='white'>
                {user?.name}
              </Typography>
              <Typography variant="caption" color='white'>
                Attendee
              </Typography>
            </Box>

            <IconButton onClick={handleMenu} sx={{ p: 0.5 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {user?.name?.charAt(0).toUpperCase()}
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
              <AccountCircle sx={{ mr: 1 }} /> My Profile
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/my-sessions'); }}>
              <Schedule sx={{ mr: 1 }} /> My Sessions
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 4,
            borderRadius: 3,
            mb: 4,
            boxShadow: 3
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Discover amazing expos and workshops happening around you
          </Typography>
        </Box>

        {/* Stats Cards */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Available Expos */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
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
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {stats.availableExpos}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Available Expos
                      </Typography>
                    </Box>
                    <Event sx={{ fontSize: 50, opacity: 0.5 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Registered Events */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  boxShadow: 2,
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
                        {stats.registeredEvents}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Registered Events
                      </Typography>
                    </Box>
                    <CalendarToday sx={{ fontSize: 50, color: 'success.light', opacity: 0.5 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Bookmarked Sessions */}
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  boxShadow: 2,
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
                        {stats.bookmarkedSessions}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        My Sessions
                      </Typography>
                    </Box>
                    <Schedule sx={{ fontSize: 50, color: 'warning.light', opacity: 0.5 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Expos Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Upcoming Expos
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<Search />}
            onClick={() => navigate('/search')}
          >
            Search All
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        ) : expos.length === 0 ? (
          <Card sx={{ p: 6, textAlign: 'center', boxShadow: 2 }}>
            <Event sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No expos available at the moment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back soon for upcoming events!
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {expos.map((expo) => (
              <Grid item xs={12} md={6} lg={4} key={expo._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    boxShadow: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: 140,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 60
                    }}
                  >
                    🎪
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
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

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                        <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {expo.totalBooths - expo.bookedBooths} booths available
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                    <Button 
                      size="small" 
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/sessions/${expo._id}`)}
                    >
                      View Sessions
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate(`/booths/${expo._id}`)}
                    >
                      View Booths
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Dashboard;