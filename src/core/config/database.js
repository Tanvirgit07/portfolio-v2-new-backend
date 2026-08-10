import mongoose from 'mongoose';

import { mongoURI } from './config.js';
import logger from './logger.js';

let connectionPromise;

/**
 * Reuses the existing Mongoose connection when running in a serverless
 * environment, so a new database connection is not created per request.
 */
export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!mongoURI) {
    throw new Error('MONGO_URI is not configured. Add it in Vercel Environment Variables.');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(mongoURI, { serverSelectionTimeoutMS: 10000 })
      .then(() => {
        logger.info('MongoDB connected');
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        logger.error('MongoDB connection error', { message: error.message, stack: error.stack });
        throw error;
      });
  }

  return connectionPromise;
};
