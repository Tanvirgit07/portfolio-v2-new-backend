import logger from './src/core/config/logger.js'; 
import { app } from './src/app.js'; 
import { port } from './src/core/config/config.js';
import { connectDatabase } from './src/core/config/database.js';

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error('Server startup failed', { message: err.message, stack: err.stack });
    process.exitCode = 1;
  });
