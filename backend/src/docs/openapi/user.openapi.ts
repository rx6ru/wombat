import { z } from 'zod';
import { openApiRegistry } from './registry.js';
import {
  AuthErrorSchema,
  BasicErrorSchema,
  UpdateUserInfoRequestSchema,
  UpdateUserInfoResponseSchema,
  UserInfoResponseSchema,
  ValidationErrorSchema,
} from './schemas.js';

openApiRegistry.registerPath({
  method: 'get',
  path: '/api/v1/user/info/getUserInfo',
  tags: ['User'],
  summary: 'Get current user profile info',
  description: 'Returns username information for the authenticated user. If the local profile does not exist yet, the backend creates it during this request.',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Current username information for the authenticated user.',
      content: {
        'application/json': {
          schema: UserInfoResponseSchema,
        },
      },
    },
    401: {
      description: 'Missing, invalid, or expired bearer token.',
      content: {
        'application/json': {
          schema: AuthErrorSchema,
        },
      },
    },
    500: {
      description: 'Unexpected server error.',
      content: {
        'application/json': {
          schema: BasicErrorSchema,
        },
      },
    },
  },
});

openApiRegistry.registerPath({
  method: 'put',
  path: '/api/v1/user/info/updateUserInfo',
  tags: ['User'],
  summary: 'Update current username',
  description: 'Updates the stored username for the authenticated user.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateUserInfoRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Username updated successfully.',
      content: {
        'application/json': {
          schema: UpdateUserInfoResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid username payload.',
      content: {
        'application/json': {
          schema: ValidationErrorSchema,
        },
      },
    },
    401: {
      description: 'Missing, invalid, or expired bearer token.',
      content: {
        'application/json': {
          schema: AuthErrorSchema,
        },
      },
    },
    404: {
      description: 'Local profile was not found.',
      content: {
        'application/json': {
          schema: z.object({ error: z.literal('Profile not found') }),
        },
      },
    },
    500: {
      description: 'Unexpected server error.',
      content: {
        'application/json': {
          schema: BasicErrorSchema,
        },
      },
    },
  },
});
