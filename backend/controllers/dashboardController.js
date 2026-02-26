const Expo = require('../models/Expo');
const Booth = require('../models/Booth');
const Session = require('../models/Session');

// @desc    Get exhibitor dashboard statistics
// @route   GET /api/dashboard/exhibitor-stats
// @access  Private (Exhibitor)
const getExhibitorStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count active booths (booked by this exhibitor)
    const activeBooths = await Booth.countDocuments({
      exhibitor: userId,
      isBooked: true
    });

    // Count available expos (upcoming and ongoing)
    const availableExpos = await Expo.countDocuments({
      status: { $in: ['upcoming', 'ongoing'] }
    });

    // Count visitor engagements (sessions registered by this user)
    const visitorEngagements = await Session.countDocuments({
      registeredAttendees: userId
    });

    res.json({
      activeBooths,
      availableExpos,
      visitorEngagements
    });
  } catch (error) {
    console.error('Error fetching exhibitor stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendee dashboard statistics
// @route   GET /api/dashboard/attendee-stats
// @access  Private (Attendee)
const getAttendeeStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count available expos
    const availableExpos = await Expo.countDocuments({
      status: { $in: ['upcoming', 'ongoing'] }
    });

    // Count registered events (sessions user has registered for)
    const registeredEvents = await Session.countDocuments({
      registeredAttendees: userId
    });

    // Count bookmarked sessions (for future implementation)
    const bookmarkedSessions = 0; // Placeholder for future feature

    res.json({
      availableExpos,
      registeredEvents,
      bookmarkedSessions
    });
  } catch (error) {
    console.error('Error fetching attendee stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get exhibitor's active bookings details
// @route   GET /api/dashboard/exhibitor-bookings
// @access  Private (Exhibitor)
const getExhibitorBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booth.find({
      exhibitor: userId,
      isBooked: true
    })
    .populate('expoId', 'title startDate endDate location')
    .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExhibitorStats,
  getAttendeeStats,
  getExhibitorBookings
};