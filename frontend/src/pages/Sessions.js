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
  LinearProgress,
  Alert,
  Paper,
  alpha,
  Avatar
} from '@mui/material';
import {
  ArrowBack,
  Person,
  LocationOn,
  Schedule,
  CheckCircle,
  Event,
  CalendarToday
} from '@mui/icons-material';

function Sessions() {
  const { expoId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [expo, setExpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExpoDetails();
    fetchSessions();
  }, [expoId]);

  const fetchExpoDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/expos/${expoId}`);
      setExpo(res.data);
    } catch (error) {
      console.error('Error fetching expo:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sessions/expo/${expoId}`);
      setSessions(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  const handleRegister = async (sessionId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/sessions/${sessionId}/register`);
      setMessage('Successfully registered for session!');
      fetchSessions();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to register');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUnregister = async (sessionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/sessions/${sessionId}/unregister`);
      setMessage('Successfully unregistered from session');
      fetchSessions();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to unregister');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const isRegistered = (session) => {
    return user && session.registeredAttendees.some(
      attendee => attendee._id === user._id
    );
  };

  const getOccupancyPercentage = (session) => {
    return (session.registeredAttendees.length / session.maxAttendees) * 100;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Workshop': 'primary',
      'Seminar': 'secondary',
      'Panel Discussion': 'warning',
      'Keynote': 'error',
      'Networking': 'info',
      'Product Demo': 'success'
    };
    return colors[category] || 'default';
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Event sx={{ ml: 2, mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {expo?.title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Expo Header */}
        {expo && (
          <Paper 
            sx={{ 
              p: 4, 
              mb: 4, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: 3
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              📅 Event Sessions & Workshops
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Event Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Location
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {expo.location?.venue}, {expo.location?.city}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Event sx={{ fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Total Sessions
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {sessions.length} Available
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {message && (
          <Alert 
            severity={message.includes('Success') ? 'success' : 'error'} 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Available Sessions
        </Typography>

        {loading ? (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        ) : sessions.length === 0 ? (
          <Card sx={{ p: 6, textAlign: 'center', boxShadow: 2 }}>
            <Schedule sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No sessions scheduled yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back later for updates!
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {sessions.map((session) => (
              <Grid item xs={12} md={6} key={session._id}>
                <Card 
                  sx={{ 
                    height: '100%',
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
                      height: 8,
                      background: `linear-gradient(90deg, ${
                        session.category === 'Workshop' ? '#667eea, #764ba2' :
                        session.category === 'Keynote' ? '#f093fb, #f5576c' :
                        session.category === 'Seminar' ? '#4facfe, #00f2fe' :
                        '#43e97b, #38f9d7'
                      })`
                    }}
                  />

                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Chip 
                        label={session.category} 
                        size="small" 
                        color={getCategoryColor(session.category)}
                      />
                      <Chip 
                        label={session.status} 
                        size="small" 
                        color="success"
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {session.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {session.description}
                    </Typography>

                    <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Person sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {session.speaker}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Schedule sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {new Date(session.startTime).toLocaleString()}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {session.location}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Capacity Bar */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {session.registeredAttendees.length} / {session.maxAttendees} Registered
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {getOccupancyPercentage(session).toFixed(0)}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={getOccupancyPercentage(session)} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 1,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            background: getOccupancyPercentage(session) > 80 
                              ? 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)'
                              : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                          }
                        }}
                      />
                    </Box>

                    {/* Action Buttons */}
                    {user && (
                      <>
                        {isRegistered(session) ? (
                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            startIcon={<CheckCircle />}
                            onClick={() => handleUnregister(session._id)}
                          >
                            Registered - Click to Unregister
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleRegister(session._id)}
                            disabled={session.registeredAttendees.length >= session.maxAttendees}
                            sx={{
                              background: session.registeredAttendees.length >= session.maxAttendees
                                ? undefined
                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #6b4298 100%)'
                              }
                            }}
                          >
                            {session.registeredAttendees.length >= session.maxAttendees 
                              ? '🔒 Session Full' 
                              : '✓ Register Now'}
                          </Button>
                        )}
                      </>
                    )}

                    {!user && (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate('/login')}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                      >
                        Login to Register
                      </Button>
                    )}
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

export default Sessions;