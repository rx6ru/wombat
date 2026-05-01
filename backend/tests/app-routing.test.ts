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

async function loadRoutingModules() {
  setTestEnv();
  return Promise.all([
    import('../src/app/routes.js'),
    import('../src/api/v1/index.js'),
  ]);
}

test('registers only the canonical /api/v1 mount and keeps v1 user/key route groups', async () => {
  const [{ APP_ROUTE_MOUNTS }, { API_V1_ROUTE_MOUNTS }] = await loadRoutingModules();

  assert.deepEqual(APP_ROUTE_MOUNTS, [
    { basePath: '/api/v1', middleware: ['protectRoute'], router: 'apiV1Routes' },
  ]);

  assert.deepEqual(API_V1_ROUTE_MOUNTS, [
    { basePath: '/user', router: 'userRoutes' },
    { basePath: '/key', router: 'keyRoutes' },
  ]);
});

test('notFoundHandler returns the expected JSON payload', async () => {
  const { notFoundHandler } = await import('../src/middleware/error.middleware.js');

  const response = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };

  notFoundHandler({} as never, response as never);

  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.body, { error: 'Not found' });
});
