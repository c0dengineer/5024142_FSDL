const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @route   GET /api/notifications
// @desc    Get user's notifications (paginated)
// @access  Private
exports.getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const notifications = await Notification.find({ recipient: req.user.id })
    .populate('relatedFood', 'title quantity city category')
    .populate('relatedUser', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Notification.countDocuments({ recipient: req.user.id });

  const unreadCount = await Notification.countDocuments({
    recipient: req.user.id,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    data: notifications,
    unreadCount,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
    },
  });
});

// @route   PATCH /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
});

// @route   PATCH /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
  });
});
