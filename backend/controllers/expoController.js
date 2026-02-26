const Expo = require('../models/Expo');

// @desc    Get all expos
// @route   GET /api/expos
// @access  Public
const getExpos = async (req, res) => {
  try {
    const expos = await Expo.find().populate('organizer', 'name email');
    res.json(expos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single expo
// @route   GET /api/expos/:id
// @access  Public
const getExpoById = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id).populate('organizer', 'name email');
    
    if (!expo) {
      return res.status(404).json({ message: 'Expo not found' });
    }
    
    res.json(expo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new expo
// @route   POST /api/expos
// @access  Private/Admin
const createExpo = async (req, res) => {
  try {
    const { title, description, theme, startDate, endDate, location, totalBooths } = req.body;

    const expo = await Expo.create({
      title,
      description,
      theme,
      startDate,
      endDate,
      location,
      totalBooths,
      organizer: req.user._id
    });

    res.status(201).json(expo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update expo
// @route   PUT /api/expos/:id
// @access  Private/Admin
const updateExpo = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);

    if (!expo) {
      return res.status(404).json({ message: 'Expo not found' });
    }

    // Check if user is organizer
    if (expo.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this expo' });
    }

    const updatedExpo = await Expo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedExpo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete expo
// @route   DELETE /api/expos/:id
// @access  Private/Admin
const deleteExpo = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);

    if (!expo) {
      return res.status(404).json({ message: 'Expo not found' });
    }

    if (expo.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this expo' });
    }

    await expo.deleteOne();
    res.json({ message: 'Expo removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExpos, getExpoById, createExpo, updateExpo, deleteExpo };