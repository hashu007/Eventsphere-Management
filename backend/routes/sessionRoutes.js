const express = require('express');
const router = express.Router();
const {
  getSessionsByExpo,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  registerForSession,
  unregisterFromSession,
  getMyRegisteredSessions
} = require('../controllers/sessionController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, createSession);
router.get('/expo/:expoId', getSessionsByExpo);
router.get('/my-sessions', protect, getMyRegisteredSessions);
router.get('/:id', getSessionById);
router.put('/:id', protect, admin, updateSession);
router.delete('/:id', protect, admin, deleteSession);
router.post('/:id/register', protect, registerForSession);
router.delete('/:id/unregister', protect, unregisterFromSession);

module.exports = router;