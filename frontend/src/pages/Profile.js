import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Avatar,
  Alert,
  Card,
  CardContent,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress  // ✅ ADDED THIS IMPORT
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Email,
  Business,
  Edit,
  Save,
  Cancel,
  Delete,
  Event,
  Phone,
  CheckCircle,
  Warning,
  EventBusy,
  BookmarkRemove,
  PersonOff,
  Store
} from '@mui/icons-material';

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    companyDescription: '',
    contactNumber: ''
  });
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        email: user.email || '',
        companyName: user.companyName || '',
        companyDescription: user.companyDescription || '',
        contactNumber: user.contactNumber || ''
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setMessage('');
    setLoading(true);

    try {
      await axios.put('http://localhost:5000/api/auth/update-profile', formData);
      
      setMessage('✓ Profile updated successfully!');
      setMessageType('success');
      setEditMode(false);
      setOriginalData(formData);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || '✗ Failed to update profile');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setEditMode(false);
    setMessage('');
  };

  const handleBack = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'exhibitor') {
      navigate('/exhibitor/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText.toLowerCase() !== 'delete my account') {
      setMessage('Please type "DELETE MY ACCOUNT" to confirm');
      setMessageType('error');
      return;
    }

    setDeleteLoading(true);

    try {
      await axios.delete('http://localhost:5000/api/auth/delete-account');
      
      // Logout and redirect
      logout();
      navigate('/', { 
        state: { 
          message: 'Your account has been successfully deleted. We\'re sorry to see you go!' 
        } 
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete account');
      setMessageType('error');
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'exhibitor': return 'success';
      case 'attendee': return 'primary';
      default: return 'default';
    }
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const getDeleteImpact = () => {
    const impacts = [
      {
        icon: <EventBusy color="error" />,
        text: 'All expo registrations will be cancelled'
      },
      {
        icon: <BookmarkRemove color="error" />,
        text: 'All session registrations will be removed'
      }
    ];

    if (user?.role === 'exhibitor') {
      impacts.push({
        icon: <Store color="error" />,
        text: 'All booth bookings will be cancelled and refunded'
      });
    }

    impacts.push(
      {
        icon: <PersonOff color="error" />,
        text: 'Your profile will be permanently deleted'
      },
      {
        icon: <Warning color="error" />,
        text: 'This action cannot be undone'
      }
    );

    return impacts;
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
          <IconButton edge="start" onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Event sx={{ ml: 2, mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: 'primary.main' }}>
            My Profile
          </Typography>
          
          {!editMode ? (
            <Button 
              startIcon={<Edit />}
              onClick={() => setEditMode(true)}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                startIcon={<Cancel />}
                onClick={handleCancel}
                variant="outlined"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                startIcon={<Save />}
                onClick={handleSave}
                variant="contained"
                disabled={loading || !hasChanges()}
                sx={{
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  '&:disabled': {
                    background: 'grey.300'
                  }
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Messages */}
        {message && (
          <Alert 
            severity={messageType} 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setMessage('')}
            icon={messageType === 'success' ? <CheckCircle /> : undefined}
          >
            {message}
          </Alert>
        )}

        {/* Profile Header */}
        <Paper 
          sx={{ 
            p: 4, 
            mb: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: 3,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: alpha('#fff', 0.1)
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: alpha('#fff', 0.1)
            }}
          />

          <Avatar
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto',
              bgcolor: alpha('#fff', 0.3),
              fontSize: 50,
              mb: 2,
              border: '4px solid white',
              boxShadow: 3,
              position: 'relative',
              zIndex: 1
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, position: 'relative', zIndex: 1 }}>
            {formData.name || user?.name}
          </Typography>
          
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, position: 'relative', zIndex: 1 }}>
            {formData.email || user?.email}
          </Typography>
          
          <Chip
            label={user?.role?.toUpperCase()}
            sx={{
              bgcolor: alpha('#fff', 0.2),
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              fontWeight: 600,
              position: 'relative',
              zIndex: 1
            }}
          />
        </Paper>

        {/* Edit Mode Indicator */}
        {editMode && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Edit Mode:</strong> Make your changes and click "Save Changes" when done.
            </Typography>
          </Alert>
        )}

        {/* Personal Information */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Person color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Personal Information
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editMode}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: editMode ? 'white' : 'grey.50'
                  }
                }}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editMode}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: editMode ? 'white' : 'grey.50'
                  }
                }}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="+1 234 567 8900"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: editMode ? 'white' : 'grey.50'
                  }
                }}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Company Information (for exhibitors) */}
        {user?.role === 'exhibitor' && (
          <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Business color="success" />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Company Details
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  disabled={!editMode}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: editMode ? 'white' : 'grey.50'
                    }
                  }}
                  InputProps={{
                    startAdornment: <Business sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Description"
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  disabled={!editMode}
                  multiline
                  rows={4}
                  placeholder="Tell us about your company..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: editMode ? 'white' : 'grey.50'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Account Information */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Account Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: 'grey.50', boxShadow: 0 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    ACCOUNT TYPE
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                      {user?.role}
                    </Typography>
                    <Chip 
                      label="Verified" 
                      size="small" 
                      color={getRoleBadgeColor(user?.role)}
                      icon={<CheckCircle />}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: 'grey.50', boxShadow: 0 }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    MEMBER SINCE
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {user?.createdAt ? (
                      new Date(user.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })
                    ) : (
                      'Not available'
                    )}
                  </Typography>
                  {user?.createdAt && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))} days ago
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Danger Zone */}
        <Paper 
          sx={{ 
            p: 4, 
            borderRadius: 3, 
            boxShadow: 3,
            border: '2px solid',
            borderColor: 'error.light',
            bgcolor: alpha('#f44336', 0.02)
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Warning color="error" sx={{ fontSize: 30 }} />
            <Typography variant="h6" color="error" sx={{ fontWeight: 700 }}>
              Danger Zone
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Once you delete your account, there is no going back. All your data, bookings, and registrations will be permanently deleted. Please be certain.
          </Typography>
          
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Delete My Account
          </Button>
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: 'error.main', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning sx={{ fontSize: 30 }} />
            Delete Account Permanently?
          </Box>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              ⚠️ WARNING: This action is irreversible!
            </Typography>
          </Alert>

          <Typography variant="body1" sx={{ mb: 3, fontWeight: 600 }}>
            What will happen when you delete your account:
          </Typography>

          <List dense>
            {getDeleteImpact().map((impact, index) => (
              <ListItem key={index} sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {impact.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={impact.text}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: 'text.secondary'
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
              To confirm deletion, please type: <code style={{ color: 'red' }}>DELETE MY ACCOUNT</code>
            </Typography>
            <TextField
              fullWidth
              placeholder="Type DELETE MY ACCOUNT"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={deleteLoading}
              error={confirmText && confirmText.toLowerCase() !== 'delete my account'}
              helperText={confirmText && confirmText.toLowerCase() !== 'delete my account' ? 'Text does not match' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'white'
                }
              }}
            />
          </Box>
        </DialogContent>
        
        <Divider />
        
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setDeleteDialogOpen(false);
              setConfirmText('');
            }}
            disabled={deleteLoading}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAccount} 
            color="error" 
            variant="contained"
            disabled={deleteLoading || confirmText.toLowerCase() !== 'delete my account'}
            startIcon={deleteLoading ? <CircularProgress size={20} color="inherit" /> : <Delete />}
            sx={{ borderRadius: 2, minWidth: 120 }}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Forever'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profile;