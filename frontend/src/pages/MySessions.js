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
import { ArrowBack, Event, LocationOn, Schedule } from '@mui/icons-material';

function MySessions() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMySessions();
  }, [user, navigate]);

  const fetchMySessions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sessions/my-sessions');
      setSessions(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  const handleUnregister = async (sessionId) => {
    if (window.confirm('Are you sure you want to unregister from this session?')) {
      try {
        await axios.delete(`http://localhost:5000/api/sessions/${sessionId}/unregister`);
        fetchMySessions();
        alert('Unregistered successfully');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to unregister');
      }
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            My Registered Sessions
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Sessions & Workshops
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : sessions.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Event sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Sessions Registered
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Browse expos and register for interesting sessions!
            </Typography>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>
              Browse Expos
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {sessions.map((session) => (
              <Grid item xs={12} md={6} key={session._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip label={session.category} color="primary" size="small" />
                      <Chip label={session.status} color="success" size="small" />
                    </Box>

                    <Typography variant="h6" gutterBottom>
                      {session.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {session.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>Expo:</strong> {session.expoId?.title}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Speaker:</strong> {session.speaker}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Schedule sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2">
                          {new Date(session.startTime).toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <LocationOn sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2">
                          {session.location}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => handleUnregister(session._id)}
                    >
                      Unregister
                    </Button>
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

export default MySessions;