const Booth = require('../models/Booth');
const Expo = require('../models/Expo');

// @desc    Get all booths for an expo
// @route   GET /api/booths/expo/:expoId
// @access  Public
const getBoothsByExpo = async (req, res) => {
  try {
    const booths = await Booth.find({ expoId: req.params.expoId })
      .populate('exhibitor', 'name companyName email');
    res.json(booths);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create booths for an expo
// @route   POST /api/booths
// @access  Private/Admin
const createBooths = async (req, res) => {
  try {
    const { expoId, numberOfBooths, price, size } = req.body;

    const expo = await Expo.findById(expoId);
    if (!expo) {
      return res.status(404).json({ message: 'Expo not found' });
    }

    const booths = [];
    for (let i = 1; i <= numberOfBooths; i++) {
      booths.push({
        expoId,
        boothNumber: `B${String(i).padStart(3, '0')}`,
        size: size || 'medium',
        price: price || 1000,
        location: {
          floor: 'Ground Floor',
          section: `Section ${Math.ceil(i / 10)}`,
          coordinates: { x: i % 10, y: Math.floor(i / 10) }
        }
      });
    }

    const createdBooths = await Booth.insertMany(booths);
    res.status(201).json(createdBooths);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book a booth
// @route   PUT /api/booths/:id/book
// @access  Private/Exhibitor
const bookBooth = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id);

    if (!booth) {
      return res.status(404).json({ message: 'Booth not found' });
    }

    if (booth.isBooked) {
      return res.status(400).json({ message: 'Booth already booked' });
    }

    booth.isBooked = true;
    booth.exhibitor = req.user._id;
    booth.status = 'booked';

    await booth.save();

    // Update expo booked booths count
    const expo = await Expo.findById(booth.expoId);
    expo.bookedBooths += 1;
    await expo.save();

    res.json(booth);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booth booking
// @route   PUT /api/booths/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id);

    if (!booth) {
      return res.status(404).json({ message: 'Booth not found' });
    }

    if (booth.exhibitor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booth.isBooked = false;
    booth.exhibitor = null;
    booth.status = 'available';

    await booth.save();

    // Update expo booked booths count
    const expo = await Expo.findById(booth.expoId);
    expo.bookedBooths = Math.max(0, expo.bookedBooths - 1);
    await expo.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get exhibitor's booths
// @route   GET /api/booths/my-bookings
// @access  Private/Exhibitor
const getMyBookings = async (req, res) => {
  try {
    const booths = await Booth.find({ exhibitor: req.user._id })
      .populate('expoId', 'title startDate endDate location');
    res.json(booths);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBoothsByExpo,
  createBooths,
  bookBooth,
  cancelBooking,
  getMyBookings
};