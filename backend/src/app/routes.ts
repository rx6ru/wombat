import { Router } from 'express';
import apiV1Routes from '../api/v1/index.js';
import { protectRoute } from '../middleware/auth.middleware.js';

export const APP_ROUTE_MOUNTS = [
  { basePath: '/api/v1', middleware: ['protectRoute'], router: 'apiV1Routes' },
] as const;

const router = Router();

router.use('/api/v1', protectRoute, apiV1Routes);

export default router;
