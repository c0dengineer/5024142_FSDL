const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodListing',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        message: 'Status must be pending, accepted, rejected, completed, or cancelled',
      },
      default: 'pending',
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
requestSchema.index({ receiver: 1, status: 1 });
requestSchema.index({ donor: 1, status: 1 });
requestSchema.index({ food: 1, status: 1 });

module.exports = mongoose.model('Request', requestSchema);
