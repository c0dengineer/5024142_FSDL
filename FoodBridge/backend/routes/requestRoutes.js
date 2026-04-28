const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequestStatus,
  completeRequest,
} = require('../controllers/requestController');
const { authMiddleware } = require('../middleware/auth');

// All request routes require authentication
router.post('/', authMiddleware, createRequest);
router.get('/my', authMiddleware, getMyRequests);
router.get('/received', authMiddleware, getReceivedRequests);
router.patch('/:id/status', authMiddleware, updateRequestStatus);
router.patch('/:id/complete', authMiddleware, completeRequest);

module.exports = router;
