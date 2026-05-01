import { Router } from 'express';
import userRoutes from './user.routes.js';
import keyRoutes from './key.routes.js';

export const API_V1_ROUTE_MOUNTS = [
  { basePath: '/user', router: 'userRoutes' },
  { basePath: '/key', router: 'keyRoutes' },
] as const;

const router = Router();

router.use('/user', userRoutes);
router.use('/key', keyRoutes);

export default router;
