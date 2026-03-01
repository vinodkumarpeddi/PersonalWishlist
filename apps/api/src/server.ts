import { app } from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';

async function bootstrap() {
  // Connect to MongoDB
  await connectDatabase();

  // Start server
  app.listen(env.port, () => {
    logger.info(`🚀 WishPal API running on port ${env.port} [${env.nodeEnv}]`);
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
