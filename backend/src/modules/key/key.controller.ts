import type { Request, Response } from 'express';
import { requireAuthId } from '../../shared/http/require-auth-id.js';
import {
  addKey as addKeyService,
  deleteKey as deleteKeyService,
  fetchKey as fetchKeyService,
  getKeysDetails as getKeysDetailsService,
  searchKeys as searchKeysService,
  updateKey as updateKeyService,
} from './key.service.js';

export async function getKeysDetails(req: Request, res: Response) {
  const authId = requireAuthId(req);
  const result = await getKeysDetailsService(authId, req.query.cursor as string | undefined);
  return res.status(200).json(result);
}

export async function searchKeys(req: Request, res: Response) {
  const authId = requireAuthId(req);
  const result = await searchKeysService(
    authId,
    (req.query.q as string | undefined) ?? '',
    req.query.cursor as string | undefined,
  );
  return res.status(200).json(result);
}

export async function fetchKey(req: Request, res: Response) {
  const authId = requireAuthId(req);
  const result = await fetchKeyService(authId, req.params.id);
  return res.status(200).json(result);
}

export async function addKey(req: Request, res: Response) {
  const authId = requireAuthId(req);
  const result = await addKeyService(authId, req.body);
  return res.status(201).json(result);
}

export async function updateKey(req: Request, res: Response) {
  const authId = requireAuthId(req);
  const result = await updateKeyService(authId, req.params.id, req.body);
  return res.status(200).json(result);
}

export async function deleteKey(req: Request, res: Response) {
  const authId = requireAuthId(req);
  await deleteKeyService(authId, req.params.id);
  return res.sendStatus(204);
}
