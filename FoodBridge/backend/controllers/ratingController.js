const asyncHandler = require('express-async-handler');
const Rating = require('../models/Rating');
const Request = require('../models/Request');
const User = require('../models/User');

// @route   POST /api/ratings
// @desc    Create a rating (receiver rates donor)
// @access  Private
exports.createRating = asyncHandler(async (req, res) => {
  const { requestId, score, comment } = req.body;

  if (!requestId || !score) {
    return res.status(400).json({
      success: false,
      message: 'Please provide request ID and score',
    });
  }

  if (score < 1 || score > 5) {
    return res.status(400).json({
      success: false,
      message: 'Score must be between 1 and 5',
    });
  }

  const request = await Request.findById(requestId);

  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Request not found',
    });
  }

  // Only receiver can rate
  if (request.receiver.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Only the receiver can rate this request',
    });
  }

  // Request must be completed
  if (request.status !== 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Request must be completed to add a rating',
    });
  }

  // Check if already rated
  const existingRating = await Rating.findOne({ request: requestId });
  if (existingRating) {
    return res.status(400).json({
      success: false,
      message: 'This request has already been rated',
    });
  }

  // Create rating
  const rating = await Rating.create({
    ratedBy: req.user.id,
    ratedUser: request.donor,
    food: request.food,
    request: requestId,
    score,
    comment: comment || '',
  });

  // Update user's average rating
  const allRatings = await Rating.find({ ratedUser: request.donor });
  const averageScore =
    allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length;

  await User.findByIdAndUpdate(request.donor, {
    averageRating: parseFloat(averageScore.toFixed(2)),
    ratingCount: allRatings.length,
  });

  await rating.populate('ratedBy', 'name avatar');
  await rating.populate('ratedUser', 'name avatar');

  res.status(201).json({
    success: true,
    message: 'Rating created successfully',
    data: rating,
  });
});

// @route   GET /api/ratings/user/:userId
// @desc    Get all ratings for a user
// @access  Public
exports.getUserRatings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const ratings = await Rating.find({ ratedUser: req.params.userId })
    .populate('ratedBy', 'name avatar city')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Rating.countDocuments({ ratedUser: req.params.userId });

  res.status(200).json({
    success: true,
    data: ratings,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
    },
  });
});

// @route   GET /api/ratings/my
// @desc    Get ratings I've given
// @access  Private
exports.getMyRatings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const ratings = await Rating.find({ ratedBy: req.user.id })
    .populate('ratedUser', 'name avatar')
    .populate('food', 'title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Rating.countDocuments({ ratedBy: req.user.id });

  res.status(200).json({
    success: true,
    data: ratings,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
    },
  });
});
