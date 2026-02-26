const express = require('express');
const router = express.Router();
const { 
  getExpos, 
  getExpoById, 
  createExpo, 
  updateExpo, 
  deleteExpo 
} = require('../controllers/expoController');
const { protect, admin } = require('../middleware/auth'); // Make sure it's auth, not authMiddleware

router.route('/')
  .get(getExpos)
  .post(protect, admin, createExpo);

router.route('/:id')
  .get(getExpoById)
  .put(protect, admin, updateExpo)
  .delete(protect, admin, deleteExpo);

module.exports = router;