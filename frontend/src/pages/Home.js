import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo with out background.png';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  AppBar,
  Toolbar,
  alpha
} from '@mui/material';
import {
  Event,
  People,
  Business,
  TrendingUp,
  CheckCircle,
  ArrowForward
} from '@mui/icons-material';

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px"
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "120px",
    height: "120px",
  },
};

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Event sx={{ fontSize: 60 }} />,
      title: 'Expo Management',
      description: 'Create and manage large-scale expos with ease'
    },
    {
      icon: <Business sx={{ fontSize: 60 }} />,
      title: 'Booth Booking',
      description: 'Reserve exhibition spaces with real-time availability'
    },
    {
      icon: <People sx={{ fontSize: 60 }} />,
      title: 'Session Registration',
      description: 'Attend workshops and networking events'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 60 }} />,
      title: 'Analytics Dashboard',
      description: 'Track engagement and performance metrics'
    }
  ];

  const benefits = [
    'Real-time booth availability',
    'Secure payment processing',
    'Interactive floor plans',
    'Mobile-responsive design',
    'Advanced search & filters',
    '24/7 customer support'
  ];

  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="EventSphere Logo" style={{ width: '80px', height: '80px' }} />
          </Box>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, color: 'white' }}>
            EventSphere
          </Typography>
          <Button color="white" onClick={() => navigate('/login')} sx={{ mr: 1 }}>
            Login
          </Button>
          <Button variant="contained" onClick={() => navigate('/register')}>
            Get Started
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pt: 10,
          pb: 12,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Revolutionize Your Expo Experience
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                The complete platform for managing expos, booking booths, and connecting exhibitors with attendees
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: alpha('#ffffff', 0.9)
                    }
                  }}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/search')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: alpha('#fff', 0.1)
                    }
                  }}
                >
                  Browse Expos
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: 400,
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: alpha('#fff', 0.1),
                    borderRadius: 4,
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 100
                  }}
                >
                  
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Everything You Need
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Powerful features to manage your events seamlessly
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                Why Choose EventSphere?
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Join thousands of event organizers, exhibitors, and attendees who trust EventSphere for their expo management needs.
              </Typography>
              <Box sx={{ mt: 3 }}>
                {benefits.map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircle sx={{ color: 'success.main', mr: 2 }} />
                    <Typography variant="body1">{benefit}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Ready to Get Started?
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Create your account today and start managing expos like a pro!
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  component={Link}
                  to="/register"
                  sx={{
                    bgcolor: 'white',
                    color: 'white',
                    '&:hover': {
                      bgcolor: alpha('#fff', 0.9)
                    }
                  }}
                >
                  Sign Up Now - It's Free
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={4} sx={{ textAlign: 'center' }}>
          <Grid item xs={12} md={3}>
            <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              500+
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Expos Hosted
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              10K+
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Exhibitors
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              50K+
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Attendees
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              98%
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Satisfaction
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img src={logo} alt="EventSphere Logo" style={{ width: '50px', height: '50px', marginRight: '12px' }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  EventSphere
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                The future of expo management is here. Join us today!
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link to="/register" style={{ color: 'white', opacity: 0.8, textDecoration: 'none' }}>
                  Register
                </Link>
                <Link to="/login" style={{ color: 'white', opacity: 0.8, textDecoration: 'none' }}>
                  Login
                </Link>
                <Link to="/search" style={{ color: 'white', opacity: 0.8, textDecoration: 'none' }}>
                  Search Expos
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Email: support@eventsphere.com<br />
                Phone: +1 (555) 123-4567<br />
                Address: 123 Expo Street, City
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © 2026 EventSphere. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Home;