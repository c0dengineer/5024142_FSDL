const express = require('express');
const router = express.Router();
const {
  getGlobalStats,
  getLeaderboard,
  getDashboardStats,
} = require('../controllers/statsController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.get('/global', getGlobalStats);
router.get('/leaderboard', getLeaderboard);

// Protected routes
router.get('/dashboard', authMiddleware, getDashboardStats);

module.exports = router;
