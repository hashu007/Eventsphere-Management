const express = require('express');
const router = express.Router();
const {
  getExhibitorStats,
  getAttendeeStats,
  getExhibitorBookings
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// Exhibitor routes
router.get('/exhibitor-stats', protect, getExhibitorStats);
router.get('/exhibitor-bookings', protect, getExhibitorBookings);

// Attendee routes
router.get('/attendee-stats', protect, getAttendeeStats);

module.exports = router;