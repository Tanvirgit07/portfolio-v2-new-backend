import winston from 'winston';

const transports = [new winston.transports.Console()];

// Vercel's deployed filesystem is read-only. Its runtime captures stdout,
// so only use a file transport during local development.
if (!process.env.VERCEL) {
  transports.push(new winston.transports.File({ filename: 'logs/app.log' }));
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Dhaka' 
      })
    }),
    winston.format.json()
  ),
  transports
});

export default logger;
