import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import connectDatabase, { isDatabaseConnected } from './config/database';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration - supports multiple origins from environment
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  // Development origins
  'http://localhost:3000', // Frontend (Next.js)
  'http://localhost:3001',
  'http://localhost:5173', // Admin Dashboard (Vite)
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In production, be strict; in development, allow all
      if (process.env.NODE_ENV === 'production') {
        callback(new Error('Not allowed by CORS'));
      } else {
        callback(null, true);
      }
    }
  },
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  const dbConnected = isDatabaseConnected();
  res.status(dbConnected ? 200 : 503).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      connected: dbConnected,
      status: dbConnected ? 'healthy' : 'unavailable',
    },
  });
});

// Import routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import categoryRoutes from './routes/category.routes';
import chatbotRoutes from './routes/chatbot.routes';
import analyticsRoutes from './routes/analytics.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import uploadRoutes from './routes/upload.routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import { requireDatabase } from './middleware/db-check.middleware';

// API Routes
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'Tangerine Furniture API v1.0',
    endpoints: {
      auth: '/api/v1/auth',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      cart: '/api/v1/cart',
      orders: '/api/v1/orders',
      chatbot: '/api/v1/chatbot',
    },
  });
});

// Mount routes (with database check for data-dependent routes)
app.use('/api/v1/auth', requireDatabase, authRoutes);
app.use('/api/v1/products', requireDatabase, productRoutes);
app.use('/api/v1/categories', requireDatabase, categoryRoutes);
app.use('/api/v1/cart', requireDatabase, cartRoutes);
app.use('/api/v1/orders', requireDatabase, orderRoutes);
app.use('/api/v1/chatbot', requireDatabase, chatbotRoutes);
app.use('/api/v1/analytics', requireDatabase, analyticsRoutes);
app.use('/api/v1/users', requireDatabase, userRoutes);
app.use('/api/v1/admin', requireDatabase, adminRoutes);
app.use('/api/v1/upload', requireDatabase, uploadRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Start listening first (so health check works even without DB)
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API: http://localhost:${PORT}/api/v1`);
      logger.info(`🏥 Health: http://localhost:${PORT}/health`);
      logger.info(`✅ Server started successfully`);
    });

    // Connect to MongoDB (non-blocking)
    connectDatabase().catch((error) => {
      logger.error('MongoDB connection failed, but server will continue running:', error);
      logger.warn('⚠️ Database-dependent routes will return 503 errors');
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${PORT} is already in use`);
      } else {
        logger.error('Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

