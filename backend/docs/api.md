# Wombat Backend API Documentation

_Last updated: 2026-05-01_

## 1. Purpose

This document explains how the backend API documentation works in this repository and how developers should use and maintain it.

For day-to-day API development, the **canonical API contract is the OpenAPI document served by the backend**.

Primary documentation surfaces:

- **Swagger UI:** `/docs`
- **Raw OpenAPI JSON:** `/docs/openapi.json`
- **Static exported spec file:** `docs/openapi.json`

This Markdown file is the developer guide for using and maintaining those API docs.

## 2. What is canonical now

The backend API contract is now maintained in a **code-first OpenAPI setup**.

That means:

- route documentation is generated from the backend codebase
- the OpenAPI document is the source of truth for endpoint contracts
- Swagger UI is the primary interactive view for backend/frontend/dev consumers
- this Markdown file explains usage and maintenance, rather than duplicating every endpoint shape manually

## 3. Where to view the docs

### Interactive Swagger UI

Start the backend and open:

```text
http://localhost:<PORT>/docs
```

This provides:

- endpoint inventory
- request body schemas
- query/path parameter schemas
- response schemas
- auth scheme visibility
- example payloads
- interactive request exploration

### Raw OpenAPI JSON

Open:

```text
http://localhost:<PORT>/docs/openapi.json
```

Use this when:

- integrating tooling
- generating clients/SDKs
- validating the current contract
- exporting the machine-readable API spec

### Static exported JSON file

The repository can also generate a checked-in/exportable JSON artifact at:

```text
docs/openapi.json
```

Generate or refresh it with:

```bash
npm run openapi:write
```

## 4. Current implemented API surface

Current implemented route groups:

- `/api/v1/user/...`
- `/api/v1/key/...`

Current implemented endpoints:

- `GET /api/v1/user/info/getUserInfo`
- `PUT /api/v1/user/info/updateUserInfo`
- `GET /api/v1/key/keys`
- `GET /api/v1/key/keys/search`
- `GET /api/v1/key/key/:id`
- `POST /api/v1/key/key`
- `PUT /api/v1/key/key/:id`
- `DELETE /api/v1/key/key/:id`

For the full endpoint payloads, responses, and schema details, use Swagger UI or the raw OpenAPI JSON.

## 5. How the Swagger/OpenAPI setup is structured

The implementation lives under:

```text
src/docs/openapi/
src/docs/swagger/
```

### Current responsibilities

- `src/docs/openapi/registry.ts`
  - shared OpenAPI registry
- `src/docs/openapi/components.ts`
  - shared schemas and security components
- `src/docs/openapi/user.openapi.ts`
  - user endpoint registration
- `src/docs/openapi/key.openapi.ts`
  - key endpoint registration
- `src/docs/openapi/generate-document.ts`
  - final OpenAPI 3.1 document builder
- `src/docs/openapi/write-openapi.ts`
  - writes `docs/openapi.json`
- `src/docs/swagger/swagger-ui.ts`
  - serves Swagger UI and raw spec routes

## 6. How to use it as a developer

### For frontend developers

Use Swagger UI to:

- inspect current endpoints
- see request payload fields
- see response shapes
- check path/query parameter names
- understand auth requirements
- confirm which endpoints return metadata vs plaintext secret values

Use the raw OpenAPI JSON when you need machine-readable integration input.

### For backend developers

Use Swagger UI and the raw JSON to:

- confirm the actual documented contract before changing an endpoint
- verify that request/response docs still match behavior after edits
- inspect shared error/auth schema consistency

### For product/design/other engineers

Use `/docs` as the quickest way to understand what is actually implemented right now.

## 7. How to update it when code changes

Whenever an API contract changes, update the OpenAPI layer in the same change.

### Required update rule

If you change any of the following, you must update the OpenAPI docs in the same PR/change:

- route path
- request body shape
- query parameters
- path parameters
- response payload shape
- response status codes
- auth behavior
- rate-limit behavior worth documenting

### Typical workflow

1. Update backend code.
2. Update the relevant OpenAPI registration file:
   - `user.openapi.ts`
   - `key.openapi.ts`
   - or shared components if needed
3. Run:

```bash
npm test
npm run build
npm run openapi:write
```

4. Start the backend.
5. Open `/docs`.
6. Verify the endpoint contract looks correct.

## 8. How to add a new endpoint

When adding a new endpoint:

1. implement the route/controller/service/repository work
2. add or reuse Zod schemas as needed
3. register the endpoint in the matching OpenAPI domain file
4. add shared component schemas only when they are actually reused
5. regenerate `docs/openapi.json`
6. verify in Swagger UI

### Rule of thumb

- endpoint docs belong near the domain doc file
- shared schemas belong in `components.ts` or `schemas.ts`
- do not duplicate the same payload schema across many files if one shared schema can represent it cleanly

## 9. What should not happen

Avoid these doc problems:

- keeping Swagger stale while code changes
- duplicating endpoint contracts across many Markdown files
- treating `docs/api.md` as a second conflicting contract source
- documenting guessed behavior instead of actual implemented behavior

## 10. Related documentation

Use these alongside Swagger/OpenAPI:

- `docs/current-state/README.md`
- `docs/current-state/system-architecture.md`
- `docs/current-state/data-model-and-dependencies.md`
- `docs/current-state/security-posture-and-known-gaps.md`
- `docs/current-state/codebase-structure-and-discipline.md`

## 11. Summary

In this repository:

- **OpenAPI JSON is the canonical endpoint contract**
- **Swagger UI is the primary interactive developer view**
- **`docs/api.md` is the usage and maintenance guide for the API docs system**
