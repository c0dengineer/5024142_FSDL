const express = require('express');
const router = express.Router();
const {
  createRating,
  getUserRatings,
  getMyRatings,
} = require('../controllers/ratingController');
const { authMiddleware } = require('../middleware/auth');

// Public route
router.get('/user/:userId', getUserRatings);

// Protected routes
router.post('/', authMiddleware, createRating);
router.get('/my', authMiddleware, getMyRatings);

module.exports = router;
