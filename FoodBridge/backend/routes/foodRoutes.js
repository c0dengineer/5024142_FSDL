const express = require('express');
const router = express.Router();
const {
  createFood,
  getAllFood,
  getFoodById,
  updateFood,
  deleteFood,
  getMyListings,
  updateFoodStatus,
} = require('../controllers/foodController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Public routes
router.get('/', getAllFood);
router.get('/:id', getFoodById);

// Protected routes (donor only)
router.post('/', authMiddleware, roleMiddleware(['donor']), createFood);
router.put('/:id', authMiddleware, roleMiddleware(['donor']), updateFood);
router.delete('/:id', authMiddleware, roleMiddleware(['donor']), deleteFood);
router.get('/donor/my-listings', authMiddleware, roleMiddleware(['donor']), getMyListings);
router.patch('/:id/status', authMiddleware, roleMiddleware(['donor']), updateFoodStatus);

module.exports = router;
