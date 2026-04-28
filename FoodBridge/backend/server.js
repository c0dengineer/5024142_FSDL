const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const FoodListing = require('./models/FoodListing');
const Notification = require('./models/Notification');

// Import routes
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const requestRoutes = require('./routes/requestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://foodbridge.vercel.app', // Vercel deployment
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests, please try again later',
});
app.use(limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

// Mount routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/stats', statsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

// CRON JOBS
// Check for expired food listings every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  try {
    const now = new Date();

    // Find all expired food that is still available or requested
    const expiredFoods = await FoodListing.find({
      expiresAt: { $lt: now },
      status: { $in: ['available', 'requested'] },
    });

    if (expiredFoods.length > 0) {
      // Update all expired foods to status 'expired'
      await FoodListing.updateMany(
        {
          expiresAt: { $lt: now },
          status: { $in: ['available', 'requested'] },
        },
        { status: 'expired' }
      );

      console.log(`✅ Marked ${expiredFoods.length} listings as expired`);

      // Notify donors about expired food
      for (const food of expiredFoods) {
        await Notification.create({
          recipient: food.donor,
          type: 'food_expiring_soon',
          message: `Your food listing "${food.title}" has expired`,
          relatedFood: food._id,
        });
      }
    }
  } catch (error) {
    console.error('❌ Cron job error (expiry check):', error);
  }
});

// Check for food expiring soon (< 2 hours) every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  try {
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    // Find food expiring soon that we haven't notified about
    const expiringFood = await FoodListing.find({
      expiresAt: { $lt: twoHoursFromNow, $gte: now },
      status: 'available',
    });

    if (expiringFood.length > 0) {
      console.log(`⏰ Found ${expiringFood.length} foods expiring soon`);

      for (const food of expiringFood) {
        // Check if notification already exists
        const existingNotification = await Notification.findOne({
          recipient: food.donor,
          type: 'food_expiring_soon',
          relatedFood: food._id,
          createdAt: {
            $gte: new Date(now.getTime() - 60 * 60 * 1000), // Last hour
          },
        });

        if (!existingNotification) {
          await Notification.create({
            recipient: food.donor,
            type: 'food_expiring_soon',
            message: `Your food listing "${food.title}" is expiring soon!`,
            relatedFood: food._id,
          });
        }
      }
    }
  } catch (error) {
    console.error('❌ Cron job error (expiring soon check):', error);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 FoodBridge Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 MongoDB: Connected`);
  console.log(`⏰ Cron jobs: Initialized\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;
