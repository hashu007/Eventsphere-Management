const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getExpoAnalytics,
  getUserGrowth
} = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/auth');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/expo/:id', protect, admin, getExpoAnalytics);
router.get('/user-growth', protect, admin, getUserGrowth);

module.exports = router;