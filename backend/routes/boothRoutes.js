const express = require('express');
const router = express.Router();
const {
  getBoothsByExpo,
  createBooths,
  bookBooth,
  cancelBooking,
  getMyBookings
} = require('../controllers/boothController');
const { protect, admin, exhibitor } = require('../middleware/auth'); // Make sure it's auth

router.post('/', protect, admin, createBooths);
router.get('/expo/:expoId', getBoothsByExpo);
router.get('/my-bookings', protect, exhibitor, getMyBookings);
router.put('/:id/book', protect, exhibitor, bookBooth);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;