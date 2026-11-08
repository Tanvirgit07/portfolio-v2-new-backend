import { app } from '../src/app.js';
import { connectDatabase } from '../src/core/config/database.js';
import logger from '../src/core/config/logger.js';

let isConnected = false;

// Vercel invokes this handler for every request.
export default async function handler(req, res) {
  try {
    if (!isConnected) {
      await connectDatabase();
      isConnected = true;
    }

    return new Promise((resolve, reject) => {
      res.on("finish", resolve);
      res.on("close", resolve);
      res.on("error", reject);
      app(req, res);
    });
  } catch (error) {
    logger.error("Serverless function initialization failed", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: error.message || "Server initialization failed.",
    });
  }
}
