const asyncHandler = require('express-async-handler');
const FoodListing = require('../models/FoodListing');
const Request = require('../models/Request');
const User = require('../models/User');

// @route   GET /api/stats/global
// @desc    Get global platform statistics
// @access  Public
exports.getGlobalStats = asyncHandler(async (req, res) => {
  const totalDonations = await FoodListing.aggregate([
    { $group: { _id: null, total: { $sum: '$quantity' } } },
  ]);

  const totalDonors = await User.countDocuments({ role: 'donor' });
  const totalReceivers = await User.countDocuments({ role: 'receiver' });

  const activeListings = await FoodListing.countDocuments({
    status: 'available',
  });

  const completedRequests = await Request.countDocuments({ status: 'completed' });

  const totalQuantityDonated = totalDonations[0]?.total || 0;
  const estimatedMealsSaved = Math.round(totalQuantityDonated * 4); // Assuming 1kg feeds 4 people
  const co2Saved = (totalQuantityDonated * 2.5).toFixed(2); // 1kg food waste = 2.5kg CO2

  res.status(200).json({
    success: true,
    data: {
      totalQuantityDonated: parseFloat(totalQuantityDonated.toFixed(2)),
      estimatedMealsSaved,
      totalDonors,
      totalReceivers,
      activeListings,
      completedRequests,
      co2SavedKg: parseFloat(co2Saved),
    },
  });
});

// @route   GET /api/stats/leaderboard
// @desc    Get leaderboard rankings
// @access  Public
exports.getLeaderboard = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;

  let dateFilter = {};
  const now = new Date();

  if (period === 'week') {
    dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === 'month') {
    dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === 'all-time') {
    dateFilter = null;
  }

  let foodQuery = { status: { $in: ['claimed', 'expired'] } };
  if (dateFilter) {
    foodQuery.createdAt = { $gte: dateFilter };
  }

  const foods = await FoodListing.find(foodQuery).populate('donor', '_id');

  // Group by donor and sum quantities
  const donorStats = {};

  for (const food of foods) {
    if (!donorStats[food.donor._id]) {
      donorStats[food.donor._id] = {
        totalQuantity: 0,
        totalListings: 0,
      };
    }
    donorStats[food.donor._id].totalQuantity += food.quantity;
    donorStats[food.donor._id].totalListings += 1;
  }

  // Get donor details with ratings
  const leaderboard = await Promise.all(
    Object.entries(donorStats).map(async ([userId, stats]) => {
      const user = await User.findById(userId);
      return {
        userId: user._id,
        name: user.name,
        avatar: user.avatar,
        city: user.city,
        totalQuantityDonated: stats.totalQuantity,
        totalListings: stats.totalListings,
        averageRating: user.averageRating,
        ratingCount: user.ratingCount,
        score: stats.totalQuantity * 2 + user.averageRating * 10 + stats.totalListings,
      };
    })
  );

  // Sort by score
  leaderboard.sort((a, b) => b.score - a.score);

  // Get top 3 donors
  const topDonors = leaderboard.slice(0, 10);

  // Get most active city
  const cityCounts = {};
  for (const food of foods) {
    cityCounts[food.city] = (cityCounts[food.city] || 0) + 1;
  }

  const mostActiveCity = Object.entries(cityCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  res.status(200).json({
    success: true,
    data: {
      topDonors,
      mostActiveCity: mostActiveCity ? mostActiveCity[0] : 'N/A',
      period,
    },
  });
});

// @route   GET /api/stats/dashboard
// @desc    Get dashboard statistics for logged-in user
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (user.role === 'donor') {
    // Donor stats
    const totalListings = await FoodListing.countDocuments({
      donor: req.user.id,
    });

    const activeListings = await FoodListing.countDocuments({
      donor: req.user.id,
      status: 'available',
    });

    const pendingRequests = await Request.countDocuments({
      donor: req.user.id,
      status: 'pending',
    });

    const completedRequests = await Request.countDocuments({
      donor: req.user.id,
      status: 'completed',
    });

    // Get food donations over last 30 days
    const thirtyDaysAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentFoods = await FoodListing.find({
      donor: req.user.id,
      createdAt: { $gte: thirtyDaysAgo },
    });

    const donationsByDay = {};
    recentFoods.forEach((food) => {
      const day = new Date(food.createdAt).toISOString().split('T')[0];
      if (!donationsByDay[day]) {
        donationsByDay[day] = 0;
      }
      donationsByDay[day] += food.quantity;
    });

    res.status(200).json({
      success: true,
      data: {
        role: 'donor',
        totalDonations: user.totalDonations,
        totalListings,
        activeListings,
        pendingRequests,
        completedRequests,
        averageRating: user.averageRating,
        donationsByDay,
        peopleFed: Math.round(user.totalDonations * 4), // Assuming 1kg feeds 4 people
      },
    });
  } else {
    // Receiver stats
    const totalRequests = await Request.countDocuments({
      receiver: req.user.id,
    });

    const acceptedRequests = await Request.countDocuments({
      receiver: req.user.id,
      status: 'accepted',
    });

    const completedRequests = await Request.countDocuments({
      receiver: req.user.id,
      status: 'completed',
    });

    const rejectedRequests = await Request.countDocuments({
      receiver: req.user.id,
      status: 'rejected',
    });

    // Get nearby available food
    const nearbyFood = await FoodListing.find({
      city: user.city,
      status: 'available',
      donor: { $ne: req.user.id },
    })
      .limit(5)
      .populate('donor', 'name avatar averageRating');

    res.status(200).json({
      success: true,
      data: {
        role: 'receiver',
        totalReceived: user.totalReceived,
        totalRequests,
        acceptedRequests,
        completedRequests,
        rejectedRequests,
        nearbyFood,
        foodSecuredThisMonth: user.totalReceived, // Can be enhanced with time-based filtering
      },
    });
  }
});
