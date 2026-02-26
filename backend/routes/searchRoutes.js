const express = require('express');
const router = express.Router();
const {
  searchExpos,
  searchExhibitors,
  searchSessions,
  getFilterOptions
} = require('../controllers/searchController');

router.get('/expos', searchExpos);
router.get('/exhibitors', searchExhibitors);
router.get('/sessions', searchSessions);
router.get('/filters', getFilterOptions);

module.exports = router;