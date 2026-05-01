import { z } from 'zod';
import { openApiRegistry } from './registry.js';
import {
  AuthErrorSchema,
  BasicErrorSchema,
  CreateApiKeyRequestSchema,
  FetchKeyResponseSchema,
  PaginatedApiKeyListSchema,
  RateLimitErrorSchema,
  UpdateApiKeyRequestSchema,
  ValidationErrorSchema,
  ApiKeyMetadataSchema,
} from './schemas.js';

const keyIdParamsSchema = z.object({
  id: z.string().meta({ description: 'API key record id', example: 'uuid' }),
});

const keySearchQuerySchema = z.object({
  q: z.string().meta({ description: 'Search term used across name, service, and description.', example: 'openai' }),
  cursor: z.string().optional().meta({ description: 'Cursor for paginated reads.', example: 'uuid' }),
});

const cursorQuerySchema = z.object({
  cursor: z.string().optional().meta({ description: 'Cursor for paginated reads.', example: 'uuid' }),
});

const keyNotFoundSchema = z.object({ error: z.literal('Key not found') });
const missingKeyIdSchema = z.object({ error: z.literal('Missing key id') });
const missingSearchQuerySchema = z.object({ error: z.literal('Missing search query') });
const noUpdateFieldsSchema = z.object({ error: z.literal('No update fields provided') });

openApiRegistry.registerPath({
  method: 'get',
  path: '/api/v1/key/keys',
  tags: ['API Keys'],
  summary: 'List stored API keys',
  description: 'Returns paginated API key metadata for the authenticated user. Plaintext secret values are never returned by this endpoint.',
  security: [{ bearerAuth: [] }],
  request: {
    query: cursorQuerySchema,
  },
  responses: {
    200: {
      description: 'Paginated API key metadata list.',
      headers: {
        'X-RateLimit-Limit': { schema: { type: 'string' }, description: 'Configured limit for the current window.' },
        'X-RateLimit-Remaining': { schema: { type: 'string' }, description: 'Remaining requests in the current window.' },
        'X-RateLimit-Reset': { schema: { type: 'string' }, description: 'Rate limit reset timestamp returned by Upstash.' },
      },
      content: {
        'application/json': {
          schema: PaginatedApiKeyListSchema,
        },
      },
    },
    400: {
      description: 'Invalid cursor query parameter.',
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
    429: {
      description: 'Too many requests for this endpoint.',
      content: {
        'application/json': {
          schema: RateLimitErrorSchema,
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
  method: 'get',
  path: '/api/v1/key/keys/search',
  tags: ['API Keys'],
  summary: 'Search stored API keys',
  description: 'Searches the authenticated user\'s API key metadata by name, service, or description.',
  security: [{ bearerAuth: [] }],
  request: {
    query: keySearchQuerySchema,
  },
  responses: {
    200: {
      description: 'Paginated API key metadata list filtered by the search term.',
      content: {
        'application/json': {
          schema: PaginatedApiKeyListSchema,
        },
      },
    },
    400: {
      description: 'Missing search query or invalid cursor.',
      content: {
        'application/json': {
          schema: z.union([ValidationErrorSchema, missingSearchQuerySchema]),
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
  method: 'get',
  path: '/api/v1/key/key/{id}',
  tags: ['API Keys'],
  summary: 'Fetch plaintext API key value',
  description: 'Returns the decrypted plaintext secret value for a stored API key record owned by the authenticated user.',
  security: [{ bearerAuth: [] }],
  request: {
    params: keyIdParamsSchema,
  },
  responses: {
    200: {
      description: 'Plaintext API key value.',
      headers: {
        'X-RateLimit-Limit': { schema: { type: 'string' }, description: 'Configured limit for the current window.' },
        'X-RateLimit-Remaining': { schema: { type: 'string' }, description: 'Remaining requests in the current window.' },
        'X-RateLimit-Reset': { schema: { type: 'string' }, description: 'Rate limit reset timestamp returned by Upstash.' },
      },
      content: {
        'application/json': {
          schema: FetchKeyResponseSchema,
        },
      },
    },
    400: {
      description: 'Missing key id.',
      content: {
        'application/json': {
          schema: missingKeyIdSchema,
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
      description: 'Key not found or not owned by the caller.',
      content: {
        'application/json': {
          schema: keyNotFoundSchema,
        },
      },
    },
    429: {
      description: 'Too many requests for this endpoint.',
      content: {
        'application/json': {
          schema: RateLimitErrorSchema,
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
  method: 'post',
  path: '/api/v1/key/key',
  tags: ['API Keys'],
  summary: 'Create stored API key record',
  description: 'Validates and stores a new API key record for the authenticated user. The plaintext secret is encrypted before persistence.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateApiKeyRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Created API key metadata record.',
      content: {
        'application/json': {
          schema: ApiKeyMetadataSchema,
        },
      },
    },
    400: {
      description: 'Validation failure for the create payload.',
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
      description: 'Profile not found for the authenticated user.',
      content: {
        'application/json': {
          schema: z.object({ error: z.literal('Profile not found for this user') }),
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
  path: '/api/v1/key/key/{id}',
  tags: ['API Keys'],
  summary: 'Update stored API key record',
  description: 'Partially updates an existing stored API key record owned by the authenticated user.',
  security: [{ bearerAuth: [] }],
  request: {
    params: keyIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateApiKeyRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Updated API key metadata record.',
      content: {
        'application/json': {
          schema: ApiKeyMetadataSchema,
        },
      },
    },
    400: {
      description: 'Validation failure, missing key id, or empty update payload.',
      content: {
        'application/json': {
          schema: z.union([ValidationErrorSchema, missingKeyIdSchema, noUpdateFieldsSchema]),
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
      description: 'Key not found or not owned by the caller.',
      content: {
        'application/json': {
          schema: keyNotFoundSchema,
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
  method: 'delete',
  path: '/api/v1/key/key/{id}',
  tags: ['API Keys'],
  summary: 'Delete stored API key record',
  description: 'Deletes an API key record owned by the authenticated user.',
  security: [{ bearerAuth: [] }],
  request: {
    params: keyIdParamsSchema,
  },
  responses: {
    204: {
      description: 'API key record deleted successfully.',
    },
    400: {
      description: 'Missing key id.',
      content: {
        'application/json': {
          schema: missingKeyIdSchema,
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
      description: 'Key not found or not owned by the caller.',
      content: {
        'application/json': {
          schema: keyNotFoundSchema,
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
