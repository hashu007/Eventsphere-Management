import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  alpha,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  ArrowBack,
  Event,
  LocationOn,
  CalendarToday,
  Business,
  Description,
  NavigateNext,
  NavigateBefore,
  CheckCircle,
  Image as ImageIcon
} from '@mui/icons-material';

function CreateExpo() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expoBanner, setExpoBanner] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    startDate: '',
    endDate: '',
    venue: '',
    city: '',
    address: '',
    totalBooths: 50
  });

  const steps = ['Basic Info', 'Date & Time', 'Location', 'Review'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.title && formData.description;
      case 1:
        return formData.startDate && formData.endDate;
      case 2:
        return formData.venue && formData.city && formData.address;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date must be after start date');
      setLoading(false);
      return;
    }

    try {
      const expoData = {
        title: formData.title,
        description: formData.description,
        theme: formData.theme,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: {
          venue: formData.venue,
          city: formData.city,
          address: formData.address
        },
        totalBooths: parseInt(formData.totalBooths),
        banner: expoBanner
      };

      const expoRes = await axios.post('http://localhost:5000/api/expos', expoData);
      
      // Create booths for this expo
      await axios.post('http://localhost:5000/api/booths', {
        expoId: expoRes.data._id,
        numberOfBooths: parseInt(formData.totalBooths),
        price: 1000,
        size: 'medium'
      });

      setSuccess('Expo and booths created successfully!');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create expo');
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Description color="primary" /> Basic Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Expo Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Tech Innovation Expo 2026"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  placeholder="Describe what makes your expo special..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Theme"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  placeholder="e.g., Technology, Fashion, Healthcare"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total Booths"
                  name="totalBooths"
                  type="number"
                  value={formData.totalBooths}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 1 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ bgcolor: 'grey.50', border: '2px dashed', borderColor: 'primary.main' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <ImageIcon color="primary" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Expo Banner Image (Optional)
                      </Typography>
                    </Box>
                    <ImageUpload
                      currentImage={expoBanner}
                      onImageUploaded={(url) => setExpoBanner(url)}
                      label="Upload Expo Banner"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday color="primary" /> Date & Time
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date & Time"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date & Time"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  <Typography variant="body2">
                    <strong>Tip:</strong> Choose dates that give exhibitors enough time to prepare and promote their participation.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn color="primary" /> Location Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Venue Name"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Grand Convention Center"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="e.g., New York"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Complete venue address with street, zip code, etc."
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="success" /> Review Your Expo
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      EXPO TITLE
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {formData.title || 'Not provided'}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      DESCRIPTION
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {formData.description || 'Not provided'}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          THEME
                        </Typography>
                        <Typography variant="body2">
                          {formData.theme || 'No theme specified'}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          TOTAL BOOTHS
                        </Typography>
                        <Typography variant="body2">
                          {formData.totalBooths} booths
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          START DATE
                        </Typography>
                        <Typography variant="body2">
                          {formData.startDate ? new Date(formData.startDate).toLocaleString() : 'Not set'}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          END DATE
                        </Typography>
                        <Typography variant="body2">
                          {formData.endDate ? new Date(formData.endDate).toLocaleString() : 'Not set'}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          LOCATION
                        </Typography>
                        <Typography variant="body2">
                          {formData.venue && formData.city 
                            ? `${formData.venue}, ${formData.city}` 
                            : 'Not provided'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formData.address || 'Address not provided'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {expoBanner && (
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: 'grey.50' }}>
                    <CardContent>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                        EXPO BANNER
                      </Typography>
                      <Box
                        component="img"
                        src={expoBanner}
                        alt="Expo Banner"
                        sx={{
                          width: '100%',
                          maxHeight: 200,
                          objectFit: 'cover',
                          borderRadius: 2
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        );

      default:
        return null;
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
          <IconButton edge="start" onClick={() => navigate('/admin/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Event sx={{ ml: 2, mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Create New Expo
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Header Card */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: 3
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            🎪 Create Your Expo Event
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Fill in the details to launch an amazing expo experience
          </Typography>
        </Paper>

        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} icon={<CheckCircle />}>
            {success}
          </Alert>
        )}

        {/* Form Content */}
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            {loading && (
              <Box sx={{ mt: 3 }}>
                <LinearProgress sx={{ borderRadius: 1 }} />
                <Typography variant="body2" align="center" sx={{ mt: 1 }} color="text.secondary">
                  Creating expo and booths...
                </Typography>
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                startIcon={<NavigateBefore />}
                variant="outlined"
                sx={{ borderRadius: 2, px: 3 }}
              >
                Back
              </Button>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/dashboard')}
                  disabled={loading}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Cancel
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    endIcon={<CheckCircle />}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6b4298 100%)'
                      }
                    }}
                  >
                    {loading ? 'Creating...' : 'Create Expo'}
                  </Button>
                ) : (
                  <Button
  variant="contained"
  onClick={handleNext}
  disabled={!validateStep(activeStep)}
  endIcon={<NavigateNext />}
  sx={{
    borderRadius: 2,
    px: 4,
    color: 'white',   // 👈 text color
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '&:hover': {
      color: 'white',  // 👈 keep white on hover
      background: 'linear-gradient(135deg, #5568d3 0%, #6b4298 100%)'
    }
  }}
>
  Next
</Button>

                )}
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default CreateExpo;