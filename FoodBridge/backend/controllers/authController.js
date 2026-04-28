const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, city, phone } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists',
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    city: city || '',
    phone: phone || '',
  });

  // Generate token
  const token = generateToken(user._id, user.role);

  // Return response
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        city: user.city,
      },
      token,
    },
  });
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  // Find user and select password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated',
    });
  }

  // Generate token
  const token = generateToken(user._id, user.role);

  // Return response
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        city: user.city,
        averageRating: user.averageRating,
        totalDonations: user.totalDonations,
        totalReceived: user.totalReceived,
      },
      token,
    },
  });
});

// @route   GET /api/auth/me
// @desc    Get current user (protected)
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      city: user.city,
      phone: user.phone,
      bio: user.bio,
      averageRating: user.averageRating,
      ratingCount: user.ratingCount,
      totalDonations: user.totalDonations,
      totalReceived: user.totalReceived,
      createdAt: user.createdAt,
    },
  });
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, city, phone, bio, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: name || undefined,
      city: city || undefined,
      phone: phone || undefined,
      bio: bio || undefined,
      avatar: avatar || undefined,
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      city: user.city,
      phone: user.phone,
      bio: user.bio,
    },
  });
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide old and new password',
    });
  }

  const user = await User.findById(req.user.id).select('+password');
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Old password is incorrect',
    });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});
