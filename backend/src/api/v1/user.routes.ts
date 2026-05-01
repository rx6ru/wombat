import { Router } from 'express';
import { getUserInfo, updateUserInfo } from '../../modules/user/user.controller.js';
import { asyncHandler } from '../../shared/http/async-handler.js';

const router = Router();

router.get('/info/getUserInfo', asyncHandler(getUserInfo));
router.put('/info/updateUserInfo', asyncHandler(updateUserInfo));

export default router;
