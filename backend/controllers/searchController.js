const Expo = require('../models/Expo');
const User = require('../models/User');
const Session = require('../models/Session');

// @desc    Search expos
// @route   GET /api/search/expos
// @access  Public
const searchExpos = async (req, res) => {
  try {
    const { query, city, theme, status, startDate, endDate } = req.query;

    let filter = {};

    // Text search
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // City filter
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    // Theme filter
    if (theme) {
      filter.theme = { $regex: theme, $options: 'i' };
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Date range filter
    if (startDate) {
      filter.startDate = { $gte: new Date(startDate) };
    }
    if (endDate) {
      filter.endDate = { $lte: new Date(endDate) };
    }

    const expos = await Expo.find(filter)
      .populate('organizer', 'name email')
      .sort('-createdAt');

    res.json({
      count: expos.length,
      expos
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search exhibitors
// @route   GET /api/search/exhibitors
// @access  Public
const searchExhibitors = async (req, res) => {
  try {
    const { query, products } = req.query;

    let filter = { role: 'exhibitor' };

    if (query) {
      filter.$or = [
        { companyName: { $regex: query, $options: 'i' } },
        { companyDescription: { $regex: query, $options: 'i' } }
      ];
    }

    if (products) {
      filter.productsServices = { $regex: products, $options: 'i' };
    }

    const exhibitors = await User.find(filter)
      .select('-password')
      .limit(50);

    res.json({
      count: exhibitors.length,
      exhibitors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search sessions
// @route   GET /api/search/sessions
// @access  Public
const searchSessions = async (req, res) => {
  try {
    const { query, category, expoId } = req.query;

    let filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { speaker: { $regex: query, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (expoId) {
      filter.expoId = expoId;
    }

    const sessions = await Session.find(filter)
      .populate('expoId', 'title')
      .sort('startTime');

    res.json({
      count: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get filter options
// @route   GET /api/search/filters
// @access  Public
const getFilterOptions = async (req, res) => {
  try {
    const cities = await Expo.distinct('location.city');
    const themes = await Expo.distinct('theme');
    const categories = ['Workshop', 'Seminar', 'Panel Discussion', 'Keynote', 'Networking', 'Product Demo'];

    res.json({
      cities: cities.filter(Boolean),
      themes: themes.filter(Boolean),
      categories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchExpos,
  searchExhibitors,
  searchSessions,
  getFilterOptions
};