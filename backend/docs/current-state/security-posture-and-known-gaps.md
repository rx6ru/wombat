# Security Posture and Known Gaps — Current State

## Security posture summary

The backend has meaningful early security controls, but it is still an early-stage secure storage backend rather than a production-complete vault/proxy platform.

### Controls currently implemented

- bearer JWT authentication using Supabase JWKS
- per-user authorization checks for API key ownership
- encryption-at-rest for API key values
- rate limiting on two read endpoints
- request validation through module schemas and middleware
- centralized error boundary at app level

### Major capabilities not yet implemented

- external KMS-backed key management
- true envelope encryption
- key rotation/versioning
- audit-grade structured event logging
- RBAC or multi-tenant authorization models
- proxy request authorization and policy enforcement
- anomaly detection or monitoring pipelines

## Authentication and authorization

What exists now:

- JWTs are verified against a remote JWKS URL.
- Expired tokens return a dedicated `TOKEN_EXPIRED` code.
- The backend stores only `sub` in `req.user`.
- API key access is scoped by resolving `Profile.id` and matching it against `ApiKey.userId`.

Current limitations:

- no explicit issuer/audience checks are visible in the JWT verification call
- no role, org, or permission model is enforced
- no service-to-service auth model exists
- no admin/operator privilege system exists

## Encryption posture

What exists now:

- API keys are not stored in plaintext in the `ApiKey` table
- AES-256-GCM is used for authenticated encryption
- each user gets a distinct stored secret in `EncryptionKey`
- IVs are randomly generated per encryption call

Current limitations:

- not envelope encryption
- not backed by Google KMS or another external KMS
- encrypted API keys and per-user encryption secrets live in the same database system
- no key version metadata
- no rotation flow
- no re-encryption migration support

## API exposure posture

Most sensitive endpoint:

- `GET /api/v1/key/key/:id`

Controls on that endpoint today:

- JWT auth required
- ownership verified
- rate limited to `3 / 5s`
- action logged

Remaining risk:

- no step-up verification or secondary approval before plaintext secret release

## Logging and observability

What exists now:

- key action middleware logs fetch/add/update/delete attempts to console
- logs try to identify users by profile email, falling back to auth ID
- controller and middleware errors are logged with `console.error`

Current limitations:

- no structured logger
- no persistent audit event store
- no redaction policy framework
- no request IDs or trace correlation
- no metrics/tracing stack in app code

## Rate limiting and abuse controls

What exists now:

- Upstash-backed sliding-window limiter
- rate-limit headers returned to clients
- authenticated user subject is the primary limiter key

Current coverage gaps:

- search endpoint is not rate limited
- create/update/delete endpoints are not rate limited
- no provider-specific quota logic
- no per-key/per-service usage accounting
- no outbound budget enforcement because proxying is not implemented

## Transport and edge posture

What exists now:

- global CORS middleware

Current limitations:

- default open `cors()` configuration
- no explicit `trust proxy` setting
- no health or readiness endpoint
- no in-process HTTPS handling

## Bottom-line assessment

The current backend should be described as:

> an authenticated API-key storage backend with modular layering, basic encryption, validation, and rate limiting

It should not yet be described as:

- a KMS-backed envelope-encrypted vault
- a production-complete secret management platform
- a proxy API platform
- an SDK-wrapper platform
