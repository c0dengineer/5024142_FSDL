const mongoose = require('mongoose');

const foodListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [0.1, 'Quantity must be greater than 0'],
    },
    quantityUnit: {
      type: String,
      enum: {
        values: ['kg', 'plates', 'boxes', 'litres', 'pieces'],
        message: 'Unit must be kg, plates, boxes, litres, or pieces',
      },
      default: 'plates',
    },
    category: {
      type: String,
      enum: {
        values: ['cooked', 'raw', 'packaged', 'beverage', 'other'],
        message: 'Category must be cooked, raw, packaged, beverage, or other',
      },
      default: 'cooked',
    },
    images: {
      type: [String],
      default: [],
    },
    city: {
      type: String,
      required: [true, 'Please provide a city'],
      trim: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Please provide expiry time'],
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'requested', 'claimed', 'expired'],
        message: 'Status must be available, requested, claimed, or expired',
      },
      default: 'available',
    },
    tags: {
      type: [String],
      enum: ['veg', 'non-veg', 'gluten-free', 'vegan', 'dairy-free', 'nut-free'],
      default: [],
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
foodListingSchema.index({ status: 1, expiresAt: 1 });
foodListingSchema.index({ city: 1, status: 1 });
foodListingSchema.index({ donor: 1, status: 1 });

module.exports = mongoose.model('FoodListing', foodListingSchema);
