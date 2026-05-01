# Data Model and Dependencies — Current State

## Data model overview

The backend currently persists three Prisma models in PostgreSQL:

1. `Profile`
2. `ApiKey`
3. `EncryptionKey`

## Prisma schema

### `Profile`

| Field | Type | Notes |
|---|---|---|
| `id` | `String @db.Uuid` | Primary key |
| `authId` | `String` | Unique external auth identifier from Supabase JWT `sub` |
| `username` | `String` | Current display name |
| `email` | `String` | Captured from Supabase Auth |
| `createdAt` | `DateTime` | Default `now()` |
| `updatedAt` | `DateTime` | Auto-updated |

Relations:

- `apiKeys: ApiKey[]`
- `encryptionKey: EncryptionKey?`

### `ApiKey`

| Field | Type | Notes |
|---|---|---|
| `id` | `String @db.Uuid` | Primary key |
| `userId` | `String @db.Uuid` | FK to `Profile.id` |
| `name` | `String` | Required label |
| `service` | `String?` | Optional provider hint |
| `key` | `String` | Encrypted key blob |
| `reqSample` | `Json?` | Optional sample request payload |
| `resSample` | `Json?` | Optional sample response payload |
| `description` | `String?` | Optional description |
| `isActive` | `Boolean` | Defaults to `true` |
| `createdAt` | `DateTime` | Default `now()` |
| `updatedAt` | `DateTime` | Auto-updated |

### `EncryptionKey`

| Field | Type | Notes |
|---|---|---|
| `id` | `String @db.Uuid` | Primary key |
| `userId` | `String @db.Uuid` | Unique FK to `Profile.id` |
| `encryptionKey` | `String` | Per-user secret material |
| `createdAt` | `DateTime` | Default `now()` |
| `updatedAt` | `DateTime` | Auto-updated |

## Data ownership model

Ownership is resolved through the profile layer:

1. JWT `sub` → `Profile.authId`
2. `Profile.id` → `ApiKey.userId`
3. `Profile.id` → `EncryptionKey.userId`

This makes the local `Profile` record the anchor for both API-key ownership and per-user encryption material.

## Current validation model

Validation now lives in module-local schema files.

Current active validation surfaces:

- `src/modules/key/key.schemas.ts`
- `src/modules/user/user.schemas.ts`
- `src/middleware/validate-cursor.middleware.ts`

Behavior:

- key create/update payloads are validated in the key module
- user update payload is validated in the user module
- cursor shape is validated at middleware level

## Encryption data handling

The backend currently uses application-managed encryption, not KMS-managed encryption.

Stored data responsibilities:

- `ApiKey.key` stores ciphertext
- `EncryptionKey.encryptionKey` stores the per-user secret used to derive the AES key

Ciphertext format:

```text
base64(iv + authTag + ciphertext)
```

Algorithm details:

- algorithm = `aes-256-gcm`
- IV length = 12 bytes
- auth tag length = 16 bytes
- stored secret is hashed with SHA-256 to derive the AES key

## Environment variables

| Variable | Purpose |
|---|---|
| `PORT` | HTTP server port |
| `NODE_ENV` | Runtime environment label |
| `SUPABASE_DATABASE_URL` | Pooled Prisma DB connection |
| `SUPABASE_DIRECT_URL` | Direct Prisma DB connection |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Supabase service-role/admin access |
| `SUPABASE_PUBLISHABLE_KEY` | Loaded in config, not currently used by runtime flows |
| `SUPABASE_JWKS_URL` | Remote JWKS URL for JWT verification |
| `UPSTASH_REDIS_REST_URL` | Redis REST URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Redis REST token |
| `KMS_PROVIDER` | Placeholder config value |

## Dependency inventory

### Runtime

| Package | Current role |
|---|---|
| `express` | HTTP server and routing |
| `cors` | CORS middleware |
| `dotenv` | Environment loading |
| `@prisma/client` | Generated database client |
| `prisma` | ORM and client generation tooling |
| `@supabase/supabase-js` | Supabase admin client |
| `jose` | JWT verification via remote JWKS |
| `@upstash/redis` | Redis REST client |
| `@upstash/ratelimit` | Sliding-window rate limiting |
| `zod` | Request validation |
| `express-rate-limit` | Installed but not used |

### Development

| Package | Current role |
|---|---|
| `typescript` | Compilation |
| `tsx` | Dev runner and test import loader |
| `ts-node-dev` | Installed but not used by scripts |
| `@types/express` | Type definitions |
| `@types/cors` | Type definitions |
| `@types/node` | Node type definitions |

## Build and test scripts

| Script | Command | Current use |
|---|---|---|
| `dev` | `tsx watch ./src/server.ts` | local development |
| `build` | `tsc` | TypeScript build |
| `start` | `node ./dist/server.js` | run compiled app |
| `test` | `node --import tsx --test tests/**/*.test.ts` | test runner |
| `postinstall` | `prisma generate` | generate Prisma client |

## External services

### Supabase

Current responsibilities:

- hosts Postgres database
- provides JWT issuer/JWKS source
- provides admin API lookup for profile bootstrap

### Upstash Redis

Current responsibility:

- backs route-level sliding-window rate limiting
