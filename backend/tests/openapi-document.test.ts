import test from 'node:test';
import assert from 'node:assert/strict';

function setTestEnv() {
  process.env.PORT = '3000';
  process.env.NODE_ENV = 'test';
  process.env.SUPABASE_DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
  process.env.SUPABASE_DIRECT_URL = 'postgresql://user:pass@localhost:5432/db';
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SECRET_KEY = 'service-role-secret';
  process.env.SUPABASE_PUBLISHABLE_KEY = 'publishable-key';
  process.env.SUPABASE_JWKS_URL = 'https://example.supabase.co/auth/v1/.well-known/jwks.json';
  process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'token';
  process.env.KMS_PROVIDER = 'aws';
}

test('generates an OpenAPI document with the current v1 routes and bearer auth', async () => {
  setTestEnv();
  const { generateOpenApiDocument } = await import('../src/docs/openapi/index.js');
  const document = generateOpenApiDocument();
  const paths = document.paths;
  const bearerAuth = document.components?.securitySchemes?.bearerAuth;

  assert.ok(paths, 'OpenAPI document should include paths');
  assert.equal(document.openapi, '3.1.0');
  assert.equal(document.info.title, 'Wombat Backend API');
  assert.ok(paths['/api/v1/user/info/getUserInfo']);
  assert.ok(paths['/api/v1/user/info/updateUserInfo']);
  assert.ok(paths['/api/v1/key/keys']);
  assert.ok(paths['/api/v1/key/keys/search']);
  assert.ok(paths['/api/v1/key/key/{id}']);
  assert.ok(bearerAuth && 'scheme' in bearerAuth, 'bearerAuth security scheme should be present');
  assert.equal(bearerAuth.scheme, 'bearer');
});
