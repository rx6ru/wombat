import { z } from 'zod';
import { UpdateUserSchema } from '../../modules/user/user.schemas.js';

export const AuthErrorSchema = z.object({
  error: z.string().meta({ example: 'Unauthorized' }),
  details: z.string().optional().meta({ example: 'jwt expired' }),
  code: z.string().optional().meta({ example: 'TOKEN_EXPIRED' }),
}).meta({ id: 'AuthError' });

export const BasicErrorSchema = z.object({
  error: z.string().meta({ example: 'Server error' }),
  details: z.string().optional().meta({ example: 'Unexpected internal error' }),
}).meta({ id: 'BasicError' });

export const RateLimitErrorSchema = z.object({
  error: z.string().meta({ example: 'Too many requests. Please wait before trying again.' }),
}).meta({ id: 'RateLimitError' });

export const UserInfoResponseSchema = z.object({
  namePresent: z.boolean().meta({ example: true }),
  username: z.string().meta({ example: 'existing-username' }),
}).meta({ id: 'UserInfoResponse' });

export const UpdateUserInfoRequestSchema = UpdateUserSchema.meta({ id: 'UpdateUserInfoRequest' });

export const UpdatedProfileSchema = z.object({
  id: z.string().meta({ example: 'uuid' }),
  username: z.string().meta({ example: 'new-username' }),
  email: z.string().meta({ example: 'user@example.com' }),
  updatedAt: z.string().meta({ example: '2026-05-01T00:00:00.000Z' }),
}).meta({ id: 'UpdatedProfile' });

export const UpdateUserInfoResponseSchema = z.object({
  message: z.string().meta({ example: 'Profile updated successfully' }),
  profile: UpdatedProfileSchema,
}).meta({ id: 'UpdateUserInfoResponse' });

export const ApiKeyMetadataSchema = z.object({
  id: z.string().meta({ example: 'uuid' }),
  name: z.string().meta({ example: 'OpenAI prod' }),
  service: z.string().nullable().optional().meta({ example: 'openai' }),
  reqSample: z.any().nullable().optional().meta({ example: { model: 'gpt-4.1' } }),
  resSample: z.any().nullable().optional().meta({ example: { ok: true } }),
  description: z.string().nullable().optional().meta({ example: 'Production usage' }),
  isActive: z.boolean().meta({ example: true }),
  createdAt: z.string().meta({ example: '2026-05-01T00:00:00.000Z' }),
  updatedAt: z.string().meta({ example: '2026-05-01T00:00:00.000Z' }),
}).meta({ id: 'ApiKeyMetadata' });

export const PaginatedApiKeyListSchema = z.object({
  data: z.array(ApiKeyMetadataSchema),
  nextCursor: z.string().nullable().meta({ example: 'uuid-or-null' }),
  hasMore: z.boolean().meta({ example: false }),
}).meta({ id: 'PaginatedApiKeyList' });

export const FetchKeyResponseSchema = z.object({
  key: z.string().meta({ example: 'sk-live-plaintext-secret' }),
}).meta({ id: 'FetchKeyResponse' });

export const CreateApiKeyRequestSchema = z.object({
  name: z.string().min(1).max(100).meta({ example: 'OpenAI prod' }),
  service: z.string().max(50).optional().meta({ example: 'openai' }),
  key: z.string().min(1).max(500).meta({ example: 'sk-live-plaintext-secret' }),
  reqSample: z.any().optional().meta({ example: { model: 'gpt-4.1' } }),
  resSample: z.any().optional().meta({ example: { ok: true } }),
  description: z.string().max(500).optional().meta({ example: 'Production usage' }),
  isActive: z.boolean().default(true).meta({ example: true }),
}).meta({ id: 'CreateApiKeyRequest' });

export const UpdateApiKeyRequestSchema = z.object({
  name: z.string().min(1).max(100).optional().meta({ example: 'OpenAI prod' }),
  service: z.string().max(50).optional().meta({ example: 'openai' }),
  key: z.string().min(1).max(500).optional().meta({ example: 'sk-live-plaintext-secret' }),
  reqSample: z.any().optional().meta({ example: { model: 'gpt-4.1' } }),
  resSample: z.any().optional().meta({ example: { ok: true } }),
  description: z.string().max(500).optional().meta({ example: 'Production usage' }),
  isActive: z.boolean().optional().meta({ example: true }),
}).meta({ id: 'UpdateApiKeyRequest' });

export const ValidationErrorSchema = z.object({
  error: z.string().meta({ example: 'Validation failed' }),
  details: z.record(z.string(), z.any()).optional(),
}).meta({ id: 'ValidationError' });
