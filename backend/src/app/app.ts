import cors from 'cors';
import express from 'express';
import swaggerRouter from '../docs/swagger/swagger-ui.js';
import { errorHandler, notFoundHandler } from '../middleware/error.middleware.js';
import appRoutes from './routes.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/docs', swaggerRouter);
  app.use(appRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
