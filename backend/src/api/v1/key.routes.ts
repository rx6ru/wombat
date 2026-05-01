import { Router } from 'express';
import {
  keyAddedLog,
  keyDeletedLog,
  keyOnlyFetchLog,
  keyUpdatedLog,
} from '../../middleware/key-logs.middleware.js';
import { createRateLimiter } from '../../middleware/rate-limit.middleware.js';
import { validateCursor } from '../../middleware/validate-cursor.middleware.js';
import {
  addKey,
  deleteKey,
  fetchKey,
  getKeysDetails,
  searchKeys,
  updateKey,
} from '../../modules/key/key.controller.js';
import { asyncHandler } from '../../shared/http/async-handler.js';

const router = Router();
const standardRL = createRateLimiter(10, '10 s');
const strictRL = createRateLimiter(3, '5 s');

router.get('/keys', standardRL, validateCursor, asyncHandler(getKeysDetails));
router.get('/keys/search', validateCursor, asyncHandler(searchKeys));
router.get('/key/:id', strictRL, keyOnlyFetchLog, asyncHandler(fetchKey));
router.post('/key', keyAddedLog, asyncHandler(addKey));
router.put('/key/:id', keyUpdatedLog, asyncHandler(updateKey));
router.delete('/key/:id', keyDeletedLog, asyncHandler(deleteKey));

export default router;
