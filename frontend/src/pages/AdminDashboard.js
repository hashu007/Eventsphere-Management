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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountCircle,
  ExitToApp,
  Event,
  People,
  Store,
  Add,
  Assessment,
  Delete,
  MoreVert,
  AttachMoney
} from '@mui/icons-material';

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "none",
    color: "white",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "80px",
    height: "80px",
  },
};

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expos, setExpos] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedExpo, setSelectedExpo] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/dashboard');
    } else {
      fetchExpos();
    }
  }, [user, navigate]);

  const fetchExpos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expos');
      setExpos(res.data);
    } catch (error) {
      console.error('Error fetching expos:', error);
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

  const handleExpoMenu = (event, expo) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedExpo(expo);
  };

  const handleExpoMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedExpo(null);
  };

  const handleDeleteExpo = async (id) => {
    if (window.confirm('Are you sure you want to delete this expo?')) {
      try {
        await axios.delete(`http://localhost:5000/api/expos/${id}`);
        fetchExpos();
        handleExpoMenuClose();
      } catch (error) {
        alert('Error deleting expo: ' + error.response?.data?.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'success';
      case 'ongoing': return 'warning';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const bookedBooths = expos.reduce((sum, expo) => sum + expo.bookedBooths, 0);
  const revenue = bookedBooths * 1000;

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'white', 
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar>
          <nav style={styles.nav}>
            <div style={styles.logoContainer}>
              <img src={logo} alt="EventSphere Logo" style={styles.logo} />
            </div>
          </nav>
          
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: 'white' }}>
            EventSphere Admin
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }} color='white'>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="white">
                Administrator
              </Typography>
            </Box>

            <IconButton onClick={handleMenu} sx={{ p: 0.5 }}>
              <Avatar sx={{ bgcolor: 'error.main' }}>
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
            Welcome, {user?.name}! 👨‍💼
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Manage your expos, exhibitors, and track platform performance
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              boxShadow: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {expos.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Expos
                    </Typography>
                  </Box>
                  <Event sx={{ fontSize: 50, opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {bookedBooths}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Booked Booths
                    </Typography>
                  </Box>
                  <Store sx={{ fontSize: 50, color: 'success.light', opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main' }}>
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Users
                    </Typography>
                  </Box>
                  <People sx={{ fontSize: 50, color: 'warning.light', opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'info.main' }}>
                      ${revenue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Revenue
                    </Typography>
                  </Box>
                  <AttachMoney sx={{ fontSize: 50, color: 'info.light', opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => navigate('/admin/create-expo')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 3
            }}
          >
            Create New Expo
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<Assessment />}
            onClick={() => navigate('/analytics')}
          >
            View Analytics
          </Button>
        </Box>

        {/* Expos Table */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Manage Expos
            </Typography>
          </Box>

          {expos.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <Event sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No expos created yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Click "Create New Expo" to get started!
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/admin/create-expo')}
              >
                Create Your First Expo
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Expo Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Booths</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expos.map((expo) => (
                    <TableRow 
                      key={expo._id}
                      sx={{ '&:hover': { bgcolor: 'grey.50' } }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {expo.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(expo.startDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {expo.location?.city || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {expo.bookedBooths}/{expo.totalBooths}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={expo.status} 
                          size="small" 
                          color={getStatusColor(expo.status)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleExpoMenu(e, expo)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Expo Actions Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleExpoMenuClose}
        >
          <MenuItem onClick={() => {
            handleExpoMenuClose();
            navigate(`/sessions/${selectedExpo?._id}`);
          }}>
            <Event sx={{ mr: 1, fontSize: 20 }} /> View Sessions
          </MenuItem>
          <MenuItem onClick={() => {
            handleExpoMenuClose();
            navigate(`/create-session/${selectedExpo?._id}`);
          }}>
            <Add sx={{ mr: 1, fontSize: 20 }} /> Add Session
          </MenuItem>
          <MenuItem onClick={() => {
            handleExpoMenuClose();
            navigate(`/booths/${selectedExpo?._id}`);
          }}>
            <Store sx={{ mr: 1, fontSize: 20 }} /> Manage Booths
          </MenuItem>
          <MenuItem 
            onClick={() => handleDeleteExpo(selectedExpo?._id)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1, fontSize: 20 }} /> Delete Expo
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
}

export default AdminDashboard;