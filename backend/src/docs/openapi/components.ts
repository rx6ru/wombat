import { openApiRegistry } from './registry.js';
import {
  ApiKeyMetadataSchema,
  AuthErrorSchema,
  BasicErrorSchema,
  CreateApiKeyRequestSchema,
  FetchKeyResponseSchema,
  PaginatedApiKeyListSchema,
  RateLimitErrorSchema,
  UpdateApiKeyRequestSchema,
  UpdateUserInfoRequestSchema,
  UpdateUserInfoResponseSchema,
  UserInfoResponseSchema,
  ValidationErrorSchema,
} from './schemas.js';

openApiRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Supabase access token provided as a Bearer token.',
});

openApiRegistry.register('AuthError', AuthErrorSchema);
openApiRegistry.register('BasicError', BasicErrorSchema);
openApiRegistry.register('ValidationError', ValidationErrorSchema);
openApiRegistry.register('RateLimitError', RateLimitErrorSchema);
openApiRegistry.register('UserInfoResponse', UserInfoResponseSchema);
openApiRegistry.register('UpdateUserInfoRequest', UpdateUserInfoRequestSchema);
openApiRegistry.register('UpdateUserInfoResponse', UpdateUserInfoResponseSchema);
openApiRegistry.register('ApiKeyMetadata', ApiKeyMetadataSchema);
openApiRegistry.register('PaginatedApiKeyList', PaginatedApiKeyListSchema);
openApiRegistry.register('FetchKeyResponse', FetchKeyResponseSchema);
openApiRegistry.register('CreateApiKeyRequest', CreateApiKeyRequestSchema);
openApiRegistry.register('UpdateApiKeyRequest', UpdateApiKeyRequestSchema);
