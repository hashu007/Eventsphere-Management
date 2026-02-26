const Session = require('../models/Session');
const Expo = require('../models/Expo');

// @desc    Get all sessions for an expo
// @route   GET /api/sessions/expo/:expoId
// @access  Public
const getSessionsByExpo = async (req, res) => {
  try {
    const sessions = await Session.find({ expoId: req.params.expoId })
      .populate('registeredAttendees', 'name email')
      .sort('startTime');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Public
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('expoId', 'title location')
      .populate('registeredAttendees', 'name email');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create session
// @route   POST /api/sessions
// @access  Private/Admin
const createSession = async (req, res) => {
  try {
    const {
      expoId,
      title,
      description,
      speaker,
      speakerBio,
      startTime,
      endTime,
      location,
      maxAttendees,
      category
    } = req.body;

    const expo = await Expo.findById(expoId);
    if (!expo) {
      return res.status(404).json({ message: 'Expo not found' });
    }

    const session = await Session.create({
      expoId,
      title,
      description,
      speaker,
      speakerBio,
      startTime,
      endTime,
      location,
      maxAttendees,
      category
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private/Admin
const updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private/Admin
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.deleteOne();
    res.json({ message: 'Session removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for session
// @route   POST /api/sessions/:id/register
// @access  Private
const registerForSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if already registered
    if (session.registeredAttendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this session' });
    }

    // Check if session is full
    if (session.registeredAttendees.length >= session.maxAttendees) {
      return res.status(400).json({ message: 'Session is full' });
    }

    session.registeredAttendees.push(req.user._id);
    await session.save();

    res.json({ message: 'Successfully registered for session' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unregister from session
// @route   DELETE /api/sessions/:id/unregister
// @access  Private
const unregisterFromSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.registeredAttendees = session.registeredAttendees.filter(
      attendee => attendee.toString() !== req.user._id.toString()
    );

    await session.save();
    res.json({ message: 'Unregistered from session' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's registered sessions
// @route   GET /api/sessions/my-sessions
// @access  Private
const getMyRegisteredSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ registeredAttendees: req.user._id })
      .populate('expoId', 'title location')
      .sort('startTime');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CRITICAL: Make sure ALL functions are exported
module.exports = {
  getSessionsByExpo,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  registerForSession,
  unregisterFromSession,
  getMyRegisteredSessions
};