import mongoose from 'mongoose';
import { logger } from '../utils/logger';

let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 3000; // 3 seconds

const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      logger.error('❌ MONGODB_URI is not defined in environment variables');
      logger.warn('⚠️ Server will start without database connection');
      return;
    }

    const options = {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 10000, // Increased to 10 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4, // Use IPv4
    };

    logger.info('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, options);

    isConnected = true;
    connectionAttempts = 0;
    logger.info('✅ MongoDB Atlas connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected. Will attempt to reconnect on next request...');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('✅ MongoDB reconnected successfully');
      isConnected = true;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed due to app termination');
      } catch (err) {
        logger.error('Error closing MongoDB connection:', err);
      } finally {
        process.exit(0);
      }
    });

  } catch (error: any) {
    connectionAttempts++;
    isConnected = false;

    logger.error(`❌ MongoDB connection failed (Attempt ${connectionAttempts}/${MAX_RETRIES}):`, error.message);

    if (connectionAttempts < MAX_RETRIES) {
      logger.info(`🔄 Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
      setTimeout(() => connectDatabase(), RETRY_DELAY);
    } else {
      logger.error('❌ Maximum connection attempts reached. Server will start without database.');
      logger.warn('⚠️ Database-dependent features will not be available.');
      logger.info('💡 Check your MongoDB Atlas connection string and network access.');
    }
  }
};

// Check if database is connected
export const isDatabaseConnected = (): boolean => {
  return isConnected && mongoose.connection.readyState === 1;
};

// Middleware to check database connection
export const checkDatabaseConnection = (req: any, res: any, next: any) => {
  if (!isDatabaseConnected()) {
    return res.status(503).json({
      success: false,
      error: 'Database temporarily unavailable. Please try again later.',
    });
  }
  next();
};

export default connectDatabase;

