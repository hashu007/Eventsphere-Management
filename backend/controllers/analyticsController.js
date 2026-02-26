const Expo = require('../models/Expo');
const User = require('../models/User');
const Booth = require('../models/Booth');
const Session = require('../models/Session');

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Total counts
    const totalExpos = await Expo.countDocuments();
    const totalExhibitors = await User.countDocuments({ role: 'exhibitor' });
    const totalAttendees = await User.countDocuments({ role: 'attendee' });
    const totalBooths = await Booth.countDocuments();
    const bookedBooths = await Booth.countDocuments({ isBooked: true });
    const totalSessions = await Session.countDocuments();

    // Recent expos
    const recentExpos = await Expo.find()
      .sort('-createdAt')
      .limit(5)
      .select('title startDate status bookedBooths totalBooths');

    // Upcoming expos
    const upcomingExpos = await Expo.find({
      startDate: { $gte: new Date() },
      status: 'upcoming'
    }).countDocuments();

    // Revenue (assuming $1000 per booth)
    const revenue = bookedBooths * 1000;

    // Expo statistics
    const expoStats = await Expo.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly registrations
    const monthlyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Popular sessions
    const popularSessions = await Session.find()
      .sort('-registeredAttendees')
      .limit(5)
      .select('title registeredAttendees maxAttendees')
      .populate('expoId', 'title');

    res.json({
      summary: {
        totalExpos,
        totalExhibitors,
        totalAttendees,
        totalBooths,
        bookedBooths,
        availableBooths: totalBooths - bookedBooths,
        totalSessions,
        upcomingExpos,
        revenue,
        occupancyRate: totalBooths > 0 ? ((bookedBooths / totalBooths) * 100).toFixed(2) : 0
      },
      expoStats,
      recentExpos,
      monthlyRegistrations,
      popularSessions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get expo analytics
// @route   GET /api/analytics/expo/:id
// @access  Private/Admin
const getExpoAnalytics = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);

    if (!expo) {
      return res.status(404).json({ message: 'Expo not found' });
    }

    const booths = await Booth.find({ expoId: req.params.id });
    const sessions = await Session.find({ expoId: req.params.id });

    const bookedBooths = booths.filter(b => b.isBooked).length;
    const totalRevenue = bookedBooths * 1000;

    const sessionStats = sessions.map(session => ({
      title: session.title,
      registered: session.registeredAttendees.length,
      capacity: session.maxAttendees,
      occupancyRate: ((session.registeredAttendees.length / session.maxAttendees) * 100).toFixed(2)
    }));

    res.json({
      expo: {
        title: expo.title,
        startDate: expo.startDate,
        endDate: expo.endDate,
        status: expo.status
      },
      boothStats: {
        total: booths.length,
        booked: bookedBooths,
        available: booths.length - bookedBooths,
        occupancyRate: ((bookedBooths / booths.length) * 100).toFixed(2),
        revenue: totalRevenue
      },
      sessionStats: {
        total: sessions.length,
        sessions: sessionStats
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user growth analytics
// @route   GET /api/analytics/user-growth
// @access  Private/Admin
const getUserGrowth = async (req, res) => {
  try {
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            role: '$role'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json(userGrowth);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getExpoAnalytics,
  getUserGrowth
};