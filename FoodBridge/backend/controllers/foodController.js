const asyncHandler = require('express-async-handler');
const FoodListing = require('../models/FoodListing');
const User = require('../models/User');
const Notification = require('../models/Notification');

// City coordinates mapping
const cityCoordinates = {
  'Delhi': { lat: 28.7041, lng: 77.1025 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
};

// Get coordinates for a city
const getCoordinates = (city) => {
  return cityCoordinates[city] || { lat: null, lng: null };
};

// @route   POST /api/food
// @desc    Create a new food listing (donor only)
// @access  Private
exports.createFood = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    quantity,
    quantityUnit,
    category,
    images,
    city,
    expiresAt,
    tags,
  } = req.body;

  // Validation
  if (!title || !description || !quantity || !category || !city || !expiresAt) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  // Check if expiry date is in the future
  if (new Date(expiresAt) <= new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Expiry date must be in the future',
    });
  }

  // Get coordinates
  const coords = getCoordinates(city);

  // Create food listing
  const food = await FoodListing.create({
    title,
    description,
    quantity,
    quantityUnit: quantityUnit || 'plates',
    category,
    images: images || [],
    city,
    latitude: coords.lat,
    longitude: coords.lng,
    expiresAt,
    tags: tags || [],
    donor: req.user.id,
  });

  // Populate donor info
  await food.populate('donor', 'name avatar city averageRating');

  res.status(201).json({
    success: true,
    message: 'Food listing created successfully',
    data: food,
  });
});

// @route   GET /api/food
// @desc    Get all food listings with filters and pagination
// @access  Public
exports.getAllFood = asyncHandler(async (req, res) => {
  const {
    city,
    category,
    tag,
    status,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  let filter = {};

  // Only show available listings unless specifically requested
  if (status) {
    filter.status = status;
  } else {
    filter.status = 'available';
  }

  if (city) {
    filter.city = city;
  }

  if (category) {
    filter.category = category;
  }

  if (tag) {
    filter.tags = tag;
  }

  // Sort logic
  let sortBy = { createdAt: -1 };
  if (sort === 'expiring-soon') {
    sortBy = { expiresAt: 1 };
  } else if (sort === 'most-views') {
    sortBy = { views: -1 };
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const foods = await FoodListing.find(filter)
    .populate('donor', 'name avatar city averageRating phone')
    .sort(sortBy)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await FoodListing.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: foods,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
      itemsPerPage: parseInt(limit),
    },
  });
});

// @route   GET /api/food/:id
// @desc    Get food listing by ID
// @access  Public
exports.getFoodById = asyncHandler(async (req, res) => {
  const food = await FoodListing.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('donor', 'name avatar city averageRating phone bio');

  if (!food) {
    return res.status(404).json({
      success: false,
      message: 'Food listing not found',
    });
  }

  res.status(200).json({
    success: true,
    data: food,
  });
});

// @route   PUT /api/food/:id
// @desc    Update food listing (donor only, own listing)
// @access  Private
exports.updateFood = asyncHandler(async (req, res) => {
  let food = await FoodListing.findById(req.params.id);

  if (!food) {
    return res.status(404).json({
      success: false,
      message: 'Food listing not found',
    });
  }

  // Check ownership
  if (food.donor.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only edit your own listings',
    });
  }

  const {
    title,
    description,
    quantity,
    quantityUnit,
    category,
    images,
    city,
    expiresAt,
    tags,
  } = req.body;

  if (title) food.title = title;
  if (description) food.description = description;
  if (quantity) food.quantity = quantity;
  if (quantityUnit) food.quantityUnit = quantityUnit;
  if (category) food.category = category;
  if (images) food.images = images;
  if (city) {
    food.city = city;
    const coords = getCoordinates(city);
    food.latitude = coords.lat;
    food.longitude = coords.lng;
  }
  if (expiresAt) food.expiresAt = expiresAt;
  if (tags) food.tags = tags;

  food.updatedAt = new Date();
  await food.save();

  await food.populate('donor', 'name avatar city averageRating');

  res.status(200).json({
    success: true,
    message: 'Food listing updated successfully',
    data: food,
  });
});

// @route   DELETE /api/food/:id
// @desc    Delete food listing (donor only, own listing)
// @access  Private
exports.deleteFood = asyncHandler(async (req, res) => {
  const food = await FoodListing.findById(req.params.id);

  if (!food) {
    return res.status(404).json({
      success: false,
      message: 'Food listing not found',
    });
  }

  // Check ownership
  if (food.donor.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only delete your own listings',
    });
  }

  await FoodListing.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Food listing deleted successfully',
  });
});

// @route   GET /api/food/donor/my-listings
// @desc    Get donor's own listings
// @access  Private
exports.getMyListings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 12 } = req.query;

  let filter = { donor: req.user.id };

  if (status) {
    filter.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const foods = await FoodListing.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await FoodListing.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: foods,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
    },
  });
});

// @route   PATCH /api/food/:id/status
// @desc    Update food listing status
// @access  Private
exports.updateFoodStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Please provide status',
    });
  }

  let food = await FoodListing.findById(req.params.id);

  if (!food) {
    return res.status(404).json({
      success: false,
      message: 'Food listing not found',
    });
  }

  // Check ownership
  if (food.donor.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own listings',
    });
  }

  food.status = status;
  food.updatedAt = new Date();
  await food.save();

  res.status(200).json({
    success: true,
    message: 'Food listing status updated successfully',
    data: food,
  });
});
