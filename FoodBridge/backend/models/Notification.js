const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: {
        values: [
          'food_requested',
          'request_accepted',
          'request_rejected',
          'food_expiring_soon',
          'new_food_nearby',
          'request_completed',
        ],
        message: 'Invalid notification type',
      },
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedFood: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodListing',
      default: null,
    },
    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      default: null,
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
