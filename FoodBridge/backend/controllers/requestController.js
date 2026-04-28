const asyncHandler = require('express-async-handler');
const Request = require('../models/Request');
const FoodListing = require('../models/FoodListing');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @route   POST /api/requests
// @desc    Create a request to claim food (receiver only)
// @access  Private
exports.createRequest = asyncHandler(async (req, res) => {
  const { foodId, message } = req.body;

  if (!foodId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide food ID',
    });
  }

  const food = await FoodListing.findById(foodId);

  if (!food) {
    return res.status(404).json({
      success: false,
      message: 'Food listing not found',
    });
  }

  if (food.status !== 'available') {
    return res.status(400).json({
      success: false,
      message: 'This food is no longer available',
    });
  }

  if (food.donor.toString() === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot request your own food',
    });
  }

  // Check if already requested by this user
  const existingRequest = await Request.findOne({
    food: foodId,
    receiver: req.user.id,
    status: { $in: ['pending', 'accepted'] },
  });

  if (existingRequest) {
    return res.status(400).json({
      success: false,
      message: 'You have already requested this food',
    });
  }

  // Create request
  const request = await Request.create({
    food: foodId,
    receiver: req.user.id,
    donor: food.donor,
    message: message || '',
  });

  // Update food status to requested
  await FoodListing.findByIdAndUpdate(foodId, { status: 'requested' });

  // Populate request
  await request.populate('receiver', 'name avatar city phone');
  await request.populate('donor', 'name email');
  await request.populate('food', 'title quantity quantityUnit');

  // Send notification to donor
  const receiver = await User.findById(req.user.id);
  await Notification.create({
    recipient: food.donor,
    type: 'food_requested',
    message: `${receiver.name} has requested your ${food.title}`,
    relatedFood: foodId,
    relatedRequest: request._id,
    relatedUser: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: 'Request created successfully',
    data: request,
  });
});

// @route   GET /api/requests/my
// @desc    Get receiver's own requests
// @access  Private
exports.getMyRequests = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 12 } = req.query;

  let filter = { receiver: req.user.id };

  if (status) {
    filter.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const requests = await Request.find(filter)
    .populate('food', 'title quantity quantityUnit category expiresAt status')
    .populate('donor', 'name avatar city averageRating phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Request.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: requests,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
    },
  });
});

// @route   GET /api/requests/received
// @desc    Get requests received on donor's food
// @access  Private
exports.getReceivedRequests = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 12 } = req.query;

  let filter = { donor: req.user.id };

  if (status) {
    filter.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const requests = await Request.find(filter)
    .populate('receiver', 'name avatar city phone bio')
    .populate('food', 'title quantity quantityUnit category expiresAt')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Request.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: requests,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
    },
  });
});

// @route   PATCH /api/requests/:id/status
// @desc    Update request status (accept/reject/cancel)
// @access  Private
exports.updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Please provide status',
    });
  }

  let request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Request not found',
    });
  }

  // Authorization checks
  if (status === 'accepted' || status === 'rejected') {
    // Only donor can accept/reject
    if (request.donor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the donor can accept or reject requests',
      });
    }

    if (status === 'accepted') {
      request.status = 'accepted';
      request.acceptedAt = new Date();

      // Update food status
      await FoodListing.findByIdAndUpdate(request.food, {
        status: 'claimed',
        claimedBy: request.receiver,
      });

      // Notify receiver
      const food = await FoodListing.findById(request.food);
      await Notification.create({
        recipient: request.receiver,
        type: 'request_accepted',
        message: `Your request for ${food.title} has been accepted!`,
        relatedFood: request.food,
        relatedRequest: request._id,
        relatedUser: request.donor,
      });
    } else if (status === 'rejected') {
      request.status = 'rejected';

      // Check if there are other pending requests
      const otherRequests = await Request.findOne({
        food: request.food,
        _id: { $ne: request._id },
        status: 'pending',
      });

      // If no other pending requests, mark food as available again
      if (!otherRequests) {
        await FoodListing.findByIdAndUpdate(request.food, {
          status: 'available',
        });
      }

      // Notify receiver
      const food = await FoodListing.findById(request.food);
      await Notification.create({
        recipient: request.receiver,
        type: 'request_rejected',
        message: `Your request for ${food.title} has been rejected`,
        relatedFood: request.food,
        relatedRequest: request._id,
        relatedUser: request.donor,
      });
    }
  } else if (status === 'cancelled') {
    // Only receiver can cancel
    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the receiver can cancel the request',
      });
    }

    request.status = 'cancelled';

    // Check if there are other pending requests
    const otherRequests = await Request.findOne({
      food: request.food,
      _id: { $ne: request._id },
      status: 'pending',
    });

    // If no other pending requests, mark food as available again
    if (!otherRequests) {
      await FoodListing.findByIdAndUpdate(request.food, {
        status: 'available',
      });
    }
  }

  await request.save();
  await request.populate('receiver', 'name avatar');
  await request.populate('donor', 'name avatar');
  await request.populate('food', 'title');

  res.status(200).json({
    success: true,
    message: `Request ${status} successfully`,
    data: request,
  });
});

// @route   PATCH /api/requests/:id/complete
// @desc    Mark request as completed (donor marks pickup)
// @access  Private
exports.completeRequest = asyncHandler(async (req, res) => {
  let request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json({
      success: false,
      message: 'Request not found',
    });
  }

  // Only donor can mark as complete
  if (request.donor.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Only the donor can mark as complete',
    });
  }

  if (request.status !== 'accepted') {
    return res.status(400).json({
      success: false,
      message: 'Only accepted requests can be marked as complete',
    });
  }

  request.status = 'completed';
  request.completedAt = new Date();
  await request.save();

  // Update user stats
  const donor = await User.findById(request.donor);
  const food = await FoodListing.findById(request.food);
  donor.totalDonations += food.quantity;
  await donor.save();

  const receiver = await User.findById(request.receiver);
  receiver.totalReceived += food.quantity;
  await receiver.save();

  // Notify receiver
  await Notification.create({
    recipient: request.receiver,
    type: 'request_completed',
    message: `Your food request has been marked as completed. Please rate this experience!`,
    relatedFood: request.food,
    relatedRequest: request._id,
    relatedUser: request.donor,
  });

  await request.populate('receiver', 'name avatar');
  await request.populate('donor', 'name avatar');
  await request.populate('food', 'title');

  res.status(200).json({
    success: true,
    message: 'Request marked as completed',
    data: request,
  });
});
