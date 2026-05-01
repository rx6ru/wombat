import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import './components.js';
import './user.openapi.js';
import './key.openapi.js';
import { openApiRegistry } from './registry.js';

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(openApiRegistry.definitions);
  const port = process.env.PORT ?? '3000';

  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Wombat Backend API',
      version: '1.0.0',
      description:
        'Interactive OpenAPI contract for the currently implemented Wombat backend API. This covers the active /api/v1 user and API key endpoints.',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Relative v1 API base path',
      },
      {
        url: `http://localhost:${port}/api/v1`,
        description: 'Local development server',
      },
    ],
    tags: [
      { name: 'User', description: 'Authenticated user profile bootstrap and username management.' },
      { name: 'API Keys', description: 'Authenticated API key storage, search, retrieval, update, and deletion.' },
    ],
  });
}
