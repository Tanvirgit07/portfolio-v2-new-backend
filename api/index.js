import { app } from '../src/app.js';
import { connectDatabase } from '../src/core/config/database.js';
import logger from '../src/core/config/logger.js';

// Vercel invokes this handler for every request. Do not call app.listen() here.
export default async function handler(req, res) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    logger.error('Serverless function initialization failed', {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: 'Server initialization failed. Check the Vercel function logs.',
    });
  }
}
