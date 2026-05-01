import type { Request, Response } from 'express';
import { requireAuthId } from '../../shared/http/require-auth-id.js';
import { getUserInfo as getUserInfoService, updateUserInfo as updateUserInfoService } from './user.service.js';

export async function getUserInfo(req: Request, res: Response) {
  const authId = requireAuthId(req);
  const result = await getUserInfoService(authId);
  return res.status(200).json(result);
}

export async function updateUserInfo(req: Request, res: Response) {
  const authId = requireAuthId(req);
  const result = await updateUserInfoService(authId, req.body);
  return res.status(200).json(result);
}
